import { apiClient } from './client';
import type { Category } from '../interfaces/product.interface';

/**
 * Public categories API client.
 * Calls backend /categories endpoints.
 */
export const categoriesApi = {
  async getCategories(status?: string): Promise<Category[]> {
    return apiClient<Category[]>('/categories', {
      params: status ? { status } : undefined,
      next: { revalidate: 60 },
    });
  },

  async getCategoryTree(): Promise<Category[]> {
    return apiClient<Category[]>('/categories/tree', {
      next: { revalidate: 60 },
    });
  },

  async getCategory(id: string): Promise<Category> {
    return apiClient<Category>(`/categories/${id}`, {
      next: { revalidate: 60 },
    });
  },
};
