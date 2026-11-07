/**
 * Product review and rating domain interfaces.
 * Aligned with backend reviews/entities/product-review.entity.ts.
 */

export type ReviewStatus = 'PENDING' | 'PUBLISHED' | 'REJECTED';

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  orderId?: string | null;
  rating: number; // 1 to 5
  title?: string | null;
  comment: string;
  status: ReviewStatus;
  isVerifiedPurchase: boolean;
  createdAt: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
  } | null;
}

export interface ProductReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  reviews: ProductReview[];
}
