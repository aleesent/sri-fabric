import { Fabric } from '../types/index.ts';

// Deterministic realistic wholesale prices ($50.00 - $75.00) matching reference screenshot
const PRICE_MAP: Record<number, number> = {
  16: 75,
  17: 50,
  18: 50,
  19: 55,
  20: 75,
  21: 55,
  22: 60,
  23: 65,
  24: 60,
  25: 70,
  26: 55,
  27: 80,
  28: 50,
  29: 65,
  30: 75,
  31: 55,
  32: 60,
  33: 50,
  34: 75,
  35: 65,
  36: 85,
  37: 60,
  38: 55,
  39: 70,
  40: 65,
  41: 75,
  42: 80,
};

export interface ProductPrice {
  usd: number;
  inr: number;
  formattedUsd: string;
  formattedInr: string;
}

export const getProductPrice = (fabric: Fabric): ProductPrice => {
  const usd = PRICE_MAP[fabric.id] || (50 + ((fabric.id * 7) % 35));
  const inr = usd * 22; // ~ ₹1,100 to ₹1,870
  return {
    usd,
    inr,
    formattedUsd: `$${usd}.00`,
    formattedInr: `₹${inr.toLocaleString('en-IN')}`,
  };
};

export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  border?: boolean;
}

// 10 exact color swatches matching the reference image
export const SHOP_COLORS: ColorSwatch[] = [
  { id: 'orange', name: 'Orange / Rust', hex: '#e67e22' },
  { id: 'navy', name: 'Navy / Blue', hex: '#2c3e50' },
  { id: 'green', name: 'Emerald Green', hex: '#1e824c' },
  { id: 'red', name: 'Crimson Red / Maroon', hex: '#c0392b' },
  { id: 'yellow', name: 'Gold / Yellow', hex: '#f39c12' },
  { id: 'purple', name: 'Royal Purple', hex: '#8e44ad' },
  { id: 'pink', name: 'Rose Pink', hex: '#d87093' },
  { id: 'slate', name: 'Charcoal / Slate', hex: '#34495e' },
  { id: 'white', name: 'White / Cream', hex: '#ffffff', border: true },
  { id: 'black', name: 'Jet Black', hex: '#111111' },
];

export const fabricMatchesColor = (fabric: Fabric, colorId: string): boolean => {
  const text = `${fabric.name} ${fabric.description} ${fabric.keywords || ''}`.toLowerCase();
  switch (colorId) {
    case 'orange':
      return /orange|rust|terracotta|apricot|copper|amber/i.test(text);
    case 'navy':
      return /navy|blue|teal|indigo|azure|peacock/i.test(text);
    case 'green':
      return /green|emerald|olive|mint|sage|sea green/i.test(text);
    case 'red':
      return /red|maroon|crimson|burgundy|wine|ruby/i.test(text);
    case 'yellow':
      return /gold|yellow|mustard|beige|ochre|honey/i.test(text);
    case 'purple':
      return /purple|violet|magenta|lavender|plum/i.test(text);
    case 'pink':
      return /pink|rose|blush|peach|coral/i.test(text);
    case 'slate':
      return /slate|grey|gray|charcoal|silver/i.test(text);
    case 'white':
      return /white|cream|ivory|off-white|pearl/i.test(text);
    case 'black':
      return /black|dark|midnight/i.test(text);
    default:
      return true;
  }
};

export interface ShopCategoryItem {
  id: string;
  name: string;
  keywords: string[];
}

// Checkbox categories matching the reference format
export const SHOP_CHECKBOX_CATEGORIES: ShopCategoryItem[] = [
  { id: 'floral', name: 'Floral Motifs & Panels', keywords: ['floral', 'flower', 'leaf', 'motifs', 'rose'] },
  { id: 'kalamkari', name: 'Kalamkari & Folk Prints', keywords: ['kalamkari', 'artistic', 'print', 'folk'] },
  { id: 'chevron', name: 'Chevron & Geometric Prints', keywords: ['chevron', 'geometric', 'stripe', 'lines'] },
  { id: 'embroidered', name: 'Embroidered-Style Panels', keywords: ['embroidered', 'embroidery', 'neckline', 'panel'] },
  { id: 'ornamental', name: 'Ornamental Borders & Dupatta', keywords: ['ornamental', 'border', 'dupatta', 'statement'] },
  { id: 'woven-border', name: 'Woven Border & Zari', keywords: ['woven', 'border', 'zari'] },
  { id: 'jacquard', name: 'Traditional Jacquard', keywords: ['traditional', 'jacquard', 'weave'] },
  { id: 'pure-silk', name: 'Festive Silk & Sets', keywords: ['silk', 'festive', 'bridal', 'dola'] },
  { id: 'casual', name: 'Casual & Daily Wear', keywords: ['casual', 'office', 'subtle', 'everyday'] },
];

export const fabricMatchesCategory = (fabric: Fabric, categoryId: string): boolean => {
  const cat = SHOP_CHECKBOX_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return true;
  const text = `${fabric.name} ${fabric.description} ${fabric.fabricType || ''} ${fabric.keywords || ''}`.toLowerCase();
  return cat.keywords.some((kw) => text.includes(kw));
};

export const SHOP_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
