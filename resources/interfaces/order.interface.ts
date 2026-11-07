/**
 * Order domain interfaces.
 * Aligned with backend orders/entities/order.entity.ts and store-order.entity.ts.
 */

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'PARTIALLY_SHIPPED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  id: string;
  productId?: string;
  variantId?: string | null;
  variantName?: string | null;
  productName?: string;
  productNameSnapshot?: string;
  sku?: string | null;
  skuSnapshot?: string | null;
  unitPrice: number;
  quantity: number;
  subtotal?: number;
  totalPrice?: number;
  metadata?: {
    image?: string;
    [key: string]: unknown;
  } | null;
}

export interface OrderStore {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export interface StoreOrder {
  id: string;
  orderId: string;
  storeId: string;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  trackingNumber?: string | null;
  carrier?: string | null;
  store?: OrderStore;
  items?: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderShippingAddress {
  fullName: string;
  phone: string;
  streetAddress?: string;
  addressLine1?: string;
  apartment?: string | null;
  addressLine2?: string | null;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  isGuest: boolean;
  guestEmail?: string | null;
  guestName?: string | null;
  guestPhone?: string | null;
  status: OrderStatus;
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string; // Default 'EUR'
  shippingAddress: OrderShippingAddress | null;
  customerNotes?: string | null;
  items?: OrderItem[];
  storeOrders?: StoreOrder[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerOrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}
