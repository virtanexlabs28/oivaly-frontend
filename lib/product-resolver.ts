import { productsApi } from "@/resources/apis/products.api";
import type { Product } from "@/resources/interfaces/product.interface";
import { DEMO_FEATURED_PRODUCTS, type DemoProductItem } from "@/fixtures/marketplace-demo";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function mapDemoItemToProduct(demo: DemoProductItem): Product {
  return {
    id: demo.id,
    storeId: demo.storeId,
    name: demo.name,
    slug: demo.slug,
    description:
      "Handcrafted, timeless Nordic design piece crafted with care from high-grade natural materials in Finland. Each item is a unique studio creation combining functional utility with Scandinavian design sensibilities.",
    sku: `SKU-${demo.slug.slice(0, 10).toUpperCase()}`,
    price: demo.price,
    vatRate: demo.vatRate,
    vatIncluded: demo.vatIncluded,
    vatCode: "FI-ALV-25.5",
    status: "PUBLISHED",
    trackInventory: true,
    isReturnEligible: demo.isReturnEligible,
    category: {
      id: demo.categorySlug,
      name: demo.categoryName,
      slug: demo.categorySlug,
      isActive: true,
    },
    store: {
      id: demo.storeId,
      name: demo.storeName,
      address: `${demo.storeCity}, Finland`,
      phone: "+358 40 123 4567",
      status: "ACTIVE",
    },
    images: [
      {
        id: `${demo.id}-img-1`,
        productId: demo.id,
        url: demo.imageUrl,
        altText: demo.imageAlt,
        isPrimary: true,
        sortOrder: 0,
      },
      {
        id: `${demo.id}-img-2`,
        productId: demo.id,
        url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
        altText: `${demo.name} close-up and details`,
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    variants: [
      {
        id: `${demo.id}-var-std`,
        productId: demo.id,
        size: "Standard",
        stockQuantity: 15,
        lowStockThreshold: 3,
        isActive: true,
      },
    ],
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
  };
}

/**
 * Resolves a product by either UUID or slug.
 * 1. Attempts direct backend lookup if UUID.
 * 2. Attempts catalog search if slug.
 * 3. Falls back to demonstration fixtures if live backend does not contain item.
 * 4. Returns null if product does not exist.
 */
export async function resolveProductBySlugOrId(
  slugOrId: string
): Promise<Product | null> {
  const normalized = slugOrId.trim();
  if (!normalized) return null;

  // 1. Direct UUID lookup in backend
  if (UUID_REGEX.test(normalized)) {
    try {
      const product = await productsApi.getProduct(normalized);
      if (product) return product;
    } catch {
      // Continue to check fallback or search
    }
  }

  // 2. Slug search in live backend marketplace
  try {
    const searchTerm = normalized.replace(/-/g, " ");
    const marketplaceRes = await productsApi.getMarketplace({
      search: searchTerm,
      limit: 20,
    });

    if (marketplaceRes.data && marketplaceRes.data.length > 0) {
      const matched = marketplaceRes.data.find(
        (p) =>
          p.slug.toLowerCase() === normalized.toLowerCase() ||
          p.id.toLowerCase() === normalized.toLowerCase() ||
          p.name.toLowerCase() === searchTerm.toLowerCase()
      );

      if (matched) {
        // Fetch full product details including all relations
        try {
          const fullProduct = await productsApi.getProduct(matched.id);
          return fullProduct;
        } catch {
          return matched;
        }
      }
    }

    // Secondary fallback: query catalog list to find exact slug match
    const catalogRes = await productsApi.getMarketplace({ limit: 100 });
    if (catalogRes.data && catalogRes.data.length > 0) {
      const matched = catalogRes.data.find(
        (p) =>
          p.slug.toLowerCase() === normalized.toLowerCase() ||
          p.id.toLowerCase() === normalized.toLowerCase()
      );

      if (matched) {
        try {
          const fullProduct = await productsApi.getProduct(matched.id);
          return fullProduct;
        } catch {
          return matched;
        }
      }
    }
  } catch (err) {
    console.warn("[product-resolver] Failed live backend lookup:", err);
  }

  // 3. Fallback to demonstration fixtures
  const LEGACY_SLUG_MAP: Record<string, string> = {
    "kasintehty-keraaminen-kahvikuppi": "demo-p1",
    "pellavainen-poytaliina": "demo-p2",
    "tammesta-veistetty-tarjoilualusta": "demo-p3",
    "villahuopa-luonnonvalkoinen": "demo-p4",
    "soijavahakynttila-metsa": "demo-p5",
    "kasin-taottu-hopeinen-sormus": "demo-p6",
    "minimalistinen-lasimaljakko": "demo-p7",
    "nahkainen-korttikotelo": "demo-p8",
  };

  const resolvedDemoId = LEGACY_SLUG_MAP[normalized.toLowerCase()];

  const demoMatched = DEMO_FEATURED_PRODUCTS.find(
    (d) =>
      d.slug.toLowerCase() === normalized.toLowerCase() ||
      d.id.toLowerCase() === normalized.toLowerCase() ||
      (resolvedDemoId && d.id === resolvedDemoId)
  );

  if (demoMatched) {
    return mapDemoItemToProduct(demoMatched);
  }

  return null;
}
