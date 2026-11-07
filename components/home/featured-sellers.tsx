import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, MapPinIcon, StarIcon, StorefrontIcon } from "@phosphor-icons/react/dist/ssr";
import { DEMO_FEATURED_SELLERS, type DemoSellerItem } from "@/fixtures/marketplace-demo";
import type { MarketplaceStorePreview } from "@/resources/apis/stores.api";
import { formatFinnishCurrency } from "@/lib/finland";

export interface FeaturedSellersProps {
  realSellers?: MarketplaceStorePreview[];
  sellers?: DemoSellerItem[];
}

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=600&auto=format&fit=crop";
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop";

/**
 * Etsy-inspired Featured Sellers Section ("Meet the Makers" / "Tutustu tekijöihin").
 * Displays independent studios with maker avatars, location tags, star ratings,
 * and a 3-item mini product showcase gallery inside each shop card.
 * Integrates live backend stores with graceful demo fallbacks.
 */
export function FeaturedSellers({
  realSellers = [],
  sellers = DEMO_FEATURED_SELLERS,
}: FeaturedSellersProps) {
  // Map real backend stores into maker card format
  const mappedRealSellers: DemoSellerItem[] = realSellers.map((store) => {
    // Extract city from address like "Aleksanterinkatu 15, 00100 Helsinki, Finland"
    let city = "Finland";
    if (store.address) {
      if (store.address.includes("Helsinki")) city = "Helsinki";
      else if (store.address.includes("Turku")) city = "Turku";
      else if (store.address.includes("Rovaniemi")) city = "Rovaniemi";
      else if (store.address.includes("Tampere")) city = "Tampere";
      else if (store.address.includes("Oulu")) city = "Oulu";
      else if (store.address.includes(",")) {
        const parts = store.address.split(",");
        city = parts[parts.length - 2]?.trim() || parts[0]?.trim() || "Finland";
      }
    }

    return {
      id: store.id,
      name: store.name,
      city,
      region: "Nordic Workshop",
      specialty: store.description?.slice(0, 45) || "Artisan Craft & Studio Goods",
      description: store.description || `Handcrafted goods direct from ${store.name}.`,
      itemCount: store.productCount || store.featuredProducts?.length || 0,
      avatarUrl: store.logoUrl || DEFAULT_AVATAR,
      bannerUrl: store.bannerUrl || DEFAULT_BANNER,
      joinedYear: new Date(store.createdAt || Date.now()).getFullYear() || 2024,
      rating: 4.9,
      reviewCount: 38,
      featuredProducts: store.featuredProducts?.map((prod) => ({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        imageUrl: prod.imageUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=300&auto=format&fit=crop",
        slug: prod.slug,
      })),
    };
  });

  // When live backend sellers are available, display ONLY live sellers
  const displaySellers =
    mappedRealSellers.length > 0 ? mappedRealSellers : sellers.slice(0, 4);

  return (
    <section
      id="makers"
      aria-labelledby="makers-heading"
      className="py-14 sm:py-20 bg-background border-b border-border/70 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block mb-1">
              Independent Studios
            </span>
            <h2
              id="makers-heading"
              className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
            >
              Meet the independent makers
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-lg">
              Behind every object is a passionate creator, studio potter, or woodworker.
            </p>
          </div>

          <Link
            href="/seller/signup"
            className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span>Open your own shop</span>
            <ArrowRightIcon className="size-3.5 ml-1" aria-hidden="true" />
          </Link>
        </div>

        {/* Sellers Grid: 4 Maker Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displaySellers.map((seller) => (
            <article
              key={seller.id}
              className="group relative flex flex-col overflow-hidden rounded-md bg-card border border-border/80 hover:border-primary/50 hover:shadow-md transition-all duration-200"
            >
              {/* Studio Banner */}
              <div className="relative aspect-16/9 w-full overflow-hidden bg-muted">
                <Image
                  src={seller.bannerUrl}
                  alt={`${seller.name} studio workshop`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Profile Body */}
              <div className="relative p-4 pt-0 flex flex-col flex-1 justify-between">
                <div>
                  {/* Floating Avatar & Rating */}
                  <div className="flex items-end justify-between -mt-6 mb-3">
                    <div className="relative size-12 overflow-hidden rounded-full border-2 border-background shadow-xs bg-muted">
                      <Image
                        src={seller.avatarUrl}
                        alt={seller.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>

                    {seller.rating && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-foreground bg-background/90 px-2 py-0.5 rounded-full border border-border shadow-2xs">
                        <StarIcon className="size-3 text-amber-500" weight="fill" />
                        <span>{seller.rating.toFixed(1)}</span>
                        {seller.reviewCount && (
                          <span className="text-[10px] text-muted-foreground font-normal">
                            ({seller.reviewCount})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Title & Location */}
                  <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    <Link href={`/shops/${seller.id}`} className="focus-visible:outline-none focus-visible:underline">
                      {seller.name}
                    </Link>
                  </h3>

                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                    <MapPinIcon className="size-3 text-primary shrink-0" aria-hidden="true" />
                    <span>{seller.city}</span>
                  </div>

                  {/* Specialty */}
                  <p className="text-[11px] font-medium text-brand-deep-forest dark:text-brand-pale-sage mt-1.5 line-clamp-1">
                    {seller.specialty}
                  </p>

                  {/* Etsy-Style 3-Product Preview Strip */}
                  {seller.featuredProducts && seller.featuredProducts.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-1.5 pt-2 border-t border-border/40">
                      {seller.featuredProducts.map((item) => (
                        <Link
                          key={item.id}
                          href={`/products/${item.slug}`}
                          className="group/item relative flex flex-col overflow-hidden rounded-xs bg-muted/40 border border-border/60 hover:border-primary transition-all"
                          title={item.name}
                        >
                          <div className="relative aspect-square w-full overflow-hidden">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover group-hover/item:scale-105 transition-transform"
                            />
                          </div>
                          <span className="p-1 text-[9px] font-semibold text-foreground truncate text-center">
                            {formatFinnishCurrency(item.price)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Bio */}
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                    {seller.description}
                  </p>
                </div>

                {/* Footer link to storefront */}
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {seller.itemCount} listings
                  </span>
                  <Link
                    href={`/shops/${seller.id}`}
                    className="font-semibold text-primary hover:underline inline-flex items-center gap-1 text-xs"
                  >
                    <span>Visit Studio</span>
                    <ArrowRightIcon className="size-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
