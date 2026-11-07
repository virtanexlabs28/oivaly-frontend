import { apiClient } from './client';
import { getAccessToken } from '@/lib/auth-token';
import type { CustomerAddress, CreateAddressInput, UpdateAddressInput } from '../interfaces/address.interface';

/**
 * Customer Address Book API Client.
 * Calls backend /customer/addresses endpoints.
 */
export const addressesApi = {
  /**
   * Retrieves all saved addresses for the authenticated customer.
   */
  async getAddresses(tokenOverride?: string): Promise<CustomerAddress[]> {
    const token = tokenOverride || getAccessToken();
    return apiClient<CustomerAddress[]>('/customer/addresses', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
    });
  },

  /**
   * Retrieves a single saved address by UUID.
   */
  async getAddress(id: string, tokenOverride?: string): Promise<CustomerAddress> {
    const token = tokenOverride || getAccessToken();
    return apiClient<CustomerAddress>(`/customer/addresses/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
    });
  },

  /**
   * Saves a new shipping address.
   */
  async createAddress(
    data: CreateAddressInput,
    tokenOverride?: string
  ): Promise<CustomerAddress> {
    const token = tokenOverride || getAccessToken();
    return apiClient<CustomerAddress>('/customer/addresses', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(data),
    });
  },

  /**
   * Updates an existing address.
   */
  async updateAddress(
    id: string,
    data: UpdateAddressInput,
    tokenOverride?: string
  ): Promise<CustomerAddress> {
    const token = tokenOverride || getAccessToken();
    return apiClient<CustomerAddress>(`/customer/addresses/${id}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(data),
    });
  },

  /**
   * Sets an address as the customer's primary default address.
   */
  async setDefaultAddress(id: string, tokenOverride?: string): Promise<CustomerAddress> {
    const token = tokenOverride || getAccessToken();
    return apiClient<CustomerAddress>(`/customer/addresses/${id}/default`, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  /**
   * Deletes a saved address.
   */
  async deleteAddress(id: string, tokenOverride?: string): Promise<void> {
    const token = tokenOverride || getAccessToken();
    return apiClient<void>(`/customer/addresses/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};
