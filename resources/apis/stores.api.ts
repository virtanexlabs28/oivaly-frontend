import { apiClient } from './client';
import { productsApi, type MarketplaceProductsResponse } from './products.api';
import type { Store } from '../interfaces/store.interface';
import type { ProductFilterParams } from '../interfaces/product.interface';

export interface MarketplaceStorePreview {
  id: string;
  name: string;
  legalBusinessName: string;
  address: string;
  phone: string;
  contactName: string;
  status: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  websiteUrl: string | null;
  createdAt: string;
  productCount: number;
  featuredProducts: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl: string | null;
  }>;
}

/**
 * Stores (Sellers / Independent Makers) API Client.
 * Connects directly to backend /marketplace/stores endpoints.
 */
export const storesApi = {
  /**
   * Fetches active marketplace stores / makers.
   */
  async getMarketplaceStores(limit = 20, search?: string): Promise<MarketplaceStorePreview[]> {
    try {
      return await apiClient<MarketplaceStorePreview[]>('/marketplace/stores', {
        params: { limit, search },
        next: { revalidate: 60 },
      });
    } catch {
      return [];
    }
  },

  /**
   * Fetches published products for a specific store from the public marketplace.
   */
  async getStoreProducts(
    storeId: string,
    params?: Omit<ProductFilterParams, 'storeId'>
  ): Promise<MarketplaceProductsResponse> {
    return productsApi.getMarketplace({
      ...params,
      storeId,
    });
  },

  /**
   * Fetches a single public store profile from the backend by UUID or slug.
   */
  async getStore(storeId: string): Promise<Store | null> {
    try {
      return await apiClient<Store>(`/marketplace/stores/${encodeURIComponent(storeId)}`, {
        next: { revalidate: 60 },
      });
    } catch {
      return null;
    }
  },
};
