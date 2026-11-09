import { productsApi } from "@/resources/apis/products.api";
import type { Product } from "@/resources/interfaces/product.interface";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Resolves a product by either UUID or slug from the live backend.
 * Returns null if product does not exist in the database.
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
      // Continue to check slug search
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

  return null;
}
