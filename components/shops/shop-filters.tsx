"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  MagnifyingGlassIcon,
  XIcon,
  FunnelIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export interface ShopFiltersProps {
  categories?: { id: string; name: string; count: number }[];
  totalResults: number;
}

export function ShopFilters({ categories = [] }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL parameters
  const currentQ = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "newest";
  const currentInStock = searchParams.get("inStockOnly") === "true";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  // Local search input state
  const [searchTerm, setSearchTerm] = React.useState(currentQ);
  const [showPriceInputs, setShowPriceInputs] = React.useState(
    Boolean(currentMinPrice || currentMaxPrice)
  );
  const [minPrice, setMinPrice] = React.useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = React.useState(currentMaxPrice);

  // Sync state when URL search params change
  const [prevParams, setPrevParams] = React.useState({
    q: currentQ,
    min: currentMinPrice,
    max: currentMaxPrice,
  });

  if (
    prevParams.q !== currentQ ||
    prevParams.min !== currentMinPrice ||
    prevParams.max !== currentMaxPrice
  ) {
    setPrevParams({ q: currentQ, min: currentMinPrice, max: currentMaxPrice });
    setSearchTerm(currentQ);
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
  }

  // Push updated params to URL
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset pagination to page 1 on filter change
    params.delete("page");

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ q: searchTerm.trim() || null });
  };

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({
      minPrice: minPrice ? minPrice.trim() : null,
      maxPrice: maxPrice ? maxPrice.trim() : null,
    });
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    router.replace(pathname, { scroll: false });
  };

  // Determine active filters
  const hasActiveFilters = Boolean(
    currentQ ||
      (currentCategory && currentCategory !== "all") ||
      currentSort !== "newest" ||
      currentInStock ||
      currentMinPrice ||
      currentMaxPrice
  );

  return (
    <div className="space-y-3.5 mb-6">
      {/* Search & Selectors Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search within shop */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 max-w-md flex items-center"
        >
          <div className="relative w-full">
            <MagnifyingGlassIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products in this shop..."
              className="pl-9 pr-14 text-xs h-9 bg-card border-border/80 focus-visible:ring-1 focus-visible:ring-primary"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  updateUrlParams({ q: null });
                }}
                className="absolute right-9 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label="Clear search"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs font-medium text-primary hover:bg-transparent hover:underline"
            >
              Go
            </Button>
          </div>
        </form>

        {/* Filter Controls (Category, Sort, In-Stock) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          {categories.length > 0 && (
            <Select
              value={currentCategory}
              onValueChange={(val) => updateUrlParams({ category: val })}
            >
              <SelectTrigger className="h-9 text-xs w-[150px] sm:w-[170px] bg-card border-border/80">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Categories
                </SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="text-xs">
                    {c.name} ({c.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort Selector */}
          <Select
            value={currentSort}
            onValueChange={(val) => updateUrlParams({ sort: val })}
          >
            <SelectTrigger className="h-9 text-xs w-[150px] sm:w-[165px] bg-card border-border/80">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest" className="text-xs">
                Newest first
              </SelectItem>
              <SelectItem value="price_asc" className="text-xs">
                Price: low to high
              </SelectItem>
              <SelectItem value="price_desc" className="text-xs">
                Price: high to low
              </SelectItem>
              <SelectItem value="name_asc" className="text-xs">
                Name: A to Z
              </SelectItem>
            </SelectContent>
          </Select>

          {/* In-Stock Toggle */}
          <Button
            type="button"
            variant={currentInStock ? "default" : "outline"}
            size="sm"
            onClick={() =>
              updateUrlParams({ inStockOnly: currentInStock ? null : "true" })
            }
            className={`h-9 text-xs gap-1.5 ${
              currentInStock
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-card border-border/80"
            }`}
          >
            {currentInStock && <CheckIcon className="size-3" />}
            <span>In stock only</span>
          </Button>

          {/* Price Filter Toggle */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPriceInputs(!showPriceInputs)}
            className="h-9 text-xs bg-card border-border/80 gap-1.5"
          >
            <FunnelIcon className="size-3.5 text-muted-foreground" />
            <span>Price</span>
          </Button>
        </div>
      </div>

      {/* Expandable Price Form */}
      {showPriceInputs && (
        <form
          onSubmit={handleApplyPrice}
          className="flex flex-wrap items-center gap-2 p-3 bg-muted/40 border border-border/70 text-xs"
        >
          <span className="text-muted-foreground font-medium">Price range (€):</span>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="Min €"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-24 h-8 text-xs bg-background"
          />
          <span className="text-muted-foreground">&ndash;</span>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="Max €"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-24 h-8 text-xs bg-background"
          />
          <Button type="submit" size="sm" className="h-8 text-xs">
            Apply
          </Button>
          {(currentMinPrice || currentMaxPrice) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setMinPrice("");
                setMaxPrice("");
                updateUrlParams({ minPrice: null, maxPrice: null });
              }}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset Price
            </Button>
          )}
        </form>
      )}

      {/* Active Filter Chips Strip */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-muted-foreground text-[11px] font-medium">
            Active filters:
          </span>

          {currentQ && (
            <Badge
              variant="secondary"
              className="text-[11px] font-normal gap-1 bg-card border border-border/70"
            >
              <span>Search: &ldquo;{currentQ}&rdquo;</span>
              <button
                type="button"
                onClick={() => updateUrlParams({ q: null })}
                className="hover:text-destructive"
                aria-label="Remove search filter"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}

          {currentCategory && currentCategory !== "all" && (
            <Badge
              variant="secondary"
              className="text-[11px] font-normal gap-1 bg-card border border-border/70"
            >
              <span>
                Category:{" "}
                {categories.find((c) => c.id === currentCategory)?.name ||
                  currentCategory}
              </span>
              <button
                type="button"
                onClick={() => updateUrlParams({ category: null })}
                className="hover:text-destructive"
                aria-label="Remove category filter"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}

          {currentInStock && (
            <Badge
              variant="secondary"
              className="text-[11px] font-normal gap-1 bg-card border border-border/70"
            >
              <span>In stock only</span>
              <button
                type="button"
                onClick={() => updateUrlParams({ inStockOnly: null })}
                className="hover:text-destructive"
                aria-label="Remove in-stock filter"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}

          {(currentMinPrice || currentMaxPrice) && (
            <Badge
              variant="secondary"
              className="text-[11px] font-normal gap-1 bg-card border border-border/70"
            >
              <span>
                €{currentMinPrice || "0"} &ndash; €{currentMaxPrice || "any"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                  updateUrlParams({ minPrice: null, maxPrice: null });
                }}
                className="hover:text-destructive"
                aria-label="Remove price filter"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}

          {currentSort !== "newest" && (
            <Badge
              variant="secondary"
              className="text-[11px] font-normal gap-1 bg-card border border-border/70"
            >
              <span>
                Sort:{" "}
                {currentSort === "price_asc"
                  ? "Price low to high"
                  : currentSort === "price_desc"
                  ? "Price high to low"
                  : "Name A-Z"}
              </span>
              <button
                type="button"
                onClick={() => updateUrlParams({ sort: null })}
                className="hover:text-destructive"
                aria-label="Reset sort"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
