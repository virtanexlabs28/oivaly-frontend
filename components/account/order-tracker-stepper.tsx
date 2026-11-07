"use client";

import * as React from "react";
import {
  CheckCircleIcon,
  PackageIcon,
  TruckIcon,
  HouseLineIcon,
  CreditCardIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import type { OrderStatus } from "@/resources/interfaces/order.interface";
import { cn } from "@/lib/utils";

interface OrderTrackerStepperProps {
  status: OrderStatus;
  carrier?: string | null;
  trackingNumber?: string | null;
  compact?: boolean;
}

const STEPS = [
  { id: "PENDING", label: "Order Placed", icon: PackageIcon },
  { id: "PAID", label: "Confirmed", icon: CreditCardIcon },
  { id: "PROCESSING", label: "In Studio", icon: CheckCircleIcon },
  { id: "SHIPPED", label: "Dispatched", icon: TruckIcon },
  { id: "DELIVERED", label: "Delivered", icon: HouseLineIcon },
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case "PENDING":
      return 0;
    case "PAID":
      return 1;
    case "PROCESSING":
      return 2;
    case "PARTIALLY_SHIPPED":
    case "SHIPPED":
      return 3;
    case "DELIVERED":
      return 4;
    case "CANCELLED":
    case "REFUNDED":
      return -1;
    default:
      return 0;
  }
}

export function OrderTrackerStepper({
  status,
  carrier,
  trackingNumber,
  compact = false,
}: OrderTrackerStepperProps) {
  const currentStep = getStepIndex(status);
  const isCancelled = status === "CANCELLED" || status === "REFUNDED";

  if (isCancelled) {
    return (
      <div className="rounded-xs border border-destructive/20 bg-destructive/10 p-3 text-destructive flex items-center gap-2.5">
        <XCircleIcon className="size-5 shrink-0" weight="fill" />
        <div className="text-xs">
          <p className="font-semibold">Order Cancelled</p>
          <p className="text-[11px] opacity-80 mt-0.5">
            This order has been cancelled and any reserved items have been released.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Progress Line & Nodes */}
      <div className="relative flex items-start justify-between px-2 sm:px-4">
        {/* Connecting Background Line: aligned with circle centers */}
        <div
          className="absolute left-5 right-5 sm:left-8 sm:right-8 top-[14px] sm:top-[16px] -translate-y-1/2 h-1 bg-border/80 rounded-full"
          aria-hidden="true"
        />

        {/* Active Progress Fill */}
        <div
          className="absolute left-5 sm:left-8 top-[14px] sm:top-[16px] -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500"
          style={{
            width: `calc(${Math.min(100, (currentStep / (STEPS.length - 1)) * 100)}% * ((100% - 40px) / 100))`,
          }}
          aria-hidden="true"
        />

        {/* Step Nodes */}
        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentStep;
          const isCurrent = idx === currentStep;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center group min-w-0"
            >
              <div
                className={cn(
                  "size-7 sm:size-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 shrink-0",
                  isCompleted
                    ? "bg-primary text-primary-foreground shadow-xs ring-2 ring-background"
                    : "bg-muted text-muted-foreground border border-border/80 ring-2 ring-background",
                  isCurrent && "ring-4 ring-primary/25 scale-105"
                )}
              >
                {isCompleted && idx < currentStep ? (
                  <CheckCircleIcon className="size-4" weight="bold" />
                ) : (
                  <StepIcon className="size-3.5 sm:size-4" />
                )}
              </div>

              {!compact && (
                <span
                  className={cn(
                    "text-[10px] sm:text-xs font-medium mt-1.5 sm:mt-2 text-center leading-tight max-w-[62px] sm:max-w-[88px] transition-colors",
                    isCurrent
                      ? "text-primary font-semibold"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Transit Dispatch Metadata when shipped */}
      {(carrier || trackingNumber) && currentStep >= 3 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">
              {carrier || "Posti Finland"}:
            </span>
            <span className="font-mono text-[11px] bg-muted/60 px-2 py-0.5 rounded-xs text-foreground">
              {trackingNumber || "FI-POSTI-77401"}
            </span>
          </div>
          <span className="text-[11px] text-primary font-medium">
            Estimated Delivery: 1–3 business days
          </span>
        </div>
      )}
    </div>
  );
}
