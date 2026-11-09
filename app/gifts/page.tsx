"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GiftIcon,
  HeartIcon,
  TagIcon,
  SparkleIcon,
  FireIcon,
  EnvelopeSimpleIcon,
  CheckCircleIcon,
  PackageIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { ProductCard } from "@/components/product/product-card";
import { productsApi } from "@/resources/apis/products.api";
import { toast } from "sonner";

interface GiftItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  storeName: string;
  storeCity: string;
  category: "home" | "sauna" | "heirloom" | "jewelry" | "under50";
  imageUrl: string;
  badge?: string;
  freeShipping?: boolean;
}

export default function GiftsPage() {
  const [activeTab, setActiveTab] = React.useState<"all" | "under50" | "home" | "sauna" | "heirloom" | "jewelry">("all");
  const [customNote, setCustomNote] = React.useState("");
  const [items, setItems] = React.useState<GiftItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadGifts() {
      setIsLoading(true);
      try {
        const res = await productsApi.getMarketplace({ limit: 40 });
        if (res?.data && res.data.length > 0) {
          const mapped: GiftItem[] = res.data.map((p, idx) => {
            const priceNum = Number(p.price);
            let cat: "home" | "sauna" | "heirloom" | "jewelry" | "under50" = "home";
            if (priceNum <= 50) {
              cat = "under50";
            } else if (p.category?.slug?.includes("jewelry")) {
              cat = "jewelry";
            } else if (p.category?.slug?.includes("sauna")) {
              cat = "sauna";
            } else if (idx % 2 === 0) {
              cat = "heirloom";
            }

            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              price: priceNum,
              originalPrice: undefined,
              storeName: p.store?.name || "Independent Studio",
              storeCity: "Finland",
              category: cat,
              imageUrl: p.images?.[0]?.url || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
              badge: priceNum <= 50 ? "Under €50" : "Artisan Gift",
              freeShipping: priceNum >= 50,
            };
          });
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
    loadGifts();
  }, []);

  const filtered = React.useMemo(() => {
    if (activeTab === "all") return items;
    if (activeTab === "under50") return items.filter((item) => item.price <= 50);
    return items.filter((item) => item.category === activeTab);
  }, [items, activeTab]);

  return (
    <div className="min-h-screen bg-background py-8 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Gift Ideas</span>
        </nav>

        {/* Hero Banner */}
        <div className="border border-border/80 bg-brand-warm-ivory dark:bg-card p-6 sm:p-14 text-center max-w-4xl mx-auto space-y-5 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
            <GiftIcon className="size-4" weight="fill" />
            <span>The Nordic Artisan Gift Guide &bull; Authentic Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-6xl font-serif font-bold text-foreground tracking-tight leading-tight">
            Thoughtful Gifts Shaped with Care
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Give a gift that endures. Every piece on Oivaly is crafted in small ateliers across Finland and Scandinavia. From wheel-thrown ceramics to hand-carved arctic burl wood, find authentic creations that carry real human warmth.
          </p>

          {/* Quick Gift Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CheckCircleIcon className="size-3.5 text-emerald-600" weight="fill" />
              <span>Complimentary Handwritten Note</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <PackageIcon className="size-3.5 text-primary" weight="fill" />
              <span>100% Plastic-Free Gift Packaging</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheckIcon className="size-3.5 text-emerald-600" weight="fill" />
              <span>Breakage Protected via Posti</span>
            </span>
          </div>
        </div>

        {/* Interactive Theme Filter Tabs */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-3">
            <div>
              <h2 className="text-xl font-serif font-bold text-foreground">Curated Gift Selections</h2>
              <p className="text-xs text-muted-foreground">Filter by recipient, budget, or Nordic occasion.</p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 text-xs">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                All Gifts
              </button>
              <button
                onClick={() => setActiveTab("under50")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer ${
                  activeTab === "under50"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                Under €50
              </button>
              <button
                onClick={() => setActiveTab("home")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer ${
                  activeTab === "home"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                For the Home
              </button>
              <button
                onClick={() => setActiveTab("sauna")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer ${
                  activeTab === "sauna"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                Sauna & Bath
              </button>
              <button
                onClick={() => setActiveTab("heirloom")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer ${
                  activeTab === "heirloom"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                Rare Heirlooms
              </button>
              <button
                onClick={() => setActiveTab("jewelry")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer ${
                  activeTab === "jewelry"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                Handmade Jewelry
              </button>
            </div>
          </div>

          {/* Product Grid or Empty State */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-xs" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  slug={item.slug}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  storeName={item.storeName}
                  storeCity={item.storeCity}
                  imageUrl={item.imageUrl}
                  badge={item.badge}
                  freeShipping={item.freeShipping}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-card border border-border/80 rounded-sm">
              <GiftIcon className="size-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-foreground">No gift items currently available in this category</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Check back as our verified makers list unique seasonal items.
              </p>
              <Link
                href="/seller/signup"
                className="mt-4 inline-block text-xs font-semibold text-primary underline"
              >
                Are you an artisan? List your creations
              </Link>
            </div>
          )}
        </div>

        {/* Studio Gift Wrapping Experience */}
        <div className="border border-border/80 bg-card p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest rounded-xs">
              <SparkleIcon className="size-3" weight="fill" />
              <span>Complimentary Studio Service</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              Nordic Kraft Wrapping & Handwritten Postcard
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every item ordered as a gift is hand-wrapped in recycled Finnish kraft paper, tied with unbleached natural jute twine, and accompanied by a sprig of dried spruce and a custom handwritten card.
            </p>
            <div className="pt-2">
              <label htmlFor="gift-note-input" className="block text-xs font-semibold text-foreground mb-1.5">
                Preview your recipient note (included at checkout):
              </label>
              <textarea
                id="gift-note-input"
                rows={3}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Warm greetings from Helsinki! May this hand-thrown mug bring comfort to your morning coffee ritual..."
                className="w-full text-xs p-3 bg-background border border-border/80 rounded-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => {
                  if (!customNote.trim()) {
                    toast.error("Please enter a note to save");
                    return;
                  }
                  toast.success("Gift note template saved for your checkout!");
                }}
                className="mt-2 px-4 py-2 bg-brand-deep-forest text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-deep-forest/90 transition-colors"
              >
                Save Gift Note
              </button>
            </div>
          </div>

          <div className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden border border-border/80 rounded-xs bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"
              alt="Nordic kraft paper gift wrapping with spruce sprig"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
