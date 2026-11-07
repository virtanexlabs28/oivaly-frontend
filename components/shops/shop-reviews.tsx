import * as React from "react";
import { StarIcon, ChatCircleTextIcon, ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr";

export interface ShopReviewsProps {
  shopName: string;
  rating?: number | null;
  reviewCount?: number;
}

export function ShopReviews({
  shopName,
  rating,
  reviewCount = 0,
}: ShopReviewsProps) {
  const hasReviews = Boolean(rating && reviewCount > 0);

  return (
    <section
      id="reviews"
      aria-labelledby="shop-reviews-heading"
      className="scroll-mt-32 pt-12 border-t border-border/70 pb-12"
    >
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block mb-1">
            Community & Feedback
          </span>
          <h2
            id="shop-reviews-heading"
            className="font-heading text-xl sm:text-2xl font-semibold text-foreground tracking-tight"
          >
            Customer Reviews
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Genuine experiences from customers who have purchased handcrafted items from {shopName}.
          </p>
        </div>

        {hasReviews ? (
          <div className="border border-border/80 bg-card p-6 max-w-xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-heading font-semibold text-foreground">
                {rating?.toFixed(1)}
              </div>
              <div>
                <div className="flex items-center gap-1 text-primary">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className="size-4"
                      weight={star <= (rating || 0) ? "fill" : "regular"}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground mt-0.5 block">
                  Based on {reviewCount} verified {reviewCount === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl border border-dashed border-border/80 bg-card/60 p-6 sm:p-8 text-center space-y-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-brand-pale-sage/60 text-primary mx-auto">
              <ChatCircleTextIcon className="size-6" aria-hidden="true" />
            </div>
            <h3 className="font-heading text-base font-semibold text-foreground">
              No customer reviews yet
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              {shopName} has not received verified customer reviews yet. Once you complete an order and receive your items, you will be invited to leave an authentic review for this maker.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-brand-deep-forest font-medium">
              <ShieldCheckIcon className="size-4 text-primary" aria-hidden="true" />
              <span>All orders protected by Nordic Buyer Protection</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
