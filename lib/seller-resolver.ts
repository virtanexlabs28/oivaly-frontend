import { productsApi } from "@/resources/apis/products.api";
import { storesApi } from "@/resources/apis/stores.api";
import type { Store, StoreStatus } from "@/resources/interfaces/store.interface";
import type { Product } from "@/resources/interfaces/product.interface";
import {
  DEMO_FEATURED_SELLERS,
  DEMO_FEATURED_PRODUCTS,
  type DemoSellerItem,
  type DemoProductItem,
} from "@/fixtures/marketplace-demo";

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

function mapDemoSellerToStore(demo: DemoSellerItem): Store {
  return {
    id: demo.id,
    name: demo.name,
    legalBusinessName: `${demo.name} Oy`,
    businessId: "2893412-1",
    vatId: "FI28934121",
    address: `${demo.city}, Finland`,
    phone: "+358 40 123 4567",
    contactName: demo.name,
    status: "ACTIVE" as StoreStatus,
    description: demo.description,
    logoUrl: demo.avatarUrl,
    bannerUrl: demo.bannerUrl,
    websiteUrl: null,
    currency: "EUR",
    timezone: "Europe/Helsinki",
    sellerAgreementAccepted: true,
    createdAt: `${demo.joinedYear}-02-15T09:00:00.000Z`,
    updatedAt: `${demo.joinedYear}-10-01T12:00:00.000Z`,
  };
}

function mapDemoProductItemToProduct(demo: DemoProductItem): Product {
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
        altText: `${demo.name} studio detail`,
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

// Additional demo stores derived from demo products that aren't in DEMO_FEATURED_SELLERS
const EXTRA_DEMO_SELLERS: Record<string, DemoSellerItem> = {
  "store-aura-botanical": {
    id: "store-aura-botanical",
    name: "Aura Botanical",
    city: "Naantali",
    region: "Southwest Finland",
    specialty: "Hand-poured natural soy candles & wild botanical scents",
    description: "Capturing the serene scents of the Finnish archipelago and northern pine forests through clean, natural plant waxes and pure essential oils.",
    itemCount: 12,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop",
    joinedYear: 2024,
  },
  "store-kallio-silver": {
    id: "store-kallio-silver",
    name: "Kallio Silversmiths",
    city: "Helsinki",
    region: "Uusimaa",
    specialty: "Recycled sterling silver & minimalist jewelry",
    description: "Hand-forged jewelry handcrafted in the heart of Kallio, Helsinki. Each piece explores organic textures and Scandinavian architectural minimalism.",
    itemCount: 16,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    joinedYear: 2023,
  },
  "store-nuutajarvi": {
    id: "store-nuutajarvi",
    name: "Nuutajärvi Glassworks",
    city: "Urjala",
    region: "Pirkanmaa",
    specialty: "Mouth-blown art glass & studio glassware",
    description: "Preserving Finland's historic glassblowing heritage with modern silhouettes and nuanced natural color palettes inspired by Finnish lakes.",
    itemCount: 9,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=800&auto=format&fit=crop",
    joinedYear: 2022,
  },
  "store-saimaa-leather": {
    id: "store-saimaa-leather",
    name: "Saimaa Leather Works",
    city: "Savonlinna",
    region: "South Savo",
    specialty: "Vegetable-tanned leather goods",
    description: "Durable everyday goods handcrafted from premium vegetable-tanned Scandinavian leather. Built to patina beautifully with age.",
    itemCount: 14,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
    joinedYear: 2024,
  },
};

/**
 * Resolves a store / seller by UUID, store ID, or name slug.
 * 1. Checks live backend if UUID.
 * 2. Checks live backend marketplace catalog for matching store slug.
 * 3. Falls back to demonstration fixtures.
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

  // 2. Query live marketplace products to match store slug or name
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

  // 3. Match against demonstration sellers
  const allDemoSellers = [
    ...DEMO_FEATURED_SELLERS,
    ...Object.values(EXTRA_DEMO_SELLERS),
  ];

  const matchedDemo = allDemoSellers.find((demo) => {
    const demoSlug = slugify(demo.name);
    return (
      demo.id.toLowerCase() === normalized.toLowerCase() ||
      demoSlug === normalized.toLowerCase() ||
      demo.id.replace("store-", "").toLowerCase() === normalized.toLowerCase()
    );
  });

  if (matchedDemo) {
    return mapDemoSellerToStore(matchedDemo);
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
 * Retrieves and filters products belonging to a specific store.
 * Reuses live backend marketplace endpoint with storeId scoping,
 * and falls back to demonstration fixtures for demo stores.
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

  // 1. Attempt to fetch from live backend
  try {
    const res = await productsApi.getMarketplace({
      storeId,
      limit: 100, // Fetch up to 100 to allow rich client/server filtering & categorization
    });

    if (res.data && res.data.length > 0) {
      allProducts = res.data;
    }
  } catch (err) {
    console.warn("[seller-resolver] Live backend store products error:", err);
  }

  // 2. If no products from backend, check demo fixtures
  if (allProducts.length === 0) {
    const matchingDemo = DEMO_FEATURED_PRODUCTS.filter(
      (p) => p.storeId.toLowerCase() === storeId.toLowerCase()
    );

    if (matchingDemo.length > 0) {
      allProducts = matchingDemo.map(mapDemoProductItemToProduct);
    }
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
