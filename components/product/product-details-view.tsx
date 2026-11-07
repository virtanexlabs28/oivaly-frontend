"use client";

import * as React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductGallery } from "./product-gallery";
import { ProductVariants } from "./product-variants";
import { ProductPurchaseActions } from "./product-purchase-actions";
import { ProductDeliveryInfo } from "./product-delivery-info";
import { ProductTabs } from "./product-tabs";
import { formatFinnishCurrency } from "@/lib/finland";
import type { Product, ProductVariant } from "@/resources/interfaces/product.interface";

export interface ProductDetailsViewProps {
  product: Product;
  reviewSummarySnippet?: {
    averageRating: number;
    totalReviews: number;
  };
}

export function ProductDetailsView({
  product,
  reviewSummarySnippet,
}: ProductDetailsViewProps) {
  // If product has active variants, default to first active variant
  const activeVariants = React.useMemo(() => {
    return (product.variants || []).filter((v) => v.isActive !== false);
  }, [product.variants]);

  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | null>(
    activeVariants.length === 1 ? activeVariants[0] : null
  );

  const [personalizationText, setPersonalizationText] = React.useState("");

  // Active price: variant price takes precedence if available
  const numericPrice = selectedVariant?.price
    ? Number(selectedVariant.price)
    : typeof product.price === "number"
    ? product.price
    : parseFloat(product.price) || 0;

  const formattedPrice = formatFinnishCurrency(numericPrice);

  const categoryName = product.category?.name || "Categories";
  const categorySlug = product.category?.slug || "all";
  const storeName = product.store?.name;
  const storeAddress =
    product.store && "address" in product.store ? product.store.address : undefined;
  const storeCity = storeAddress ? storeAddress.split(",")[0].trim() : undefined;

  return (
    <div className="space-y-12">
      {/* 1. Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/categories">Categories</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {product.category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/categories/${categorySlug}`}>{categoryName}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-normal text-foreground truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 2. Primary Product Showcase Grid (Two Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery (7 cols on large desktop) */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Right Column: Purchase Information (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Store / Maker Attribution */}
          {storeName && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="uppercase tracking-wider font-semibold text-[10px] text-primary">
                Maker &bull;
              </span>
              <Link
                href={`/shops/${product.store?.id || ""}`}
                className="hover:text-foreground font-medium transition-colors"
              >
                {storeName}
              </Link>
              {storeCity && <span className="opacity-70">&bull; {storeCity}</span>}
            </div>
          )}

          {/* Product Title */}
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-snug">
              {product.name}
            </h1>

            {/* Rating summary snippet */}
            {reviewSummarySnippet && reviewSummarySnippet.totalReviews > 0 && (
              <a
                href="#reviews-heading"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors"
              >
                <span className="text-amber-500 font-semibold">★ {reviewSummarySnippet.averageRating.toFixed(1)}</span>
                <span className="underline">({reviewSummarySnippet.totalReviews} reviews)</span>
              </a>
            )}
          </div>

          {/* Pricing & VAT Details */}
          <div className="p-4 bg-card/60 border border-border/70 space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {formattedPrice}
              </span>

              <span className="text-xs text-muted-foreground">
                {product.vatIncluded !== false
                  ? `incl. VAT (${product.vatRate || "25.5"}%)`
                  : `+ VAT (${product.vatRate || "25.5"}%)`}
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Shipping calculated at checkout &bull; No hidden fees
            </p>
          </div>

          {/* Variants Selector (Color swatches, size/model pills, stock badge, personalization) */}
          <ProductVariants
            product={product}
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelectVariant={setSelectedVariant}
            personalizationText={personalizationText}
            onPersonalizationChange={setPersonalizationText}
          />

          {/* Purchase Actions (Quantity, Add to Cart, Buy Now, Wishlist) */}
          <ProductPurchaseActions
            product={product}
            selectedVariant={selectedVariant}
            personalizationText={personalizationText}
          />

          {/* Delivery & Trust Summary Card */}
          <ProductDeliveryInfo
            isReturnEligible={product.isReturnEligible}
            storeName={storeName}
            storeAddress={storeAddress}
            storeCity={storeCity}
          />
        </div>
      </div>

      {/* 3. Product Tabs (Description, Specifications, Maker, Delivery) */}
      <ProductTabs product={product} />
    </div>
  );
}
