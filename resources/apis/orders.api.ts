import { apiClient } from './client';
import { getAccessToken } from '@/lib/auth-token';
import type { Order, CustomerOrdersResponse } from '../interfaces/order.interface';

export interface CustomerOrderQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

/**
 * Customer Orders & Tracking API client.
 * Calls backend /customer/orders endpoints.
 */
export const ordersApi = {
  /**
   * Retrieves paginated order history strictly for the authenticated customer.
   * Naturally sorted by newest orders first.
   */
  async getCustomerOrders(
    params?: CustomerOrderQueryParams,
    tokenOverride?: string
  ): Promise<CustomerOrdersResponse> {
    const token = tokenOverride || getAccessToken();
    return apiClient<CustomerOrdersResponse>('/customer/orders', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      params: params as Record<string, string | number | boolean | undefined | null>,
      cache: 'no-store',
    });
  },

  /**
   * Retrieves a single customer order with full store orders and item breakdowns.
   */
  async getOrderById(id: string, tokenOverride?: string): Promise<Order> {
    const token = tokenOverride || getAccessToken();
    return apiClient<Order>(`/customer/orders/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
    });
  },

  /**
   * Cancels a pending order before fulfillment starts.
   */
  async cancelOrder(id: string, tokenOverride?: string): Promise<Order> {
    const token = tokenOverride || getAccessToken();
    return apiClient<Order>(`/customer/orders/${id}/cancel`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  /**
   * Track order as guest with orderNumber and guestEmail.
   */
  async trackGuestOrder(orderNumber: string, guestEmail: string): Promise<Order> {
    return apiClient<Order>('/customer/orders/guest/track', {
      params: { orderNumber, guestEmail },
      cache: 'no-store',
    });
  },

  /**
   * Complete checkout for authenticated customer.
   */
  async checkout(payload: {
    shippingAddress: {
      fullName: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
    };
    customerNotes?: string;
  }): Promise<Order> {
    return apiClient<Order>('/customer/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Complete checkout for guest customer.
   */
  async guestCheckout(payload: {
    guestEmail: string;
    guestName: string;
    guestPhone: string;
    shippingAddress: {
      fullName: string;
      phone: string;
      addressLine1: string;
      city: string;
      postalCode: string;
      country: string;
    };
    items: Array<{ variantId?: string; productId?: string; quantity: number }>;
    customerNotes?: string;
  }): Promise<Order> {
    return apiClient<Order>('/customer/checkout/guest', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
