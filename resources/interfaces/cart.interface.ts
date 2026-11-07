/**
 * Shopping cart domain interfaces.
 * Aligned with backend cart/entities/cart.entity.ts, cart-item.entity.ts, and cart.service.ts.
 */

import type { Product, ProductVariant } from './product.interface';
import type { Store } from './store.interface';

export interface CartItem {
  id: string;
  cartId?: string;
  productId: string;
  variantId?: string | null;
  storeId: string;
  quantity: number;
  product?: Product;
  variant?: ProductVariant | null;
  store?: Store | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cart {
  id: string;
  customerId?: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AddCartItemPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CartItemDetail {
  id: string;
  productId: string;
  productName: string;
  productSlug?: string;
  variantId: string | null;
  variantDescription?: string | null;
  sku: string | null;
  storeId: string;
  storeName: string;
  unitPrice: number;
  vatRate: number;
  vatIncluded: boolean;
  quantity: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  availableStock: number;
  isValid: boolean;
  validationError?: string;
  imageUrl?: string | null;
}

export interface StoreCartGroup {
  storeId: string;
  storeName: string;
  storeSubtotal: number;
  storeTax: number;
  storeTotal: number;
  items: CartItemDetail[];
}

export interface CartSummaryResponse {
  id: string;
  customerId: string;
  totalItems: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  stores: StoreCartGroup[];
  hasInvalidItems: boolean;
}
