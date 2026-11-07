/**
 * Product, Category, and Variant domain interfaces.
 * Aligned with backend products/entities/product.entity.ts.
 */

export type ProductStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name?: string | null;
  size?: string | null;
  color?: string | null;
  model?: string | null;
  attributeKey?: string | null;
  attributeValue?: string | null;
  sku?: string | null;
  price?: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  sku?: string | null;
  price: number | string;
  vatRate?: number | string;
  vatIncluded?: boolean;
  vatCode?: string | null;
  status: ProductStatus;
  trackInventory?: boolean;
  isReturnEligible?: boolean;
  featuredImageUrl?: string | null;
  category?: Category | null;
  store?: import('./store.interface').Store | import('./store.interface').StoreSummary | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilterParams {
  categoryId?: string;
  storeId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  status?: ProductStatus;
  page?: number;
  limit?: number;
  inStockOnly?: boolean;
}
