# Phase 4: Product Discovery & Search Architecture

## 1. Overview & Objective
Phase 4 implements the complete product discovery, catalog browsing, and search experience for **Oivaly** (`http://localhost:4242`). The solution seamlessly connects the frontend with the active backend (`http://localhost:4040`) while strictly respecting the Scandinavian Sage and Warm Off-White design tokens established in Phase 1.

The discovery experience delivers:
- **Search Results (`/search?q=...`)**: Full-text keyword querying against backend product titles and descriptions.
- **Category Browsing (`/categories/[slug]`)**: Dedicated department landing pages with category header, breadcrumbs, and pre-filtered catalog.
- **All Categories Directory (`/categories`)**: Visual department directory with editorial photography and descriptions.
- **Faceted Filtering**: Desktop sidebar and mobile `Sheet` drawer supporting categories, EUR price bounds with instant validation, and an in-stock availability toggle.
- **Active Filter Management**: Removable badge chips and clear-all action.
- **URL Synchronization**: Shareable, bookmarkable search and filter state via Next.js navigation.
- **Deterministic Pagination**: Page-based navigation respecting backend `total` and `limit`.
- **Loading, Empty & Error States**: Zero-layout-shift skeletons, helpful empty results with recovery actions, and resilient error handling.

---

## 2. Component Inventory & Architecture

```
app/
├── categories/
│   ├── page.tsx                           # All categories directory route (ISR 1m)
│   └── [slug]/
│       └── page.tsx                       # Category catalog browsing route (PPR)
└── search/
    └── page.tsx                           # Unified search & discovery route (PPR)

components/
└── catalog/
    ├── active-filters.tsx                 # Removable filter chips & clear-all button
    ├── catalog-empty-state.tsx            # Friendly empty results with suggestions
    ├── catalog-error-state.tsx            # Graceful error banner with retry option
    ├── catalog-header.tsx                 # Breadcrumbs, title, result count & sort
    ├── catalog-pagination.tsx             # Accessible pagination preserving URL state
    ├── catalog-product-grid.tsx           # Responsive product grid using ProductCard
    ├── catalog-skeleton.tsx               # Shimmer skeleton for streaming loading
    ├── catalog-view.tsx                   # Unified catalog layout container
    ├── categories-directory.tsx           # Category index grid client component
    ├── filter-mobile-drawer.tsx           # Accessible mobile Sheet drawer (<lg screens)
    └── filter-sidebar.tsx                 # Desktop filter controls & EUR inputs

lib/
├── categories.ts                          # Platform categories & backend UUID resolver
└── search-url.ts                          # Clean URL search query serialization

resources/
├── apis/
│   ├── categories.api.ts                  # Added ISR revalidation (next: { revalidate: 60 })
│   └── products.api.ts                    # Marketplace product querying
├── interfaces/
│   └── product.interface.ts               # Added inStockOnly?: boolean to filter params
└── schemas/
    └── search.schema.ts                   # Zod validation for price bounds and pagination
```

---

## 3. Real Backend Integration (`GET /marketplace`)

The search and discovery pages integrate directly with the NestJS backend:

| Filter Parameter | Backend DTO Field | Implementation Behavior |
| :--- | :--- | :--- |
| `q` | `search` | Matches against `(p.name ILIKE :s OR p.description ILIKE :s)` |
| `category` | `categoryId` | Resolves slug to backend UUID via `resolveBackendCategoryId()`. If category is provisional (not yet in DB), safely queries without crashing. |
| `minPrice` | `minPrice` | Filters `p.price >= :minPrice` (numeric, min 0 €) |
| `maxPrice` | `maxPrice` | Filters `p.price <= :maxPrice` (numeric, min 0 €) |
| `inStockOnly` | `inStockOnly` | Filters `EXISTS (SELECT 1 FROM product_variants pv WHERE pv."stockQuantity" > 0)` |
| `page` | `page` | 1-indexed pagination (default 1) |
| `limit` | `limit` | Items per page (default 12) |

### Missing Backend Capabilities Identified
1. **Dynamic Sorting (`sort`)**:
   - *Current Backend Behavior*: Hardcoded to `p.createdAt DESC` (Newest first).
   - *Frontend Adaptation*: Sorting dropdown defaults to "Uusimmat ensin (Newest first)" and preserves URL state.
   - *Required Contract*: Backend `MarketplaceQueryDto` should add `sort?: 'newest' | 'price_asc' | 'price_desc'`.
2. **Category Hierarchy in Database**:
   - *Current Backend Data*: Only `Electronics` (`9e376613-cbea-40b1-a4d9-c392fdcdc61b`) exists in PostgreSQL.
   - *Frontend Adaptation*: `lib/categories.ts` unifies backend categories with the navigation categories (`Koti & Sisustus`, `Korut & Asusteet`, etc.) so the discovery interface displays both seamlessly.

---

## 4. URL State Synchronization

Every search interaction is reflected in the URL query string:
- Example: `/search?q=wireless&minPrice=50&maxPrice=150&inStockOnly=true`
- Clean URLs: Default values (`page=1`, empty strings, undefined bounds) are omitted to prevent URL clutter.
- Changing any filter or search term automatically resets `page` to `1`.
- Browser **Back** and **Forward** buttons navigate through search history without hydration mismatches.
- Individual filter removal (e.g. clicking `✕` on `Hinta: 50 € – 150 €`) strips only the price parameters and updates the URL.

---

## 5. Mobile & Responsive Layout

- **375px & 430px Mobile**:
  - Filter sidebar collapses into a prominent **"Suodattimet"** button with active filter count badge.
  - Tapping opens an accessible shadcn `Sheet` drawer containing category selectors, EUR price inputs, price presets (*Alle 25 €*, *25–50 €*, *50–100 €*, *Yli 100 €*), and an availability switch.
  - Product grid renders in clean 2-column layout (`grid-cols-2 gap-3`) without horizontal overflow.
- **1024px+ Desktop**:
  - Balanced 4-column layout (`grid grid-cols-1 lg:grid-cols-4 gap-8`).
  - Left column: sticky desktop `FilterSidebar`.
  - Right column: catalog header, active filter tags, 3-column product grid, and pagination.

---

## 6. Verification Results

- **TypeScript Compilation (`bunx tsc --noEmit`)**: Code `0` (0 errors).
- **ESLint (`bun run lint`)**: 0 errors/warnings on all Phase 1–4 application code.
- **Production Build (`bun run build`)**: Code `0`.
  - `○ /` (Static 1m ISR)
  - `○ /categories` (Static 1m ISR)
  - `◐ /categories/[slug]` (Partial Prerendering with streaming)
  - `◐ /search` (Partial Prerendering with streaming)
- **Browser Testing (`browser_subagent`)**:
  - Verified desktop search catalog at 1280x800.
  - Verified search query filtering (`?q=wireless`).
  - Verified empty search state (`?q=ceramic`).
  - Verified category catalog browsing (`/categories/electronics`).
  - Verified categories directory (`/categories`).
  - Verified mobile responsive layout and Filter Sheet drawer at 375x812.
