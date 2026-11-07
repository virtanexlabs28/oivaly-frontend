# Phase 3: Homepage Implementation Architecture

## Overview
Phase 3 implements the complete, responsive homepage for **Oivaly** (`http://localhost:4242`). The design realizes an original Scandinavian e-commerce atmosphere: warm off-white surfaces (`#FAF9F6`), soft sage accents (`#78947B`, `#536F57`, `#E7EFE5`), restrained borders, editorial typography (Geist Sans), and artisan-focused merchandising.

---

## Architecture & Section Inventory

```
components/
├── home/
│   ├── home-hero.tsx              # Asymmetric editorial hero with lifestyle artisan visual
│   ├── category-discovery.tsx     # 6 visual category tiles with photography & hover states
│   ├── featured-products.tsx      # Curated product grid & FeaturedProductsSkeleton fallback
│   ├── curated-collections.tsx    # 3 large editorial lifestyle tiles
│   ├── featured-sellers.tsx       # Meet the Makers artisan studio cards
│   ├── marketplace-benefits.tsx   # Verified Finnish e-commerce trust standards
│   ├── story-highlight.tsx        # Nordic craft community story & philosophy
│   └── index.ts                   # Centralized barrel export
├── product/
│   └── product-card.tsx           # Reusable marketplace product card
fixtures/
└── marketplace-demo.ts            # Strongly typed presentation demonstration fixtures
resources/
└── apis/
    ├── products.api.ts            # Public marketplace API client (/marketplace)
    ├── categories.api.ts          # Public categories API client (/categories)
    └── client.ts                  # Fetch API wrapper with revalidation support
```

### 1. Hero Section (`HomeHero`)
- **Headline**: *"Löydä jotain ihastuttavan erilaista."*
- **Eyebrow**: *"AJATUKSELLA VALITTUA"* with subtle spark icon.
- **CTAs**: Primary *"Tutustu valikoimaan"* (`/categories`), Secondary *"Tutustu tekijöihin"* (`#makers`).
- **Visual**: High-resolution Scandinavian interior with floating artisan attribution card (*Kupittaa Keramiikka • Turku*).
- **LCP Optimization**: Image loaded with `priority` attribute.

### 2. Category Discovery (`CategoryDiscovery`)
- 6 visual editorial tiles:
  1. Koti & Sisustus (`/categories/home-living`)
  2. Korut & Asusteet (`/categories/jewelry-accessories`)
  3. Vaatteet & Kengät (`/categories/clothing-shoes`)
  4. Taide & Keramiikka (`/categories/art-ceramics`)
  5. Käsityöt & Tarvikkeet (`/categories/craft-supplies`)
  6. Lahjat & Sesonki (`/categories/gifts-seasonal`)

### 3. Product Merchandising Grid (`FeaturedProducts`)
- **Shared Card (`ProductCard`)**:
  - Consistent square aspect ratio (`aspect-square`).
  - Formatted price in EUR with Finnish spacing (`formatFinnishCurrency`).
  - Store and city attribution (*Nordic Artisan Bakery • Helsinki*, etc.).
  - VAT indication (*sis. ALV*).
  - Wishlist heart action button.
- **Data Streaming & Resilience**:
  - Live products fetched server-side from backend `GET /marketplace`.
  - Streamed via `<React.Suspense fallback={<FeaturedProductsSkeleton />}>`.
  - Enriched with demonstration fixtures when catalog count is small.

### 4. Curated Collections (`CuratedCollections`)
- 3 large editorial lifestyle tiles:
  1. *Pohjoismainen keittiö & kattaus* (Nordic Dining & Kitchen)
  2. *Lämpöä & luonnonmateriaaleja* (Warmth & Natural Living)
  3. *Käsityöläisen työpöytä* (Studio Craft & Pottery)

### 5. Meet the Makers (`FeaturedSellers`)
- 4 artisan cards with studio banner, circular avatar, city attribution, craft specialty, bio, and link to store storefront.

### 6. Marketplace Benefits & Trust (`MarketplaceBenefits`)
- Compact trust section reflecting Finnish e-commerce standards:
  - *Suoraan tekijältä* (Direct maker support)
  - *Läpinäkyvät tuotetiedot* (Transparent materials & tax)
  - *Turvalliset maksutavat* (Secure European payment checkout)
  - *14 päivän palautusoikeus* (Statutory 14-day Finnish return rights)

### 7. Nordic Craft Philosophy (`StoryHighlight`)
- Authentic story section inviting shoppers to learn about artisan workshops across Finland, without fake newsletter forms.

---

## Verification Summary
- **TypeScript**: `bunx tsc --noEmit` exited with code `0`.
- **Next.js Production Build**: `bun run build` exited with code `0` (prerendered all routes with 1m ISR revalidation).
- **ESLint**: 0 errors and 0 warnings in all Phase 3 code.
- **Visual Inspection via Browser Subagent**: Verified all 7 sections, responsive mobile stacking (375x812), zero horizontal overflow, and accessible touch targets.
