"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheckIcon,
  TruckIcon,
  LockKeyIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  PackageIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { ordersApi } from "@/resources/apis/orders.api";
import { paymentsApi } from "@/resources/apis/payments.api";
import { productsApi } from "@/resources/apis/products.api";
import { StripePaymentForm, type StripeCardDetails } from "@/components/checkout/stripe-payment-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFinnishCurrency } from "@/lib/finland";
import { toast } from "sonner";

function CheckoutContent() {
  const { items, cartCount, subtotal, shippingAmount, taxAmount, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createdPaymentLink, setCreatedPaymentLink] = React.useState<{
    url: string;
    orderNumber: string;
    orderId: string;
    amount: number;
  } | null>(null);

  const searchParams = useSearchParams();
  const isCanceled = searchParams?.get("canceled") === "true";

  // Form Fields derived cleanly without cascading renders
  const [customFields, setCustomFields] = React.useState<Record<string, string>>({});

  // Stripe Card Details state
  const [cardDetails, setCardDetails] = React.useState<StripeCardDetails>({
    cardNumber: "4242 4242 4242 4242",
    cardExp: "12/28",
    cardCvc: "123",
    nameOnCard: user?.name || "Aino Virtanen",
  });

  const formData = React.useMemo(
    () => ({
      fullName: customFields.fullName ?? user?.name ?? "Aino Virtanen",
      email: customFields.email ?? user?.email ?? "aino.virtanen@example.fi",
      phone: customFields.phone ?? user?.phone ?? "+358 40 123 4567",
      streetAddress: customFields.streetAddress ?? "Mannerheimintie 14 B 6",
      apartment: customFields.apartment ?? "",
      city: customFields.city ?? "Helsinki",
      postalCode: customFields.postalCode ?? "00100",
      country: customFields.country ?? "Finland",
      deliveryMethod: customFields.deliveryMethod ?? "posti-parcel",
      paymentMethod: customFields.paymentMethod ?? "stripe",
      notes: customFields.notes ?? "",
    }),
    [customFields, user]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Ensure all items have valid variantIds resolved
      const resolvedItems = await Promise.all(
        items.map(async (item) => {
          if (item.variantId) return item;
          try {
            const prod = await productsApi.getProduct(item.productId);
            const firstVariant = prod.variants?.[0];
            if (firstVariant?.id) {
              return { ...item, variantId: firstVariant.id };
            }
          } catch (err) {
            console.warn("Could not fetch product variant:", err);
          }
          return item;
        })
      );

      let createdOrder: { id: string; orderNumber: string; totalAmount: number } | null = null;

      if (isAuthenticated) {
        // Authenticated customer checkout
        try {
          createdOrder = await ordersApi.checkout({
            shippingAddress: {
              fullName: formData.fullName,
              phone: formData.phone,
              addressLine1: formData.streetAddress,
              addressLine2: formData.apartment || undefined,
              city: formData.city,
              postalCode: formData.postalCode,
              country: formData.country,
            },
            customerNotes: formData.notes || undefined,
          });
        } catch {
          // If customer backend cart was empty, fallback seamlessly to direct guest checkout
          const guestPayloadItems = resolvedItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId || undefined,
            quantity: i.quantity,
          }));

          createdOrder = await ordersApi.guestCheckout({
            guestEmail: formData.email,
            guestName: formData.fullName,
            guestPhone: formData.phone,
            shippingAddress: {
              fullName: formData.fullName,
              phone: formData.phone,
              addressLine1: formData.streetAddress,
              city: formData.city,
              postalCode: formData.postalCode,
              country: formData.country,
            },
            items: guestPayloadItems,
            customerNotes: formData.notes || undefined,
          });
        }
      } else {
        // Guest customer checkout
        const guestPayloadItems = resolvedItems.map((i) => ({
          productId: i.productId,
          variantId: i.variantId || undefined,
          quantity: i.quantity,
        }));

        createdOrder = await ordersApi.guestCheckout({
          guestEmail: formData.email,
          guestName: formData.fullName,
          guestPhone: formData.phone,
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            addressLine1: formData.streetAddress,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          items: guestPayloadItems,
          customerNotes: formData.notes || undefined,
        });
      }

      if (!createdOrder?.id) {
        throw new Error("Unable to create order. Please check your items and try again.");
      }

      // 2. Create REAL Stripe Checkout Session Payment Link
      toast.info("Connecting to Stripe test payment...");

      const session = await paymentsApi.createCheckoutSession(createdOrder.id, window.location.origin);

      if (!session?.paymentUrl) {
        throw new Error("Stripe payment link could not be generated. Please try again.");
      }

      // Clear local cart now that the order is safely registered
      await clearCart();

      // Show payment link modal
      setCreatedPaymentLink({
        url: session.paymentUrl,
        orderNumber: createdOrder.orderNumber,
        orderId: createdOrder.id,
        amount: Number(createdOrder.totalAmount),
      });

      toast.success("Stripe test payment link ready! Redirecting to Stripe...");

      // Redirect immediately to Stripe Hosted Checkout to pay!
      setTimeout(() => {
        window.location.href = session.paymentUrl;
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-background py-16 text-center max-w-md mx-auto px-4">
        <div className="size-16 rounded-full bg-brand-pale-sage/60 text-primary mx-auto flex items-center justify-center mb-5">
          <ShoppingBagIcon className="size-8" weight="light" />
        </div>
        <h1 className="font-heading text-xl font-bold text-foreground">
          Your cart is currently empty
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          You need items in your cart to proceed to checkout.
        </p>
        <Button asChild className="mt-6 bg-primary text-primary-foreground text-xs uppercase tracking-wider font-semibold h-10 px-6">
          <Link href="/categories">
            <span>Explore Products</span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center space-x-2 text-xs text-muted-foreground">
            <li>
              <Link href="/cart" className="hover:text-foreground transition-colors">
                Cart
              </Link>
            </li>
            <li aria-hidden="true">&bull;</li>
            <li className="text-foreground font-medium" aria-current="page">
              Secure Stripe Checkout
            </li>
          </ol>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/80 gap-3">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <span>Checkout</span>
              <Badge variant="secondary" className="bg-brand-pale-sage text-brand-deep-forest text-xs font-semibold px-2 py-0.5 rounded-full">
                {cartCount} items
              </Badge>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Protected direct ordering from Nordic artisans across Finland.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5 text-xs text-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border/60">
              <span className="size-3.5 rounded-xs bg-[#635BFF] text-white flex items-center justify-center text-[9px] font-bold">
                S
              </span>
              <span className="font-semibold text-xs">Stripe Checkout</span>
              <LockKeyIcon className="size-3 text-emerald-600 ml-1" />
            </div>
          </div>
        </div>

        {isCanceled && (
          <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xs flex items-center justify-between gap-3 text-xs text-foreground">
            <div className="flex items-center gap-2">
              <WarningCircleIcon className="size-5 text-amber-600 shrink-0" weight="fill" />
              <span>
                Your Stripe checkout was cancelled. You can review your details and proceed to Stripe again below.
              </span>
            </div>
          </div>
        )}

        {/* Form Grid */}
        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Customer & Delivery Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Contact Info */}
            <div className="bg-card border border-border/80 rounded-xs p-5 space-y-4">
              <h2 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider flex items-center justify-between">
                <span>1. Contact Information</span>
                {isAuthenticated && (
                  <span className="text-[11px] font-normal text-emerald-700 dark:text-emerald-400">
                    Signed in as {user?.email}
                  </span>
                )}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full h-9 px-3 text-xs rounded-none border border-border bg-background focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-9 px-3 text-xs rounded-none border border-border bg-background focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Mobile Phone * (for Posti SMS parcel tracking notifications)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-9 px-3 text-xs rounded-none border border-border bg-background focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-card border border-border/80 rounded-xs p-5 space-y-4">
              <h2 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
                2. Shipping Destination
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    required
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="e.g. Mannerheimintie 14"
                    className="w-full h-9 px-3 text-xs rounded-none border border-border bg-background focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Apartment, Suite, Unit (Optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="e.g. B 6"
                    className="w-full h-9 px-3 text-xs rounded-none border border-border bg-background focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 00100"
                    className="w-full h-9 px-3 text-xs rounded-none border border-border bg-background focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Helsinki"
                    className="w-full h-9 px-3 text-xs rounded-none border border-border bg-background focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full h-9 px-3 text-xs rounded-none border border-border bg-background focus:ring-1 focus:ring-primary"
                  >
                    <option value="Finland">Finland (Suomi)</option>
                    <option value="Sweden">Sweden (Sverige)</option>
                    <option value="Norway">Norway (Norge)</option>
                    <option value="Denmark">Denmark (Danmark)</option>
                    <option value="Estonia">Estonia (Eesti)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Delivery Method */}
            <div className="bg-card border border-border/80 rounded-xs p-5 space-y-3">
              <h2 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
                3. Delivery Method
              </h2>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 border border-primary/50 bg-brand-pale-sage/20 rounded-xs cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="posti-parcel"
                      checked={formData.deliveryMethod === "posti-parcel"}
                      onChange={handleChange}
                      className="text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <TruckIcon className="size-4 text-primary" />
                        <span>Posti Parcel &bull; Locker / Pickup Point</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Climate-neutral delivery in 1–3 business days with SMS pickup code.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {shippingAmount === 0 ? "Free" : formatFinnishCurrency(shippingAmount)}
                  </span>
                </label>
              </div>
            </div>

            {/* 4. Payment Method with Stripe */}
            <div className="bg-card border border-border/80 rounded-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
                  4. Payment Method
                </h2>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <LockKeyIcon className="size-3 text-emerald-600" />
                  <span>Stripe 256-bit Encryption</span>
                </span>
              </div>

              {/* Payment Method Radio Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Stripe Card / Digital Wallet (Recommended) */}
                <label className={`flex items-start gap-3 p-3.5 border rounded-xs cursor-pointer transition-colors sm:col-span-2 ${formData.paymentMethod === "stripe" ? "border-primary bg-brand-pale-sage/20 ring-1 ring-primary/20" : "border-border hover:bg-muted/30"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={formData.paymentMethod === "stripe"}
                    onChange={handleChange}
                    className="text-primary mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <span className="size-3.5 rounded-xs bg-[#635BFF] text-white flex items-center justify-center text-[9px] font-bold">
                          S
                        </span>
                        <span>Credit / Debit Card (via Stripe)</span>
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.2 rounded-xs ml-1">
                          Recommended
                        </span>
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                        <span>Visa</span> &bull; <span>MC</span> &bull; <span>Amex</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Fast, seamless payment with Stripe. Apple Pay and Google Pay supported.
                    </p>
                  </div>
                </label>

                {/* 2. Finnish Online Banks */}
                <label className={`flex items-center gap-3 p-3 border rounded-xs cursor-pointer transition-colors ${formData.paymentMethod === "bank" ? "border-primary bg-brand-pale-sage/20" : "border-border hover:bg-muted/30"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={formData.paymentMethod === "bank"}
                    onChange={handleChange}
                    className="text-primary"
                  />
                  <div>
                    <p className="text-xs font-semibold text-foreground">Finnish Online Banks</p>
                    <p className="text-[10px] text-muted-foreground">OP, Nordea, Danske, S-Pankki</p>
                  </div>
                </label>

                {/* 3. MobilePay */}
                <label className={`flex items-center gap-3 p-3 border rounded-xs cursor-pointer transition-colors ${formData.paymentMethod === "mobilepay" ? "border-primary bg-brand-pale-sage/20" : "border-border hover:bg-muted/30"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mobilepay"
                    checked={formData.paymentMethod === "mobilepay"}
                    onChange={handleChange}
                    className="text-primary"
                  />
                  <div>
                    <p className="text-xs font-semibold text-foreground">MobilePay</p>
                    <p className="text-[10px] text-muted-foreground">Instant payment via app</p>
                  </div>
                </label>
              </div>

              {/* Interactive Stripe Payment Elements Form when Stripe is selected */}
              {formData.paymentMethod === "stripe" && (
                <div className="pt-2 border-t border-border/60">
                  <StripePaymentForm
                    cardDetails={cardDetails}
                    onChange={setCardDetails}
                    isProcessing={isSubmitting}
                  />
                </div>
              )}
            </div>

            {/* 5. Special Notes */}
            <div className="bg-card border border-border/80 rounded-xs p-5 space-y-2">
              <label htmlFor="checkout-notes" className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                Special Delivery Notes (Optional)
              </label>
              <textarea
                id="checkout-notes"
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Door code, special instructions for the artisan maker, or courier notes..."
                className="w-full p-2.5 text-xs rounded-none border border-border bg-background focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Right Summary Sidebar (4 cols sticky) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-card border border-border/80 rounded-xs p-5 shadow-xs space-y-4">
              <h2 className="font-heading text-sm font-bold text-foreground border-b border-border/70 pb-3 flex items-center justify-between">
                <span>Review & Pay</span>
                <span className="text-xs font-mono font-normal text-muted-foreground">
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </span>
              </h2>

              {/* Items List Preview */}
              <div className="divide-y divide-border/60 max-h-56 overflow-y-auto pr-1 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative size-10 rounded-xs bg-muted/40 shrink-0 border border-border/50 overflow-hidden">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.productName} fill sizes="40px" className="object-cover" />
                        ) : (
                          <div className="size-full flex items-center justify-center text-muted-foreground">
                            <PackageIcon className="size-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{item.productName}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <span>Qty: {item.quantity}</span>
                          {item.storeName && (
                            <>
                              <span>&bull;</span>
                              <span className="truncate max-w-[130px]">{item.storeName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="font-medium text-foreground shrink-0 font-mono">
                      {formatFinnishCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-xs border-t border-border/60 pt-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground">{formatFinnishCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Posti Delivery</span>
                  <span className="font-mono text-foreground">
                    {shippingAmount === 0 ? "Free" : formatFinnishCurrency(shippingAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>VAT 25.5% (Included)</span>
                  <span className="font-mono text-foreground">{formatFinnishCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between items-baseline font-bold text-foreground pt-3 border-t border-border/70 text-base">
                  <span>Total to Pay</span>
                  <span className="font-heading text-lg text-primary font-bold">
                    {formatFinnishCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Submit CTA with Stripe Branding */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold uppercase tracking-wider shadow-sm rounded-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing with Stripe...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <LockKeyIcon className="size-3.5" />
                    <span>Pay with Stripe &bull; {formatFinnishCurrency(totalAmount)}</span>
                  </span>
                )}
              </Button>

              <div className="text-center pt-1 space-y-1.5">
                <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                  <ShieldCheckIcon className="size-3.5 text-primary" />
                  <span>Stripe Certified &bull; 14-day statutory returns</span>
                </p>
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/80 font-mono">
                  <span>SSL ENCRYPTED</span>
                  <span>&bull;</span>
                  <span>PCI LEVEL 1</span>
                  <span>&bull;</span>
                  <span>SCA READY</span>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Stripe Payment Link Creation Modal */}
        {createdPaymentLink && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border shadow-2xl rounded-md max-w-md w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="size-16 rounded-full bg-[#635BFF]/10 text-[#635BFF] mx-auto flex items-center justify-center ring-8 ring-[#635BFF]/5">
                <ShieldCheckIcon className="size-8" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20">
                  <span>Stripe Payment Link Generated</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Redirecting to Stripe...
                </h3>
                <p className="text-xs text-muted-foreground">
                  Order <span className="font-mono font-semibold text-foreground">#{createdPaymentLink.orderNumber}</span> for{" "}
                  <span className="font-mono font-semibold text-primary">{formatFinnishCurrency(createdPaymentLink.amount)}</span>
                </p>
              </div>

              <div className="p-3 bg-muted/40 rounded-xs border border-border/60 text-xs text-muted-foreground flex items-center justify-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Connecting to Stripe Hosted Checkout...</span>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  asChild
                  className="w-full bg-[#635BFF] hover:bg-[#5349e0] text-white font-semibold text-xs uppercase tracking-wider h-11"
                >
                  <a href={createdPaymentLink.url}>
                    <span>Click to Pay with Stripe Now</span>
                    <ArrowRightIcon className="size-4 ml-1.5" />
                  </a>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-xs h-9"
                  onClick={() => {
                    navigator.clipboard.writeText(createdPaymentLink.url);
                    toast.success("Payment link copied to clipboard!");
                  }}
                >
                  <span>Copy Payment Link</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground">Loading checkout...</p>
        </div>
      }
    >
      <CheckoutContent />
    </React.Suspense>
  );
}
