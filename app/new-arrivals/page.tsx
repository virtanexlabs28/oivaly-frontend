"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SparkleIcon,
  PackageIcon,
  ShieldCheckIcon,
  FunnelIcon,
  ArrowsDownUpIcon,
  MapPinIcon,
  ArrowRightIcon,
  LeafIcon,
  TagIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { productsApi } from "@/resources/apis/products.api";
import { ProductCard } from "@/components/product/product-card";

interface DisplayProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  storeName: string;
  storeCity: string;
  category: string;
  imageUrl: string;
  badge?: string;
  freeShipping?: boolean;
  isSmallBatch?: boolean;
}

const CATEGORY_TABS = [
  { id: "all", label: "All New Arrivals" },
  { id: "ceramics", label: "Studio Ceramics" },
  { id: "textiles", label: "Linen & Wool" },
  { id: "woodwork", label: "Nordic Woodwork" },
  { id: "glassware", label: "Mouth-Blown Glass" },
  { id: "sauna", label: "Sauna & Botanical" },
  { id: "jewelry", label: "Artisan Jewelry" },
  { id: "home", label: "Lighting & Decor" },
];

export default function NewArrivalsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [sortBy, setSortBy] = React.useState<"latest" | "price-asc" | "price-desc">("latest");
  const [items, setItems] = React.useState<DisplayProduct[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadBackendProducts() {
      setIsLoading(true);
      try {
        const res = await productsApi.getMarketplace({ limit: 40 });
        if (res?.data && res.data.length > 0) {
          const mapped: DisplayProduct[] = res.data.map((p, idx) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price),
            originalPrice: undefined,
            storeName: p.store?.name || "Independent Studio",
            storeCity: "Finland",
            category: p.category?.slug?.toLowerCase() || (idx % 2 === 0 ? "ceramics" : "textiles"),
            imageUrl: p.images?.[0]?.url || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
            badge: idx % 3 === 0 ? "Just Added" : "Small Batch",
            freeShipping: Number(p.price) >= 50,
            isSmallBatch: true,
          }));
          setItems(mapped);
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadBackendProducts();
  }, []);

  const filteredItems = React.useMemo(() => {
    let result = items;
    if (selectedCategory !== "all") {
      result = result.filter(
        (i) => i.category.toLowerCase().includes(selectedCategory) || selectedCategory.includes(i.category.toLowerCase())
      );
    }

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    return result;
  }, [items, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">New Arrivals</span>
        </nav>

        {/* Hero Editorial Header */}
        <div className="border border-border/80 bg-brand-warm-ivory dark:bg-card p-6 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
              <SparkleIcon className="size-4" weight="fill" />
              <span>Direct Studio Releases &bull; Authentic Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight leading-tight">
              Fresh Nordic Arrivals
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Explore the latest wheel-thrown ceramics, hand-loomed flax linens, Arctic birch woodwork, and wild-harvested botanical apothecary. Every piece is handcrafted in limited batches directly in independent Scandinavian studios.
            </p>
          </div>

          {/* Quick Stats Highlights */}
          <div className="mt-8 pt-6 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Latest Batch</span>
              <strong className="text-foreground font-serif text-sm">Live Inventory</strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Artisan Share</span>
              <strong className="text-foreground font-serif text-sm">90% Direct to Maker</strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Direct Dispatch</span>
              <strong className="text-foreground font-serif text-sm">Independent Workshops</strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Finnish VAT</span>
              <strong className="text-foreground font-serif text-sm">25.5% Included</strong>
            </div>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors border ${
                  selectedCategory === cat.id
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest"
                    : "bg-background text-muted-foreground border-border/80 hover:text-foreground hover:border-foreground/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0 text-xs">
            <ArrowsDownUpIcon className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "latest" | "price-asc" | "price-desc")}
              className="bg-background border border-border/80 px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="latest">Latest Drop</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xs" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                price={p.price}
                originalPrice={p.originalPrice}
                storeName={p.storeName}
                storeCity={p.storeCity}
                imageUrl={p.imageUrl}
                badge={p.badge}
                freeShipping={p.freeShipping}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-card border border-border/80 rounded-sm">
            <PackageIcon className="size-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-foreground">No new arrivals in this department</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Our independent studios list new pieces as they finish them on the wheel and loom. Check back soon!
            </p>
            <Link
              href="/seller/signup"
              className="mt-4 inline-block text-xs font-semibold text-primary underline"
            >
              Are you a maker? Join our marketplace
            </Link>
          </div>
        )}

        {/* Collector Newsletter Signup */}
        <div className="border border-border/80 bg-card p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-3">
          <SparkleIcon className="size-6 text-primary mx-auto" weight="fill" />
          <h3 className="text-lg font-serif font-bold text-foreground">Never Miss a Small Batch Drop</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Independent artisans produce limited editions of 10 to 50 pieces. Receive our weekly Saturday morning digest highlighting new studio arrivals before they sell out.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="h-10 px-3 text-xs bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary flex-1"
            />
            <button
              type="button"
              className="h-10 px-5 bg-brand-deep-forest text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-deep-forest/90 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
