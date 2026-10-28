export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  featured: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  imageUrl?: string;
  featured: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Fabric {
  id: number;
  name: string;
  slug: string;
  designId?: string;
  inStock?: boolean;
  categoryId?: number | null;
  collectionId?: number | null;
  fabricType: string;
  description: string;
  longDescription?: string;
  composition?: string;
  gsm?: string;
  width?: string;
  finish?: string;
  pattern?: string;
  availableColours?: string;
  applications?: string;
  moq?: string;
  manufacturingDetails?: string;
  primaryImageUrl: string;
  videoUrl?: string;
  featured: boolean;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
  sortOrder: number;
  createdAt?: string;
  images?: { id: number; imageUrl: string; altText?: string }[];
  related?: Fabric[];
}

export interface HeroSlide {
  id: number;
  kicker?: string;
  heading: string;
  subheading?: string;
  description?: string;
  buttonText1?: string;
  buttonLink1?: string;
  buttonText2?: string;
  buttonLink2?: string;
  imageUrl: string;
  mobileImageUrl?: string | null;
  targetPage?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Enquiry {
  id: number;
  enquiryNumber: string;
  name: string;
  companyName: string;
  businessEmail: string;
  phone: string;
  country: string;
  city?: string;
  fabricOrCollection?: string;
  fabricId?: number | null;
  requiredQuantity: string;
  application?: string;
  message: string;
  sampleRequired: boolean;
  attachmentUrl?: string;
  status: 'NEW' | 'CONTACTED' | 'IN DISCUSSION' | 'SAMPLE REQUESTED' | 'QUOTATION SENT' | 'CONVERTED' | 'CLOSED';
  internalNotes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'REPLIED' | 'ARCHIVED';
  internalNotes?: string;
  createdAt: string;
}

export interface Testimonial {
  id: number;
  clientName: string;
  company: string;
  designation?: string;
  country: string;
  photoUrl?: string;
  testimonial: string;
  rating: number;
  featured: boolean;
  status: string;
  sortOrder: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  categoryId?: number;
  categoryName?: string;
  author: string;
  publishDate: string;
  tags?: string;
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;
  status: string;
}

export interface ManufacturingProcess {
  id: number;
  title: string;
  stepNumber: number;
  description: string;
  imageUrl?: string;
  highlight?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ManufacturingCapability {
  id: number;
  title: string;
  metric?: string;
  description: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface GlobalRegion {
  id: number;
  countryName: string;
  regionName: string;
  exportVolume?: string;
  deliveryTime?: string;
  clientsCount: number;
  flagEmoji?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface SiteSettings {
  brand_name?: string;
  tagline?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  business_hours?: string;
  seo_title?: string;
  seo_description?: string;
  footer_text?: string;
  [key: string]: string | undefined;
}

export interface ShopTheLookItem {
  id: string;
  title: string;
  category: string;
  shortcode?: string;
  reelId?: string;
  pinId?: string;
  shortUrl: string;
  canonicalUrl: string;
  posterUrl: string;
  videoUrl: string;
  productSlug?: string;
  isActive: boolean;
  sortOrder: number;
}


