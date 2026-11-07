"use client";

import * as React from "react";
import Link from "next/link";
import {
  ListIcon,
  HeartIcon,
  ShoppingBagIcon,
  UserIcon,
  GlobeIcon,
  SparkleIcon,
  StorefrontIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SearchBar } from "./search-bar";
import { PROVISIONAL_CATEGORIES, HEADER_NAV_CONFIG } from "@/config/navigation";

export interface MobileNavigationProps {
  cartCount?: number;
  wishlistCount?: number;
}

/**
 * Mobile drawer navigation using shadcn/ui Sheet.
 * Provides accessible category exploration, search, and customer actions.
 */
export function MobileNavigation({
  cartCount,
  wishlistCount,
}: MobileNavigationProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden text-foreground hover:bg-muted"
          aria-label="Open navigation menu"
        >
          <ListIcon className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[85vw] max-w-sm p-0 flex flex-col bg-background text-foreground"
      >
        <SheetHeader className="p-4 border-b border-border/70 text-left">
          <SheetTitle className="text-base font-semibold tracking-tight">
            Oivaly
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Curated marketplace for independent Nordic makers
          </SheetDescription>
        </SheetHeader>

        {/* Integrated Mobile Search */}
        <div className="p-4 border-b border-border/60 bg-muted/30">
          <SearchBar
            id="mobile-sheet-search"
            placeholder="Search products, gifts and makers..."
            size="sm"
            onSearchSubmit={handleLinkClick}
          />
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
          {/* Categories */}
          <div>
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Categories
            </h3>
            <ul className="space-y-0.5">
              {PROVISIONAL_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={cat.href}
                    onClick={handleLinkClick}
                    className="flex items-center justify-between min-h-[44px] px-2.5 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
                  >
                    <span>{cat.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Quick Actions (Wishlist & Cart) */}
          <div className="space-y-1">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Shopping Actions
            </h3>

            <Link
              href={HEADER_NAV_CONFIG.routes.cart}
              onClick={handleLinkClick}
              className="flex items-center justify-between min-h-[44px] px-2.5 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBagIcon className="size-4 text-primary" aria-hidden="true" />
                <span>Cart</span>
              </div>
              {typeof cartCount === "number" && cartCount > 0 && (
                <span className="inline-flex items-center justify-center size-5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href={HEADER_NAV_CONFIG.routes.wishlist}
              onClick={handleLinkClick}
              className="flex items-center justify-between min-h-[44px] px-2.5 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <HeartIcon className="size-4 text-primary" aria-hidden="true" />
                <span>Wishlist</span>
              </div>
              {typeof wishlistCount === "number" && wishlistCount > 0 && (
                <span className="inline-flex items-center justify-center size-5 text-xs font-medium bg-muted text-foreground rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href={HEADER_NAV_CONFIG.routes.sell}
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 min-h-[44px] px-2.5 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
            >
              <StorefrontIcon className="size-4 text-muted-foreground" aria-hidden="true" />
              <span>Sell on Oivaly</span>
            </Link>
          </div>

          <Separator />

          {/* Account */}
          <div className="space-y-1">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Account
            </h3>
            {user ? (
              <>
                <div className="px-2.5 py-1 mb-1">
                  <p className="text-xs font-semibold text-foreground">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                </div>
                <Link
                  href={HEADER_NAV_CONFIG.routes.account}
                  onClick={handleLinkClick}
                  className="flex items-center gap-2.5 min-h-[44px] px-2.5 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
                >
                  <UserIcon className="size-4 text-primary" aria-hidden="true" />
                  <span>My Account</span>
                </Link>
                <Link
                  href="/account/addresses"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2.5 min-h-[44px] px-2.5 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
                >
                  <span>Saved Addresses</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLinkClick();
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 min-h-[44px] px-2.5 py-2 text-sm text-destructive hover:bg-muted rounded transition-colors text-left"
                >
                  <SignOutIcon className="size-4" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href={HEADER_NAV_CONFIG.routes.login}
                  onClick={handleLinkClick}
                  className="flex items-center gap-2.5 min-h-[44px] px-2.5 py-2 text-sm font-medium text-primary hover:bg-muted rounded transition-colors"
                >
                  <UserIcon className="size-4" aria-hidden="true" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href={HEADER_NAV_CONFIG.routes.register}
                  onClick={handleLinkClick}
                  className="flex items-center gap-2.5 min-h-[44px] px-2.5 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
                >
                  <SparkleIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                  <span>Create Account</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Footer info in Sheet */}
        <div className="p-4 border-t border-border/70 bg-muted/20 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <GlobeIcon className="size-3.5 text-primary" aria-hidden="true" />
            <span>English</span>
          </div>
          <span className="font-medium text-foreground">EUR (€)</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
