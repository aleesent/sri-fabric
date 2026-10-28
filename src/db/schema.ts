import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Admins
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  uid: text('uid').unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  name: text('name').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Hero Slides
export const heroSlides = pgTable('hero_slides', {
  id: serial('id').primaryKey(),
  kicker: text('kicker').default('PREMIUM TEXTILES'),
  heading: text('heading').notNull(),
  subheading: text('subheading'),
  description: text('description'),
  buttonText1: text('button_text_1').default('EXPLORE FABRICS'),
  buttonLink1: text('button_link_1').default('/fabrics'),
  buttonText2: text('button_text_2').default('REQUEST AN ENQUIRY'),
  buttonLink2: text('button_link_2').default('/contact'),
  imageUrl: text('image_url').notNull(),
  mobileImageUrl: text('mobile_image_url'),
  targetPage: text('target_page').default('home'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Categories
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  imageUrl: text('image_url'),
  featured: boolean('featured').default(true),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Collections
export const collections = pgTable('collections', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  tagline: text('tagline'),
  description: text('description'),
  imageUrl: text('image_url'),
  featured: boolean('featured').default(true),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Fabrics
export const fabrics = pgTable('fabrics', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  categoryId: integer('category_id').references(() => categories.id),
  collectionId: integer('collection_id').references(() => collections.id),
  fabricType: text('fabric_type').notNull(),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  composition: text('composition'),
  gsm: text('gsm'),
  width: text('width'),
  finish: text('finish'),
  pattern: text('pattern'),
  availableColours: text('available_colours'),
  applications: text('applications'),
  moq: text('moq').default('100 Metres'),
  manufacturingDetails: text('manufacturing_details'),
  primaryImageUrl: text('primary_image_url').notNull(),
  videoUrl: text('video_url'),
  featured: boolean('featured').default(false),
  isActive: boolean('is_active').default(true),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  keywords: text('keywords'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Fabric Images
export const fabricImages = pgTable('fabric_images', {
  id: serial('id').primaryKey(),
  fabricId: integer('fabric_id').references(() => fabrics.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  altText: text('alt_text'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Enquiries
export const enquiries = pgTable('enquiries', {
  id: serial('id').primaryKey(),
  enquiryNumber: text('enquiry_number').notNull().unique(),
  name: text('name').notNull(),
  companyName: text('company_name').notNull(),
  businessEmail: text('business_email').notNull(),
  phone: text('phone').notNull(),
  country: text('country').notNull(),
  city: text('city'),
  fabricOrCollection: text('fabric_or_collection'),
  fabricId: integer('fabric_id').references(() => fabrics.id),
  requiredQuantity: text('required_quantity').notNull(),
  application: text('application'),
  message: text('message').notNull(),
  sampleRequired: boolean('sample_required').default(false),
  attachmentUrl: text('attachment_url'),
  status: text('status').default('NEW'),
  internalNotes: text('internal_notes'),
  assignedTo: text('assigned_to'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Contacts
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  company: text('company'),
  email: text('email').notNull(),
  phone: text('phone'),
  country: text('country'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('NEW'),
  internalNotes: text('internal_notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Testimonials
export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  company: text('company').notNull(),
  designation: text('designation'),
  country: text('country').notNull(),
  photoUrl: text('photo_url'),
  testimonial: text('testimonial').notNull(),
  rating: integer('rating').default(5),
  featured: boolean('featured').default(true),
  status: text('status').default('ACTIVE'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Blog Categories
export const blogCategories = pgTable('blog_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Blog Posts
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  featuredImageUrl: text('featured_image_url').notNull(),
  categoryId: integer('category_id').references(() => blogCategories.id),
  categoryName: text('category_name'),
  author: text('author').default('SRI Fabrics Editorial Team'),
  publishDate: timestamp('publish_date').defaultNow(),
  tags: text('tags'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  featured: boolean('featured').default(false),
  status: text('status').default('PUBLISHED'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Manufacturing Processes
export const manufacturingProcesses = pgTable('manufacturing_processes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  stepNumber: integer('step_number').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  highlight: text('highlight'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Manufacturing Capabilities
export const manufacturingCapabilities = pgTable('manufacturing_capabilities', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  metric: text('metric'),
  description: text('description').notNull(),
  icon: text('icon').default('factory'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Global Regions
export const globalRegions = pgTable('global_regions', {
  id: serial('id').primaryKey(),
  countryName: text('country_name').notNull(),
  regionName: text('region_name').notNull(),
  exportVolume: text('export_volume'),
  deliveryTime: text('delivery_time'),
  clientsCount: integer('clients_count').default(10),
  flagEmoji: text('flag_emoji'),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Newsletter Subscribers
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  status: text('status').default('SUBSCRIBED'),
  subscribedAt: timestamp('subscribed_at').defaultNow(),
});

// Media Library
export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  fileName: text('file_name').notNull(),
  url: text('url').notNull(),
  mimeType: text('mime_type'),
  fileSize: integer('file_size'),
  caption: text('caption'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Site Settings
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const fabricsRelations = relations(fabrics, ({ one, many }) => ({
  category: one(categories, {
    fields: [fabrics.categoryId],
    references: [categories.id],
  }),
  collection: one(collections, {
    fields: [fabrics.collectionId],
    references: [collections.id],
  }),
  images: many(fabricImages),
  enquiries: many(enquiries),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  fabrics: many(fabrics),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
  fabrics: many(fabrics),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
}));
