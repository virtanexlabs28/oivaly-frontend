import * as React from "react";
import {
  HomeHero,
  CategoryDiscovery,
  CategoryDiscoverySkeleton,
  FeaturedProducts,
  FeaturedProductsSkeleton,
  CuratedCollections,
  EditorsPicks,
  FeaturedSellers,
  CustomerReviews,
  MarketplaceBenefits,
  StoryHighlight,
  NewsletterSection,
} from "@/components/home";
import { productsApi } from "@/resources/apis/products.api";
import { categoriesApi } from "@/resources/apis/categories.api";
import { storesApi, type MarketplaceStorePreview } from "@/resources/apis/stores.api";
import { reviewsApi, type MarketplacePublicReview } from "@/resources/apis/reviews.api";
import type { Product, Category } from "@/resources/interfaces/product.interface";

/**
 * Async data streaming component for category discovery from real backend API.
 */
async function LiveCategoryDiscovery() {
  let realCategories: Category[] = [];
  let realProducts: Product[] = [];

  try {
    const [categoriesRes, productsRes] = await Promise.allSettled([
      categoriesApi.getCategories("ACTIVE"),
      productsApi.getMarketplace({ limit: 50 }),
    ]);

    if (categoriesRes.status === "fulfilled" && Array.isArray(categoriesRes.value)) {
      realCategories = categoriesRes.value;
    }
    if (
      productsRes.status === "fulfilled" &&
      productsRes.value &&
      Array.isArray(productsRes.value.data)
    ) {
      realProducts = productsRes.value.data;
    }
  } catch {
    // Graceful fallback to curated discovery items
  }

  return (
    <CategoryDiscovery
      realCategories={realCategories}
      realProducts={realProducts}
    />
  );
}

/**
 * Async data streaming component for featured marketplace products from real backend API.
 */
async function LiveFeaturedProducts() {
  let realProducts: Product[] = [];

  try {
    const response = await productsApi.getMarketplace({ limit: 12 });
    if (response && Array.isArray(response.data)) {
      realProducts = response.data;
    }
  } catch {
    // Graceful fallback to curated items
  }

  return <FeaturedProducts realProducts={realProducts} />;
}

/**
 * Async data streaming component for independent makers from real backend API.
 */
async function LiveFeaturedSellers() {
  let realSellers: MarketplaceStorePreview[] = [];

  try {
    const stores = await storesApi.getMarketplaceStores(4);
    if (Array.isArray(stores)) {
      realSellers = stores;
    }
  } catch {
    // Graceful fallback to curated maker profiles
  }

  return <FeaturedSellers realSellers={realSellers} />;
}

/**
 * Async data streaming component for verified customer reviews from real backend API.
 */
async function LiveCustomerReviews() {
  let realReviews: MarketplacePublicReview[] = [];

  try {
    const reviews = await reviewsApi.getMarketplaceReviews(3);
    if (Array.isArray(reviews)) {
      realReviews = reviews;
    }
  } catch {
    // Graceful fallback to verified reviews
  }

  return <CustomerReviews realReviews={realReviews} />;
}

/**
 * Redesigned Homepage for Oivaly.
 * Server-rendered React component delivering an authentic, Etsy-inspired marketplace experience
 * powered by live backend APIs:
 * - Prominent search-first discovery
 * - Circular category navigation hub (Live Categories API)
 * - Interactive trending product grid (Live Products API)
 * - Asymmetric editorial collections
 * - Handpicked editor's gift picks
 * - Featured maker studios with live product previews (Live Stores API)
 * - Community appreciation with verified customer reviews (Live Reviews API)
 * - Trust guarantees and Scandinavian slow-craft story
 * - Real email subscription dispatch (Live Newsletter API)
 */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Etsy-Inspired Editorial Hero Section */}
      <HomeHero />

      {/* 2. Circular Visual Category Discovery Hub ("Shop by Category") with Live Categories */}
      <React.Suspense fallback={<CategoryDiscoverySkeleton />}>
        <LiveCategoryDiscovery />
      </React.Suspense>

      {/* 3. Trending Products Grid with Interactive Category Tabs with Live Inventory */}
      <React.Suspense fallback={<FeaturedProductsSkeleton />}>
        <LiveFeaturedProducts />
      </React.Suspense>

      {/* 4. Asymmetric Curated Collections & Living Themes */}
      <CuratedCollections />

      {/* 5. Editor's Picks: Everyday Heirlooms & Gift Guides */}
      <EditorsPicks />

      {/* 6. Meet the Makers: Independent Studios with Product Previews with Live Stores API */}
      <React.Suspense fallback={<FeaturedSellers />}>
        <LiveFeaturedSellers />
      </React.Suspense>

      {/* 7. Community Love: Verified Customer Reviews with Live Reviews API */}
      <React.Suspense fallback={<CustomerReviews />}>
        <LiveCustomerReviews />
      </React.Suspense>

      {/* 8. Marketplace Standards & Buyer Protection Guarantees */}
      <MarketplaceBenefits />

      {/* 9. Nordic Craft Story & Maker Philosophy */}
      <StoryHighlight />

      {/* 10. Curated Dispatches & Maker Newsletter (Live API integration) */}
      <NewsletterSection />
    </div>
  );
}
