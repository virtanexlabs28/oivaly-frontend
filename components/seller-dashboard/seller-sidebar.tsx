"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFourIcon,
  PackageIcon,
  PlusCircleIcon,
  ShoppingCartIcon,
  GearSixIcon,
  ArrowSquareOutIcon,
  SignOutIcon,
  StorefrontIcon,
  ShieldCheckIcon,
  ClockCountdownIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useSellerAuth } from "@/lib/seller-auth-context";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; weight?: "regular" | "bold" | "fill" }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/seller/dashboard",
    icon: SquaresFourIcon,
  },
  {
    label: "Products",
    href: "/seller/dashboard/products",
    icon: PackageIcon,
  },
  {
    label: "Add Product",
    href: "/seller/dashboard/products/new",
    icon: PlusCircleIcon,
  },
  {
    label: "Orders & Fulfillment",
    href: "/seller/dashboard/orders",
    icon: ShoppingCartIcon,
  },
  {
    label: "Studio Settings",
    href: "/seller/dashboard/settings",
    icon: GearSixIcon,
  },
];

export function SellerSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { store, seller, logout } = useSellerAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusBadge = () => {
    const status = store?.status || "PENDING";
    switch (status) {
      case "ACTIVE":
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <ShieldCheckIcon className="size-3" weight="bold" />
            <span>Active Studio</span>
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <ClockCountdownIcon className="size-3" weight="bold" />
            <span>Under Review</span>
          </span>
        );
      case "SUSPENDED":
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-destructive/10 text-destructive border border-destructive/20">
            <WarningCircleIcon className="size-3" weight="bold" />
            <span>{status}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <aside className="w-64 h-full flex flex-col bg-[#142416] text-[#EBF1EC] border-r border-[#223B25] select-none">
      {/* Brand & Studio Identity Header */}
      <div className="p-5 border-b border-[#223B25]">
        <Link
          href="/seller/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2.5 group"
        >
          <div className="size-9 rounded-sm bg-[#1E3721] border border-[#2E4E32] flex items-center justify-center text-white group-hover:bg-[#28482C] transition-colors shadow-xs">
            <StorefrontIcon className="size-5 text-emerald-400" weight="fill" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400/80 block leading-tight">
              Nordic Artisan
            </span>
            <span className="text-sm font-semibold text-white tracking-tight truncate block">
              Atelier Portal
            </span>
          </div>
        </Link>

        {/* Current Workshop Identity Card */}
        <div className="mt-4 p-3 rounded-sm bg-[#182D1B] border border-[#26442A]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-white truncate">
              {mounted && store?.name ? store.name : "Artisan Workshop"}
            </p>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            {mounted ? (
              getStatusBadge()
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                <span>Atelier</span>
              </span>
            )}
            <span className="text-[10px] text-[#A3B8A6] font-mono">
              ID: {mounted && store?.id ? `${store.id.slice(0, 8)}...` : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#7E9682]">
          Studio Operations
        </p>

        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/seller/dashboard"
              ? pathname === "/seller/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-medium transition-all group ${
                isActive
                  ? "bg-[#203D24] text-white shadow-xs font-semibold border-l-2 border-emerald-400"
                  : "text-[#C2D1C5] hover:bg-[#1A311D] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`size-4.5 transition-colors ${
                    isActive
                      ? "text-emerald-400"
                      : "text-[#8BA490] group-hover:text-emerald-300"
                  }`}
                  weight={isActive ? "fill" : "regular"}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Public Shop Preview & Switcher */}
      <div className="p-3 border-t border-[#223B25] space-y-1 bg-[#112013]">
        <Link
          href={`/shops`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-sm text-xs text-[#A3B8A6] hover:text-white hover:bg-[#1A311D] transition-colors"
        >
          <div className="flex items-center gap-2">
            <ArrowSquareOutIcon className="size-4 text-emerald-400" />
            <span>View Public Storefront</span>
          </div>
          <span className="text-[10px] text-[#7E9682]">↗</span>
        </Link>
      </div>

      {/* Seller User Profile & Logout */}
      <div className="p-3.5 border-t border-[#223B25] bg-[#0E1A0F] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 rounded-full bg-[#1F3A22] border border-[#2D5030] flex items-center justify-center text-xs font-semibold text-emerald-300 shrink-0">
            {mounted && seller?.name ? seller.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white truncate">
              {mounted && seller?.name ? seller.name : "Studio Artisan"}
            </p>
            <p className="text-[10px] text-[#8BA490] truncate">
              {mounted && seller?.email ? seller.email : "artisan@nordic.fi"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          title="Sign out of Atelier"
          className="p-1.5 rounded text-[#8BA490] hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
        >
          <SignOutIcon className="size-4" />
        </button>
      </div>
    </aside>
  );
}
