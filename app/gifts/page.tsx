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

const GIFT_CATALOG: GiftItem[] = [
  {
    id: "gift-1",
    name: "Hand-Carved Arctic Birch Kuksa Drinking Cup",
    slug: "hand-carved-finnish-kuksa-drinking-cup",
    price: 49.0,
    storeName: "Lapland Birchworks",
    storeCity: "Inari",
    category: "heirloom",
    imageUrl: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80",
    badge: "Bestselling Gift",
    freeShipping: true,
  },
  {
    id: "gift-2",
    name: "Smoked Birch & Peat Aromatherapy Soy Candle",
    slug: "smoked-birch-peat-soy-candle",
    price: 26.0,
    storeName: "Helsinki Flame Studio",
    storeCity: "Helsinki",
    category: "under50",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    badge: "Under €30",
    freeShipping: false,
  },
  {
    id: "gift-3",
    name: "Woven Heavy Flax Linen Kitchen Towels (Pair)",
    slug: "woven-heavy-linen-kitchen-towel-set",
    price: 38.0,
    storeName: "Pohjanmaa Linen Guild",
    storeCity: "Vaasa",
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    badge: "Host Gift",
    freeShipping: false,
  },
  {
    id: "gift-4",
    name: "Ceramic Drip Coffee Pour-Over & Carafe Set",
    slug: "ceramic-drip-coffee-pour-over-set",
    price: 58.0,
    storeName: "Kallio Potters Co.",
    storeCity: "Helsinki",
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    badge: "Design Pick",
    freeShipping: true,
  },
  {
    id: "gift-5",
    name: "Traditional Hand-Coil Sauna Bucket & Birch Ladle",
    slug: "handmade-sauna-bucket-birch-ladle",
    price: 84.0,
    storeName: "Saimaa Sauna Craft",
    storeCity: "Savonlinna",
    category: "sauna",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    badge: "Sauna Classic",
    freeShipping: true,
  },
  {
    id: "gift-6",
    name: "Mouth-Blown Clear Sea-Mist Glass Carafe",
    slug: "mouth-blown-clear-glass-water-carafe",
    price: 72.0,
    storeName: "Nuutajärvi Heritage Glass",
    storeCity: "Urjala",
    category: "heirloom",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    badge: "Heirloom Glass",
    freeShipping: true,
  },
  {
    id: "gift-7",
    name: "Raw Honeycomb & Finnish Forest Berry Confection Box",
    slug: "organic-forest-pine-honey-wooden-dipper",
    price: 24.5,
    storeName: "Kainuu Forest Apiaries",
    storeCity: "Kajaani",
    category: "under50",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    badge: "Sweet Treat",
    freeShipping: false,
  },
  {
    id: "gift-8",
    name: "Solid Reclaimed Oak Charcuterie & Cheese Board",
    slug: "solid-reclaimed-oak-serving-board",
    price: 64.0,
    storeName: "Tampere Woodworkers",
    storeCity: "Tampere",
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    badge: "Hand-Branded",
    freeShipping: true,
  },
  {
    id: "gift-9",
    name: "Forged Sterling Silver Archipelago Pebble Earrings",
    slug: "forged-silver-archipelago-pebble-earrings",
    price: 68.0,
    storeName: "Design District Metals",
    storeCity: "Helsinki",
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    badge: "925 Silver",
    freeShipping: true,
  },
  {
    id: "gift-10",
    name: "Pure Linen Waffle Sauna Bathrobe (Charcoal)",
    slug: "pure-linen-waffle-sauna-bathrobe",
    price: 135.0,
    storeName: "Turku Weaver Guild",
    storeCity: "Turku",
    category: "sauna",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    badge: "Luxury Linen",
    freeShipping: true,
  },
  {
    id: "gift-11",
    name: "Wild Rowanberry Botanical Facial Care Set",
    slug: "wild-rowanberry-botanical-facial-care-set",
    price: 45.0,
    storeName: "Kallio Botanical Apothecary",
    storeCity: "Helsinki",
    category: "under50",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    badge: "100% Organic",
    freeShipping: false,
  },
  {
    id: "gift-12",
    name: "Hand-Carved Curly Birch Watch Box with Velvet Lining",
    slug: "hand-carved-curly-birch-watch-box",
    price: 165.0,
    storeName: "Lapland Birchworks",
    storeCity: "Inari",
    category: "heirloom",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    badge: "One-of-a-Kind",
    freeShipping: true,
  },
];

export default function GiftsPage() {
  const [activeTab, setActiveTab] = React.useState<"all" | "under50" | "home" | "sauna" | "heirloom" | "jewelry">("all");
  const [customNote, setCustomNote] = React.useState("");

  const filtered = React.useMemo(() => {
    if (activeTab === "all") return GIFT_CATALOG;
    return GIFT_CATALOG.filter((item) => item.category === activeTab);
  }, [activeTab]);

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
            <span>The Nordic Artisan Gift Guide &bull; Season 2026</span>
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
                All Gifts ({GIFT_CATALOG.length})
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

          {/* Product Grid */}
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
        </div>

        {/* Studio Gift Wrapping Experience */}
        <div className="border border-border/80 bg-card p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest rounded-xs">
              <SparkleIcon className="size-3" weight="fill" />
              <span>Complimentary Service</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              Hand-Penned Studio Note & Wax Seal
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When sending a gift directly to someone special, select &ldquo;This order is a gift&rdquo; at checkout. The independent artisan will hand-write your heartfelt words on Finnish heavyweight cardstock, sealed with natural pine-resin sealing wax.
            </p>
            <div className="p-3.5 bg-muted/20 border border-border/60 text-xs italic font-serif text-foreground/80">
              &ldquo;May this hand-thrown stoneware mug bring quiet moments of warmth to your morning coffee in Helsinki. With love from Fiskars village.&rdquo;
            </div>
          </div>

          <div className="relative aspect-4/3 w-full bg-muted overflow-hidden border border-border/80">
            <Image
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
              alt="Artisan wrapping gift package with natural twine"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Corporate & Bulk Gifting Section */}
        <div className="border border-border/80 bg-brand-deep-forest text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-serif font-bold">
              Looking for Corporate or Wedding Favors?
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              We collaborate with Finnish companies, creative agencies, and couples to assemble bespoke artisanal gift hampers: custom ceramic sets, engraved wooden kuksas, and organic sauna wellness sets.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 bg-brand-sage text-brand-deep-forest text-xs font-bold uppercase tracking-wider hover:bg-brand-sage/90 transition-colors shrink-0"
          >
            Inquire About Bespoke Gifting
          </Link>
        </div>
      </div>
    </div>
  );
}
