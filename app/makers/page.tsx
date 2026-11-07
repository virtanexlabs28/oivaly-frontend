"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  StorefrontIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SparkleIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  CertificateIcon,
} from "@phosphor-icons/react";
import { storesApi, type MarketplaceStorePreview } from "@/resources/apis/stores.api";

interface MakerDetail extends MarketplaceStorePreview {
  region: "helsinki" | "lapland" | "lakeland" | "archipelago";
  specialty: string;
  artisanQuote: string;
}

const MAKERS_DIRECTORY: MakerDetail[] = [
  {
    id: "maker-1",
    name: "Fiskars Savi Studio",
    legalBusinessName: "Fiskars Savi Oy",
    address: "Ruukintie 8, 10470 Fiskars, Finland",
    phone: "+358 40 123 4567",
    contactName: "Eeva Virtanen",
    status: "ACTIVE",
    region: "archipelago",
    specialty: "Wheel-Thrown Stoneware & Tableware",
    artisanQuote: "Our clay is gathered from the iron-rich river valley. Every glaze is formulated by hand in our 18th-century foundry workshop.",
    description: "Wheel-thrown Nordic stoneware, speckled tableware, and architectural vases handcrafted with Finnish earthenware and natural wood-ash glazes.",
    logoUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://fiskarssavi.fi",
    createdAt: "2024-01-15",
    productCount: 18,
    featuredProducts: [],
  },
  {
    id: "maker-2",
    name: "Pohjolan Puu Atelier",
    legalBusinessName: "Pohjolan Puu Tmi",
    address: "Valtakatu 12, 96100 Rovaniemi, Finland",
    phone: "+358 40 987 6543",
    contactName: "Tapio Korhonen",
    status: "ACTIVE",
    region: "lapland",
    specialty: "Arctic Curly Birch & Kelo Pine",
    artisanQuote: "A true kuksa cannot be rushed. We season our birch burls for three winters in the sub-zero frost before carving.",
    description: "Traditional Arctic birch carvings, hand-shaped kuksas, and kelo pine furniture crafted from naturally fallen deadwood above the Arctic Circle.",
    logoUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://pohjolanpuu.fi",
    createdAt: "2024-02-10",
    productCount: 14,
    featuredProducts: [],
  },
  {
    id: "maker-3",
    name: "Aurajoen Kutomo Guild",
    legalBusinessName: "Aurajoen Kutomo Oy",
    address: "Läntinen Rantakatu 14, 20100 Turku, Finland",
    phone: "+358 45 332 1109",
    contactName: "Maija Lindqvist",
    status: "ACTIVE",
    region: "archipelago",
    specialty: "Baltic Flax Linen & Wool Weaving",
    artisanQuote: "We weave our heavy waffle linen on wooden shuttle looms built in 1912. The fabric softens with every wash over decades.",
    description: "Hand-loomed Baltic linen blankets, waffle sauna towels, and wool throws woven on century-old floor looms along the Aura River in Turku.",
    logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://aurajoenkutomo.fi",
    createdAt: "2024-03-01",
    productCount: 22,
    featuredProducts: [],
  },
  {
    id: "maker-4",
    name: "Design District Metals",
    legalBusinessName: "Helsinki Koru Studio Oy",
    address: "Uudenmaankatu 23, 00120 Helsinki, Finland",
    phone: "+358 50 443 8912",
    contactName: "Kari Niemi",
    status: "ACTIVE",
    region: "helsinki",
    specialty: "Recycled Sterling Silver & Baltic Amber",
    artisanQuote: "Clean modernist lines inspired by the sea ice of Helsinki harbor, forged in 100% certified recycled silver.",
    description: "Architectural jewelry forged in recycled 925 sterling silver, raw jeweler's brass, and ethically sourced Baltic sea amber.",
    logoUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://designdistrictmetals.fi",
    createdAt: "2024-04-12",
    productCount: 16,
    featuredProducts: [],
  },
  {
    id: "maker-5",
    name: "Saimaa Pure Botanical",
    legalBusinessName: "Saimaan Luonto Oy",
    address: "Kauppakatu 5, 57100 Savonlinna, Finland",
    phone: "+358 40 771 9920",
    contactName: "Liisa Rantanen",
    status: "ACTIVE",
    region: "lakeland",
    specialty: "Wild Pine, Peat & Sauna Botanicals",
    artisanQuote: "Our herbs and birch leaves are harvested by hand under the midnight sun when the botanical oils are at their peak concentration.",
    description: "Wild-harvested pine, peat, and birch soaps, sauna aromatherapy oils, and restorative salves from the pristine archipelago of Lake Saimaa.",
    logoUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://saimaabotanical.fi",
    createdAt: "2024-05-05",
    productCount: 12,
    featuredProducts: [],
  },
  {
    id: "maker-6",
    name: "Nuutajärvi Heritage Glass",
    legalBusinessName: "Nuutajärvi Lasi Osk",
    address: "Pruukinraitti 1, 31160 Nuutajärvi, Finland",
    phone: "+358 50 112 3445",
    contactName: "Mikko Salo",
    status: "ACTIVE",
    region: "lakeland",
    specialty: "Mouth-Blown Studio Glassware",
    artisanQuote: "At 1100°C the glass is like liquid honey. The breath of the glassblower freezes time into shape.",
    description: "Mouth-blown Finnish art glass, textured carafes, and sculptural paperweights shaped in Finland’s oldest glass village established in 1793.",
    logoUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
    websiteUrl: "https://nuutajarviglass.fi",
    createdAt: "2024-06-18",
    productCount: 9,
    featuredProducts: [],
  },
];

export default function MakersDirectoryPage() {
  const [selectedRegion, setSelectedRegion] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredMakers = React.useMemo(() => {
    return MAKERS_DIRECTORY.filter((m) => {
      const matchRegion = selectedRegion === "all" || m.region === selectedRegion;
      const matchSearch =
        searchQuery.trim() === "" ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [selectedRegion, searchQuery]);

  return (
    <div className="min-h-screen bg-background py-8 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Independent Makers</span>
        </nav>

        {/* Hero Banner */}
        <div className="border border-border/80 bg-brand-warm-ivory dark:bg-card p-6 sm:p-14 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
              <StorefrontIcon className="size-4" weight="fill" />
              <span>The Nordic Artisan Registry &bull; Verified Creators</span>
            </div>
            <h1 className="text-3xl sm:text-6xl font-serif font-bold text-foreground tracking-tight leading-tight">
              Meet Our Independent Makers
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every shop on Oivaly is an independent studio, atelier, or family workshop. Discover the people behind the craft, browse regional workshops, and purchase directly with 90% going to the creator.
            </p>
          </div>

          {/* Vetting Guarantee Bar */}
          <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <ShieldCheckIcon className="size-4 text-emerald-600" weight="fill" />
              <span className="font-semibold">Every artisan verified via official Finnish PRH / YTJ trade records</span>
            </div>
            <div className="text-muted-foreground">
              Zero drop-shippers &bull; Direct workshop shipping via Posti &bull; 14-day escrow protection
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            {/* Region Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <button
                onClick={() => setSelectedRegion("all")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${selectedRegion === "all"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                  }`}
              >
                All Regions ({MAKERS_DIRECTORY.length})
              </button>
              <button
                onClick={() => setSelectedRegion("helsinki")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${selectedRegion === "helsinki"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                  }`}
              >
                Helsinki & Uusimaa
              </button>
              <button
                onClick={() => setSelectedRegion("lapland")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${selectedRegion === "lapland"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                  }`}
              >
                Lapland & North
              </button>
              <button
                onClick={() => setSelectedRegion("lakeland")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${selectedRegion === "lakeland"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                  }`}
              >
                Lakeland & East
              </button>
              <button
                onClick={() => setSelectedRegion("archipelago")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${selectedRegion === "archipelago"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                  }`}
              >
                Turku & Archipelago
              </button>
            </div>

            {/* Studio Search */}
            <div className="relative w-full sm:w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by studio or craft..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-card border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Makers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMakers.map((maker) => {
            const shopSlug = maker.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <div
                key={maker.id}
                className="bg-card border border-border/80 hover:border-primary/80 transition-all duration-200 flex flex-col justify-between overflow-hidden group shadow-2xs"
              >
                <div>
                  {/* Banner Image */}
                  <div className="relative h-44 w-full bg-muted overflow-hidden">
                    <Image
                      src={maker.bannerUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"}
                      alt={maker.name}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Location Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-semibold text-white drop-shadow-sm">
                      <MapPinIcon className="size-3.5 text-brand-sage" weight="fill" />
                      <span>{maker.address.split(",")[1]?.trim() || "Finland"}</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[10px] text-white font-mono rounded-xs">
                      {maker.specialty}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                          {maker.name}
                        </h3>
                        <CheckCircleIcon className="size-3.5 text-emerald-600" weight="fill" />
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {maker.legalBusinessName} &bull; Lead: {maker.contactName}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {maker.description}
                    </p>

                    {/* Artisan Quote */}
                    <div className="p-3 bg-muted/20 border-l-2 border-brand-sage text-[11px] italic font-serif text-foreground/80">
                      &ldquo;{maker.artisanQuote}&rdquo;
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="px-5 py-3.5 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {maker.productCount} pieces in studio
                  </span>
                  <Link
                    href={`/shops/${shopSlug}`}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-xs"
                  >
                    <span>Visit Atelier</span>
                    <ArrowRightIcon className="size-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* How We Vet Artisans */}
        <div className="border border-border/80 bg-brand-warm-ivory dark:bg-card p-8 sm:p-12 space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              Our 3-Stage Artisan Vetting Standard
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We protect the integrity of handcrafted goods through strict validation before any studio storefront is approved to sell.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-background border border-border/70 space-y-1.5">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <CertificateIcon className="size-4 text-primary" weight="fill" />
                <span>1. Legal Entity Validation</span>
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Automated registry checks cross-verify the Finnish Business ID (Y-tunnus) with the Finnish Patent and Registration Office (PRH).
              </p>
            </div>

            <div className="p-4 bg-background border border-border/70 space-y-1.5">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheckIcon className="size-4 text-emerald-600" weight="fill" />
                <span>2. Craft Workshop Proof</span>
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Artisans submit studio documentation, kiln firing logs, or workshop photos confirming hands-on production in Scandinavia.
              </p>
            </div>

            <div className="p-4 bg-background border border-border/70 space-y-1.5">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <SparkleIcon className="size-4 text-primary" weight="fill" />
                <span>3. Material Quality Audit</span>
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Products must comply with our environmental mandate: food-safe glazes, PEFC-certified woods, and plastic-free packaging.
              </p>
            </div>
          </div>
        </div>

        {/* Maker Application Callout */}
        <div className="border border-border/80 bg-brand-deep-forest text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-serif font-bold">
              Are you a Finnish or Scandinavian creator?
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Open your digital atelier on Oivaly. We handle bank payouts, automated Posti shipping, and marketing so you can focus on making.
            </p>
          </div>
          <Link
            href="/seller/signup"
            className="px-6 py-3 bg-brand-sage text-brand-deep-forest text-xs font-bold uppercase tracking-wider hover:bg-brand-sage/90 transition-colors shrink-0"
          >
            Apply to Open an Atelier
          </Link>
        </div>
      </div>
    </div>
  );
}
