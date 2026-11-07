export type StoreStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'REJECTED';

export type ProductStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED';

export type StoreOrderStatusType =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface StoreSalesSummary {
  grossSales: number;
  netEarnings: number;
  platformCommission: number;
  pendingHoldBalance: number;
  availablePayoutBalance: number;
  totalOrdersCount: number;
  currency: string;
}

export interface StoreSalesAnalyticsItem {
  date: string;
  revenue: number;
  orders: number;
  earnings: number;
}

export interface StoreProductImage {
  id?: string;
  url: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface StoreProductVariant {
  id?: string;
  size?: string;
  color?: string;
  model?: string;
  attributeKey?: string;
  attributeValue?: string;
  sku?: string;
  price?: number;
  stockQuantity?: number;
  lowStockThreshold?: number;
}

export interface StoreProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface StoreProductItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  vatRate?: number;
  vatIncluded?: boolean;
  vatCode?: string;
  sku?: string;
  status: ProductStatus;
  rejectionReason?: string;
  storeId: string;
  categoryId?: string;
  category?: StoreProductCategory;
  trackInventory?: boolean;
  totalStock?: number;
  images: StoreProductImage[];
  variants?: StoreProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreProductPayload {
  name: string;
  description?: string;
  categoryId?: string;
  sku?: string;
  price: number;
  vatRate?: number;
  vatIncluded?: boolean;
  vatCode?: string;
  trackInventory?: boolean;
  variants?: StoreProductVariant[];
  images?: StoreProductImage[];
}

export interface UpdateStoreProductPayload {
  name?: string;
  description?: string;
  categoryId?: string;
  sku?: string;
  price?: number;
  vatRate?: number;
  vatIncluded?: boolean;
  vatCode?: string;
  trackInventory?: boolean;
  variants?: StoreProductVariant[];
  images?: StoreProductImage[];
}

export interface StoreInventorySummary {
  totalSkus: number;
  totalInStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  items: Array<{
    productId: string;
    productName: string;
    variantId?: string;
    sku?: string;
    stockQuantity: number;
    lowStockThreshold: number;
    isLowStock: boolean;
    isOutOfStock: boolean;
  }>;
}

export interface StoreOrderItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  productSku?: string;
  variantName?: string;
  unitPrice: number;
  vatRate: number;
  quantity: number;
  lineSubtotal: number;
  productImage?: string;
}

export interface StoreOrderCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface StoreOrderShippingAddress {
  fullName?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface StoreOrderItemDetail {
  id: string;
  storeOrderNumber: string;
  status: StoreOrderStatusType;
  subtotal: number;
  taxTotal: number;
  shippingFee: number;
  grandTotal: number;
  trackingNumber?: string;
  trackingCarrier?: string;
  carrier?: string;
  trackingUrl?: string;
  fulfillmentNotes?: string;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    orderNumber: string;
    shippingAddress: StoreOrderShippingAddress;
    customer?: StoreOrderCustomer;
    createdAt: string;
  };
  items: StoreOrderItem[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateStoreOrderStatusPayload {
  status: StoreOrderStatusType;
  notes?: string;
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
}

export interface StoreProfileData {
  id: string;
  name: string;
  slug: string;
  legalBusinessName?: string;
  businessId?: string;
  vatId?: string;
  description?: string;
  businessAddress?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: StoreStatus;
  logoUrl?: string;
  bannerUrl?: string;
  bankIban?: string;
  bankBic?: string;
  commissionRate?: number;
}
