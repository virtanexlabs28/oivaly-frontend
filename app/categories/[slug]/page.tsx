import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/catalog-view";
import { type BreadcrumbCrumb } from "@/components/catalog/catalog-header";
import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";
import { productsApi } from "@/resources/apis/products.api";
import {
  getMarketplaceCategories,
  getCategoryBySlug,
} from "@/lib/categories";
import { catalogSearchQuerySchema } from "@/resources/schemas/search.schema";
import type { Product } from "@/resources/interfaces/product.interface";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category not found | Oivaly",
    };
  }

  return {
    title: `${category.name} | Oivaly`,
    description:
      category.description ||
      `Explore ${category.name.toLowerCase()} pieces crafted by independent Nordic makers.`,
  };
}

async function CategoryProductsContent({
  paramsPromise,
  searchParamsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await paramsPromise;
  const rawParams = await searchParamsPromise;

  const categories = await getMarketplaceCategories();
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Parse filters
  const parsed = catalogSearchQuerySchema.safeParse({
    q: typeof rawParams.q === "string" ? rawParams.q : undefined,
    category: slug,
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
        category: slug,
        minPrice: undefined,
        maxPrice: undefined,
        inStockOnly: undefined,
        sort: "newest" as const,
        page: 1,
        limit: 12,
      };

  let products: Product[] = [];
  let total = 0;
  let errorMessage: string | null = null;

  if (category.isBackend) {
    try {
      const res = await productsApi.getMarketplace({
        search: queryParams.q || undefined,
        categoryId: category.id,
        minPrice: queryParams.minPrice,
        maxPrice: queryParams.maxPrice,
        inStockOnly: queryParams.inStockOnly,
        page: queryParams.page,
        limit: queryParams.limit,
      });

      products = res.data || [];
      total = res.total ?? products.length;
    } catch (err) {
      console.error("[category] Failed to fetch marketplace products:", err);
      errorMessage =
        "Unable to load category products. Please try again shortly.";
    }
  } else {
    // Category is currently provisional; backend has no products linked yet
    products = [];
    total = 0;
  }

  const breadcrumbs: BreadcrumbCrumb[] = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: category.name },
  ];

  return (
    <CatalogView
      title={category.name}
      description={category.description}
      breadcrumbs={breadcrumbs}
      basePath={`/categories/${slug}`}
      filters={{
        q: queryParams.q,
        category: slug,
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

export default function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<CatalogSkeleton />}>
          <CategoryProductsContent
            paramsPromise={params}
            searchParamsPromise={searchParams}
          />
        </Suspense>
      </div>
    </div>
  );
}
