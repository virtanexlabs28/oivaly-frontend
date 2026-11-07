import * as React from "react";
import {
  TruckIcon,
  ArrowCounterClockwiseIcon,
  ShieldCheckIcon,
  StorefrontIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface ProductDeliveryInfoProps {
  isReturnEligible?: boolean;
  storeName?: string;
  storeAddress?: string;
  storeCity?: string;
  className?: string;
}

export function ProductDeliveryInfo({
  isReturnEligible = true,
  storeName,
  storeAddress,
  storeCity,
  className,
}: ProductDeliveryInfoProps) {
  const effectiveMaker = storeName || "Nordic Artisan Bakery";
  const effectiveLocation = storeAddress || storeCity || "Aleksanterinkatu 15";

  return (
    <div
      role="region"
      aria-label="Delivery and purchasing terms"
      className={cn(
        "divide-y divide-border/60 border border-border/70 bg-card/60 p-4 text-xs text-muted-foreground",
        className
      )}
    >
      {/* 1. Fast Nordic Delivery */}
      <div className="flex items-start gap-3 py-2.5 first:pt-0">
        <TruckIcon className="size-4.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="font-medium text-foreground">
            Fast Nordic Delivery (2–4 business days)
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Tracked dispatch to local parcel pick-up lockers or direct to your door.
          </p>
        </div>
      </div>

      {/* 2. 14-Day Statutory Returns */}
      <div className="flex items-start gap-3 py-2.5">
        <ArrowCounterClockwiseIcon
          className="size-4.5 text-primary shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div>
          <p className="font-medium text-foreground">
            {isReturnEligible
              ? "14-Day Statutory Returns"
              : "Made-to-Order (Limited Return Policy)"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isReturnEligible
              ? "Standard 14-day statutory return rights for unused items."
              : "Personalized or made-to-order handcrafted items are exempt from standard returns."}
          </p>
        </div>
      </div>

      {/* 3. Dispatched directly by maker */}
      <div className="flex items-start gap-3 py-2.5">
        <StorefrontIcon
          className="size-4.5 text-primary shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div>
          <p className="font-medium text-foreground">
            Dispatched directly by maker: {effectiveMaker}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            You are supporting an independent artisan based in {effectiveLocation}.
          </p>
        </div>
      </div>

      {/* 4. Oivaly Buyer Protection */}
      <div className="flex items-start gap-3 py-2.5 last:pb-0">
        <ShieldCheckIcon
          className="size-4.5 text-primary shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div>
          <p className="font-medium text-foreground">Oivaly Buyer Protection</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Secure bank-grade encrypted checkout. Payment is held securely until your order is fulfilled.
          </p>
        </div>
      </div>
    </div>
  );
}
