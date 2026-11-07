"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export interface MarketplaceShellProps {
  children: React.ReactNode;
}

function isBareLayoutRoute(pathname: string | null): boolean {
  if (!pathname) return false;

  // Dedicated seller atelier routes
  if (
    pathname.startsWith("/seller") ||
    pathname === "/sell" ||
    pathname.startsWith("/sell/")
  ) {
    return true;
  }

  // Customer authentication and account recovery routes
  if (
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/forgot-password/") ||
    pathname === "/reset-password" ||
    pathname.startsWith("/reset-password/") ||
    pathname === "/verify-email" ||
    pathname.startsWith("/verify-email/")
  ) {
    return true;
  }

  return false;
}

function ConditionalHeader() {
  const pathname = usePathname();
  if (isBareLayoutRoute(pathname)) {
    return null;
  }

  return <SiteHeader />;
}

function ConditionalFooter() {
  const pathname = usePathname();
  if (isBareLayoutRoute(pathname)) {
    return null;
  }

  return <SiteFooter />;
}

/**
 * Shell wrapper that conditionally renders customer header and footer.
 * On dedicated seller routes (/seller/*, /sell) and authentication routes
 * (/login, /register, etc.), customer header and footer are omitted to
 * present a focused, high-end full-bleed experience.
 *
 * Header and footer are wrapped in Suspense so usePathname() does not
 * block root prerendering on dynamic routes like /products/[slug].
 */
export function MarketplaceShell({ children }: MarketplaceShellProps) {
  return (
    <>
      <React.Suspense fallback={null}>
        <ConditionalHeader />
      </React.Suspense>
      <main id="main-content" className="flex-1 flex flex-col">
        {children}
      </main>
      <React.Suspense fallback={null}>
        <ConditionalFooter />
      </React.Suspense>
    </>
  );
}
