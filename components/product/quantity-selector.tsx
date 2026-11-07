"use client";

import * as React from "react";
import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  max?: number;
  min?: number;
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  max = 99,
  min = 1,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      const clamped = Math.max(min, Math.min(max, val));
      onQuantityChange(clamped);
    }
  };

  const canDecrease = quantity > min && !disabled;
  const canIncrease = quantity < max && !disabled;

  return (
    <div
      role="group"
      aria-label="Select quantity"
      className={cn("inline-flex items-center border border-border/80 bg-card", className)}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={!canDecrease}
        aria-label="Decrease quantity"
        className="flex size-9 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <MinusIcon className="size-3.5" aria-hidden="true" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label="Quantity"
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        className="h-9 w-12 text-center text-xs font-semibold text-foreground bg-transparent border-x border-border/80 outline-none select-none disabled:opacity-50"
      />

      <button
        type="button"
        onClick={handleIncrease}
        disabled={!canIncrease}
        aria-label="Increase quantity"
        className="flex size-9 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <PlusIcon className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
