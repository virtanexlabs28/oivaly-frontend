"use client";

import * as React from "react";
import {
  LockKeyIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";

export interface StripeCardDetails {
  cardNumber: string;
  cardExp: string;
  cardCvc: string;
  nameOnCard: string;
}

export interface StripePaymentFormProps {
  cardDetails?: StripeCardDetails;
  onChange?: (details: StripeCardDetails) => void;
  isProcessing?: boolean;
}

export function StripePaymentForm(props: StripePaymentFormProps = {}) {
  const { isProcessing = false } = props;

  return (
    <div className="space-y-3 pt-1">
      {/* Stripe Security & Gateway Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted/40 border border-border/70 rounded-xs text-xs">
        <div className="flex items-center gap-2 text-foreground">
          <div className="size-5 rounded-xs bg-[#635BFF] text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
            S
          </div>
          <span className="font-semibold">Stripe Payment Gateway</span>
          <Badge
            variant="outline"
            className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 font-mono"
          >
            <LockKeyIcon className="size-3" />
            <span>256-bit SSL</span>
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {isProcessing ? (
            <span className="flex items-center gap-1 text-primary animate-pulse font-medium">
              <span className="size-2 rounded-full bg-primary animate-ping" />
              Processing...
            </span>
          ) : (
            <>
              <ShieldCheckIcon className="size-3.5 text-[#635BFF]" />
              <span>Hosted Payment Link</span>
            </>
          )}
        </div>
      </div>

      {/* Stripe Checkout Explanation Box */}
      <div className="p-4 bg-card border border-border/80 rounded-xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center shrink-0 mt-0.5">
            <ArrowSquareOutIcon className="size-4" />
          </div>
          <div className="text-xs space-y-1">
            <p className="font-semibold text-foreground">
              Direct Stripe Payment Link Generation
            </p>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              When you submit this order, a secure Stripe Payment Link will be generated automatically. You will be redirected to the official Stripe checkout to complete payment safely.
            </p>
          </div>
        </div>

        {/* Accepted Payment Methods Chips */}
        <div className="pt-2 border-t border-border/50 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-1">
            Accepted:
          </span>
          <span className="px-2 py-0.5 bg-background border border-border/70 rounded-xs text-[10px] font-semibold text-blue-600 font-mono">
            VISA
          </span>
          <span className="px-2 py-0.5 bg-background border border-border/70 rounded-xs text-[10px] font-semibold text-amber-600 font-mono">
            MASTERCARD
          </span>
          <span className="px-2 py-0.5 bg-background border border-border/70 rounded-xs text-[10px] font-semibold text-sky-600 font-mono">
            AMEX
          </span>
          <span className="px-2 py-0.5 bg-background border border-border/70 rounded-xs text-[10px] font-semibold text-foreground font-mono">
            APPLE PAY
          </span>
          <span className="px-2 py-0.5 bg-background border border-border/70 rounded-xs text-[10px] font-semibold text-foreground font-mono">
            GOOGLE PAY
          </span>
          <span className="px-2 py-0.5 bg-background border border-border/70 rounded-xs text-[10px] font-semibold text-pink-600 font-mono">
            KLARNA
          </span>
        </div>
      </div>

      {/* Trust reassurance */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
        <span className="flex items-center gap-1">
          <ShieldCheckIcon className="size-3.5 text-primary" />
          <span>PCI-DSS Level 1 Encrypted</span>
        </span>
        <span className="flex items-center gap-1 text-[10px]">
          <CheckCircleIcon className="size-3 text-emerald-600" />
          <span>Zero card exposure &bull; Received by Stripe</span>
        </span>
      </div>
    </div>
  );
}
