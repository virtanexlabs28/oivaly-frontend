import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { HouseIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { ShopHeader } from "@/components/shops/shop-header";
import { ShopNavigation } from "@/components/shops/shop-navigation";
import { ShopFilters } from "@/components/shops/shop-filters";
import { ShopProductGrid } from "@/components/shops/shop-product-grid";
import { ShopAbout } from "@/components/shops/shop-about";
import { ShopPolicies } from "@/components/shops/shop-policies";
import { ShopReviews } from "@/components/shops/shop-reviews";
import ShopLoading from "./loading";
import {
  resolveStoreBySlugOrId,
  getStoreProducts,
  type StoreProductsFilterOptions,
} from "@/lib/seller-resolver";

interface ShopPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: ShopPageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await resolveStoreBySlugOrId(slug);

  if (!store) {
    return {
      title: "Shop Not Found | Oivaly",
    };
  }

  return {
    title: `${store.name} | Oivaly`,
    description:
      store.description ||
      `Explore handcrafted Nordic items and design pieces by ${store.name} on Oivaly.`,
    openGraph: {
      title: `${store.name} — Independent Maker | Oivaly`,
      description: store.description || undefined,
      images: store.bannerUrl
        ? [{ url: store.bannerUrl }]
        : store.logoUrl
        ? [{ url: store.logoUrl }]
        : undefined,
    },
  };
}

async function ShopPageContent({
  paramsPromise,
  searchParamsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await paramsPromise;
  const resolvedParams = await searchParamsPromise;

  const store = await resolveStoreBySlugOrId(slug);

  if (!store) {
    notFound();
  }

  // Handle suspended or inactive backend stores respectfully
  if (store.status === "SUSPENDED" || store.status === "REJECTED") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center space-y-4">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Shop Currently Unavailable
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          This studio storefront is currently not active on Oivaly.
        </p>
        <div className="pt-4">
          <Link
            href="/#makers"
            className="inline-flex items-center text-xs font-medium text-primary hover:underline"
          >
            &larr; Discover other independent makers
          </Link>
        </div>
      </div>
    );
  }

  // Parse filter parameters
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;
  const category =
    typeof resolvedParams.category === "string"
      ? resolvedParams.category
      : undefined;
  const sort = (
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : "newest"
  ) as StoreProductsFilterOptions["sort"];
  const minPrice =
    typeof resolvedParams.minPrice === "string"
      ? parseFloat(resolvedParams.minPrice)
      : undefined;
  const maxPrice =
    typeof resolvedParams.maxPrice === "string"
      ? parseFloat(resolvedParams.maxPrice)
      : undefined;
  const inStockOnly = resolvedParams.inStockOnly === "true";
  const page =
    typeof resolvedParams.page === "string"
      ? parseInt(resolvedParams.page, 10) || 1
      : 1;

  // Retrieve products for this store
  const { products, total, categories, totalPages } = await getStoreProducts(
    store.id,
    {
      search: q,
      category,
      sort,
      minPrice,
      maxPrice,
      inStockOnly,
      page,
      limit: 12,
    }
  );

  const hasActiveFilters = Boolean(
    q ||
      (category && category !== "all") ||
      sort !== "newest" ||
      inStockOnly ||
      minPrice !== undefined ||
      maxPrice !== undefined
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5">
          <nav aria-label="Breadcrumbs" className="flex items-center text-xs text-muted-foreground">
            <Link
              href="/"
              className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              <HouseIcon className="size-3.5" aria-hidden="true" />
              <span>Home</span>
            </Link>
            <CaretRightIcon className="size-3 mx-1.5 opacity-60" aria-hidden="true" />
            <Link href="/#makers" className="hover:text-foreground transition-colors">
              Makers
            </Link>
            <CaretRightIcon className="size-3 mx-1.5 opacity-60" aria-hidden="true" />
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
              {store.name}
            </span>
          </nav>
        </div>
      </div>

      {/* 1. Header & Identity Section */}
      <ShopHeader store={store} totalProducts={total} />

      {/* 2. Sticky Sub-navigation */}
      <ShopNavigation totalProducts={total} activeSection="products" />

      {/* 3. Main Discovery Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        {/* Products Section */}
        <section id="products" aria-labelledby="shop-products-heading" className="scroll-mt-32">
          <h2 id="shop-products-heading" className="sr-only">
            Products by {store.name}
          </h2>

          <ShopFilters
            categories={categories}
            totalResults={total}
          />

          <ShopProductGrid
            products={products}
            total={total}
            page={page}
            totalPages={totalPages}
            shopName={store.name}
            hasActiveFilters={hasActiveFilters}
          />
        </section>

        {/* About Maker Section */}
        <ShopAbout store={store} />

        {/* Shop Policies Section */}
        <ShopPolicies shopName={store.name} />

        {/* Customer Reviews Section */}
        <ShopReviews shopName={store.name} />
      </div>
    </div>
  );
}

export default function ShopPage({ params, searchParams }: ShopPageProps) {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopPageContent
        paramsPromise={params}
        searchParamsPromise={searchParams}
      />
    </Suspense>
  );
}
