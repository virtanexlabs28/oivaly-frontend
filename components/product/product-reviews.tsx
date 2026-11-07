import * as React from "react";
import { StarIcon, CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { reviewsApi } from "@/resources/apis/reviews.api";
import type { ProductReviewSummary } from "@/resources/interfaces/review.interface";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ProductReviewsProps {
  productId: string;
  className?: string;
}

export async function ProductReviews({
  productId,
  className,
}: ProductReviewsProps) {
  let summary: ProductReviewSummary = {
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    reviews: [],
  };

  try {
    summary = await reviewsApi.getProductReviews(productId);
  } catch (err) {
    console.warn("[reviews] Failed to load reviews from backend:", err);
  }

  const hasReviews = summary.totalReviews > 0;

  return (
    <section
      aria-labelledby="reviews-heading"
      className={cn("pt-12 border-t border-border/70", className)}
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block mb-1">
            Verified Feedback
          </span>
          <h2
            id="reviews-heading"
            className="font-heading text-xl sm:text-2xl font-semibold text-foreground"
          >
            Customer Reviews
          </h2>
        </div>

        {hasReviews && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground text-sm">
              {summary.averageRating.toFixed(1)} / 5
            </span>
            <span>({summary.totalReviews} reviews)</span>
          </div>
        )}
      </div>

      {hasReviews ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Star Breakdown & Distribution */}
          <div className="p-5 border border-border/70 bg-card space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">
                {summary.averageRating.toFixed(1)}
              </span>
              <div>
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      weight={i < Math.round(summary.averageRating) ? "fill" : "regular"}
                      className="size-4"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  Based on {summary.totalReviews} verified purchases
                </span>
              </div>
            </div>

            {/* Distribution bars */}
            <div className="space-y-1.5 pt-2 border-t border-border/60 text-xs text-muted-foreground">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = summary.distribution[stars as keyof typeof summary.distribution] || 0;
                const pct = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;

                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-6 text-[11px]">{stars} ★</span>
                    <Progress value={pct} className="h-2 flex-1 rounded-none bg-muted" />
                    <span className="w-6 text-[11px] text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Reviews List */}
          <div className="md:col-span-2 space-y-4">
            {summary.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 border border-border/70 bg-card space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        weight={i < rev.rating ? "fill" : "regular"}
                        className="size-3.5"
                        aria-hidden="true"
                      />
                    ))}
                    {rev.title && (
                      <strong className="text-foreground ml-1 font-semibold">
                        {rev.title}
                      </strong>
                    )}
                  </div>

                  {rev.isVerifiedPurchase && (
                    <Badge
                      variant="outline"
                      className="text-[10px] gap-1 px-1.5 py-0.5 font-normal text-emerald-800 dark:text-emerald-300 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 rounded-none"
                    >
                      <CheckCircleIcon className="size-3" aria-hidden="true" />
                      <span>Verified Buyer</span>
                    </Badge>
                  )}
                </div>

                <p className="text-foreground/90 leading-relaxed">{rev.comment}</p>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>
                    {rev.user?.firstName
                      ? `${rev.user.firstName} ${rev.user.lastName ? rev.user.lastName[0] + "." : ""}`
                      : "Verified Customer"}
                  </span>
                  <span>{new Date(rev.createdAt).toLocaleDateString("en-IE")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center border border-border/70 bg-card/40 max-w-xl mx-auto space-y-2">
          <p className="font-medium text-sm text-foreground">
            No customer reviews yet
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Be the first to review this handcrafted item. Only customers with completed orders can submit a verified review.
          </p>
        </div>
      )}
    </section>
  );
}
