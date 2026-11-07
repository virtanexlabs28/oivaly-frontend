import { categoriesApi } from '@/resources/apis/categories.api';
import { productsApi } from '@/resources/apis/products.api';
import { PROVISIONAL_CATEGORIES, type NavCategory } from '@/config/navigation';

export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isBackend: boolean;
  parentId?: string | null;
  productCount?: number;
}

const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  'home-living':
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop',
  'jewelry-accessories':
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
  'clothing-shoes':
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop',
  'art-ceramics':
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=600&auto=format&fit=crop',
  'craft-supplies':
    'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=600&auto=format&fit=crop',
  'gifts-seasonal':
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
  'vintage-collectibles':
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600&auto=format&fit=crop',
  'nordic-living':
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop',
  electronics:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
};

/**
 * Retrieves all platform categories directly from active backend categories API.
 * Dynamically resolves product count and authentic cover images from live marketplace items.
 */
export async function getMarketplaceCategories(): Promise<MarketplaceCategory[]> {
  const categories: MarketplaceCategory[] = [];

  // 1. Fetch real active categories and live products concurrently from backend API
  try {
    const [backendCategories, productsRes] = await Promise.all([
      categoriesApi.getCategories('ACTIVE'),
      productsApi.getMarketplace({ limit: 50 }).catch(() => null),
    ]);

    const liveProducts = productsRes?.data || [];

    if (Array.isArray(backendCategories) && backendCategories.length > 0) {
      backendCategories.forEach((cat) => {
        // Find matching live products in this category
        const matchingProducts = liveProducts.filter(
          (p) =>
            p.categoryId === cat.id ||
            p.category?.slug === cat.slug ||
            p.category?.id === cat.id
        );

        // Find primary image from live products if available
        const productWithImg = matchingProducts.find(
          (p) => p.images && p.images.length > 0 && p.images[0]?.url
        );

        const resolvedImageUrl =
          (cat as unknown as { imageUrl?: string }).imageUrl ||
          productWithImg?.images?.[0]?.url ||
          CATEGORY_DEFAULT_IMAGES[cat.slug] ||
          null;

        categories.push({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || null,
          imageUrl: resolvedImageUrl,
          isBackend: true,
          parentId: cat.parentId || null,
          productCount: matchingProducts.length,
        });
      });

      return categories;
    }
  } catch (err) {
    console.warn('[categories] Failed to fetch backend categories, using editorial fallback:', err);
  }

  // 2. Fallback only if backend categories API is completely unreachable
  PROVISIONAL_CATEGORIES.forEach((prov: NavCategory) => {
    categories.push({
      id: prov.slug,
      name: prov.title,
      slug: prov.slug,
      description: prov.description || null,
      imageUrl: CATEGORY_DEFAULT_IMAGES[prov.slug] || null,
      isBackend: false,
      parentId: null,
      productCount: 0,
    });
  });

  return categories;
}

/**
 * Finds a single marketplace category by its URL slug.
 */
export async function getCategoryBySlug(
  slug: string
): Promise<MarketplaceCategory | null> {
  const categories = await getMarketplaceCategories();
  return (
    categories.find(
      (c) => c.slug.toLowerCase() === slug.toLowerCase() || c.id === slug
    ) || null
  );
}

/**
 * Resolves whether a slug corresponds to an active backend category UUID.
 * Returns the UUID if backend-compatible, or undefined otherwise to prevent
 * sending invalid non-UUID strings to the backend API.
 */
export function resolveBackendCategoryId(
  slugOrId: string | undefined,
  categories: MarketplaceCategory[]
): string | undefined {
  if (!slugOrId) return undefined;

  const found = categories.find(
    (c) =>
      c.slug.toLowerCase() === slugOrId.toLowerCase() ||
      c.id.toLowerCase() === slugOrId.toLowerCase()
  );

  if (found && found.isBackend) {
    return found.id;
  }

  // Check if it's already a valid UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(slugOrId)) {
    return slugOrId;
  }

  return undefined;
}
