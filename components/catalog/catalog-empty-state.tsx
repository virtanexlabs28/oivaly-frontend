"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, ArrowCounterClockwiseIcon, HouseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { buildCatalogUrl, type CatalogFilterState } from "@/lib/search-url";
import type { MarketplaceCategory } from "@/lib/categories";

export interface CatalogEmptyStateProps {
  basePath: string;
  filters: CatalogFilterState;
  categories?: MarketplaceCategory[];
}

export function CatalogEmptyState({
  basePath,
  filters,
  categories = [],
}: CatalogEmptyStateProps) {
  const router = useRouter();

  const handleResetFilters = () => {
    // Clear filters and reset
    const targetUrl = buildCatalogUrl(basePath, {});
    router.push(targetUrl);
  };

  const hasAnyFilter = Boolean(
    filters.q ||
      filters.category ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.inStockOnly
  );

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card/40 border border-border/70 my-4">
      {/* Icon */}
      <div className="flex size-14 items-center justify-center rounded-full bg-brand-pale-sage/60 dark:bg-muted text-primary mb-4">
        <MagnifyingGlassIcon className="size-6" aria-hidden="true" />
      </div>

      {/* Headings */}
      <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground">
        No products found
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-md">
        We couldn&apos;t find any items matching your criteria. Try adjusting your filters or search keywords.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
        {hasAnyFilter && (
          <Button
            type="button"
            onClick={handleResetFilters}
            variant="default"
            size="sm"
            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium h-9 px-4"
          >
            <ArrowCounterClockwiseIcon className="size-3.5 mr-1.5" aria-hidden="true" />
            Clear filters
          </Button>
        )}

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-none border-border/80 text-xs font-medium h-9 px-4"
        >
          <Link href="/">
            <HouseIcon className="size-3.5 mr-1.5" aria-hidden="true" />
            Return home
          </Link>
        </Button>
      </div>

      {/* Suggestions / Popular categories chips */}
      {categories.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border/40 w-full max-w-lg">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Or explore popular departments:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="px-2.5 py-1 text-xs border border-border/70 hover:border-foreground hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
