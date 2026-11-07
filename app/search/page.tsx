import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/catalog-view";
import { type BreadcrumbCrumb } from "@/components/catalog/catalog-header";
import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";
import { productsApi } from "@/resources/apis/products.api";
import {
  getMarketplaceCategories,
  resolveBackendCategoryId,
} from "@/lib/categories";
import { catalogSearchQuerySchema } from "@/resources/schemas/search.schema";
import type { Product } from "@/resources/interfaces/product.interface";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const rawParams = await searchParams;
  const q = typeof rawParams.q === "string" ? rawParams.q.trim() : "";

  if (q) {
    return {
      title: `Search: "${q}" | Oivaly`,
      description: `Discover Nordic goods and handcrafted designs matching "${q}".`,
    };
  }

  return {
    title: "All Products | Oivaly",
    description: "Browse curated Nordic goods, gifts, and independent studio craftsmanship.",
  };
}

async function SearchResultsContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const rawParams = await searchParamsPromise;

  // 1. Normalize and parse search parameters
  const parsed = catalogSearchQuerySchema.safeParse({
    q: typeof rawParams.q === "string" ? rawParams.q : undefined,
    category: typeof rawParams.category === "string" ? rawParams.category : undefined,
    minPrice: typeof rawParams.minPrice === "string" ? rawParams.minPrice : undefined,
    maxPrice: typeof rawParams.maxPrice === "string" ? rawParams.maxPrice : undefined,
    inStockOnly:
      typeof rawParams.inStockOnly === "string" ? rawParams.inStockOnly : undefined,
    sort: typeof rawParams.sort === "string" ? rawParams.sort : undefined,
    page: typeof rawParams.page === "string" ? rawParams.page : undefined,
    limit: typeof rawParams.limit === "string" ? rawParams.limit : "12",
  });

  const queryParams = parsed.success
    ? parsed.data
    : {
        q: undefined,
        category: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        inStockOnly: undefined,
        sort: "newest" as const,
        page: 1,
        limit: 12,
      };

  // 2. Fetch platform categories
  const categories = await getMarketplaceCategories();

  // 3. Resolve category ID for backend if specified
  const backendCatId = resolveBackendCategoryId(queryParams.category, categories);
  const isProvisionalCategoryOnly =
    Boolean(queryParams.category) && !backendCatId;

  let products: Product[] = [];
  let total = 0;
  let errorMessage: string | null = null;

  if (isProvisionalCategoryOnly) {
    // Category exists only as provisional navigation; backend has no products yet
    products = [];
    total = 0;
  } else {
    try {
      const res = await productsApi.getMarketplace({
        search: queryParams.q || undefined,
        categoryId: backendCatId,
        minPrice: queryParams.minPrice,
        maxPrice: queryParams.maxPrice,
        inStockOnly: queryParams.inStockOnly,
        page: queryParams.page,
        limit: queryParams.limit,
      });

      products = res.data || [];
      total = res.total ?? products.length;
    } catch (err) {
      console.error("[search] Failed to fetch marketplace products:", err);
      errorMessage =
        "Unable to load marketplace products. Please try again shortly.";
    }
  }

  // 4. Construct presentation title & breadcrumbs
  const activeCategory = queryParams.category
    ? categories.find(
        (c) =>
          c.slug.toLowerCase() === queryParams.category?.toLowerCase() ||
          c.id.toLowerCase() === queryParams.category?.toLowerCase()
      )
    : null;

  let title = "All Products";
  if (queryParams.q) {
    title = `Search: “${queryParams.q}”`;
  } else if (activeCategory) {
    title = activeCategory.name;
  }

  const breadcrumbs: BreadcrumbCrumb[] = [
    { label: "Home", href: "/" },
    { label: "Search", href: "/search" },
  ];
  if (queryParams.q) {
    breadcrumbs.push({ label: `“${queryParams.q}”` });
  } else if (activeCategory) {
    breadcrumbs.push({ label: activeCategory.name });
  }

  return (
    <CatalogView
      title={title}
      description={
        queryParams.q
          ? `Showing results for “${queryParams.q}”`
          : activeCategory?.description ||
            "Discover distinctive handcrafted goods and curated Nordic finds."
      }
      breadcrumbs={breadcrumbs}
      basePath="/search"
      filters={{
        q: queryParams.q,
        category: queryParams.category,
        minPrice: queryParams.minPrice,
        maxPrice: queryParams.maxPrice,
        inStockOnly: queryParams.inStockOnly,
        sort: queryParams.sort,
        page: queryParams.page,
        limit: queryParams.limit,
      }}
      categories={categories}
      products={products}
      total={total}
      page={queryParams.page ?? 1}
      limit={queryParams.limit ?? 12}
      errorMessage={errorMessage}
    />
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<CatalogSkeleton />}>
          <SearchResultsContent searchParamsPromise={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
