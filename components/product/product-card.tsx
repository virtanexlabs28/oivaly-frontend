"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon, PackageIcon, StarIcon } from "@phosphor-icons/react";
import { formatFinnishCurrency } from "@/lib/finland";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/lib/wishlist-context";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  originalPrice?: number | string;
  storeName?: string;
  storeCity?: string;
  storeId?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  badge?: string;
  vatIncluded?: boolean;
  priorityImage?: boolean;
  className?: string;
  onWishlistToggle?: (productId: string) => void;
  isWishlisted?: boolean;
  rating?: number;
  reviewCount?: number;
  freeShipping?: boolean;
}

/**
 * Reusable Scandinavian & Etsy-inspired product card for marketplace discovery grids.
 * Emphasizes high-quality product photography, clear pricing, discounts, maker attribution,
 * and social proof ratings.
 */
export function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  storeName,
  storeCity,
  storeId,
  imageUrl,
  imageAlt,
  badge,
  vatIncluded = true,
  priorityImage = false,
  className,
  onWishlistToggle,
  isWishlisted = false,
  rating,
  reviewCount,
  freeShipping = false,
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(id) || isWishlisted;

  const numericPrice = typeof price === "number" ? price : parseFloat(price) || 0;
  const formattedPrice = formatFinnishCurrency(numericPrice);

  const numericOriginal =
    originalPrice !== undefined
      ? typeof originalPrice === "number"
        ? originalPrice
        : parseFloat(originalPrice) || 0
      : undefined;

  const hasDiscount =
    numericOriginal !== undefined && numericOriginal > numericPrice;
  const formattedOriginalPrice = hasDiscount
    ? formatFinnishCurrency(numericOriginal)
    : null;
  const discountPercent = hasDiscount
    ? Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100)
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: id,
      name,
      slug: slug || id,
      price: numericPrice,
      imageUrl,
      storeName,
      storeId,
    });
    if (onWishlistToggle) {
      onWishlistToggle(id);
    }
  };

  const productHref = `/products/${slug || id}`;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden bg-card border border-border/70 hover:border-border hover:shadow-md transition-all duration-200 rounded-sm",
        className
      )}
    >
      {/* 1. Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
        <Link
          href={productHref}
          className="block size-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`View product: ${name}`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt || name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              priority={priorityImage}
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center text-muted-foreground/50">
              <PackageIcon className="size-8" aria-hidden="true" />
              <span className="text-[11px] mt-1">Image coming soon</span>
            </div>
          )}
        </Link>

        {/* Overlay Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1 items-start pointer-events-none">
          {badge && (
            <Badge
              variant="secondary"
              className="text-[10px] uppercase tracking-wider font-semibold bg-background/95 backdrop-blur-xs text-foreground border border-border/80 px-2 py-0.5 shadow-2xs"
            >
              {badge}
            </Badge>
          )}
          {hasDiscount && (
            <Badge
              variant="destructive"
              className="text-[10px] font-semibold tracking-wide bg-brand-deep-forest text-primary-foreground dark:bg-primary dark:text-primary-foreground px-2 py-0.5 shadow-2xs"
            >
              -{discountPercent}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={
            wishlisted
              ? `Remove from wishlist: ${name}`
              : `Add to wishlist: ${name}`
          }
          className={cn(
            "absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-xs text-muted-foreground transition-all duration-150 hover:bg-background hover:text-foreground hover:scale-110 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            wishlisted && "text-destructive hover:text-destructive"
          )}
        >
          <HeartIcon
            className="size-4"
            weight={wishlisted ? "fill" : "regular"}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* 2. Product Metadata */}
      <div className="flex flex-1 flex-col p-3 sm:p-3.5 justify-between bg-card">
        <div>
          {/* Store Name & City */}
          {storeName && (
            <div className="flex items-center justify-between text-[11px] text-muted-foreground truncate mb-1">
              {storeId ? (
                <Link
                  href={`/shops/${storeId}`}
                  className="truncate hover:text-foreground transition-colors"
                >
                  <span className="font-medium text-muted-foreground/90">{storeName}</span>
                  {storeCity && <span className="opacity-70"> &bull; {storeCity}</span>}
                </Link>
              ) : (
                <span className="truncate">
                  <span className="font-medium text-muted-foreground/90">{storeName}</span>
                  {storeCity && <span className="opacity-70"> &bull; {storeCity}</span>}
                </span>
              )}
            </div>
          )}

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            <Link href={productHref} className="focus-visible:outline-none focus-visible:underline">
              {name}
            </Link>
          </h3>

          {/* Ratings & Reviews (Etsy-Style Social Proof) */}
          {typeof rating === "number" && rating > 0 && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
              <div className="flex items-center text-amber-500">
                <StarIcon className="size-3.5" weight="fill" />
              </div>
              <span className="text-[11px] font-semibold text-foreground">
                {rating.toFixed(1)}
              </span>
              {typeof reviewCount === "number" && reviewCount > 0 && (
                <span className="text-[10px] text-muted-foreground/80">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing, VAT, and Free Shipping */}
        <div className="mt-3 pt-2 border-t border-border/40">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
              {formattedPrice}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formattedOriginalPrice}
              </span>
            )}
            {vatIncluded && (
              <span className="text-[10px] text-muted-foreground ml-auto">
                incl. VAT
              </span>
            )}
          </div>

          {freeShipping && (
            <p className="text-[10px] font-medium text-brand-deep-forest dark:text-brand-pale-sage mt-1">
              FREE delivery
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
