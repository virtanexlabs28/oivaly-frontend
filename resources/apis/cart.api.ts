import { apiClient } from './client';
import type { AddCartItemPayload, CartSummaryResponse } from '../interfaces/cart.interface';

/**
 * Customer Shopping Cart API client.
 * Calls backend /customer/cart endpoints.
 */
export const cartApi = {
  async getCart(): Promise<CartSummaryResponse> {
    return apiClient<CartSummaryResponse>('/customer/cart');
  },

  async addItem(payload: AddCartItemPayload): Promise<CartSummaryResponse> {
    return apiClient<CartSummaryResponse>('/customer/cart/items', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateItem(itemId: string, quantity: number): Promise<CartSummaryResponse> {
    return apiClient<CartSummaryResponse>(`/customer/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  },

  async removeItem(itemId: string): Promise<CartSummaryResponse> {
    return apiClient<CartSummaryResponse>(`/customer/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  async clearCart(): Promise<void> {
    return apiClient<void>('/customer/cart', {
      method: 'DELETE',
    });
  },
};
