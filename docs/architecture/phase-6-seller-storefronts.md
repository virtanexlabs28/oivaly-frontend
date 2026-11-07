# Phase 6: Seller Storefronts Architecture

## 1. Overview & Objective
Phase 6 establishes complete, responsive seller storefront pages for **Oivaly** (`http://localhost:4242/shops/[slug]`). The design realizes an original Scandinavian e-commerce atmosphere: warm off-white surfaces (`#FAF9F6`), soft sage accents (`#78947B`, `#536F57`, `#E7EFE5`), charcoal typography (`#292E29`), generous whitespace, and an artisan-first presentation.

The Seller Storefront experience includes:
- **Canonical Seller Route (`/shops/[slug]`)**: Resolves stores by UUID, store ID, or name slug. Supports both live backend merchant entities (`Store`) and demonstration fixtures.
- **Compatibility Redirect (`/stores/[slug]` -> `/shops/[slug]`)**: Automatically redirects legacy `/stores/*` links to the canonical `/shops/*` route via Next.js configuration.
- **Shop Banner & Identity (`components/shops/shop-header.tsx`)**: Wide studio banner with responsive aspect ratio, graceful design-token fallback for merchants without uploaded banners, floating avatar/initials badge, verified merchant trust indicator, public location, joined date, and active listings count.
- **Shop Bookmarking ("Save Shop")**: Persistent favorite-shop toggle backed by `localStorage` and `useSyncExternalStore` with real-time UI synchronization and toast notifications.
- **Sub-Navigation Bar (`components/shops/shop-navigation.tsx`)**: Sticky, lightweight navigation with anchor destinations: Products (with listings count), About Maker, Shop Policies, and Customer Reviews.
- **Storefront Discovery & Filtering (`components/shops/shop-filters.tsx`)**: In-shop full-text search, dynamic category selector computed from the seller's active catalog, price range filtering (min/max), in-stock toggle, and 4-way sorting (Newest, Price low to high, Price high to low, Name A–Z), synchronized with URL parameters.
- **Scoped Product Grid (`components/shops/shop-product-grid.tsx`)**: Responsive 4-column product grid reusing the Phase 3 `ProductCard` component, scoped strictly to the selected merchant, with page-based pagination controls.
- **Friendly Empty States (`components/shops/shop-empty-state.tsx`)**: Clear distinction between an empty inventory and a filter combination returning 0 matches.
- **About the Maker (`components/shops/shop-about.tsx`)**: Public studio biography, direct artisan connection explanation, and verified commercial details (Legal Business Name, Finnish Business ID / Y-tunnus, VAT ID, studio address, customer support phone, and official website).
- **Shop & Consumer Policies (`components/shops/shop-policies.tsx`)**: Transparent disclosures distinguishing statutory consumer rights (14-day statutory return under Finnish Kuluttajansuojalaki), studio dispatch timelines, and Oivaly Buyer Protection.
- **Customer Reviews (`components/shops/shop-reviews.tsx`)**: Genuine rating breakdown when available, and a reassuring empty state with buyer protection guarantees when reviews are pending.
- **Loading & Error States (`app/shops/[slug]/loading.tsx`)**: Streaming skeleton matching banner, profile, filter bar, and product card dimensions. Respectful unavailable notice for suspended or rejected accounts.

---

## 2. Component Inventory & Architecture

```
app/
└── shops/
    └── [slug]/
        ├── loading.tsx                        # Streaming skeleton placeholder
        └── page.tsx                           # Dynamic seller storefront route (PPR)

components/
├── product/
│   └── product-card.tsx                       # Reusable product card (reused from Phase 3)
└── shops/
    ├── shop-about.tsx                         # Maker biography and verified business details
    ├── shop-empty-state.tsx                   # Inventory & filter empty states
    ├── shop-filters.tsx                       # Seller-scoped search, category, price, and sorting
    ├── shop-header.tsx                        # Studio banner, avatar, title, badges, and bookmarking
    ├── shop-navigation.tsx                    # Sticky sub-navigation bar
    ├── shop-policies.tsx                      # 14-day statutory returns, dispatch, and buyer protection
    ├── shop-product-grid.tsx                  # Seller product grid with pagination
    └── shop-reviews.tsx                       # Verified seller feedback breakdown & empty state

lib/
├── finland.ts                                # Currency (€) and business ID / VAT formatting
└── seller-resolver.ts                        # Store and product resolution with backend integration

resources/
├── apis/
│   ├── products.api.ts                       # Marketplace products API client
│   └── stores.api.ts                         # Stores API client & contract documentation
└── interfaces/
    └── store.interface.ts                    # Store and StoreSummary domain interfaces
```

---

## 3. Real Backend API Integration

The seller storefront integrates directly with the live NestJS backend (`http://localhost:4040`):

| Endpoint | Method | Purpose | Response Structure | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/marketplace?storeId=:id` | `GET` | Fetches published products for a specific store | `{ data: Product[], total, page, limit }` | **Active & Integrated** |
| `/marketplace` | `GET` | Catalog discovery with store hydration (`p.store`) | Products with attached `Store` entity relations | **Active & Integrated** |
| `/marketplace/stores/:id` | `GET` | Direct public store profile endpoint | Returns `Store` entity | *Documented in `stores.api.ts`* |

---

## 4. Verification & Testing

- **TypeScript Verification**: `bunx tsc --noEmit` exited with code 0 (zero errors).
- **Linter Verification**: `bun run lint` exited with code 0 (zero errors, zero warnings).
- **Production Build**: `bun run build` exited with code 0. Route `/shops/[slug]` compiled as Partial Prerendered (`◐`).
- **Live Browser Verification**:
  - Direct navigation from homepage "Visit Studio" to `/shops/store-kupittaa`.
  - Live backend store tested at `/shops/6d438f72-94f3-4e76-8806-cf248ad54340` (Nordic Artisan Bakery with live database records: Legal Name `Nordic Bakery Oy`, Business ID `1234567-8`, Address `Aleksanterinkatu 15, 00100 Helsinki, Finland`, and live product `Wireless Bluetooth Headphones`).
  - Interactive "Save Shop" button tested with local storage persistence and Sonner toast.
  - In-shop filter and search tested with active filter chips.
  - Policy accordions tested and responsive layout verified.
