import * as React from "react";
import Link from "next/link";
import { StorefrontIcon, MagnifyingGlassIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export interface ShopEmptyStateProps {
  type?: "no-products" | "no-matches";
  shopName?: string;
  onClearFilters?: () => void;
}

/**
 * Friendly empty states for seller storefronts.
 * Distinguishes between a shop having no published inventory vs. a filter yielding no results.
 */
export function ShopEmptyState({
  type = "no-matches",
  shopName = "This shop",
  onClearFilters,
}: ShopEmptyStateProps) {
  if (type === "no-products") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border/80 bg-card/60">
        <div className="flex size-14 items-center justify-center rounded-full bg-brand-pale-sage/60 text-primary mb-4">
          <StorefrontIcon className="size-7" aria-hidden="true" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground">
          No items listed yet
        </h3>
        <p className="mt-1.5 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {shopName} is currently preparing handcrafted items for this studio collection. Check back soon or explore other independent makers.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/#makers">Discover Other Makers</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/search">Browse All Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border/80 bg-card/60">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <MagnifyingGlassIcon className="size-7" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-foreground">
        No matching products found
      </h3>
      <p className="mt-1.5 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
        We couldn&apos;t find any items matching your current filters in this shop. Try clearing your search term or adjusting your price range.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onClearFilters ? (
          <Button onClick={onClearFilters} variant="outline" size="sm">
            <ArrowCounterClockwiseIcon className="size-3.5 mr-1.5" aria-hidden="true" />
            Clear All Filters
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href="?">Reset Filters</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
