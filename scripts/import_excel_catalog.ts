import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

dotenv.config();

async function run() {
  const filePath = path.resolve(process.cwd(), 'public/SRI_FABRIC_Product_Catalog_Template.xlsx');
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  console.log(`Loaded ${rows.length} rows from sheet "${sheetName}"`);

  const pool = new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
  });

  const client = await pool.connect();

  try {
    // 1. Fetch categories
    const catRes = await client.query('SELECT id, name, slug FROM categories');
    const categories = catRes.rows;
    console.log('Existing categories:', categories);

    function findCategoryId(catName: string): number {
      const normalized = catName.toLowerCase().trim();
      const match = categories.find(
        (c) =>
          c.slug.toLowerCase() === normalized ||
          c.name.toLowerCase() === normalized ||
          (normalized === 'saree' && c.slug === 'sarees') ||
          (normalized === 'sarees' && c.slug === 'sarees') ||
          (normalized === 'kurti' && c.slug === 'kurti-set') ||
          (normalized === 'kurti set' && c.slug === 'kurti-set') ||
          (normalized === 'dress' && c.slug === 'dresses') ||
          (normalized === 'dresses' && c.slug === 'dresses')
      );
      if (match) return match.id;
      // Default fallback to Sarees or Fabrics
      const sareeCat = categories.find((c) => c.slug === 'sarees');
      return sareeCat ? sareeCat.id : 2;
    }

    let insertedCount = 0;
    let updatedCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const title = (row['Product Title'] || '').trim();
      const desc = (row['Product Description'] || '').trim();
      const catName = (row['Category'] || '').trim();
      const img1 = (row['Image Link 1'] || '').trim();
      const img2 = (row['Image Link 2'] || '').trim();
      const img3 = (row['Image Link 3'] || '').trim();
      const img4 = (row['Image Link 4'] || '').trim();

      if (!title || !img1) {
        console.warn(`Skipping empty row ${i + 1}`);
        continue;
      }

      const categoryId = findCategoryId(catName);
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const slug = baseSlug;

      const designId = `SRI-SAR-${String(1001 + i).padStart(4, '0')}`;
      const fabricType = 'Saree';
      const gsm = 'Customizable per buyer requirement';
      const width = '44 Inches (Standard Saree Width)';
      const moq = 'Wholesale Bulk Orders & Custom Yardages on Request';

      // Check if product already exists by slug or exact name
      const existingRes = await client.query(
        'SELECT id, slug FROM fabrics WHERE slug = $1 OR name = $2 LIMIT 1',
        [slug, title]
      );

      let fabricId: number;

      if (existingRes.rows.length > 0) {
        fabricId = existingRes.rows[0].id;
        await client.query(
          `UPDATE fabrics 
           SET name = $1, 
               category_id = $2, 
               fabric_type = $3, 
               description = $4, 
               long_description = $5, 
               primary_image_url = $6, 
               gsm = $7, 
               width = $8, 
               moq = $9, 
               keywords = $10,
               is_active = true,
               sort_order = $11
           WHERE id = $12`,
          [
            title,
            categoryId,
            fabricType,
            desc,
            desc,
            img1,
            gsm,
            width,
            moq,
            designId,
            i + 1,
            fabricId,
          ]
        );
        updatedCount++;
      } else {
        const insertRes = await client.query(
          `INSERT INTO fabrics (
             name, slug, category_id, fabric_type, description, long_description,
             primary_image_url, gsm, width, moq, keywords, is_active, sort_order
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, $12)
           RETURNING id`,
          [
            title,
            slug,
            categoryId,
            fabricType,
            desc,
            desc,
            img1,
            gsm,
            width,
            moq,
            designId,
            i + 1,
          ]
        );
        fabricId = insertRes.rows[0].id;
        insertedCount++;
      }

      // Refresh associated gallery images in fabric_images
      await client.query('DELETE FROM fabric_images WHERE fabric_id = $1', [fabricId]);

      const allImages = [img1, img2, img3, img4].filter(Boolean);
      for (let imgIdx = 0; imgIdx < allImages.length; imgIdx++) {
        const imgUrl = allImages[imgIdx];
        await client.query(
          `INSERT INTO fabric_images (fabric_id, image_url, alt_text, sort_order)
           VALUES ($1, $2, $3, $4)`,
          [
            fabricId,
            imgUrl,
            `${title} - View ${imgIdx + 1}`,
            imgIdx + 1,
          ]
        );
      }

      console.log(`[${i + 1}/27] Imported: "${title}" (ID: ${fabricId}, Category: ${categoryId}, Images: ${allImages.length})`);
    }

    console.log(`\nImport Complete! Inserted: ${insertedCount}, Updated: ${updatedCount}, Total Processed: ${rows.length}`);
  } catch (err) {
    console.error('Import failed with error:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
