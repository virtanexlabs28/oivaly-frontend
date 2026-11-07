"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { buildCatalogUrl, type CatalogFilterState } from "@/lib/search-url";
import type { MarketplaceCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";

export interface FilterSidebarProps {
  basePath: string;
  filters: CatalogFilterState;
  categories: MarketplaceCategory[];
  className?: string;
  onFilterApplied?: () => void;
}

const PRICE_PRESETS = [
  { label: "Under €25", min: undefined, max: 25 },
  { label: "€25 – €50", min: 25, max: 50 },
  { label: "€50 – €100", min: 50, max: 100 },
  { label: "Over €100", min: 100, max: undefined },
];

export function FilterSidebar({
  basePath,
  filters,
  categories,
  className,
  onFilterApplied,
}: FilterSidebarProps) {
  const router = useRouter();

  // Local draft states for price input to prevent firing requests on every keystroke
  const urlMin = filters.minPrice !== undefined ? String(filters.minPrice) : "";
  const urlMax = filters.maxPrice !== undefined ? String(filters.maxPrice) : "";

  const [minPriceInput, setMinPriceInput] = React.useState<string>(urlMin);
  const [maxPriceInput, setMaxPriceInput] = React.useState<string>(urlMax);
  const [prevUrlMin, setPrevUrlMin] = React.useState<string>(urlMin);
  const [prevUrlMax, setPrevUrlMax] = React.useState<string>(urlMax);
  const [priceError, setPriceError] = React.useState<string | null>(null);

  // Sync draft inputs when URL filters change (React 19 pattern)
  if (urlMin !== prevUrlMin || urlMax !== prevUrlMax) {
    setPrevUrlMin(urlMin);
    setPrevUrlMax(urlMax);
    setMinPriceInput(urlMin);
    setMaxPriceInput(urlMax);
    setPriceError(null);
  }

  const handleCategorySelect = (categorySlug?: string) => {
    const targetUrl = buildCatalogUrl(basePath, filters, {
      category: categorySlug,
      page: 1,
    });
    router.push(targetUrl);
    if (onFilterApplied) onFilterApplied();
  };

  const handlePriceApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPriceError(null);

    const min = minPriceInput.trim() ? parseFloat(minPriceInput.trim()) : undefined;
    const max = maxPriceInput.trim() ? parseFloat(maxPriceInput.trim()) : undefined;

    if (min !== undefined && (isNaN(min) || min < 0)) {
      setPriceError("Minimum price must be at least €0");
      return;
    }
    if (max !== undefined && (isNaN(max) || max < 0)) {
      setPriceError("Maximum price must be at least €0");
      return;
    }
    if (min !== undefined && max !== undefined && min > max) {
      setPriceError("Minimum price cannot exceed maximum price");
      return;
    }

    const targetUrl = buildCatalogUrl(basePath, filters, {
      minPrice: min,
      maxPrice: max,
      page: 1,
    });
    router.push(targetUrl);
    if (onFilterApplied) onFilterApplied();
  };

  const handlePresetSelect = (presetMin?: number, presetMax?: number) => {
    setMinPriceInput(presetMin !== undefined ? String(presetMin) : "");
    setMaxPriceInput(presetMax !== undefined ? String(presetMax) : "");
    setPriceError(null);

    const targetUrl = buildCatalogUrl(basePath, filters, {
      minPrice: presetMin,
      maxPrice: presetMax,
      page: 1,
    });
    router.push(targetUrl);
    if (onFilterApplied) onFilterApplied();
  };

  const handleInStockToggle = (checked: boolean | "indeterminate") => {
    const targetUrl = buildCatalogUrl(basePath, filters, {
      inStockOnly: checked === true ? "true" : undefined,
      page: 1,
    });
    router.push(targetUrl);
    if (onFilterApplied) onFilterApplied();
  };

  const handleResetFilters = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    setPriceError(null);
    const targetUrl = buildCatalogUrl(basePath, {
      q: filters.q,
    });
    router.push(targetUrl);
    if (onFilterApplied) onFilterApplied();
  };

  const isInStock =
    filters.inStockOnly === true ||
    filters.inStockOnly === "true" ||
    filters.inStockOnly === "1";

  return (
    <aside
      aria-label="Product filters"
      className={cn("space-y-6 text-foreground", className)}
    >
      {/* 1. Header with Reset action */}
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">
          Filters
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleResetFilters}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          aria-label="Clear all filters"
        >
          <ArrowCounterClockwiseIcon className="size-3 mr-1" aria-hidden="true" />
          Clear
        </Button>
      </div>

      <Separator />

      {/* 2. Categories Group */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Categories
        </Label>
        <div className="space-y-1">
          {/* All categories option */}
          <button
            type="button"
            onClick={() => handleCategorySelect(undefined)}
            className={cn(
              "flex w-full items-center justify-between px-2.5 py-1.5 text-xs text-left transition-colors rounded-none",
              !filters.category
                ? "bg-brand-pale-sage/60 font-semibold text-primary dark:bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <span>All products</span>
            {!filters.category && <CheckIcon className="size-3 text-primary" />}
          </button>

          {/* List of categories */}
          {categories.map((cat) => {
            const isSelected =
              filters.category?.toLowerCase() === cat.slug.toLowerCase() ||
              filters.category?.toLowerCase() === cat.id.toLowerCase();

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={cn(
                  "flex w-full items-center justify-between px-2.5 py-1.5 text-xs text-left transition-colors rounded-none",
                  isSelected
                    ? "bg-brand-pale-sage/60 font-semibold text-primary dark:bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <CheckIcon className="size-3 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* 3. Price Filter (EUR) */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Price (€ EUR)
        </Label>

        {/* Price Presets */}
        <div className="grid grid-cols-2 gap-1.5">
          {PRICE_PRESETS.map((preset) => {
            const isPresetActive =
              String(filters.minPrice ?? "") === String(preset.min ?? "") &&
              String(filters.maxPrice ?? "") === String(preset.max ?? "");

            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetSelect(preset.min, preset.max)}
                className={cn(
                  "px-2 py-1 text-[11px] border text-center transition-colors rounded-none",
                  isPresetActive
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border/80 text-muted-foreground hover:border-foreground hover:text-foreground bg-card"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Custom Min / Max Inputs Form */}
        <form onSubmit={handlePriceApply} className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="filter-min-price" className="text-[11px] text-muted-foreground">
                Min (€)
              </Label>
              <Input
                id="filter-min-price"
                type="number"
                min="0"
                step="any"
                placeholder="0"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="h-8 text-xs rounded-none"
              />
            </div>
            <div>
              <Label htmlFor="filter-max-price" className="text-[11px] text-muted-foreground">
                Max (€)
              </Label>
              <Input
                id="filter-max-price"
                type="number"
                min="0"
                step="any"
                placeholder="No limit"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="h-8 text-xs rounded-none"
              />
            </div>
          </div>

          {priceError && (
            <p className="text-[11px] text-destructive leading-tight" role="alert">
              {priceError}
            </p>
          )}

          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs rounded-none border-border hover:bg-muted"
          >
            Apply price
          </Button>
        </form>
      </div>

      <Separator />

      {/* 4. Availability Filter */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Availability
        </Label>
        <div className="flex items-center space-x-2.5 pt-1">
          <Checkbox
            id="filter-instock"
            checked={isInStock}
            onCheckedChange={handleInStockToggle}
            className="rounded-none border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label
            htmlFor="filter-instock"
            className="text-xs font-normal text-foreground cursor-pointer select-none leading-none"
          >
            In stock only
          </Label>
        </div>
      </div>
    </aside>
  );
}
