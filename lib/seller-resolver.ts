import { productsApi } from "@/resources/apis/products.api";
import { storesApi } from "@/resources/apis/stores.api";
import type { Store } from "@/resources/interfaces/store.interface";
import type { Product } from "@/resources/interfaces/product.interface";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Resolves a store / seller by UUID, store ID, or name slug from the live backend.
 * Returns null if not found.
 */
export async function resolveStoreBySlugOrId(
  slugOrId: string
): Promise<Store | null> {
  const normalized = slugOrId.trim();
  if (!normalized) return null;

  // 1. Direct call to live backend /marketplace/stores/:id endpoint
  try {
    const liveStore = await storesApi.getStore(normalized);
    if (liveStore) {
      return liveStore;
    }
  } catch {
    // Continue to next check
  }

  // 2. Direct UUID lookup in backend products to retrieve real store entity
  if (UUID_REGEX.test(normalized)) {
    try {
      const res = await productsApi.getMarketplace({
        storeId: normalized,
        limit: 1,
      });

      if (res.data && res.data.length > 0 && res.data[0].store) {
        return res.data[0].store as Store;
      }
    } catch {
      // Continue to next check
    }
  }

  // 3. Query live marketplace products to match store slug or name
  try {
    const marketplaceRes = await productsApi.getMarketplace({ limit: 100 });
    if (marketplaceRes.data && marketplaceRes.data.length > 0) {
      for (const prod of marketplaceRes.data) {
        if (!prod.store) continue;
        const s = prod.store as Store;
        const storeSlug = slugify(s.name);
        if (
          s.id.toLowerCase() === normalized.toLowerCase() ||
          storeSlug === normalized.toLowerCase()
        ) {
          return s;
        }
      }
    }
  } catch (err) {
    console.warn("[seller-resolver] Failed live backend store query:", err);
  }

  return null;
}

export interface StoreProductsFilterOptions {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
  page?: number;
  limit?: number;
}

export interface StoreProductsResult {
  products: Product[];
  total: number;
  categories: { id: string; name: string; count: number }[];
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Retrieves and filters products belonging to a specific store from the live backend.
 */
export async function getStoreProducts(
  storeId: string,
  options: StoreProductsFilterOptions = {}
): Promise<StoreProductsResult> {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    inStockOnly,
    sort = "newest",
    page = 1,
    limit = 12,
  } = options;

  let allProducts: Product[] = [];

  // 1. Fetch from live backend
  try {
    const res = await productsApi.getMarketplace({
      storeId,
      limit: 100,
    });

    if (res.data && res.data.length > 0) {
      allProducts = res.data;
    }
  } catch (err) {
    console.warn("[seller-resolver] Live backend store products error:", err);
  }

  // Extract all categories available in this store's inventory
  const categoryCountMap = new Map<string, { id: string; name: string; count: number }>();
  for (const prod of allProducts) {
    if (prod.category?.id && prod.category?.name) {
      const catId = prod.category.id;
      const existing = categoryCountMap.get(catId);
      if (existing) {
        existing.count += 1;
      } else {
        categoryCountMap.set(catId, {
          id: catId,
          name: prod.category.name,
          count: 1,
        });
      }
    }
  }
  const categories = Array.from(categoryCountMap.values());

  // Apply filters
  let filtered = [...allProducts];

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (category && category !== "all") {
    filtered = filtered.filter(
      (p) =>
        p.category?.slug?.toLowerCase() === category.toLowerCase() ||
        p.category?.id?.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice !== undefined && !isNaN(minPrice)) {
    filtered = filtered.filter((p) => {
      const priceNum = typeof p.price === "number" ? p.price : parseFloat(p.price);
      return priceNum >= minPrice;
    });
  }

  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    filtered = filtered.filter((p) => {
      const priceNum = typeof p.price === "number" ? p.price : parseFloat(p.price);
      return priceNum <= maxPrice;
    });
  }

  if (inStockOnly) {
    filtered = filtered.filter((p) => {
      if (!p.variants || p.variants.length === 0) return true;
      return p.variants.some((v) => v.stockQuantity > 0);
    });
  }

  // Apply sorting
  filtered.sort((a, b) => {
    const priceA = typeof a.price === "number" ? a.price : parseFloat(a.price) || 0;
    const priceB = typeof b.price === "number" ? b.price : parseFloat(b.price) || 0;

    switch (sort) {
      case "price_asc":
        return priceA - priceB;
      case "price_desc":
        return priceB - priceA;
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "newest":
      default:
        return (
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
    }
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    products: paginated,
    total,
    categories,
    page,
    limit,
    totalPages,
  };
}
