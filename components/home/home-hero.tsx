"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  SparkleIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  LeafIcon,
  CheckCircleIcon,
  StarIcon,
  StorefrontIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export interface HomeHeroProps {
  eyebrow?: string;
  headline?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

const QUICK_TAGS = [
  { label: "Electronics", href: "/categories/electronics" },
  { label: "Headphones", href: "/categories/headphone" },
  { label: "Smartphones", href: "/search?q=iphone" },
  { label: "Wireless Audio", href: "/search?q=wireless" },
];

const TRUST_PILLS = [
  { icon: ShieldCheckIcon, label: "Verified Nordic Ateliers" },
  { icon: LeafIcon, label: "Carbon-Neutral EU Shipping" },
  { icon: CheckCircleIcon, label: "Direct Studio Support" },
];

/**
 * Editorial Scandinavian & Etsy-inspired Hero Section for Oivaly.
 * Features an artisan lifestyle collage, integrated discovery search bar,
 * quick category chips, floating product callouts, and maker badges.
 */
export function HomeHero({
  eyebrow = "HANDCRAFTED & CURATED FOR YOU",
  headline = "Find things you'll love. Support independent makers.",
  description = "Discover one-of-a-kind pottery, pure washed linen, hand-carved woodware, and heirloom jewelry directly from vetted Finnish and Scandinavian workshops.",
  primaryCtaText = "Explore Marketplace",
  primaryCtaHref = "/categories",
  secondaryCtaText = "Meet the Makers",
  secondaryCtaHref = "#makers",
}: HomeHeroProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/categories");
    }
  };

  return (
    <section
      aria-label="Welcome to Oivaly"
      className="relative overflow-hidden bg-brand-warm-ivory dark:bg-card/40 border-b border-border/80"
    >
      {/* Subtle warm organic ambient background */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-brand-pale-sage/40 dark:bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 -right-24 size-96 rounded-full bg-brand-soft-beige/50 dark:bg-muted/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Copy, Search, & Actions */}
          <div className="lg:col-span-6 flex flex-col items-start justify-center text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary bg-brand-pale-sage/90 dark:bg-muted/80 border border-brand-sage/20 mb-4 shadow-2xs rounded-full">
              <SparkleIcon className="size-3.5 text-primary" weight="fill" aria-hidden="true" />
              <span>{eyebrow}</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.12] mb-4">
              {headline}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mb-6">
              {description}
            </p>

            {/* Integrated Discovery Search Bar (Etsy style prominent search) */}
            <form onSubmit={handleSearch} className="w-full max-w-xl mb-3">
              <div className="flex items-center rounded-full border border-border bg-background shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all p-1">
                <div className="pl-3 pr-2 text-muted-foreground flex items-center">
                  <MagnifyingGlassIcon className="size-4" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search electronics, headphones, mobile devices, stores..."
                  className="h-10 w-full bg-transparent px-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  aria-label="Search the marketplace"
                />
                <Button
                  type="submit"
                  size="default"
                  className="h-9 px-5 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Trending Category Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mb-7 text-xs text-muted-foreground">
              <span className="text-[11px] font-semibold text-muted-foreground mr-1">Trending:</span>
              {QUICK_TAGS.map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium text-foreground/80 bg-background/90 hover:bg-background hover:text-primary border border-border/80 hover:border-primary/50 rounded-full transition-all shadow-2xs"
                >
                  {tag.label}
                </Link>
              ))}
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8">
              <Button asChild size="default" className="px-6 h-11 rounded-full text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={primaryCtaHref}>
                  <span>{primaryCtaText}</span>
                  <ArrowRightIcon className="size-4 ml-1.5" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="default"
                className="px-6 h-11 rounded-full text-xs sm:text-sm font-semibold border-border hover:bg-muted"
              >
                <Link href={secondaryCtaHref}>
                  <span>{secondaryCtaText}</span>
                </Link>
              </Button>
            </div>

            {/* Micro Trust Pills */}
            <div className="pt-5 border-t border-border/70 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground w-full">
              {TRUST_PILLS.map((pill, i) => {
                const Icon = pill.icon;
                return (
                  <span key={i} className="inline-flex items-center gap-1.5 text-foreground/80 font-medium text-[11px] sm:text-xs">
                    <Icon className="size-3.5 text-primary" weight="bold" aria-hidden="true" />
                    <span>{pill.label}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Right Column: Layered Editorial Lifestyle Collage */}
          <div className="lg:col-span-6 relative">
            {/* Top-Left Social Proof Rating Card */}
            <div className="hidden sm:flex absolute -top-3 -left-3 z-10 items-center gap-3 bg-background/95 backdrop-blur-md border border-border px-3.5 py-2.5 shadow-md rounded-md max-w-[270px]">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-sm border border-border">
                <Image
                  src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=200&auto=format&fit=crop"
                  alt="Ceramicist throwing clay on pottery wheel"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1 text-amber-500">
                  <StarIcon className="size-3.5" weight="fill" />
                  <span className="text-xs font-bold text-foreground">4.9 / 5</span>
                  <span className="text-[10px] text-muted-foreground font-normal">(1.2k+ reviews)</span>
                </div>
                <span className="text-[11px] font-medium text-foreground truncate mt-0.5">
                  Independent Nordic Studios
                </span>
              </div>
            </div>

            {/* Main Lifestyle Hero Photo */}
            <div className="relative aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 w-full overflow-hidden rounded-md border border-border shadow-md bg-muted group">
              <Image
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
                alt="Bright Scandinavian interior with natural wood furniture and handcrafted ceramic pieces"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Scrim for Card Contrast */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Overlaid Editorial Maker Callout */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-background/95 backdrop-blur-md border border-border p-3.5 shadow-lg rounded-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Featured Atelier
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full">
                    <CheckCircleIcon className="size-3" weight="fill" />
                    Verified
                  </span>
                </div>
                <p className="text-xs font-bold text-foreground mt-1">
                  Kupittaa Ceramics &bull; Turku, Finland
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                  Hand-thrown stoneware for mindful everyday living
                </p>
                <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Mugs from</span>
                  <span className="font-bold text-foreground">€34.00</span>
                </div>
              </div>
            </div>

            {/* Bottom-Right Floating Badge */}
            <div className="hidden sm:inline-flex absolute -bottom-3 -right-3 z-10 items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 shadow-lg rounded-full text-xs font-semibold">
              <StorefrontIcon className="size-4" weight="fill" />
              <span>450+ Active Nordic Ateliers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
