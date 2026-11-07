# Phase 2: Global Layout & Navigation Architecture

## Overview
Phase 2 establishes the responsive application shell and global navigation for the Finnish Multi-Vendor Marketplace (**Oivaly**). The visual identity reflects Scandinavian editorial simplicity, high-trust commerce, and responsive usability across all viewports (from 320px mobile to 1440px desktop).

---

## Architecture & Component Breakdown

```
components/layout/
├── announcement-bar.tsx     # Slim, responsive, dismissible top banner
├── search-bar.tsx           # Accessible search form with URL navigation & Suspense boundary
├── category-navigation.tsx  # Desktop horizontal category navigation
├── account-menu.tsx         # shadcn DropdownMenu for guest & authenticated account access
├── mobile-navigation.tsx    # Accessible mobile Sheet drawer (categories, search, actions)
├── site-header.tsx          # Unified header composing top banner, search, actions & categories
├── site-footer.tsx          # Multi-column Nordic footer with trust pillars and localization
└── index.ts                 # Barrel export
```

### 1. Announcement Bar (`AnnouncementBar`)
- **Visual Design**: Subtle pale sage background (`bg-brand-pale-sage/75` / `dark:bg-secondary`) with deep forest text contrast (`text-brand-deep-forest`).
- **Configurable**: Configured via props or `config/navigation.ts`.
- **Dismissible**: Client-side dismiss with accessible `XIcon` button and `aria-label`.

### 2. Header & Search Bar (`SiteHeader` & `SearchBar`)
- **Brand Identity**: Clean typographical wordmark `"Oivaly"` with `"FINNISH MULTI-VENDOR"` subtitle.
- **Search Experience**:
  - Accessible `<form role="search">` with label, icon prefix, and submit button.
  - Submits to `/search?q=<query>` with trimmed, URI-encoded parameter.
  - Interactive clear button (`✕`) when query is present.
  - Wrapped in `<React.Suspense>` fallback to guarantee Next.js 16 Partial Prerendering and static generation compatibility.
- **Header Actions**:
  - `AccountMenu`: Radix DropdownMenu providing guest links (Sign in, Register, Sell with us, Help center) and ready for authenticated user session data.
  - `Wishlist`: Semantic link with `HeartIcon` and conditional item count badge.
  - `Cart`: Semantic link with `ShoppingBagIcon` and conditional item count badge.

### 3. Category Navigation (`CategoryNavigation`)
- **Desktop Bar**: Positioned directly beneath the primary header with subtle borders (`border-b border-border/70`).
- **Responsive Overflow**: Horizontal scroll (`overflow-x-auto scrollbar-none`) ensures that categories never wrap awkwardly on smaller desktop or tablet viewports.
- **Configurable Dataset**: Sourced from `config/navigation.ts` with Finnish titles, English translations, and planned `/categories/[slug]` routes.

### 4. Mobile Navigation Drawer (`MobileNavigation`)
- **Sheet Primitive**: Uses shadcn/ui `Sheet` (`side="left"`).
- **Navigation Structure**:
  - Embedded mobile search bar.
  - Touch-friendly category list (minimum 44px touch targets).
  - Quick action links (Cart, Wishlist, Become a seller).
  - Account links (Sign in, Register).
  - Localization bar (Finland 🇫🇮 / EUR €).

### 5. Global Footer (`SiteFooter`)
- **Trust Pillars**: Highlights Nordic quality, buyer protection, and small maker support.
- **Organized Columns**: Shopping, Customer Service, Sellers, Company & Legal.
- **Localization**: Displays Finnish market indicators (`Suomi • EUR (€) • fi / sv / en`).
- **Static Optimization**: Clean deterministic prerendering compatible with Next.js 16 cache component requirements.

---

## Route Inventory

| Route | Status | Notes |
|---|---|---|
| `/` | **Implemented** | Root home page with global shell layout |
| `/search?q=...` | **Proposed** | Form target; client-side navigation verified |
| `/categories/[slug]` | **Proposed** | Category links configured in `config/navigation.ts` |
| `/wishlist` | **Proposed** | Wishlist action destination |
| `/cart` | **Proposed** | Shopping cart action destination |
| `/login` | **Proposed** | Guest account dropdown destination |
| `/register` | **Proposed** | Guest account registration destination |
| `/sell` | **Proposed** | Seller onboarding landing link |
| `/help`, `/about`, `/privacy`, `/terms` | **Proposed** | Legal & customer service destinations |

---

## Verification Summary
- **TypeScript**: `bunx tsc --noEmit` exited with code `0`.
- **Next.js Production Build**: `bun run build` exited with code `0` (prerendered all routes).
- **ESLint**: 0 errors in Phase 2 files. (2 pre-existing errors in stock shadcn files `carousel.tsx` and `use-mobile.ts`).
- **Browser Subagent**: Verified visual appearance, responsive layout, search input, and mobile Sheet drawer on `http://localhost:4242`.
