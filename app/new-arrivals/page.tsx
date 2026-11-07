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

const NEW_ARRIVALS_FIXTURES: DisplayProduct[] = [
  {
    id: "na-1",
    name: "Hand-Thrown Speckled Stoneware Mug (350ml)",
    slug: "hand-thrown-speckled-stoneware-mug",
    price: 34.0,
    storeName: "Fiskars Savi Studio",
    storeCity: "Fiskars",
    category: "ceramics",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    badge: "Just Added",
    freeShipping: true,
    isSmallBatch: true,
  },
  {
    id: "na-2",
    name: "Unbleached Baltic Linen Woven Table Runner",
    slug: "baltic-linen-woven-table-runner",
    price: 52.0,
    storeName: "Aurajoen Kutomo",
    storeCity: "Turku",
    category: "textiles",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    badge: "Small Batch",
    freeShipping: true,
    isSmallBatch: true,
  },
  {
    id: "na-3",
    name: "Hand-Carved Arctic Birch Butter Spreader & Board Set",
    slug: "kelo-pine-carved-butter-spreader-board",
    price: 29.0,
    storeName: "Pohjolan Puu Atelier",
    storeCity: "Rovaniemi",
    category: "woodwork",
    imageUrl: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80",
    badge: "Handmade",
    freeShipping: false,
    isSmallBatch: true,
  },
  {
    id: "na-4",
    name: "Birch Veneer Architectural Pendant Lamp",
    slug: "birch-bark-minimalist-pendant-lamp",
    price: 185.0,
    originalPrice: 210.0,
    storeName: "Nordic Light Atelier",
    storeCity: "Helsinki",
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    badge: "Featured Drop",
    freeShipping: true,
    isSmallBatch: false,
  },
  {
    id: "na-5",
    name: "Saimaa Virgin Wool Chunky Waffle Throw",
    slug: "pure-wool-chunky-knit-throw",
    price: 125.0,
    storeName: "Saimaa Wool & Yarn",
    storeCity: "Mikkeli",
    category: "textiles",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    badge: "Eco Wool",
    freeShipping: true,
    isSmallBatch: true,
  },
  {
    id: "na-6",
    name: "Mouth-Blown Emerald Forest Glass Pitcher",
    slug: "mouth-blown-forest-green-glass-vase",
    price: 68.0,
    storeName: "Nuutajärvi Heritage Glass",
    storeCity: "Urjala",
    category: "glassware",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    badge: "New Release",
    freeShipping: true,
    isSmallBatch: true,
  },
  {
    id: "na-7",
    name: "Wild Peat & Pine Needle Restorative Sauna Elixir",
    slug: "botanical-wild-birch-essential-oil-sauna-blend",
    price: 24.5,
    storeName: "Kallio Botanical Apothecary",
    storeCity: "Helsinki",
    category: "sauna",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    badge: "Organic",
    freeShipping: false,
    isSmallBatch: true,
  },
  {
    id: "na-8",
    name: "Recycled 925 Silver Wave Band Ring",
    slug: "recycled-silver-wave-band-ring",
    price: 78.0,
    storeName: "Design District Metals",
    storeCity: "Helsinki",
    category: "jewelry",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    badge: "Artisan Fine",
    freeShipping: true,
    isSmallBatch: true,
  },
  {
    id: "na-9",
    name: "Hand-Turned Curly Birch Wooden Bowl",
    slug: "hand-turned-curly-birch-wooden-bowl",
    price: 89.0,
    storeName: "Pohjolan Puu Atelier",
    storeCity: "Rovaniemi",
    category: "woodwork",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    badge: "Rare Burl",
    freeShipping: true,
    isSmallBatch: true,
  },
  {
    id: "na-10",
    name: "Stoneware Pour-Over Dripper & Server",
    slug: "stoneware-pour-over-dripper-server",
    price: 62.0,
    storeName: "Fiskars Savi Studio",
    storeCity: "Fiskars",
    category: "ceramics",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    badge: "Slow Living",
    freeShipping: true,
    isSmallBatch: true,
  },
  {
    id: "na-11",
    name: "Sauna Smoked Birch Aromatherapy Candle",
    slug: "smoked-birch-peat-soy-candle",
    price: 26.0,
    storeName: "Helsinki Flame Studio",
    storeCity: "Helsinki",
    category: "sauna",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    badge: "Clean Burn",
    freeShipping: false,
    isSmallBatch: true,
  },
  {
    id: "na-12",
    name: "Minimalist Brass Geometric Wall Mobile",
    slug: "minimalist-brass-geometric-wall-mobile",
    price: 95.0,
    storeName: "Nordic Light Atelier",
    storeCity: "Helsinki",
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    badge: "Kinetic Art",
    freeShipping: true,
    isSmallBatch: true,
  },
];

const CATEGORIES = [
  { id: "all", label: "All Arrivals" },
  { id: "ceramics", label: "Ceramics & Stoneware" },
  { id: "textiles", label: "Linen & Textiles" },
  { id: "woodwork", label: "Nordic Woodwork" },
  { id: "glassware", label: "Mouth-Blown Glass" },
  { id: "sauna", label: "Sauna & Botanical" },
  { id: "jewelry", label: "Artisan Jewelry" },
  { id: "home", label: "Lighting & Decor" },
];

export default function NewArrivalsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [sortBy, setSortBy] = React.useState<"latest" | "price-asc" | "price-desc">("latest");
  const [items, setItems] = React.useState<DisplayProduct[]>(NEW_ARRIVALS_FIXTURES);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadBackendProducts() {
      setIsLoading(true);
      try {
        const res = await productsApi.getMarketplace({ limit: 20 });
        if (res?.data && res.data.length > 0) {
          const mapped: DisplayProduct[] = res.data.map((p, idx) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price),
            originalPrice: undefined,
            storeName: p.store?.name || "Nordic Artisan Atelier",
            storeCity: "Finland",
            category: p.category?.slug?.toLowerCase() || (idx % 2 === 0 ? "ceramics" : "textiles"),
            imageUrl: p.images?.[0]?.url || NEW_ARRIVALS_FIXTURES[idx % NEW_ARRIVALS_FIXTURES.length].imageUrl,
            badge: idx % 3 === 0 ? "Just Added" : "Small Batch",
            freeShipping: Number(p.price) >= 50,
            isSmallBatch: true,
          }));
          setItems((prev) => {
            const ids = new Set(mapped.map((m) => m.id));
            const remaining = prev.filter((p) => !ids.has(p.id));
            return [...mapped, ...remaining];
          });
        }
      } catch {
        // Use fixtures
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
              <span>Direct Studio Releases &bull; Autumn / Winter 2026</span>
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
              <strong className="text-foreground font-serif text-sm">Updated Daily</strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Artisan Share</span>
              <strong className="text-foreground font-serif text-sm">90% Direct to Maker</strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Courier Transit</span>
              <strong className="text-foreground font-serif text-sm">Posti 1–3 Days</strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Craft Standards</span>
              <strong className="text-foreground font-serif text-sm">100% Plastic-Free</strong>
            </div>
          </div>
        </div>

        {/* Filter Bar & Sort Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 border transition-all whitespace-nowrap cursor-pointer text-xs ${
                    selectedCategory === cat.id
                      ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold shadow-xs"
                      : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 text-xs">
              <ArrowsDownUpIcon className="size-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-8 px-2.5 text-xs bg-card border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="latest">Latest Additions</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{filteredItems.length}</strong> unique handcrafted arrivals
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <PackageIcon className="size-3.5 text-primary" />
              <span>Fulfilled with official Finnish Posti tracking</span>
            </span>
          </div>
        </div>

        {/* Products Grid */}
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

        {/* Featured Studio Spotlight Banner */}
        <div className="border border-border/80 bg-brand-pale-sage/20 dark:bg-muted/20 p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative size-32 sm:size-40 rounded-full overflow-hidden shrink-0 border-2 border-border/80">
            <Image
              src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80"
              alt="Artisan at pottery wheel"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-deep-forest text-white rounded-xs">
              <span>Studio of the Month</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
              Fiskars Savi Studio &bull; Fiskars Village, Finland
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              &ldquo;We dig our red clay locally from the riverbed and fire in an open wood kiln over 36 hours. Each mug and pour-over dripper tells the story of the iron-rich Finnish soil.&rdquo;
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-primary">
              <Link href="/shops/fiskars-ceramic-studio" className="hover:underline flex items-center gap-1">
                <span>View Full Studio Collection</span>
                <ArrowRightIcon className="size-3" />
              </Link>
            </div>
          </div>
        </div>

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
