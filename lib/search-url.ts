/**
 * Helper to produce clean, URL-synchronized query strings for marketplace catalog.
 * Omits empty, null, or default parameters and ensures proper encoding.
 */
export interface CatalogFilterState {
  q?: string;
  category?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  inStockOnly?: boolean | string;
  sort?: string;
  page?: number | string;
  limit?: number | string;
}

export function buildCatalogQueryString(
  params: CatalogFilterState,
  overrides: Partial<CatalogFilterState> = {}
): string {
  const merged: CatalogFilterState = { ...params, ...overrides };
  const searchParams = new URLSearchParams();

  // Search query (trimmed, non-empty)
  if (merged.q && typeof merged.q === 'string' && merged.q.trim()) {
    searchParams.set('q', merged.q.trim());
  }

  // Category (slug or id)
  if (merged.category && typeof merged.category === 'string' && merged.category.trim()) {
    searchParams.set('category', merged.category.trim());
  }

  // Min price (valid non-negative number)
  if (merged.minPrice !== undefined && merged.minPrice !== '' && merged.minPrice !== null) {
    const num = Number(merged.minPrice);
    if (!isNaN(num) && num >= 0) {
      searchParams.set('minPrice', num.toString());
    }
  }

  // Max price (valid non-negative number)
  if (merged.maxPrice !== undefined && merged.maxPrice !== '' && merged.maxPrice !== null) {
    const num = Number(merged.maxPrice);
    if (!isNaN(num) && num >= 0) {
      searchParams.set('maxPrice', num.toString());
    }
  }

  // In-stock flag
  if (merged.inStockOnly === true || merged.inStockOnly === 'true' || merged.inStockOnly === '1') {
    searchParams.set('inStockOnly', 'true');
  }

  // Sorting (omit default 'newest')
  if (merged.sort && merged.sort !== 'newest') {
    searchParams.set('sort', merged.sort);
  }

  // Pagination (omit default page 1)
  if (merged.page !== undefined && merged.page !== null) {
    const pageNum = Number(merged.page);
    if (!isNaN(pageNum) && pageNum > 1) {
      searchParams.set('page', pageNum.toString());
    }
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export function buildCatalogUrl(
  basePath: string,
  params: CatalogFilterState,
  overrides: Partial<CatalogFilterState> = {}
): string {
  const qs = buildCatalogQueryString(params, overrides);
  return `${basePath}${qs}`;
}
