"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { ProductCard } from "@/components/product/product-card";
import { DEMO_FEATURED_PRODUCTS } from "@/fixtures/marketplace-demo";
import type { Product } from "@/resources/interfaces/product.interface";
import { cn } from "@/lib/utils";

export interface FeaturedProductsProps {
  realProducts?: Product[];
  heading?: string;
  subheading?: string;
  limit?: number;
}

const CATEGORY_TABS = [
  { label: "All Items", slug: "all" },
  { label: "Home & Dining", slug: "home-living" },
  { label: "Ceramics & Art", slug: "art-ceramics" },
  { label: "Jewelry & Craft", slug: "jewelry-accessories" },
  { label: "Nordic Living", slug: "nordic-living" },
];

/**
 * Etsy-inspired Featured Products Grid.
 * Displays published marketplace products with category filter tabs,
 * social proof ratings, discount badges, and responsive 4-column layout.
 */
export function FeaturedProducts({
  realProducts = [],
  heading = "Popular right now",
  subheading = "Thoughtfully made goods and distinctive finds direct from independent Nordic studios.",
  limit = 8,
}: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = React.useState("all");

  // Map real backend products into card-compatible items
  const mappedRealProducts = realProducts.map((p) => {
    const primaryImg = p.images?.find((img) => img.isPrimary) || p.images?.[0];
    const store = p.store;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      originalPrice: undefined,
      vatRate: typeof p.vatRate === "number" ? p.vatRate : 25.5,
      vatIncluded: p.vatIncluded ?? true,
      storeName: store?.name || "Independent Studio",
      storeCity: (store as { address?: string })?.address?.includes("Helsinki")
        ? "Helsinki"
        : undefined,
      storeId: store?.id,
      categoryName: p.category?.name || "Home & Living",
      categorySlug: p.category?.slug || "home-living",
      imageUrl: primaryImg?.url || null,
      imageAlt: primaryImg?.altText || p.name,
      badge: p.status === "PUBLISHED" ? "New In" : undefined,
      isReturnEligible: p.isReturnEligible ?? true,
      rating: 4.9,
      reviewCount: 38,
      freeShipping: true,
    };
  });

  // Derive dynamic category tabs from real inventory
  const categoryTabs = React.useMemo(() => {
    if (mappedRealProducts.length === 0) {
      return CATEGORY_TABS;
    }
    const categoriesMap = new Map<string, string>();
    mappedRealProducts.forEach((item) => {
      if (item.categorySlug && item.categoryName) {
        categoriesMap.set(item.categorySlug, item.categoryName);
      }
    });

    return [
      { label: `All Items (${mappedRealProducts.length})`, slug: "all" },
      ...Array.from(categoriesMap.entries()).map(([slug, label]) => {
        const count = mappedRealProducts.filter((p) => p.categorySlug === slug).length;
        return { label: `${label} (${count})`, slug };
      }),
    ];
  }, [mappedRealProducts]);

  // When live backend products are available, display ONLY live products
  const allItems =
    mappedRealProducts.length > 0 ? mappedRealProducts : DEMO_FEATURED_PRODUCTS;

  // Filter items based on active tab
  const filteredItems =
    activeTab === "all"
      ? allItems
      : allItems.filter((item) => item.categorySlug === activeTab);

  const displayItems = filteredItems.slice(0, limit);

  return (
    <section
      aria-labelledby="featured-products-heading"
      className="py-14 sm:py-20 bg-background border-b border-border/70"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block mb-1">
              Curated Finds
            </span>
            <h2
              id="featured-products-heading"
              className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
            >
              {heading}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-lg">
              {subheading}
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span>Browse all products</span>
            <ArrowRightIcon className="size-3.5 ml-1" aria-hidden="true" />
          </Link>
        </div>

        {/* Etsy-Style Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categoryTabs.map((tab) => {
            const isSelected = activeTab === tab.slug;
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => setActiveTab(tab.slug)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-card text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid: 4 columns on desktop, 3 on tablet, 2 on mobile */}
        {displayItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {displayItems.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                originalPrice={product.originalPrice}
                storeName={product.storeName}
                storeCity={product.storeCity}
                storeId={product.storeId}
                imageUrl={product.imageUrl}
                imageAlt={product.imageAlt}
                badge={product.badge}
                vatIncluded={product.vatIncluded}
                rating={product.rating}
                reviewCount={product.reviewCount}
                freeShipping={product.freeShipping}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-card border border-border/80 rounded-sm">
            <p className="text-sm text-muted-foreground">
              No products found in this category.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className="mt-3 text-xs font-semibold text-primary underline"
            >
              Show all items
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Skeleton fallback for FeaturedProducts when streaming live inventory.
 */
export function FeaturedProductsSkeleton() {
  return (
    <section className="py-14 sm:py-20 bg-background border-b border-border/70 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <div className="h-3 w-28 bg-muted mb-2 rounded-sm" />
          <div className="h-8 w-64 bg-muted mb-2 rounded-sm" />
          <div className="h-4 w-96 bg-muted/60 rounded-sm" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col bg-card border border-border/60 rounded-sm">
              <div className="aspect-square bg-muted" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-20 bg-muted/70 rounded-xs" />
                <div className="h-4 w-full bg-muted rounded-xs" />
                <div className="h-4 w-16 bg-muted pt-2 rounded-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
