"use client";

import * as React from "react";
import Link from "next/link";
import { HeartIcon, ShoppingBagIcon, MagnifyingGlassIcon, StorefrontIcon } from "@phosphor-icons/react";
import { AnnouncementBar } from "./announcement-bar";
import { SearchBar } from "./search-bar";
import { CategoryNavigation } from "./category-navigation";
import { AccountMenu } from "./account-menu";
import { MobileNavigation } from "./mobile-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { HEADER_NAV_CONFIG } from "@/config/navigation";
import type { User } from "@/resources/interfaces/user.interface";
import { cn } from "@/lib/utils";

export interface SiteHeaderProps {
  user?: User | null;
  cartCount?: number;
  wishlistCount?: number;
  showAnnouncement?: boolean;
  announcementMessage?: string;
  className?: string;
}

/**
 * Global marketplace header incorporating Etsy-inspired announcement bar,
 * brand wordmark, prominent search, creator onboarding link, and customer actions.
 */
export function SiteHeader({
  user,
  cartCount,
  wishlistCount,
  showAnnouncement = true,
  announcementMessage = HEADER_NAV_CONFIG.announcement,
  className,
}: SiteHeaderProps) {
  const { user: authUser } = useAuth();
  const { cartCount: liveCartCount } = useCart();
  const { wishlistCount: liveWishlistCount } = useWishlist();

  const currentUser = user !== undefined ? user : authUser;
  const currentCartCount = cartCount !== undefined ? cartCount : liveCartCount;
  const currentWishlistCount = wishlistCount !== undefined ? wishlistCount : liveWishlistCount;

  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

  return (
    <header className={cn("relative w-full z-40 bg-background", className)}>
      {/* 1. Slim Promotional Announcement Bar */}
      {showAnnouncement && (
        <AnnouncementBar message={announcementMessage} />
      )}

      {/* 2. Main Sticky Header Bar */}
      <div className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-18 items-center justify-between gap-3 sm:gap-6">
            {/* Mobile Menu Trigger & Wordmark */}
            <div className="flex items-center gap-2 sm:gap-3">
              <MobileNavigation
                cartCount={currentCartCount}
                wishlistCount={currentWishlistCount}
              />

              <Link
                href={HEADER_NAV_CONFIG.routes.home}
                className="group flex flex-col justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
                aria-label="Oivaly Home"
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    Oivaly<span className="text-primary font-light">.</span>
                  </span>
                </div>
                <span className="hidden sm:inline-block text-[9px] uppercase tracking-widest text-muted-foreground font-semibold -mt-1">
                  Marketplace
                </span>
              </Link>
            </div>

            {/* Prominent Center Search Bar (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-4">
              <SearchBar placeholder={HEADER_NAV_CONFIG.searchPlaceholder} />
            </div>

            {/* Actions (Sell Link, Account, Wishlist, Cart) */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Creator Onboarding / "Sell on Oivaly" (Etsy-inspired) */}
              <Link
                href={HEADER_NAV_CONFIG.routes.sell}
                className="hidden xl:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-muted/80"
              >
                <StorefrontIcon className="size-4 text-primary" aria-hidden="true" />
                <span>Sell on Oivaly</span>
              </Link>

              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="lg:hidden text-foreground hover:bg-muted rounded-full"
                aria-label={mobileSearchOpen ? "Close search" : "Open search"}
                aria-expanded={mobileSearchOpen}
              >
                <MagnifyingGlassIcon className="size-4" aria-hidden="true" />
              </Button>

              {/* Customer Account Menu */}
              <div className="hidden sm:block">
                <AccountMenu user={currentUser} />
              </div>

              {/* Favorites / Wishlist Link */}
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className="relative text-foreground hover:bg-muted rounded-full"
              >
                <Link
                  href={HEADER_NAV_CONFIG.routes.wishlist}
                  aria-label={
                    typeof currentWishlistCount === "number" && currentWishlistCount > 0
                      ? `Wishlist (${currentWishlistCount} items)`
                      : "Wishlist"
                  }
                >
                  <HeartIcon className="size-4.5" aria-hidden="true" />
                  {typeof currentWishlistCount === "number" && currentWishlistCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground border-none"
                    >
                      {currentWishlistCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Shopping Cart Link */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="relative px-2.5 sm:px-3 text-foreground hover:bg-muted rounded-full"
              >
                <Link
                  href={HEADER_NAV_CONFIG.routes.cart}
                  aria-label={
                    typeof currentCartCount === "number" && currentCartCount > 0
                      ? `Cart (${currentCartCount} items)`
                      : "Shopping Cart"
                  }
                >
                  <ShoppingBagIcon className="size-4.5 text-primary" weight="bold" aria-hidden="true" />
                  <span className="hidden md:inline-block ml-1.5 text-xs font-semibold">
                    Cart
                  </span>
                  {typeof currentCartCount === "number" && currentCartCount > 0 && (
                    <Badge
                      variant="default"
                      className="ml-1 sm:ml-1.5 h-4 min-w-4 px-1 rounded-full text-[10px] font-bold bg-primary text-primary-foreground"
                    >
                      {currentCartCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>
          </div>

          {/* Expandable Mobile Search Row */}
          {mobileSearchOpen && (
            <div className="lg:hidden pb-3 pt-1 border-t border-border/50 animate-in fade-in-0 duration-150">
              <SearchBar
                id="mobile-header-search"
                autoFocus
                placeholder={HEADER_NAV_CONFIG.searchPlaceholder}
                size="sm"
                onSearchSubmit={() => setMobileSearchOpen(false)}
              />
            </div>
          )}
        </div>

        {/* 3. Category Navigation Bar (Desktop) */}
        <div className="hidden lg:block border-t border-border/50">
          <CategoryNavigation />
        </div>
      </div>
    </header>
  );
}
