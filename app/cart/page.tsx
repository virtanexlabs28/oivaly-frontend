"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBagIcon,
  TrashIcon,
  HeartIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowCounterClockwiseIcon,
  TagIcon,
  StorefrontIcon,
  PackageIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFinnishCurrency } from "@/lib/finland";
import { toast } from "sonner";

export default function CartPage() {
  const {
    items,
    cartCount,
    subtotal,
    shippingAmount,
    taxAmount,
    totalAmount,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const { toggleWishlist } = useWishlist();

  // Coupon state
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedDiscount, setAppliedDiscount] = React.useState<number | null>(null);
  const [couponError, setCouponError] = React.useState<string | null>(null);

  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();

    if (!code) return;

    if (code === "NORDIC10" || code === "WELCOME10") {
      const discount = Number((subtotal * 0.1).toFixed(2));
      setAppliedDiscount(discount);
      toast.success("Coupon applied! 10% discount applied to your order.");
    } else if (code === "FREESHIP") {
      setAppliedDiscount(shippingAmount);
      toast.success("Coupon applied! Free shipping granted.");
    } else {
      setCouponError("Invalid coupon code. Try 'NORDIC10' for 10% off.");
    }
  };

  const handleSaveForLater = (item: (typeof items)[0]) => {
    toggleWishlist({
      productId: item.productId,
      name: item.productName,
      slug: item.productSlug || item.productId,
      price: item.unitPrice,
      imageUrl: item.imageUrl,
      storeName: item.storeName,
      storeId: item.storeId,
    });
    removeItem(item.id);
    toast.success(`Moved "${item.productName}" to your wishlist`);
  };

  const effectiveTotal = Math.max(
    0,
    Number((totalAmount - (appliedDiscount || 0)).toFixed(2))
  );

  // Multi-vendor seller grouping
  const sellerGroups = React.useMemo(() => {
    const map = new Map<string, { storeId: string; storeName: string; items: typeof items }>();
    for (const item of items) {
      const key = item.storeId || "nordic-default";
      const existing = map.get(key);
      if (existing) {
        existing.items.push(item);
      } else {
        map.set(key, {
          storeId: item.storeId || "nordic-default",
          storeName: item.storeName || "Nordic Artisan Studio",
          items: [item],
        });
      }
    }
    return Array.from(map.values());
  }, [items]);

  return (
    <div className="min-h-[75vh] bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center space-x-2 text-xs text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">&bull;</li>
            <li className="text-foreground font-medium" aria-current="page">
              Shopping Cart
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/80 gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <span>Shopping Cart</span>
              {cartCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-brand-pale-sage text-brand-deep-forest text-xs font-semibold px-2.5 py-0.5 rounded-full"
                >
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </Badge>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review your selected handmade and artisan goods before checkout.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-xs h-9 border-border text-muted-foreground hover:text-destructive hover:border-destructive/30"
              >
                <TrashIcon className="size-3.5 mr-1.5" />
                Clear Cart
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-xs h-9">
                <Link href="/categories">
                  <span>Continue Shopping</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Free Shipping Progress Notification */}
        {items.length > 0 && (
          <div className="mt-6 bg-brand-pale-sage/30 border border-brand-sage/30 rounded-xs p-4">
            <div className="flex items-center justify-between text-xs font-medium text-brand-deep-forest mb-2">
              <span className="flex items-center gap-1.5">
                <TruckIcon className="size-4 text-primary" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Add <strong>{formatFinnishCurrency(remainingForFreeShipping)}</strong> more to qualify for <strong>Free Posti Delivery</strong>!
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                    <CheckCircleIcon className="size-4" weight="fill" />
                    You qualify for Free Posti Delivery across Finland!
                  </span>
                )}
              </span>
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                Threshold: €50.00
              </span>
            </div>
            <div className="w-full h-1.5 bg-border/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Body: Items vs Summary */}
        {items.length === 0 ? (
          /* Empty State */
          <div className="py-16 sm:py-24 text-center max-w-md mx-auto">
            <div className="size-16 rounded-full bg-brand-pale-sage/60 text-primary mx-auto flex items-center justify-center mb-5">
              <ShoppingBagIcon className="size-8" weight="light" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Your shopping cart is empty
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Explore independent studios and artisan shops across Finland. Your unique creations will appear here ready for checkout.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild className="w-full sm:w-auto bg-primary text-primary-foreground text-xs uppercase tracking-wider font-semibold h-10 px-6">
                <Link href="/categories">
                  <span>Discover Creations</span>
                  <ArrowRightIcon className="size-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto text-xs uppercase tracking-wider font-semibold h-10 px-6">
                <Link href="/wishlist">
                  <HeartIcon className="size-4 mr-1.5" />
                  <span>View Wishlist</span>
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Multi-Vendor Seller Cart Groups (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {sellerGroups.map((group) => {
                const groupSubtotal = group.items.reduce(
                  (acc, curr) => acc + curr.unitPrice * curr.quantity,
                  0
                );
                return (
                  <div
                    key={group.storeId}
                    className="border border-border/80 rounded-xs bg-card overflow-hidden shadow-xs"
                  >
                    {/* Seller Header */}
                    <div className="px-4 sm:px-5 py-3 bg-muted/30 border-b border-border/70 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <StorefrontIcon className="size-4 text-primary shrink-0" />
                        <Link
                          href={`/shops/${group.storeId}`}
                          className="text-xs font-semibold text-foreground hover:text-primary transition-colors truncate"
                        >
                          {group.storeName}
                        </Link>
                        <Badge
                          variant="outline"
                          className="text-[10px] text-muted-foreground border-border/60 font-normal px-1.5 py-0"
                        >
                          {group.items.length} {group.items.length === 1 ? "creation" : "creations"}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Subtotal: {formatFinnishCurrency(groupSubtotal)}
                      </span>
                    </div>

                    {/* Seller Line Items */}
                    <div className="divide-y divide-border/60">
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          {/* Item Image & Meta */}
                          <div className="flex items-start gap-4 min-w-0 flex-1">
                            <div className="relative size-20 sm:size-24 rounded-xs bg-muted/40 shrink-0 border border-border/60 overflow-hidden">
                              <Link href={`/products/${item.productSlug || item.productId}`} className="block size-full">
                                {item.imageUrl ? (
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.productName}
                                    fill
                                    sizes="96px"
                                    className="object-cover object-center"
                                  />
                                ) : (
                                  <div className="size-full flex flex-col items-center justify-center text-muted-foreground/50">
                                    <PackageIcon className="size-6" />
                                    <span className="text-[9px] mt-0.5">Item</span>
                                  </div>
                                )}
                              </Link>
                            </div>

                            <div className="min-w-0 flex-1 space-y-1">
                              <Link
                                href={`/products/${item.productSlug || item.productId}`}
                                className="font-heading text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors block leading-tight truncate"
                              >
                                {item.productName}
                              </Link>

                              {item.variantName && (
                                <p className="text-xs text-muted-foreground">
                                  Option: <span className="text-foreground">{item.variantName}</span>
                                </p>
                              )}

                              <div className="pt-1 flex items-center gap-3 text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleSaveForLater(item)}
                                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                >
                                  <HeartIcon className="size-3.5" />
                                  <span>Save for later</span>
                                </button>
                                <span className="text-border">|</span>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                                >
                                  <TrashIcon className="size-3.5" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Quantity & Price Controls */}
                          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50">
                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-border/80 rounded-xs bg-background">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                                className="size-8 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="w-9 text-center text-xs font-semibold text-foreground font-mono">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="size-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            {/* Line Item Total */}
                            <div className="text-right min-w-[80px]">
                              <p className="font-heading text-sm sm:text-base font-bold text-foreground">
                                {formatFinnishCurrency(item.unitPrice * item.quantity)}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {formatFinnishCurrency(item.unitPrice)} each
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Seller Shipping & Fulfillment Footer */}
                    <div className="px-4 sm:px-5 py-2.5 bg-muted/15 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <TruckIcon className="size-3.5 text-primary" />
                        <span>Fulfilled directly by {group.storeName} &bull; Dispatches via Posti</span>
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                        Standard Posti Parcel
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Trust Badges Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-muted/20 border border-border/60 rounded-xs flex items-center gap-2.5 text-xs text-muted-foreground">
                  <TruckIcon className="size-5 text-primary shrink-0" />
                  <span>Posti Parcel &bull; 1–3 Business Days</span>
                </div>
                <div className="p-3 bg-muted/20 border border-border/60 rounded-xs flex items-center gap-2.5 text-xs text-muted-foreground">
                  <ShieldCheckIcon className="size-5 text-primary shrink-0" />
                  <span>Buyer Protection &bull; Safe Payments</span>
                </div>
                <div className="p-3 bg-muted/20 border border-border/60 rounded-xs flex items-center gap-2.5 text-xs text-muted-foreground">
                  <ArrowCounterClockwiseIcon className="size-5 text-primary shrink-0" />
                  <span>14-Day Statutory Nordic Returns</span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Sidebar (4 cols sticky) */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">
              <div className="bg-card border border-border/80 rounded-xs p-5 sm:p-6 shadow-xs space-y-5">
                <h2 className="font-heading text-lg font-bold text-foreground border-b border-border/70 pb-3">
                  Order Summary
                </h2>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <label htmlFor="coupon-input" className="block text-xs font-medium text-foreground">
                    Have a promo or gift code?
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <TagIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <input
                        id="coupon-input"
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. NORDIC10"
                        className="w-full h-9 pl-8 pr-3 text-xs uppercase font-mono rounded-none border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <Button type="submit" variant="outline" size="sm" className="h-9 text-xs">
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-destructive">{couponError}</p>
                  )}
                  {appliedDiscount !== null && (
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircleIcon className="size-3.5" />
                      Promo code active (-{formatFinnishCurrency(appliedDiscount)})
                    </p>
                  )}
                </form>

                {/* Cost Calculations */}
                <div className="space-y-2.5 text-xs border-t border-border/60 pt-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Items Subtotal ({cartCount})</span>
                    <span className="font-mono text-foreground font-medium">
                      {formatFinnishCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Posti Delivery (Finland)</span>
                    <span className="font-mono text-foreground font-medium">
                      {shippingAmount === 0 ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold uppercase text-[11px]">
                          Free
                        </span>
                      ) : (
                        formatFinnishCurrency(shippingAmount)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>VAT 25.5% (Included)</span>
                    <span className="font-mono text-foreground">
                      {formatFinnishCurrency(taxAmount)}
                    </span>
                  </div>

                  {appliedDiscount !== null && appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                      <span>Discount</span>
                      <span className="font-mono">-{formatFinnishCurrency(appliedDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline font-bold text-foreground pt-3 border-t border-border/70 text-base">
                    <span>Total Amount</span>
                    <span className="font-heading text-lg text-primary font-bold">
                      {formatFinnishCurrency(effectiveTotal)}
                    </span>
                  </div>
                </div>

                {/* Primary Checkout CTA */}
                <Button
                  asChild
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold uppercase tracking-wider shadow-sm rounded-none"
                >
                  <Link href="/checkout" className="flex items-center justify-center gap-2">
                    <span>Proceed to Checkout</span>
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>

                {/* Security Microcopy */}
                <div className="text-center pt-2 space-y-1">
                  <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                    <ShieldCheckIcon className="size-3.5 text-primary" />
                    <span>Bank-grade 256-bit encrypted checkout</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground/80">
                    Visa &bull; Mastercard &bull; MobilePay &bull; Finnish Online Banks &bull; Klarna
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
