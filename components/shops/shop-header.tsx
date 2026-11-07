"use client";

import * as React from "react";
import Image from "next/image";
import {
  MapPinIcon,
  CalendarBlankIcon,
  ShieldCheckIcon,
  HeartIcon,
  GlobeIcon,
  ChatCircleDotsIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Store } from "@/resources/interfaces/store.interface";

export interface ShopHeaderProps {
  store: Store;
  totalProducts?: number;
}

/**
 * Editorial Scandinavian Shop Header & Identity.
 * Features wide studio banner with graceful design-token fallback,
 * floating maker avatar or initials, authentic metadata, and shop bookmarking.
 */
const subscribeStorage = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("nordic_saved_shops_updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("nordic_saved_shops_updated", callback);
  };
};

export function ShopHeader({ store, totalProducts }: ShopHeaderProps) {
  const isSaved = React.useSyncExternalStore(
    subscribeStorage,
    () => {
      try {
        const savedShops = JSON.parse(
          localStorage.getItem("nordic_saved_shops") || "[]"
        );
        return savedShops.includes(store.id);
      } catch {
        return false;
      }
    },
    () => false
  );

  const handleToggleSave = () => {
    try {
      const savedShops: string[] = JSON.parse(
        localStorage.getItem("nordic_saved_shops") || "[]"
      );
      let updated: string[];

      if (savedShops.includes(store.id)) {
        updated = savedShops.filter((id) => id !== store.id);
        toast.info(`Removed ${store.name} from your saved shops`);
      } else {
        updated = [...savedShops, store.id];
        toast.success(`Saved ${store.name} to your favorite shops!`);
      }

      localStorage.setItem("nordic_saved_shops", JSON.stringify(updated));
      window.dispatchEvent(new Event("nordic_saved_shops_updated"));
    } catch {
      toast.error("Could not update saved shops");
    }
  };

  // Format member-since date
  const memberSinceYear = React.useMemo(() => {
    if (!store.createdAt) return null;
    try {
      const d = new Date(store.createdAt);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [store.createdAt]);

  // Extract initials for avatar fallback
  const initials = React.useMemo(() => {
    const parts = store.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return store.name.slice(0, 2).toUpperCase();
  }, [store.name]);

  return (
    <div className="bg-background border-b border-border/80">
      {/* 1. Studio Banner or Scandinavian Design Fallback */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 lg:h-72 overflow-hidden bg-muted">
        {store.bannerUrl ? (
          <Image
            src={store.bannerUrl}
            alt={`${store.name} banner`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="size-full flex flex-col items-center justify-center bg-gradient-to-r from-brand-pale-sage/40 via-muted/60 to-brand-pale-sage/30 px-4 text-center">
            {/* Subtle, restrained decorative pattern */}
            <div className="space-y-1.5 opacity-60">
              <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground">
                Independent Studio Collection
              </span>
              <div className="w-16 h-px bg-primary/40 mx-auto" />
            </div>
          </div>
        )}
      </div>

      {/* 2. Shop Profile & Meta Details */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative pb-6 sm:pb-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-14 sm:-mt-16 md:-mt-18">
            {/* Left: Avatar & Title info */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative size-20 sm:size-24 rounded-full border-4 border-background bg-card shadow-sm overflow-hidden shrink-0">
                {store.logoUrl ? (
                  <Image
                    src={store.logoUrl}
                    alt={`${store.name} logo`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center bg-brand-pale-sage text-primary font-heading font-semibold text-xl sm:text-2xl">
                    {initials}
                  </div>
                )}
              </div>

              {/* Title & Key Badges */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                    {store.name}
                  </h1>

                  {/* Authoritative Status Indicator */}
                  {store.status === "ACTIVE" && (
                    <Badge
                      variant="outline"
                      className="bg-brand-pale-sage/50 text-brand-deep-forest border-brand-sage/40 text-[11px] font-medium gap-1"
                    >
                      <ShieldCheckIcon className="size-3.5 text-primary" aria-hidden="true" />
                      <span>Verified Merchant</span>
                    </Badge>
                  )}
                </div>

                {/* Metadata strip */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {store.address && (
                    <div className="inline-flex items-center gap-1">
                      <MapPinIcon className="size-3.5 text-primary shrink-0" aria-hidden="true" />
                      <span>{store.address}</span>
                    </div>
                  )}

                  {memberSinceYear && (
                    <div className="inline-flex items-center gap-1">
                      <CalendarBlankIcon className="size-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                      <span>Member since {memberSinceYear}</span>
                    </div>
                  )}

                  {totalProducts !== undefined && (
                    <span className="font-medium text-foreground">
                      {totalProducts} {totalProducts === 1 ? "listing" : "listings"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
              <Button
                variant={isSaved ? "default" : "outline"}
                size="sm"
                onClick={handleToggleSave}
                className={isSaved ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                aria-label={isSaved ? `Remove ${store.name} from saved shops` : `Save ${store.name} to favorites`}
              >
                <HeartIcon
                  className="size-4 mr-1.5"
                  weight={isSaved ? "fill" : "regular"}
                  aria-hidden="true"
                />
                <span>{isSaved ? "Saved Shop" : "Save Shop"}</span>
              </Button>

              <Button asChild variant="outline" size="sm">
                <a href="#about" aria-label={`Read story and contact details for ${store.name}`}>
                  <ChatCircleDotsIcon className="size-4 mr-1.5" aria-hidden="true" />
                  <span>About Maker</span>
                </a>
              </Button>

              {store.websiteUrl && (
                <Button asChild variant="ghost" size="sm">
                  <a
                    href={store.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit official website of ${store.name}`}
                  >
                    <GlobeIcon className="size-4 mr-1" aria-hidden="true" />
                    <span>Website</span>
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Public Description / Story summary */}
          {store.description && (
            <div className="mt-4 pt-4 border-t border-border/60 max-w-3xl">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {store.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
