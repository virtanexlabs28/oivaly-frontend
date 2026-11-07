"use client";

import * as React from "react";
import { CatalogHeader, type BreadcrumbCrumb } from "./catalog-header";
import { FilterSidebar } from "./filter-sidebar";
import { ActiveFilters } from "./active-filters";
import { CatalogProductGrid } from "./catalog-product-grid";
import { CatalogPagination } from "./catalog-pagination";
import { CatalogEmptyState } from "./catalog-empty-state";
import { CatalogErrorState } from "./catalog-error-state";
import type { CatalogFilterState } from "@/lib/search-url";
import type { MarketplaceCategory } from "@/lib/categories";
import type { Product } from "@/resources/interfaces/product.interface";

export interface CatalogViewProps {
  title: string;
  description?: string | null;
  breadcrumbs: BreadcrumbCrumb[];
  basePath: string;
  filters: CatalogFilterState;
  categories: MarketplaceCategory[];
  products: Product[];
  total: number;
  page: number;
  limit: number;
  errorMessage?: string | null;
}

export function CatalogView({
  title,
  description,
  breadcrumbs,
  basePath,
  filters,
  categories,
  products,
  total,
  page,
  limit,
  errorMessage,
}: CatalogViewProps) {
  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb, Title, Result Count, Sort, and Mobile Filter Trigger */}
      <CatalogHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        total={total}
        basePath={basePath}
        filters={filters}
        categories={categories}
      />

      {/* 2. Active Filter Badges */}
      <ActiveFilters
        basePath={basePath}
        filters={filters}
        categories={categories}
      />

      {/* 3. Main Discovery Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-2">
        {/* Desktop Sidebar (Left column) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <FilterSidebar
              basePath={basePath}
              filters={filters}
              categories={categories}
            />
          </div>
        </div>

        {/* Results Area (Right column) */}
        <div className="lg:col-span-3 min-w-0">
          {errorMessage ? (
            <CatalogErrorState message={errorMessage} />
          ) : total === 0 || products.length === 0 ? (
            <CatalogEmptyState
              basePath={basePath}
              filters={filters}
              categories={categories}
            />
          ) : (
            <div className="space-y-8">
              <CatalogProductGrid products={products} />
              <CatalogPagination
                total={total}
                page={page}
                limit={limit}
                basePath={basePath}
                filters={filters}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
