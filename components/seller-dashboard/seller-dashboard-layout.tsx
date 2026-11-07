"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ClockCountdownIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useSellerAuth, isJwtExpired } from "@/lib/seller-auth-context";
import { SellerSidebar } from "./seller-sidebar";
import { SellerTopbar } from "./seller-topbar";

export interface SellerDashboardLayoutProps {
  children: React.ReactNode;
}

export function SellerDashboardLayout({ children }: SellerDashboardLayoutProps) {
  const router = useRouter();
  const { isSellerAuthenticated, store } = useSellerAuth();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [bannerDismissed, setBannerDismissed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("nordic_seller_token");
      if (!token || isJwtExpired(token)) {
        router.replace("/seller/login");
      }
    }
  }, [router]);

  const isUnderReview = store?.status === "UNDER_REVIEW" || store?.status === "PENDING";
  const isSuspended = store?.status === "SUSPENDED" || store?.status === "REJECTED";

  return (
    <div className="min-h-screen flex bg-[#FBFBF9] dark:bg-background text-foreground">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        <React.Suspense fallback={<div className="w-64 h-screen bg-[#142416]" />}>
          <SellerSidebar />
        </React.Suspense>
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <React.Suspense fallback={<div className="w-72 h-full bg-[#142416]" />}>
              <SellerSidebar onNavigate={() => setMobileNavOpen(false)} />
            </React.Suspense>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <React.Suspense fallback={<div className="h-14 border-b border-border/80 bg-background" />}>
          <SellerTopbar onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)} />
        </React.Suspense>

        {/* Studio Status Alert Banners */}
        {mounted && isUnderReview && !bannerDismissed && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 sm:px-6 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2.5">
              <ClockCountdownIcon className="size-4 shrink-0 text-amber-600 dark:text-amber-400" weight="bold" />
              <div>
                <span className="font-semibold">Studio Application Under Review: </span>
                <span className="text-[11px] opacity-90">
                  Our Nordic artisan committee is verifying your studio credentials. You can draft products and configure settings; listings will go live once verified.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              className="p-1 hover:bg-amber-500/20 rounded text-amber-800 dark:text-amber-300"
              aria-label="Dismiss banner"
            >
              <XIcon className="size-3.5" />
            </button>
          </div>
        )}

        {isSuspended && (
          <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2.5 sm:px-6 flex items-center gap-2.5 text-xs text-destructive">
            <WarningCircleIcon className="size-4 shrink-0" weight="fill" />
            <div>
              <span className="font-semibold">Store Status: {store?.status}. </span>
              <span className="text-[11px]">
                Please contact marketplace support to resolve restrictions on your studio storefront.
              </span>
            </div>
          </div>
        )}

        {/* Child Pages Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full min-w-0 animate-in fade-in-50 duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
