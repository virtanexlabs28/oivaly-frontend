"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ListIcon,
  PlusIcon,
  StorefrontIcon,
  CopyIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { useSellerAuth } from "@/lib/seller-auth-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SellerTopbarProps {
  onToggleMobileNav: () => void;
}

export function SellerTopbar({ onToggleMobileNav }: SellerTopbarProps) {
  const pathname = usePathname();
  const { store } = useSellerAuth();
  const [copied, setCopied] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getBreadcrumbs = () => {
    if (pathname === "/seller/dashboard") return "Executive Overview";
    if (pathname === "/seller/dashboard/products") return "Products & Inventory";
    if (pathname === "/seller/dashboard/products/new") return "Add New Product Listing";
    if (pathname.includes("/seller/dashboard/products/") && pathname.endsWith("/edit"))
      return "Edit Product Listing";
    if (pathname === "/seller/dashboard/orders") return "Order Fulfillment Hub";
    if (pathname === "/seller/dashboard/settings") return "Studio Profile & Settings";
    return "Atelier Dashboard";
  };

  const handleCopyStoreId = () => {
    if (store?.id) {
      navigator.clipboard.writeText(store.id);
      setCopied(true);
      toast.success("Store UUID copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-background/80 backdrop-blur-md border-b border-border/80 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="md:hidden p-2 rounded-xs border border-border text-foreground hover:bg-muted"
          aria-label="Open sidebar menu"
        >
          <ListIcon className="size-5" />
        </button>

        {/* Section Heading & Breadcrumb */}
        <div>
          <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
            <Link
              href="/seller/dashboard"
              className="hover:text-foreground transition-colors"
            >
              Atelier
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">{getBreadcrumbs()}</span>
          </nav>
        </div>
      </div>

      {/* Right Controls: Store ID Pill & Primary Action */}
      <div className="flex items-center gap-2.5">
        {/* Studio UUID Quick Pill */}
        {mounted && store?.id && (
          <button
            type="button"
            onClick={handleCopyStoreId}
            title="Click to copy Store ID"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-none border border-border bg-muted/40 hover:bg-muted text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <StorefrontIcon className="size-3.5 text-primary" />
            <span className="truncate max-w-[120px]">{store.name}</span>
            {copied ? (
              <CheckIcon className="size-3 text-emerald-600" />
            ) : (
              <CopyIcon className="size-3 text-muted-foreground" />
            )}
          </button>
        )}

        {/* Quick Add Product Button */}
        {pathname !== "/seller/dashboard/products/new" && (
          <Button
            asChild
            size="sm"
            className="h-9 px-3.5 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white text-xs font-semibold uppercase tracking-wider rounded-none shadow-xs"
          >
            <Link href="/seller/dashboard/products/new">
              <PlusIcon className="size-3.5 mr-1.5" weight="bold" />
              <span>New Product</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
