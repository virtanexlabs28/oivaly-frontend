"use client";

import * as React from "react";
import { FadersHorizontalIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { FilterSidebar } from "./filter-sidebar";
import type { CatalogFilterState } from "@/lib/search-url";
import type { MarketplaceCategory } from "@/lib/categories";
import { Badge } from "@/components/ui/badge";

export interface FilterMobileDrawerProps {
  basePath: string;
  filters: CatalogFilterState;
  categories: MarketplaceCategory[];
}

export function FilterMobileDrawer({
  basePath,
  filters,
  categories,
}: FilterMobileDrawerProps) {
  const [open, setOpen] = React.useState(false);

  // Compute active filter count
  const hasCategory = Boolean(filters.category && filters.category.trim());
  const hasPrice =
    (filters.minPrice !== undefined && filters.minPrice !== "") ||
    (filters.maxPrice !== undefined && filters.maxPrice !== "");
  const hasInStock =
    filters.inStockOnly === true ||
    filters.inStockOnly === "true" ||
    filters.inStockOnly === "1";

  const activeCount =
    (hasCategory ? 1 : 0) + (hasPrice ? 1 : 0) + (hasInStock ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 text-xs font-medium rounded-none border-border/80 flex items-center gap-1.5"
          aria-label={`Open filters (${activeCount} active)`}
        >
          <FadersHorizontalIcon className="size-4" aria-hidden="true" />
          <span>Filters</span>
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 size-4.5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground font-semibold"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[300px] sm:w-[340px] p-0 flex flex-col bg-background"
      >
        <SheetHeader className="px-5 py-4 border-b border-border/70 flex flex-row items-center justify-between">
          <div>
            <SheetTitle className="text-base font-semibold">Filters</SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Refine results by category, price, or availability.
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <FilterSidebar
            basePath={basePath}
            filters={filters}
            categories={categories}
            onFilterApplied={() => setOpen(false)}
          />
        </div>

        <div className="p-4 border-t border-border/70 bg-card/60 flex items-center gap-2">
          <Button
            type="button"
            className="w-full text-xs font-medium rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setOpen(false)}
          >
            Show results
          </Button>
          <SheetClose asChild>
            <Button
              type="button"
              variant="outline"
              className="text-xs font-medium rounded-none"
            >
              Close
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
