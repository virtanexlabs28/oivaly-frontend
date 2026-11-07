import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* 1. Banner Skeleton */}
      <div className="w-full h-44 sm:h-56 md:h-64 lg:h-72 bg-muted/60 animate-pulse" />

      {/* 2. Profile Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative pb-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-14 sm:-mt-16 md:-mt-18">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              <Skeleton className="size-20 sm:size-24 rounded-full border-4 border-background" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-48 sm:w-64" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2 md:pt-0">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>

        {/* 3. Navigation Skeleton */}
        <div className="flex items-center gap-6 border-b border-border/80 py-3 mb-6">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* 4. Filters Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
          <Skeleton className="h-9 w-full sm:w-72" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>

        {/* 5. Product Grid Skeletons (8 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-16">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden bg-card border border-border/70"
            >
              <Skeleton className="aspect-square w-full" />
              <div className="p-3.5 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
