"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterMobileDrawer } from "./filter-mobile-drawer";
import { buildCatalogUrl, type CatalogFilterState } from "@/lib/search-url";
import type { MarketplaceCategory } from "@/lib/categories";

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
}

export interface CatalogHeaderProps {
  title: string;
  description?: string | null;
  breadcrumbs: BreadcrumbCrumb[];
  total: number;
  basePath: string;
  filters: CatalogFilterState;
  categories: MarketplaceCategory[];
}

export function CatalogHeader({
  title,
  description,
  breadcrumbs,
  total,
  basePath,
  filters,
  categories,
}: CatalogHeaderProps) {
  const router = useRouter();

  const handleSortChange = (value: string) => {
    const targetUrl = buildCatalogUrl(basePath, filters, {
      sort: value === "newest" ? undefined : value,
      page: 1,
    });
    router.push(targetUrl);
  };

  const currentSort = filters.sort || "newest";

  const resultCountText =
    total === 1 ? "1 product found" : `${total} products found`;

  return (
    <div className="space-y-4 pb-4 border-b border-border/70">
      {/* 1. Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                <BreadcrumbItem>
                  {isLast || !crumb.href ? (
                    <BreadcrumbPage className="font-normal text-foreground">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Title & Result count & Controls row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
              {description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1.5" aria-live="polite">
            {resultCountText}
          </p>
        </div>

        {/* 3. Action Toolbar: Mobile filter trigger + Sort select */}
        <div className="flex items-center gap-2 self-start sm:self-end">
          {/* Mobile Filter Drawer trigger */}
          <div className="lg:hidden">
            <FilterMobileDrawer
              basePath={basePath}
              filters={filters}
              categories={categories}
            />
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-select"
              className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline"
            >
              Sort by:
            </label>
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger
                id="sort-select"
                aria-label="Sort products"
                className="h-9 min-w-[150px] text-xs rounded-none border-border/80 bg-card"
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-none">
                <SelectItem value="newest" className="text-xs rounded-none">
                  Newest first
                </SelectItem>
                <SelectItem value="price_asc" className="text-xs rounded-none">
                  Price: low to high
                </SelectItem>
                <SelectItem value="price_desc" className="text-xs rounded-none">
                  Price: high to low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
