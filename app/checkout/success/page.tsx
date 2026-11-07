"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  WarningCircleIcon,
  ClockIcon,
} from "@phosphor-icons/react";
import { paymentsApi, type VerifySessionResponse } from "@/resources/apis/payments.api";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFinnishCurrency } from "@/lib/finland";
import { toast } from "sonner";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = React.useState(Boolean(sessionId));
  const [result, setResult] = React.useState<VerifySessionResponse | null>(null);
  const [error, setError] = React.useState<string | null>(
    sessionId ? null : "No Stripe checkout session ID was provided."
  );

  React.useEffect(() => {
    if (!sessionId) {
      return;
    }

    let isMounted = true;

    async function verify() {
      try {
        const data = await paymentsApi.verifySession(sessionId!);
        if (!isMounted) return;

        setResult(data);

        if (data.success) {
          // Successfully verified, clear the cart
          await clearCart();
          toast.success("Payment verified and order confirmed!");
        } else {
          setError(data.message || "Payment has not been completed yet.");
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : "Failed to verify Stripe payment.";
        setError(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="size-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6" />
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Verifying your Stripe payment...
        </h2>
        <p className="text-xs text-muted-foreground mt-2 max-w-sm">
          Securing cryptographic receipt and confirming your order with independent Nordic artisans.
        </p>
      </div>
    );
  }

  if (error || !result?.success) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center max-w-md mx-auto">
        <div className="size-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
          <WarningCircleIcon className="size-8" weight="fill" />
        </div>

        <h1 className="font-heading text-2xl font-bold text-foreground">
          Payment Status Notice
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          {error || "We could not confirm the completed Stripe payment for this session."}
        </p>

        <div className="mt-6 p-4 bg-muted/40 border border-border/70 rounded-xs text-xs text-left w-full space-y-2">
          <p className="font-semibold text-foreground">What you can do:</p>
          <ul className="list-disc pl-4 text-muted-foreground space-y-1 text-[11px]">
            <li>If you just completed payment, Stripe may take a moment to finalize.</li>
            <li>You can check your order status in your Account anytime.</li>
            <li>If you cancelled before completing, your cart is still saved.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full">
          <Button
            asChild
            className="w-full bg-primary text-primary-foreground text-xs uppercase tracking-wider font-semibold h-11"
          >
            <Link href="/checkout">
              <span>Return to Checkout</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full text-xs uppercase tracking-wider font-semibold h-11"
          >
            <Link href="/account">
              <span>Go to Account</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const order = result.order;
  const invoice = result.invoice;
  const totalAmount = order?.totalAmount ? Number(order.totalAmount) : 0;
  const orderNumber = order?.orderNumber || "CONFIRMED";

  return (
    <div className="min-h-[75vh] bg-background py-16 text-center max-w-xl mx-auto px-4">
      {/* Stripe Verified Icon */}
      <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 mx-auto flex items-center justify-center mb-6 ring-8 ring-emerald-50 dark:ring-emerald-950/20">
        <CheckCircleIcon className="size-9" weight="fill" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#635BFF]/10 text-[#635BFF] mb-3 border border-[#635BFF]/20">
        <ShieldCheckIcon className="size-4" />
        <span>Payment Received & Verified with Stripe</span>
      </div>

      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
        Thank you for your order!
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto">
        Your payment was processed securely via Stripe. The artisan workshops have received your order.
      </p>

      {/* Order & Payment Receipt Card */}
      <div className="mt-8 p-5 bg-card border border-border/80 rounded-md text-xs text-left space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
            Order Confirmation
          </span>
          <span className="font-mono font-bold text-sm text-primary">
            #{orderNumber}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Amount Paid:</span>
          <span className="font-bold text-foreground font-mono text-sm">
            {formatFinnishCurrency(totalAmount)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Payment Processor:</span>
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <span className="size-3.5 rounded-xs bg-[#635BFF] text-white flex items-center justify-center text-[9px] font-bold">
              S
            </span>
            <span>Stripe Hosted Checkout</span>
          </div>
        </div>

        {sessionId && (
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">Stripe Session:</span>
            <span className="font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-xs max-w-[220px] truncate">
              {sessionId}
            </span>
          </div>
        )}

        {Boolean(invoice?.invoiceNumber) && (
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">Tax Invoice:</span>
            <span className="font-mono font-medium text-foreground">
              #{String(invoice?.invoiceNumber)}
            </span>
          </div>
        )}


        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Fulfillment Status:</span>
          <Badge
            variant="outline"
            className="bg-brand-pale-sage/60 text-brand-deep-forest border-brand-sage/40 text-[10px] gap-1"
          >
            <ClockIcon className="size-3 text-primary" />
            <span>Processing with Artisans</span>
          </Badge>
        </div>

        {order?.shippingAddress && (
          <div className="flex justify-between pt-2 border-t border-border/50 text-[11px]">
            <span className="text-muted-foreground">Delivery To:</span>
            <span className="text-foreground truncate max-w-[240px]">
              {order.shippingAddress.fullName || "Customer"},{" "}
              {order.shippingAddress.city || "Finland"}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          asChild
          className="w-full sm:w-auto bg-primary text-primary-foreground text-xs uppercase tracking-wider font-semibold h-11 px-6 shadow-xs"
        >
          <Link href="/account">
            <span>Track Order in Account</span>
            <ArrowRightIcon className="size-4 ml-1.5" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full sm:w-auto text-xs uppercase tracking-wider font-semibold h-11 px-6"
        >
          <Link href="/categories">
            <ShoppingBagIcon className="size-4 mr-1.5" />
            <span>Explore More Handcrafted Items</span>
          </Link>
        </Button>
      </div>

      {/* Security Footnote */}
      <div className="mt-8 pt-6 border-t border-border/60 text-center">
        <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheckIcon className="size-4 text-emerald-600" />
          <span>Payment settled securely through Stripe &bull; 100% Buyer Protection</span>
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="size-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6" />
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Verifying your Stripe payment...
          </h2>
          <p className="text-xs text-muted-foreground mt-2 max-w-sm">
            Securing cryptographic receipt and confirming your order with independent Nordic artisans.
          </p>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </React.Suspense>
  );
}
