import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { Category, Product } from "@/resources/interfaces/product.interface";

export interface CategoryHubItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  imageUrl: string;
  count?: number;
}

const CATEGORY_IMAGES_MAP: Record<string, string> = {
  ceramics: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop",
  "art-ceramics": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop",
  linen: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=400&auto=format&fit=crop",
  "home-living": "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=400&auto=format&fit=crop",
  wood: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=400&auto=format&fit=crop",
  wool: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?q=80&w=400&auto=format&fit=crop",
  "clothing-shoes": "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?q=80&w=400&auto=format&fit=crop",
  candle: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop",
  "nordic-living": "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=400&auto=format&fit=crop",
  jewelry: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop",
  "jewelry-accessories": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop",
  glass: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=400&auto=format&fit=crop",
  leather: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop",
  electronics: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&auto=format&fit=crop",
  headphone: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400&auto=format&fit=crop",
};

const DEFAULT_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop";

export interface CategoryDiscoveryProps {
  realCategories?: Category[];
  realProducts?: Product[];
  items?: CategoryHubItem[];
}

/**
 * Etsy-inspired Circular Category Discovery Hub ("Shop by Category").
 * Features circular photo avatars, crisp titles, and smooth hover zoom
 * for fast visual browsing. Integrates live categories from backend API.
 */
export function CategoryDiscovery({
  realCategories = [],
  realProducts = [],
  items = [],
}: CategoryDiscoveryProps) {
  // Map real backend categories into category hub items with live product counts & imagery
  const mappedRealCategories: CategoryHubItem[] = realCategories.map((c) => {
    // 1. Calculate live products matching this category
    const matchingProducts = realProducts.filter(
      (p) =>
        p.categoryId === c.id ||
        p.category?.slug === c.slug ||
        p.category?.id === c.id
    );
    const count = matchingProducts.length;

    // 2. Resolve image: category imageUrl -> first product image in category -> image map -> default
    const productWithImg = matchingProducts.find(
      (p) => p.images && p.images.length > 0 && p.images[0]?.url
    );
    const slugKey = c.slug?.toLowerCase() || c.name.toLowerCase();
    const matchedImg =
      (c as unknown as { imageUrl?: string }).imageUrl ||
      productWithImg?.images?.[0]?.url ||
      CATEGORY_IMAGES_MAP[slugKey] ||
      Object.entries(CATEGORY_IMAGES_MAP).find(([k]) => slugKey.includes(k))?.[1] ||
      DEFAULT_CATEGORY_IMAGE;

    const subtitle =
      count > 0
        ? `${count} ${count === 1 ? "product" : "products"}`
        : c.description || "Explore department";

    return {
      id: c.id,
      title: c.name,
      subtitle,
      href: `/categories/${c.slug || c.id}`,
      imageUrl: matchedImg,
      count,
    };
  });

  // When live backend categories exist, display ONLY live categories directly from the backend
  const displayItems =
    mappedRealCategories.length > 0 ? mappedRealCategories : items;

  return (
    <section
      aria-labelledby="categories-heading"
      className="py-12 sm:py-16 bg-background border-b border-border/70"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block mb-1">
              Shop by Department
            </span>
            <h2
              id="categories-heading"
              className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
            >
              Explore popular categories
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-lg">
              {mappedRealCategories.length > 0
                ? `Explore active departments and authentic products directly from our marketplace catalog.`
                : "Browse verified departments and products directly from our sellers."}
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span>All categories</span>
            <ArrowRightIcon className="size-3.5 ml-1" aria-hidden="true" />
          </Link>
        </div>

        {/* Circular Category Row / Grid */}
        {displayItems.length === 0 ? (
          <div className="py-6 text-sm text-muted-foreground">
            No categories available at this moment.
          </div>
        ) : (
          <div className="flex flex-wrap items-start justify-start gap-6 sm:gap-10 pb-2">
            {displayItems.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group flex flex-col items-center text-center shrink-0 w-24 sm:w-28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1 transition-transform"
              >
                {/* Circular Avatar Photo */}
                <div className="relative size-20 sm:size-24 lg:size-28 rounded-full overflow-hidden bg-muted border-2 border-border/70 group-hover:border-primary group-hover:shadow-md transition-all duration-300 ring-2 ring-transparent group-hover:ring-primary/20">
                  <Image
                    src={cat.imageUrl}
                    alt={cat.title}
                    fill
                    sizes="(min-width: 1024px) 12vw, (min-width: 640px) 20vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors mt-3 leading-tight line-clamp-1">
                  {cat.title}
                </h3>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                  {cat.subtitle}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Skeleton loader matching the circular CategoryDiscovery layout.
 */
export function CategoryDiscoverySkeleton() {
  return (
    <section
      aria-label="Loading categories"
      className="py-12 sm:py-16 bg-background border-b border-border/70"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="space-y-2">
            <div className="h-3 w-28 bg-muted rounded-full animate-pulse" />
            <div className="h-7 w-56 bg-muted rounded-md animate-pulse" />
            <div className="h-4 w-72 bg-muted rounded-md animate-pulse" />
          </div>
          <div className="h-4 w-24 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="flex flex-wrap items-start gap-6 sm:gap-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center shrink-0 w-24 sm:w-28 space-y-3"
            >
              <div className="size-20 sm:size-24 lg:size-28 rounded-full bg-muted border-2 border-border/70 animate-pulse" />
              <div className="h-3.5 w-16 bg-muted rounded-full animate-pulse" />
              <div className="h-2.5 w-12 bg-muted rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
