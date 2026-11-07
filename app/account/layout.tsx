"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  UserIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SignOutIcon,
  HouseIcon,
  CaretRightIcon,
  PackageIcon,
} from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/account",
    label: "Orders & Overview",
    icon: PackageIcon,
    exact: true,
  },
  {
    href: "/account/profile",
    label: "Personal Profile",
    icon: UserIcon,
  },
  {
    href: "/account/addresses",
    label: "Saved Addresses",
    icon: MapPinIcon,
  },
  {
    href: "/account/security",
    label: "Security & Password",
    icon: ShieldCheckIcon,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout, isAuthenticated } = useAuth();

  // If auth is resolved and user is not authenticated, redirect to login
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CU";

  const userName = user?.name || "Customer Account";
  const userEmail = user?.email || "Signed in customer";

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5">
          <nav aria-label="Breadcrumbs" className="flex items-center text-xs text-muted-foreground">
            <Link
              href="/"
              className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              <HouseIcon className="size-3.5" aria-hidden="true" />
              <span>Home</span>
            </Link>
            <CaretRightIcon className="size-3 mx-1.5 opacity-60" aria-hidden="true" />
            <span className="text-foreground font-medium">Customer Account</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Account Navigation Sidebar */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-4">
            {/* User Mini Card */}
            <div className="bg-card border border-border/80 p-4 rounded-xs">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-brand-pale-sage text-primary font-heading font-semibold text-sm flex items-center justify-center shrink-0">
                  {userInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-sm font-semibold text-foreground truncate">
                    {userName}
                  </h3>
                  <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav
              aria-label="Account sections"
              className="bg-card border border-border/80 overflow-hidden divide-y divide-border/60"
            >
              <div className="p-1 space-y-0.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium rounded-xs transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="p-1">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-xs transition-colors text-left"
                >
                  <SignOutIcon className="size-4 shrink-0" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Account Content Area */}
          <main className="md:col-span-8 lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
