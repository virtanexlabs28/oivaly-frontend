import { apiClient } from './client';
import type { ProductReviewSummary } from '../interfaces/review.interface';

export interface MarketplacePublicReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  comment: string;
  title: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string;
  productId: string;
  productName: string;
  productPrice: number;
  productSlug: string;
  productImageUrl: string | null;
  storeName: string;
}

/**
 * Public marketplace reviews API client.
 * Calls backend /marketplace/products/:productId/reviews and /marketplace/reviews endpoints.
 */
export const reviewsApi = {
  async getProductReviews(
    productId: string,
    page = 1,
    limit = 10
  ): Promise<ProductReviewSummary> {
    return apiClient<ProductReviewSummary>(
      `/marketplace/products/${productId}/reviews`,
      {
        params: { page, limit },
        next: { revalidate: 60 },
      }
    );
  },

  async getMarketplaceReviews(limit = 6): Promise<MarketplacePublicReview[]> {
    try {
      return await apiClient<MarketplacePublicReview[]>('/marketplace/reviews', {
        params: { limit },
        next: { revalidate: 60 },
      });
    } catch {
      return [];
    }
  },
};
