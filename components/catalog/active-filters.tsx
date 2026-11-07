"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { XIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { buildCatalogUrl, type CatalogFilterState } from "@/lib/search-url";
import type { MarketplaceCategory } from "@/lib/categories";

export interface ActiveFiltersProps {
  basePath: string;
  filters: CatalogFilterState;
  categories?: MarketplaceCategory[];
  className?: string;
}

export function ActiveFilters({
  basePath,
  filters,
  categories = [],
  className,
}: ActiveFiltersProps) {
  const router = useRouter();

  const activeCategory = filters.category
    ? categories.find(
        (c) =>
          c.slug.toLowerCase() === filters.category?.toLowerCase() ||
          c.id.toLowerCase() === filters.category?.toLowerCase()
      )
    : null;

  const hasSearch = Boolean(filters.q && filters.q.trim());
  const hasCategory = Boolean(filters.category && filters.category.trim());
  const hasMinPrice = filters.minPrice !== undefined && filters.minPrice !== "";
  const hasMaxPrice = filters.maxPrice !== undefined && filters.maxPrice !== "";
  const hasInStock =
    filters.inStockOnly === true ||
    filters.inStockOnly === "true" ||
    filters.inStockOnly === "1";

  const totalActive =
    (hasSearch ? 1 : 0) +
    (hasCategory ? 1 : 0) +
    (hasMinPrice || hasMaxPrice ? 1 : 0) +
    (hasInStock ? 1 : 0);

  if (totalActive === 0) {
    return null;
  }

  const removeFilter = (key: keyof CatalogFilterState) => {
    let overrides: Partial<CatalogFilterState> = {};
    if (key === "minPrice" || key === "maxPrice") {
      overrides = { minPrice: undefined, maxPrice: undefined, page: 1 };
    } else {
      overrides = { [key]: undefined, page: 1 };
    }
    const targetUrl = buildCatalogUrl(basePath, filters, overrides);
    router.push(targetUrl);
  };

  const clearAllFilters = () => {
    // Preserve search term when clearing filters if in search view, or clear all
    const targetUrl = buildCatalogUrl(basePath, {
      q: filters.q,
    });
    router.push(targetUrl);
  };

  return (
    <div
      role="region"
      aria-label="Active filters"
      className={className}
    >
      <div className="flex flex-wrap items-center gap-2 pt-2 pb-1">
        <span className="text-xs text-muted-foreground mr-1">
          Active filters:
        </span>

        {/* 1. Search Query Tag */}
        {hasSearch && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-normal bg-card border border-border/80 hover:bg-muted"
          >
            <span>Search: &ldquo;{filters.q}&rdquo;</span>
            <button
              type="button"
              onClick={() => removeFilter("q")}
              aria-label={`Remove search filter: ${filters.q}`}
              className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
            >
              <XIcon className="size-3" aria-hidden="true" />
            </button>
          </Badge>
        )}

        {/* 2. Category Tag */}
        {hasCategory && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-normal bg-card border border-border/80 hover:bg-muted"
          >
            <span>
              Category: {activeCategory ? activeCategory.name : filters.category}
            </span>
            <button
              type="button"
              onClick={() => removeFilter("category")}
              aria-label="Remove category filter"
              className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
            >
              <XIcon className="size-3" aria-hidden="true" />
            </button>
          </Badge>
        )}

        {/* 3. Price Range Tag */}
        {(hasMinPrice || hasMaxPrice) && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-normal bg-card border border-border/80 hover:bg-muted"
          >
            <span>
              Price:{" "}
              {hasMinPrice && hasMaxPrice
                ? `€${filters.minPrice} – €${filters.maxPrice}`
                : hasMinPrice
                ? `from €${filters.minPrice}`
                : `up to €${filters.maxPrice}`}
            </span>
            <button
              type="button"
              onClick={() => removeFilter("minPrice")}
              aria-label="Remove price filter"
              className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
            >
              <XIcon className="size-3" aria-hidden="true" />
            </button>
          </Badge>
        )}

        {/* 4. In Stock Tag */}
        {hasInStock && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-normal bg-card border border-border/80 hover:bg-muted"
          >
            <span>In stock only</span>
            <button
              type="button"
              onClick={() => removeFilter("inStockOnly")}
              aria-label="Remove availability filter"
              className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
            >
              <XIcon className="size-3" aria-hidden="true" />
            </button>
          </Badge>
        )}

        {/* Clear All Action */}
        <button
          type="button"
          onClick={clearAllFilters}
          className="text-xs text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded px-1.5 py-0.5 ml-1"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
