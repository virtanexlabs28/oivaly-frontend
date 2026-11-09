import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { Category } from "@/resources/interfaces/product.interface";

export interface DemoCollectionItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  slug: string;
  imageUrl: string;
  tag: string;
}

export interface CuratedCollectionsProps {
  realCategories?: Category[];
}

const CATEGORY_IMAGES_MAP: Record<string, string> = {
  ceramics: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
  "art-ceramics": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop",
  linen: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop",
  "home-living": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop",
  wood: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=800&auto=format&fit=crop",
  wool: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?q=80&w=800&auto=format&fit=crop",
  "nordic-living": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
  jewelry: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop";

/**
 * Editorial Curated Collections Section.
 * Highlights distinct Scandinavian living themes derived directly from backend categories.
 * Renders null when no categories exist.
 */
export function CuratedCollections({
  realCategories = [],
}: CuratedCollectionsProps) {
  if (!realCategories || realCategories.length === 0) {
    return null;
  }

  const collections: DemoCollectionItem[] = realCategories.slice(0, 3).map((cat) => {
    const slugKey = cat.slug?.toLowerCase() || cat.name.toLowerCase();
    const matchedImg =
      (cat as unknown as { imageUrl?: string }).imageUrl ||
      CATEGORY_IMAGES_MAP[slugKey] ||
      Object.entries(CATEGORY_IMAGES_MAP).find(([k]) => slugKey.includes(k))?.[1] ||
      DEFAULT_IMAGE;

    return {
      id: cat.id,
      title: cat.name,
      subtitle: "Nordic Department",
      description: cat.description || `Discover authentic handcrafted goods in ${cat.name}.`,
      slug: cat.slug || cat.id,
      imageUrl: matchedImg,
      tag: cat.name,
    };
  });

  const [primary, secondary, tertiary] = collections;
  if (!primary) {
    return null;
  }

  return (
    <section
      aria-labelledby="collections-heading"
      className="py-14 sm:py-20 bg-brand-warm-ivory dark:bg-card/30 border-b border-border/70"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block mb-1">
              Editorial Selections
            </span>
            <h2
              id="collections-heading"
              className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
            >
              Themes for the Nordic Home
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-lg">
              Selected goods bringing natural calm, authenticity, and functional beauty to everyday spaces.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span>Explore all themes</span>
            <ArrowRightIcon className="size-3.5 ml-1" aria-hidden="true" />
          </Link>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Large Editorial Spotlight (Left: 7 columns) */}
          {primary && (
            <Link
              href={`/categories/${primary.slug}`}
              className="group relative flex flex-col justify-end overflow-hidden rounded-md border border-border/80 bg-card shadow-xs lg:col-span-7 min-h-[380px] sm:min-h-[440px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Image
                src={primary.imageUrl}
                alt={primary.title}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative p-6 sm:p-8 text-white max-w-lg">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30 mb-3">
                  {primary.tag}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-tight mb-2">
                  {primary.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-4 line-clamp-2">
                  {primary.description}
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:underline">
                  <span>Explore this collection</span>
                  <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </div>
            </Link>
          )}

          {/* Right Column: Stacked 2 Cards (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {secondary && (
              <Link
                href={`/categories/${secondary.slug}`}
                className="group relative flex flex-col justify-end overflow-hidden rounded-md border border-border/80 bg-card shadow-xs flex-1 min-h-[200px] sm:min-h-[210px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Image
                  src={secondary.imageUrl}
                  alt={secondary.title}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"
                  aria-hidden="true"
                />
                <div className="relative p-5 sm:p-6 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30 mb-2">
                    {secondary.tag}
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight leading-snug mb-1">
                    {secondary.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-1 mb-2">
                    {secondary.subtitle}
                  </p>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:underline">
                    <span>Shop now</span>
                    <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            )}

            {tertiary && (
              <Link
                href={`/categories/${tertiary.slug}`}
                className="group relative flex flex-col justify-end overflow-hidden rounded-md border border-border/80 bg-card shadow-xs flex-1 min-h-[200px] sm:min-h-[210px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Image
                  src={tertiary.imageUrl}
                  alt={tertiary.title}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"
                  aria-hidden="true"
                />
                <div className="relative p-5 sm:p-6 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30 mb-2">
                    {tertiary.tag}
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight leading-snug mb-1">
                    {tertiary.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-1 mb-2">
                    {tertiary.subtitle}
                  </p>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:underline">
                    <span>Shop now</span>
                    <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
