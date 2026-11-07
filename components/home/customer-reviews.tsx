import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon, CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { DEMO_CUSTOMER_REVIEWS, type DemoReviewItem } from "@/fixtures/marketplace-demo";
import type { MarketplacePublicReview } from "@/resources/apis/reviews.api";

export interface CustomerReviewsProps {
  realReviews?: MarketplacePublicReview[];
  reviews?: DemoReviewItem[];
}

/**
 * Etsy-inspired Customer Reviews & Community Appreciation Section.
 * Highlights verified buyer feedback, purchased product thumbnails,
 * and maker studio attribution. Integrates real backend marketplace reviews
 * with demonstration fallbacks.
 */
export function CustomerReviews({
  realReviews = [],
  reviews = DEMO_CUSTOMER_REVIEWS,
}: CustomerReviewsProps) {
  // Map real backend reviews into display cards
  const mappedRealReviews: DemoReviewItem[] = realReviews.map((r) => ({
    id: r.id,
    author: r.author,
    city: r.city || "Finland",
    rating: r.rating || 5,
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB", { month: "short", day: "numeric" }) : "Recently",
    comment: r.comment,
    productName: r.productName,
    productPrice: r.productPrice,
    productImageUrl: r.productImageUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=300&auto=format&fit=crop",
    productSlug: r.productSlug,
    storeName: r.storeName,
  }));

  const displayReviews = [
    ...mappedRealReviews,
    ...reviews.filter((demo) => !mappedRealReviews.some((real) => real.id === demo.id)),
  ].slice(0, 3);

  return (
    <section
      aria-labelledby="reviews-heading"
      className="py-14 sm:py-20 bg-background border-b border-border/70"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block mb-1">
            Community Love
          </span>
          <h2
            id="reviews-heading"
            className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
          >
            What shoppers are saying
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Real feedback from customers supporting independent makers across Finland and the Nordics.
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between p-6 rounded-md bg-card border border-border/80 shadow-xs hover:border-border transition-all"
            >
              <div>
                {/* 5-Star Rating Row */}
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {Array.from({ length: Math.min(5, Math.max(1, rev.rating)) }).map((_, i) => (
                    <StarIcon key={i} className="size-4" weight="fill" aria-hidden="true" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2 font-normal">
                    {rev.date}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div>
                {/* Author Info */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-4">
                  <span>{rev.author}</span>
                  <span className="text-muted-foreground font-normal">&bull; {rev.city}</span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium ml-1">
                    <CheckCircleIcon className="size-3" weight="fill" />
                    Verified purchase
                  </span>
                </div>

                {/* Purchased Product Micro-Card */}
                <Link
                  href={`/products/${rev.productSlug}`}
                  className="flex items-center gap-3 p-2 rounded-xs bg-muted/40 hover:bg-muted/80 border border-border/50 transition-colors"
                >
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-xs bg-muted">
                    <Image
                      src={rev.productImageUrl}
                      alt={rev.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-foreground truncate">
                      {rev.productName}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      from {rev.storeName}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
