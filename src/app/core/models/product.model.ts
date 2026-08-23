export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  size: string;
  stock: number;
  priceModifier?: number;
  image?: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  likes?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  shortDescription: string;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;
  tags?: string[];
  availableColors?: { name: string; hex: string }[];
  availableSizes?: string[];
  variants?: ProductVariant[];
  specifications?: ProductSpecification[];
  reviews?: ProductReview[];
}

export interface FilterState {
  category: string | null;
  brand: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  discountOnly: boolean;
  size: string[];
  color: string[];
  searchQuery: string;
  sortBy: 'popularity' | 'price-low' | 'price-high' | 'rating' | 'newest';
}
