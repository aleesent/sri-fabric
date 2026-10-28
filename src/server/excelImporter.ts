import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { db, isDatabaseConfigured } from '../db/index.ts';
import { fabrics, fabricImages, categories } from '../db/schema.ts';
import { eq, or } from 'drizzle-orm';
import { clearCache } from './api.ts';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

export async function ensureDefaultCategories() {
  if (!isDatabaseConfigured()) return;
  try {
    const existingCats = await db.select().from(categories);
    const existingSlugs = new Set(existingCats.map((c) => c.slug.toLowerCase()));

    // 1. Ensure SAREES category
    if (!existingSlugs.has('sarees')) {
      await db.insert(categories).values({
        name: 'SAREES',
        slug: 'sarees',
        description: 'Regal Banarasi katan silks, tissue organzas, and bordered bridal textiles.',
        imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        featured: true,
        sortOrder: 1,
        isActive: true,
      });
    }

    // 2. Ensure combined TOP + DUPATTA category
    if (!existingSlugs.has('top-dupatta')) {
      await db.insert(categories).values({
        name: 'TOP + DUPATTA',
        slug: 'top-dupatta',
        description: 'Coordinated designer top and dupatta ensembles with authentic motifs, matching bottoms, and artisanal borders.',
        imageUrl: 'https://i.pinimg.com/736x/53/22/48/53224833995ecb3594be3aef6bc95316.jpg',
        featured: true,
        sortOrder: 2,
        isActive: true,
      });
    }

    // 3. Ensure FABRICS category
    if (!existingSlugs.has('fabrics')) {
      await db.insert(categories).values({
        name: 'FABRICS',
        slug: 'fabrics',
        description: 'Comprehensive catalogue of pure plain, jacquard, embroidered, and dyed yardages.',
        imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
        featured: true,
        sortOrder: 3,
        isActive: true,
      });
    }
  } catch (err: any) {
    if (err?.code !== 'ECONNREFUSED' && err?.cause?.code !== 'ECONNREFUSED') {
      console.warn('Note during ensureDefaultCategories:', err?.message);
    }
  }
}

export async function importExcelCatalog(customFilePath?: string) {
  if (!isDatabaseConfigured()) {
    return { success: true, message: 'Standalone mode active with Excel catalog' };
  }
  await ensureDefaultCategories();

  const filesToImport: string[] = [];
  if (customFilePath) {
    filesToImport.push(customFilePath);
  } else {
    // Check both catalog template files
    const file1 = path.resolve(process.cwd(), 'public/SRI_FABRIC1_Product_Catalog_Template.xlsx');
    const file0 = path.resolve(process.cwd(), 'public/SRI_FABRIC_Product_Catalog_Template.xlsx');

    if (fs.existsSync(file0)) filesToImport.push(file0);
    if (fs.existsSync(file1)) filesToImport.push(file1);
  }

  if (filesToImport.length === 0) {
    console.warn('No Excel catalog files found to import.');
    return { success: false, message: 'No catalog files found' };
  }

  const allCategories = await db.select().from(categories);

  function findCategoryId(catName: string): number {
    const normalized = (catName || '').toLowerCase().trim();
    if (normalized.includes('top') || normalized.includes('dupatta') || normalized.includes('kurti')) {
      const match = allCategories.find((c) => c.slug === 'top-dupatta') || allCategories.find((c) => c.slug === 'kurti-set');
      if (match) return match.id;
    }
    if (normalized.includes('saree')) {
      const match = allCategories.find((c) => c.slug === 'sarees');
      if (match) return match.id;
    }
    if (normalized.includes('fabric')) {
      const match = allCategories.find((c) => c.slug === 'fabrics');
      if (match) return match.id;
    }
    const fallback = allCategories.find((c) => c.slug === 'top-dupatta') || allCategories[0];
    return fallback?.id || 1;
  }

  let totalInserted = 0;
  let totalUpdated = 0;

  for (const filePath of filesToImport) {
    if (!fs.existsSync(filePath)) continue;

    console.log(`Processing catalog import: ${filePath}`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0] || 'Product Catalog';
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    const rows: any[] = XLSX.utils.sheet_to_json(sheet);
    if (!rows || rows.length === 0) continue;

    const isTopDupattaFile = filePath.includes('SRI_FABRIC1');

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const title = (row['Product Title'] || '').trim();
      const desc = (row['Product Description'] || '').trim();
      const catName = (row['Category'] || '').trim() || (isTopDupattaFile ? 'Top + Dupatta' : 'Saree');
      const img1 = (row['Image Link 1'] || '').trim();
      const img2 = (row['Image Link 2'] || '').trim();
      const img3 = (row['Image Link 3'] || '').trim();
      const img4 = (row['Image Link 4'] || '').trim();

      if (!title || !img1) {
        continue;
      }

      const isTD =
        catName.toLowerCase().includes('top') ||
        catName.toLowerCase().includes('dupatta') ||
        title.toLowerCase().includes('kurta set') ||
        isTopDupattaFile;

      const categoryId = findCategoryId(catName);
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const slug = baseSlug;

      const designPrefix = isTD ? 'SRI-TD' : 'SRI-SAR';
      const designId = `${designPrefix}-${String(1001 + i).padStart(4, '0')}`;
      const fabricType = isTD ? 'Top + Dupatta' : 'Saree';
      const gsm = 'Customizable per buyer requirement';
      const width = isTD
        ? 'Standard Kurta & Dupatta Cut (44" Width)'
        : '44 Inches (Standard Saree Width)';
      const moq = 'Wholesale Bulk Orders & Custom Yardages on Request';

      // Check existing by slug or title
      const existing = await db
        .select({ id: fabrics.id })
        .from(fabrics)
        .where(or(eq(fabrics.slug, slug), eq(fabrics.name, title)))
        .limit(1);

      let fabricId: number;

      if (existing.length > 0) {
        fabricId = existing[0].id;
        await db
          .update(fabrics)
          .set({
            name: title,
            categoryId,
            fabricType,
            description: desc,
            longDescription: desc,
            primaryImageUrl: img1,
            gsm,
            width,
            moq,
            keywords: designId,
            isActive: true,
            sortOrder: isTD ? 100 + i + 1 : i + 1,
          })
          .where(eq(fabrics.id, fabricId));
        totalUpdated++;
      } else {
        const [newFabric] = await db
          .insert(fabrics)
          .values({
            name: title,
            slug,
            categoryId,
            fabricType,
            description: desc,
            longDescription: desc,
            primaryImageUrl: img1,
            gsm,
            width,
            moq,
            keywords: designId,
            isActive: true,
            sortOrder: isTD ? 100 + i + 1 : i + 1,
          })
          .returning({ id: fabrics.id });
        fabricId = newFabric.id;
        totalInserted++;
      }

      // Refresh associated gallery images (All 4 images loaded dynamically)
      await db.delete(fabricImages).where(eq(fabricImages.fabricId, fabricId));

      const imagesToInsert = [img1, img2, img3, img4].filter(Boolean);
      for (let j = 0; j < imagesToInsert.length; j++) {
        await db.insert(fabricImages).values({
          fabricId,
          imageUrl: imagesToInsert[j],
          altText: `${title} - View ${j + 1}`,
          sortOrder: j + 1,
        });
      }
    }
  }

  clearCache('fabrics');

  console.log(`Catalog import complete: ${totalInserted} inserted, ${totalUpdated} updated.`);
  return {
    success: true,
    inserted: totalInserted,
    updated: totalUpdated,
  };
}
