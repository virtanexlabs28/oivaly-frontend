"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { ShopEmptyState } from "./shop-empty-state";
import type { Product } from "@/resources/interfaces/product.interface";

export interface ShopProductGridProps {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  shopName: string;
  hasActiveFilters?: boolean;
}

export function ShopProductGrid({
  products,
  total,
  page,
  totalPages,
  shopName,
  hasActiveFilters = false,
}: ShopProductGridProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", targetPage.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (products.length === 0) {
    return (
      <ShopEmptyState
        type={hasActiveFilters ? "no-matches" : "no-products"}
        shopName={shopName}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground">
          Explore this shop
        </h2>
        <span className="text-xs text-muted-foreground">
          Showing {products.length} of {total} {total === 1 ? "product" : "products"}
        </span>
      </div>

      {/* Responsive Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => {
          const primaryImg =
            product.images?.find((img) => img.isPrimary)?.url ||
            product.images?.[0]?.url;

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug || product.id}
              price={product.price}
              storeName={shopName}
              storeId={product.storeId}
              imageUrl={primaryImg}
              imageAlt={product.name}
              vatIncluded={product.vatIncluded ?? true}
            />
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          aria-label="Shop products pagination"
          className="flex items-center justify-center gap-2 pt-6 border-t border-border/60"
        >
          <Button
            asChild={page > 1}
            disabled={page <= 1}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {page > 1 ? (
              <Link href={createPageUrl(page - 1)}>
                <ArrowLeftIcon className="size-3.5 mr-1" aria-hidden="true" />
                Previous
              </Link>
            ) : (
              <span>
                <ArrowLeftIcon className="size-3.5 mr-1" aria-hidden="true" />
                Previous
              </span>
            )}
          </Button>

          <div className="flex items-center gap-1 px-2 text-xs text-muted-foreground">
            <span>
              Page <strong className="text-foreground">{page}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>
          </div>

          <Button
            asChild={page < totalPages}
            disabled={page >= totalPages}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {page < totalPages ? (
              <Link href={createPageUrl(page + 1)}>
                Next
                <ArrowRightIcon className="size-3.5 ml-1" aria-hidden="true" />
              </Link>
            ) : (
              <span>
                Next
                <ArrowRightIcon className="size-3.5 ml-1" aria-hidden="true" />
              </span>
            )}
          </Button>
        </nav>
      )}
    </div>
  );
}
