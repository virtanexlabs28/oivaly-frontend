"use client";

import * as React from "react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/resources/interfaces/product.interface";

export interface CatalogProductGridProps {
  products: Product[];
  priorityCount?: number;
  className?: string;
}

export function CatalogProductGrid({
  products,
  priorityCount = 4,
  className,
}: CatalogProductGridProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Tuotevalikoima / Product grid"
      className={className}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4 lg:gap-5">
        {products.map((product, idx) => {
          const primaryImage =
            product.images?.find((img) => img.isPrimary) || product.images?.[0];

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              storeName={product.store?.name}
              storeId={product.store?.id}
              imageUrl={primaryImage?.url || null}
              imageAlt={primaryImage?.altText || product.name}
              vatIncluded={product.vatIncluded ?? true}
              priorityImage={idx < priorityCount}
            />
          );
        })}
      </div>
    </div>
  );
}
