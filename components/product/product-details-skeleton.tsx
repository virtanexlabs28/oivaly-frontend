import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <div className="space-y-12">
      {/* 1. Breadcrumbs Skeleton */}
      <Skeleton className="h-4 w-64" />

      {/* 2. Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery Skeleton */}
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="aspect-square w-full" />
          <div className="flex gap-2.5">
            <Skeleton className="size-16 sm:size-20 shrink-0" />
            <Skeleton className="size-16 sm:size-20 shrink-0" />
            <Skeleton className="size-16 sm:size-20 shrink-0" />
          </div>
        </div>

        {/* Right Column: Info Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-11 flex-1" />
            <Skeleton className="size-11 shrink-0" />
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      </div>

      {/* 3. Tabs Skeleton */}
      <div className="space-y-4 pt-8 border-t border-border/70">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
