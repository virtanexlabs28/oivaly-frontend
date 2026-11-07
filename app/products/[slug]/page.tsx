import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetailsView } from "@/components/product/product-details-view";
import { ProductReviews } from "@/components/product/product-reviews";
import { RelatedProducts } from "@/components/product/related-products";
import { ProductDetailsSkeleton } from "@/components/product/product-details-skeleton";
import { resolveProductBySlugOrId } from "@/lib/product-resolver";
import { reviewsApi } from "@/resources/apis/reviews.api";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProductBySlugOrId(slug);

  if (!product) {
    return {
      title: "Product not found | Oivaly",
    };
  }

  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];

  return {
    title: `${product.name} | Oivaly`,
    description:
      product.description ||
      `Purchase ${product.name} directly from independent makers on Oivaly.`,
    openGraph: {
      title: `${product.name} | Oivaly`,
      description: product.description || undefined,
      images: primaryImage?.url ? [{ url: primaryImage.url }] : undefined,
    },
  };
}

async function ProductDetailsContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;
  const product = await resolveProductBySlugOrId(slug);

  if (!product) {
    notFound();
  }

  // Fetch reviews snippet for top rating display
  let reviewSnippet: { averageRating: number; totalReviews: number } | undefined;
  try {
    const revSummary = await reviewsApi.getProductReviews(product.id, 1, 1);
    reviewSnippet = {
      averageRating: revSummary.averageRating,
      totalReviews: revSummary.totalReviews,
    };
  } catch {
    // Reviews are optional
  }

  return (
    <div className="space-y-16">
      {/* 1. Main Product Details View */}
      <ProductDetailsView
        product={product}
        reviewSummarySnippet={reviewSnippet}
      />

      {/* 2. Customer Reviews Section */}
      <ProductReviews productId={product.id} />

      {/* 3. Related Products Merchandising Grid */}
      <RelatedProducts
        currentProductId={product.id}
        categoryId={product.categoryId}
      />
    </div>
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<ProductDetailsSkeleton />}>
          <ProductDetailsContent paramsPromise={params} />
        </Suspense>
      </div>
    </div>
  );
}
