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
} from "@phosphor-icons/react";
import { storesApi, type MarketplaceStorePreview } from "@/resources/apis/stores.api";

interface MakerDetail extends MarketplaceStorePreview {
  region: "helsinki" | "lapland" | "lakeland" | "archipelago";
  specialty: string;
}

export default function MakersDirectoryPage() {
  const [selectedRegion, setSelectedRegion] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [makers, setMakers] = React.useState<MakerDetail[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStores() {
      setIsLoading(true);
      try {
        const liveStores = await storesApi.getMarketplaceStores(50);
        if (Array.isArray(liveStores) && liveStores.length > 0) {
          const mapped: MakerDetail[] = liveStores.map((s) => {
            const addr = s.address?.toLowerCase() || "";
            let region: "helsinki" | "lapland" | "lakeland" | "archipelago" = "helsinki";
            if (addr.includes("rovaniemi") || addr.includes("inari") || addr.includes("lapland") || addr.includes("oulu")) {
              region = "lapland";
            } else if (addr.includes("turku") || addr.includes("fiskars") || addr.includes("archipelago") || addr.includes("saaristo")) {
              region = "archipelago";
            } else if (addr.includes("tampere") || addr.includes("savonlinna") || addr.includes("mikkeli") || addr.includes("kuopio")) {
              region = "lakeland";
            }

            return {
              ...s,
              region,
              specialty: s.description?.slice(0, 45) || "Artisan Craft & Studio Goods",
            };
          });
          setMakers(mapped);
        } else {
          setMakers([]);
        }
      } catch {
        setMakers([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadStores();
  }, []);

  const filteredMakers = React.useMemo(() => {
    return makers.filter((m) => {
      const matchRegion = selectedRegion === "all" || m.region === selectedRegion;
      const matchSearch =
        searchQuery.trim() === "" ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.address && m.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [makers, selectedRegion, searchQuery]);

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
              <span className="font-semibold">Every artisan verified via official Finnish trade registry</span>
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
                className={`px-3.5 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${
                  selectedRegion === "all"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                All Regions ({makers.length})
              </button>
              <button
                onClick={() => setSelectedRegion("helsinki")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${
                  selectedRegion === "helsinki"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                Helsinki & Uusimaa
              </button>
              <button
                onClick={() => setSelectedRegion("lapland")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${
                  selectedRegion === "lapland"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                Lapland & North
              </button>
              <button
                onClick={() => setSelectedRegion("lakeland")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${
                  selectedRegion === "lakeland"
                    ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                Lakeland & East
              </button>
              <button
                onClick={() => setSelectedRegion("archipelago")}
                className={`px-3.5 py-1.5 border transition-all cursor-pointer whitespace-nowrap ${
                  selectedRegion === "archipelago"
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

        {/* Makers Grid or Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-xs" />
            ))}
          </div>
        ) : filteredMakers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMakers.map((maker) => {
              const shopUrl = `/shops/${maker.id}`;
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
                        <span>{maker.address ? maker.address.split(",")[1]?.trim() || maker.address : "Finland"}</span>
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
                          {maker.legalBusinessName || maker.name} &bull; Lead: {maker.contactName || "Artisan"}
                        </p>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {maker.description || `Authentic studio goods handcrafted directly by ${maker.name}.`}
                      </p>
                    </div>
                  </div>

                  {/* Footer action */}
                  <div className="px-5 py-3.5 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {maker.productCount || 0} pieces in studio
                    </span>
                    <Link
                      href={shopUrl}
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
        ) : (
          <div className="py-16 text-center bg-card border border-border/80 rounded-sm">
            <StorefrontIcon className="size-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-foreground">No independent makers found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No studios matched your selection. Try selecting a different region or search query.
            </p>
            <Link
              href="/seller/signup"
              className="mt-4 inline-block text-xs font-semibold text-primary underline"
            >
              Open your independent studio shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
