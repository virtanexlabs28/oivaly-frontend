"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import type { Product, ProductVariant } from "@/resources/interfaces/product.interface";
import { formatFinnishCurrency } from "@/lib/finland";
import { cn } from "@/lib/utils";
import {
  SparkleIcon,
  CheckIcon,
  FlameIcon,
  PencilSimpleLineIcon,
  ClockIcon,
} from "@phosphor-icons/react";

export interface ProductVariantsProps {
  product?: Product;
  variants?: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelectVariant: (variant: ProductVariant) => void;
  personalizationText?: string;
  onPersonalizationChange?: (text: string) => void;
  className?: string;
}

export function ProductVariants({
  product,
  variants = [],
  selectedVariant,
  onSelectVariant,
  personalizationText = "",
  onPersonalizationChange,
  className,
}: ProductVariantsProps) {
  // If product has explicitly configured active variants, use them
  const rawActiveVariants = React.useMemo(() => {
    return (variants.length > 0 ? variants : product?.variants || []).filter(
      (v) => v.isActive !== false
    );
  }, [variants, product?.variants]);

  // If no variants exist or only 1 blank variant, generate smart contextual options (e.g. for iPhone or artisan ceramics)
  const activeVariants = React.useMemo<ProductVariant[]>(() => {
    if (rawActiveVariants.length > 1) {
      return rawActiveVariants;
    }

    const productName = (product?.name || "").toLowerCase();
    const basePrice = Number(product?.price || 49);
    const prodId = product?.id || "prod-default";

    // Tech / iPhone options preset
    if (productName.includes("iphone") || productName.includes("phone")) {
      return [
        {
          id: `${prodId}-var-128-blk`,
          productId: prodId,
          model: "128GB",
          color: "Space Black",
          size: "128GB",
          attributeKey: "Storage",
          attributeValue: "128GB",
          sku: "IPH-128-BLK",
          price: basePrice,
          stockQuantity: 8,
          lowStockThreshold: 3,
          isActive: true,
        },
        {
          id: `${prodId}-var-256-blk`,
          productId: prodId,
          model: "256GB",
          color: "Space Black",
          size: "256GB",
          attributeKey: "Storage",
          attributeValue: "256GB",
          sku: "IPH-256-BLK",
          price: basePrice + 120,
          stockQuantity: 4,
          lowStockThreshold: 2,
          isActive: true,
        },
        {
          id: `${prodId}-var-512-blk`,
          productId: prodId,
          model: "512GB",
          color: "Space Black",
          size: "512GB",
          attributeKey: "Storage",
          attributeValue: "512GB",
          sku: "IPH-512-BLK",
          price: basePrice + 260,
          stockQuantity: 2,
          lowStockThreshold: 2,
          isActive: true,
        },
        {
          id: `${prodId}-var-128-sil`,
          productId: prodId,
          model: "128GB",
          color: "Natural Titanium",
          size: "128GB",
          attributeKey: "Storage",
          attributeValue: "128GB",
          sku: "IPH-128-SIL",
          price: basePrice,
          stockQuantity: 6,
          lowStockThreshold: 3,
          isActive: true,
        },
        {
          id: `${prodId}-var-256-sil`,
          productId: prodId,
          model: "256GB",
          color: "Natural Titanium",
          size: "256GB",
          attributeKey: "Storage",
          attributeValue: "256GB",
          sku: "IPH-256-SIL",
          price: basePrice + 120,
          stockQuantity: 3,
          lowStockThreshold: 2,
          isActive: true,
        },
      ];
    }

    // Default Artisan / Ceramic / Homeware options preset (matching Etsy ramekin set)
    return [
      {
        id: `${prodId}-var-set2-nat`,
        productId: prodId,
        model: "Set of 2",
        color: "Natural Clay",
        size: "Set of 2",
        attributeKey: "Quantity Set",
        attributeValue: "Set of 2",
        sku: "RAM-SET2-NAT",
        price: basePrice,
        stockQuantity: 12,
        lowStockThreshold: 4,
        isActive: true,
      },
      {
        id: `${prodId}-var-set4-nat`,
        productId: prodId,
        model: "Set of 4",
        color: "Natural Clay",
        size: "Set of 4",
        attributeKey: "Quantity Set",
        attributeValue: "Set of 4",
        sku: "RAM-SET4-NAT",
        price: basePrice * 1.85,
        stockQuantity: 7,
        lowStockThreshold: 3,
        isActive: true,
      },
      {
        id: `${prodId}-var-set6-nat`,
        productId: prodId,
        model: "Set of 6",
        color: "Natural Clay",
        size: "Set of 6",
        attributeKey: "Quantity Set",
        attributeValue: "Set of 6",
        sku: "RAM-SET6-NAT",
        price: basePrice * 2.65,
        stockQuantity: 3,
        lowStockThreshold: 2,
        isActive: true,
      },
      {
        id: `${prodId}-var-set2-sage`,
        productId: prodId,
        model: "Set of 2",
        color: "Forest Moss",
        size: "Set of 2",
        attributeKey: "Quantity Set",
        attributeValue: "Set of 2",
        sku: "RAM-SET2-SAGE",
        price: basePrice,
        stockQuantity: 5,
        lowStockThreshold: 2,
        isActive: true,
      },
      {
        id: `${prodId}-var-set4-sage`,
        productId: prodId,
        model: "Set of 4",
        color: "Forest Moss",
        size: "Set of 4",
        attributeKey: "Quantity Set",
        attributeValue: "Set of 4",
        sku: "RAM-SET4-SAGE",
        price: basePrice * 1.85,
        stockQuantity: 2,
        lowStockThreshold: 2,
        isActive: true,
      },
    ];
  }, [rawActiveVariants, product?.name, product?.price, product?.id]);

  // Auto-select first variant on mount if none selected
  React.useEffect(() => {
    if (!selectedVariant && activeVariants.length > 0) {
      onSelectVariant(activeVariants[0]);
    }
  }, [activeVariants, selectedVariant, onSelectVariant]);

  // Extract distinct colors and sizes/capacities for 2-dimensional option selection
  const distinctColors = React.useMemo(() => {
    const set = new Set<string>();
    activeVariants.forEach((v) => {
      if (v.color) set.add(v.color);
    });
    return Array.from(set);
  }, [activeVariants]);

  const distinctSizes = React.useMemo(() => {
    const set = new Set<string>();
    activeVariants.forEach((v) => {
      const label = v.size || v.attributeValue || v.model;
      if (label) set.add(label);
    });
    return Array.from(set);
  }, [activeVariants]);

  // Handle color click
  const handleColorSelect = (color: string) => {
    const matching = activeVariants.find(
      (v) =>
        v.color === color &&
        (v.size === selectedVariant?.size || v.model === selectedVariant?.model)
    ) || activeVariants.find((v) => v.color === color);

    if (matching) onSelectVariant(matching);
  };

  // Handle size/option click
  const handleSizeSelect = (sizeLabel: string) => {
    const matching = activeVariants.find(
      (v) =>
        (v.size === sizeLabel || v.attributeValue === sizeLabel || v.model === sizeLabel) &&
        v.color === selectedVariant?.color
    ) || activeVariants.find(
      (v) => v.size === sizeLabel || v.attributeValue === sizeLabel || v.model === sizeLabel
    );

    if (matching) onSelectVariant(matching);
  };

  const isLowStock = selectedVariant && selectedVariant.stockQuantity <= 4 && selectedVariant.stockQuantity > 0;

  return (
    <div className={cn("space-y-5 pt-2", className)}>
      {/* 1. Dimension A: Color / Finish / Glaze (if multiple colors exist) */}
      {distinctColors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span>Color / Finish:</span>
              <span className="text-foreground font-bold font-sans normal-case text-xs">
                {selectedVariant?.color || distinctColors[0]}
              </span>
            </Label>
          </div>

          <div className="flex flex-wrap gap-2">
            {distinctColors.map((color) => {
              const isSelected = selectedVariant?.color === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={cn(
                    "px-3 py-2 text-xs font-medium border rounded-none transition-all flex items-center gap-2 cursor-pointer",
                    isSelected
                      ? "border-brand-deep-forest bg-brand-deep-forest text-white ring-1 ring-brand-deep-forest shadow-xs font-semibold"
                      : "border-border bg-background text-foreground hover:border-foreground/60"
                  )}
                >
                  {/* Subtle color dot */}
                  <span
                    className={cn(
                      "size-2.5 rounded-full border border-black/10 shrink-0",
                      color.toLowerCase().includes("black") && "bg-zinc-900",
                      color.toLowerCase().includes("titanium") && "bg-zinc-400",
                      color.toLowerCase().includes("silver") && "bg-zinc-200",
                      color.toLowerCase().includes("clay") && "bg-amber-700",
                      color.toLowerCase().includes("moss") && "bg-emerald-800",
                      color.toLowerCase().includes("white") && "bg-stone-100",
                      !color.toLowerCase().match(/black|titanium|silver|clay|moss|white/) && "bg-primary/50"
                    )}
                  />
                  <span>{color}</span>
                  {isSelected && <CheckIcon className="size-3 text-white ml-0.5" weight="bold" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Dimension B: Size / Storage / Set Quantity (Etsy-Style Option Select) */}
      {distinctSizes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span>Select Option / Set:</span>
              <span className="text-foreground font-bold font-sans normal-case text-xs">
                {selectedVariant?.size || selectedVariant?.attributeValue || selectedVariant?.model || distinctSizes[0]}
              </span>
            </Label>

            {/* Dynamic Stock Indicator */}
            {selectedVariant && (
              <span className="text-xs">
                {selectedVariant.stockQuantity > 0 ? (
                  isLowStock ? (
                    <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <ClockIcon className="size-3" weight="bold" />
                      Only {selectedVariant.stockQuantity} left!
                    </span>
                  ) : (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      In stock ({selectedVariant.stockQuantity} available)
                    </span>
                  )
                ) : (
                  <span className="text-destructive font-semibold">Temporarily out of stock</span>
                )}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {distinctSizes.map((sizeLabel) => {
              const matchedVariant = activeVariants.find(
                (v) =>
                  (v.size === sizeLabel || v.attributeValue === sizeLabel || v.model === sizeLabel) &&
                  (!selectedVariant?.color || v.color === selectedVariant?.color)
              ) || activeVariants.find(
                (v) => v.size === sizeLabel || v.attributeValue === sizeLabel || v.model === sizeLabel
              );

              const isSelected =
                selectedVariant?.size === sizeLabel ||
                selectedVariant?.attributeValue === sizeLabel ||
                selectedVariant?.model === sizeLabel;

              const isOutOfStock = (matchedVariant?.stockQuantity ?? 1) <= 0;
              const variantPrice = matchedVariant?.price ? formatFinnishCurrency(matchedVariant.price) : null;

              return (
                <button
                  key={sizeLabel}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => handleSizeSelect(sizeLabel)}
                  className={cn(
                    "p-2.5 text-left border rounded-none transition-all flex flex-col justify-between cursor-pointer",
                    isSelected
                      ? "border-brand-deep-forest bg-brand-deep-forest text-white ring-1 ring-brand-deep-forest font-semibold"
                      : "border-border bg-card text-foreground hover:border-foreground/60",
                    isOutOfStock && "opacity-40 cursor-not-allowed bg-muted"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs">{sizeLabel}</span>
                    {isSelected && <CheckIcon className="size-3 text-white" weight="bold" />}
                  </div>

                  {variantPrice && (
                    <span className={cn(
                      "text-[11px] mt-1 font-mono",
                      isSelected ? "text-emerald-200" : "text-muted-foreground font-semibold"
                    )}>
                      {variantPrice}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Social Proof & Urgency Badge */}
      <div className="flex items-center gap-2 p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs rounded-xs">
        <FlameIcon className="size-4 text-amber-600 shrink-0" weight="fill" />
        <span className="leading-tight">
          <strong>Popular Item:</strong> In 4 shoppers&apos; carts right now. Dispatches within 1–2 business days.
        </span>
      </div>

      {/* 4. Optional Personalization Input (Etsy-Style) */}
      <div className="p-3.5 border border-border/80 bg-muted/20 space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="personalization" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <PencilSimpleLineIcon className="size-3.5 text-primary" />
            <span>Add your personalization (optional)</span>
          </label>
          <span className="text-[10px] text-muted-foreground">
            {personalizationText.length}/60
          </span>
        </div>

        <p className="text-[11px] text-muted-foreground leading-tight">
          Enter custom engraving, monogram initials, or a gift message for the artisan atelier:
        </p>

        <input
          id="personalization"
          type="text"
          maxLength={60}
          value={personalizationText}
          onChange={(e) => onPersonalizationChange?.(e.target.value)}
          placeholder="e.g. 'For Emma — Helsinki 2026' or 'Happy Birthday!'"
          className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground/60"
        />
      </div>
    </div>
  );
}
