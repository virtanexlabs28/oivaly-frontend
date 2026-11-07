import type { Metadata } from "next";
import { Suspense } from "react";
import { getMarketplaceCategories } from "@/lib/categories";
import { CategoriesDirectory } from "@/components/catalog/categories-directory";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "All Categories | Oivaly",
  description:
    "Explore all departments, curated collections, and independent maker studios across Oivaly.",
};

async function CategoriesContent() {
  const categories = await getMarketplaceCategories();
  return <CategoriesDirectory categories={categories} />;
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-4 w-36" />
      <div className="space-y-2 pb-6 border-b border-border/70">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 bg-card border border-border/70 p-3">
            <Skeleton className="aspect-4/3 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CategoriesIndexPage() {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesContent />
        </Suspense>
      </div>
    </div>
  );
}
