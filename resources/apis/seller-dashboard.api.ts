import { apiClient } from './client';
import { sellerAuthApi, type BusinessVerificationResult } from './seller-auth.api';
import type {
  StoreSalesSummary,
  StoreSalesAnalyticsItem,
  StoreProductItem,
  CreateStoreProductPayload,
  UpdateStoreProductPayload,
  StoreInventorySummary,
  StoreOrderItemDetail,
  PaginatedResult,
  UpdateStoreOrderStatusPayload,
  StoreProfileData,
  StoreOrderStatusType,
  ProductStatus,
} from '../interfaces/seller-dashboard.interface';

const SELLER_TOKEN_KEY = 'nordic_seller_token';
const SELLER_STORE_KEY = 'nordic_seller_store';

function getSellerAuthHeaders(storeIdOverride?: string): Record<string, string> {
  const headers: Record<string, string> = {};
  if (typeof window === 'undefined') {
    return headers;
  }

  const token = localStorage.getItem(SELLER_TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let storeId = storeIdOverride;
  if (!storeId) {
    try {
      const rawStore = localStorage.getItem(SELLER_STORE_KEY);
      if (rawStore) {
        const store = JSON.parse(rawStore);
        storeId = store?.id;
      }
    } catch {
      // Ignore JSON parse error
    }
  }

  if (storeId) {
    headers['x-store-id'] = storeId;
  }

  return headers;
}

export const sellerDashboardApi = {
  // ── 1. Financials & Sales Metrics ───────────────────────────────────────

  async getSalesSummary(storeId?: string): Promise<StoreSalesSummary> {
    return apiClient<StoreSalesSummary>('/store/sales/summary', {
      headers: getSellerAuthHeaders(storeId),
      cache: 'no-store',
    });
  },

  async getSalesAnalytics(
    period: '7d' | '30d' | 'today' = '7d',
    storeId?: string
  ): Promise<StoreSalesAnalyticsItem[]> {
    return apiClient<StoreSalesAnalyticsItem[]>('/store/sales/analytics', {
      headers: getSellerAuthHeaders(storeId),
      params: { period },
      cache: 'no-store',
    });
  },

  // ── 2. Products & Inventory ─────────────────────────────────────────────

  async getProducts(params?: {
    page?: number;
    limit?: number;
    status?: ProductStatus;
    search?: string;
    categoryId?: string;
    storeId?: string;
  }): Promise<PaginatedResult<StoreProductItem>> {
    const { storeId, ...queryParams } = params || {};
    return apiClient<PaginatedResult<StoreProductItem>>('/store/products', {
      headers: getSellerAuthHeaders(storeId),
      params: queryParams,
      cache: 'no-store',
    });
  },

  async getProduct(id: string, storeId?: string): Promise<StoreProductItem> {
    return apiClient<StoreProductItem>(`/store/products/${id}`, {
      headers: getSellerAuthHeaders(storeId),
      cache: 'no-store',
    });
  },

  async createProduct(
    payload: CreateStoreProductPayload,
    storeId?: string
  ): Promise<StoreProductItem> {
    return apiClient<StoreProductItem>('/store/products', {
      method: 'POST',
      headers: getSellerAuthHeaders(storeId),
      body: JSON.stringify(payload),
    });
  },

  async updateProduct(
    id: string,
    payload: UpdateStoreProductPayload,
    storeId?: string
  ): Promise<StoreProductItem> {
    return apiClient<StoreProductItem>(`/store/products/${id}`, {
      method: 'PUT',
      headers: getSellerAuthHeaders(storeId),
      body: JSON.stringify(payload),
    });
  },

  async submitProductForReview(id: string, storeId?: string): Promise<StoreProductItem> {
    return apiClient<StoreProductItem>(`/store/products/${id}/submit`, {
      method: 'POST',
      headers: getSellerAuthHeaders(storeId),
    });
  },

  async publishProduct(id: string, storeId?: string): Promise<StoreProductItem> {
    return apiClient<StoreProductItem>(`/store/products/${id}/publish`, {
      method: 'POST',
      headers: getSellerAuthHeaders(storeId),
    });
  },


  async archiveProduct(id: string, storeId?: string): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`/store/products/${id}/archive`, {
      method: 'POST',
      headers: getSellerAuthHeaders(storeId),
    });
  },

  async deleteProduct(id: string, storeId?: string): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`/store/products/${id}`, {
      method: 'DELETE',
      headers: getSellerAuthHeaders(storeId),
    });
  },

  async getInventorySummary(storeId?: string): Promise<StoreInventorySummary> {
    return apiClient<StoreInventorySummary>('/store/products/inventory/summary', {
      headers: getSellerAuthHeaders(storeId),
      cache: 'no-store',
    });
  },

  // ── 3. Orders & Fulfillment ─────────────────────────────────────────────

  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: StoreOrderStatusType;
    search?: string;
    storeId?: string;
  }): Promise<PaginatedResult<StoreOrderItemDetail>> {
    const { storeId, ...queryParams } = params || {};
    return apiClient<PaginatedResult<StoreOrderItemDetail>>('/store/orders', {
      headers: getSellerAuthHeaders(storeId),
      params: queryParams,
      cache: 'no-store',
    });
  },

  async getOrder(id: string, storeId?: string): Promise<StoreOrderItemDetail> {
    return apiClient<StoreOrderItemDetail>(`/store/orders/${id}`, {
      headers: getSellerAuthHeaders(storeId),
      cache: 'no-store',
    });
  },

  async updateOrderStatus(
    id: string,
    payload: UpdateStoreOrderStatusPayload,
    storeId?: string
  ): Promise<StoreOrderItemDetail> {
    return apiClient<StoreOrderItemDetail>(`/store/orders/${id}/status`, {
      method: 'PATCH',
      headers: getSellerAuthHeaders(storeId),
      body: JSON.stringify(payload),
    });
  },

  // ── 4. Categories Picker ────────────────────────────────────────────────

  async getCategories(): Promise<Array<{ id: string; name: string; slug: string }>> {
    return apiClient<Array<{ id: string; name: string; slug: string }>>('/categories', {
      cache: 'no-store',
    });
  },

  // ── 5. Studio Profile & Settings ────────────────────────────────────────

  async getProfile(storeId?: string): Promise<StoreProfileData> {
    return apiClient<StoreProfileData>('/store/profile', {
      headers: getSellerAuthHeaders(storeId),
      cache: 'no-store',
    });
  },

  async updateProfile(
    payload: Partial<StoreProfileData>,
    storeId?: string
  ): Promise<StoreProfileData> {
    return apiClient<StoreProfileData>('/store/profile', {
      method: 'PUT',
      headers: getSellerAuthHeaders(storeId),
      body: JSON.stringify(payload),
    });
  },

  // ── 6. Finnish PRH / YTJ Verification ───────────────────────────────────

  async verifyBusinessId(businessId: string): Promise<BusinessVerificationResult> {
    return sellerAuthApi.verifyBusinessId(businessId);
  },
};
