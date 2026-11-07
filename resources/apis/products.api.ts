import { apiClient } from './client';
import type { Product, ProductFilterParams } from '../interfaces/product.interface';

export interface MarketplaceProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Public marketplace products API client.
 * Calls backend /marketplace endpoints.
 */
export const productsApi = {
  async getMarketplace(params?: ProductFilterParams): Promise<MarketplaceProductsResponse> {
    return apiClient<MarketplaceProductsResponse>('/marketplace', {
      params: params as Record<string, string | number | boolean | undefined | null>,
      next: { revalidate: 60 },
    });
  },

  async getProduct(id: string): Promise<Product> {
    return apiClient<Product>(`/marketplace/${id}`);
  },
};
