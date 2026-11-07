import * as React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { ProductCard } from "./product-card";
import { productsApi } from "@/resources/apis/products.api";
import { DEMO_FEATURED_PRODUCTS } from "@/fixtures/marketplace-demo";
import type { Product } from "@/resources/interfaces/product.interface";

export interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string | null;
  className?: string;
}

export async function RelatedProducts({
  currentProductId,
  categoryId,
  className,
}: RelatedProductsProps) {
  let related: Product[] = [];

  try {
    const res = await productsApi.getMarketplace({
      categoryId: categoryId || undefined,
      limit: 5,
    });
    if (res.data) {
      related = res.data.filter((p) => p.id !== currentProductId).slice(0, 4);
    }
  } catch {
    // Graceful fallback
  }

  // Supplement with demo fixtures if catalog is sparse
  if (related.length < 4) {
    const fallbackDemos = DEMO_FEATURED_PRODUCTS.filter(
      (d) => d.id !== currentProductId && d.slug !== currentProductId
    ).slice(0, 4 - related.length);

    fallbackDemos.forEach((d) => {
      related.push({
        id: d.id,
        storeId: d.storeId,
        name: d.name,
        slug: d.slug,
        price: d.price,
        vatRate: d.vatRate,
        vatIncluded: d.vatIncluded,
        status: "PUBLISHED",
        store: { id: d.storeId, name: d.storeName, status: "ACTIVE" },
        images: [{ id: `${d.id}-img`, productId: d.id, url: d.imageUrl, altText: d.imageAlt, isPrimary: true, sortOrder: 0 }],
        createdAt: "2026-10-01T10:00:00Z",
        updatedAt: "2026-10-01T10:00:00Z",
      });
    });
  }

  if (related.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-products-heading"
      className={className}
    >
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block mb-1">
            Curated Picks
          </span>
          <h2
            id="related-products-heading"
            className="font-heading text-xl sm:text-2xl font-semibold text-foreground"
          >
            You might also like
          </h2>
        </div>

        <Link
          href="/search"
          className="inline-flex items-center text-xs font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <span>Browse all</span>
          <ArrowRightIcon className="size-3.5 ml-1" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {related.map((prod) => (
          <ProductCard
            key={prod.id}
            id={prod.id}
            name={prod.name}
            slug={prod.slug}
            price={prod.price}
            storeName={prod.store?.name}
            storeId={prod.store?.id}
            imageUrl={prod.images?.[0]?.url || null}
            imageAlt={prod.images?.[0]?.altText || prod.name}
            vatIncluded={prod.vatIncluded ?? true}
          />
        ))}
      </div>
    </section>
  );
}
