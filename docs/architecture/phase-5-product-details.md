# Phase 5: Product Details Page (PDP) Architecture

## 1. Overview & Objective
Phase 5 implements the complete, responsive product details experience for **Oivaly** (`http://localhost:4242`). The design realizes an original Scandinavian e-commerce atmosphere: warm off-white surfaces (`#FAF9F6`), soft sage accents (`#78947B`, `#536F57`, `#E7EFE5`), charcoal typography (`#292E29`), restrained borders, generous whitespace, and artisan-focused merchandising.

The PDP provides:
- **Product Route (`/products/[slug]`)**: Resolves products by either UUID or slug, supporting both live backend inventory and demonstration fixtures.
- **Product Image Gallery**: Stable aspect ratio, Next.js Image priority optimization, thumbnail strip, and accessible lightbox zoom dialog.
- **Title, Pricing & VAT**: Accurate EUR formatting (`formatFinnishCurrency`), Finnish VAT breakdown (`sis. ALV` / `+ ALV`), and store attribution.
- **Variant Selection**: Interactive variant switching (size, color, model) with live pricing updates and real-time inventory limits.
- **Quantity Selector**: Plus/minus controls bound to stock limits.
- **Add-to-Cart & Wishlist**: Integrated purchase controls with loading states, stock validation, and Sonner toast notifications.
- **Delivery & Trust Card**: Standard Finnish delivery window (2–4 arkipäivää), 14-day statutory return policy under the Finnish Consumer Protection Act, and buyer protection.
- **Product Information Tabs**: Accessible shadcn `Tabs` for Description, Specifications (SKU, VAT rate, return eligibility), Maker information (Y-tunnus, address, storefront link), and Shipping & Returns.
- **Customer Reviews**: Direct integration with the backend verified reviews API (`GET /marketplace/products/:id/reviews`) with star rating distribution (5★ to 1★) and verified purchaser badges.
- **Related Products**: Merchandising grid reusing the Phase 3 `ProductCard`.
- **Custom 404 Not-Found Page**: Dedicated Scandinavian error page (`app/not-found.tsx`) with recovery navigation.

---

## 2. Component Inventory & Architecture

```
app/
├── not-found.tsx                             # Custom 404 page with recovery navigation
└── products/
    └── [slug]/
        └── page.tsx                          # Dynamic product details route (PPR)

components/
└── product/
    ├── product-card.tsx                      # Reusable marketplace card (reused from Phase 3)
    ├── product-details-skeleton.tsx          # Shimmer skeleton for streaming loading
    ├── product-details-view.tsx              # Main PDP layout container (2-column desktop)
    ├── product-delivery-info.tsx             # Delivery, returns, and buyer protection card
    ├── product-gallery.tsx                   # Image gallery with lightbox zoom & thumbnails
    ├── product-purchase-actions.tsx          # Add to Cart, wishlist, and stock validation
    ├── product-reviews.tsx                   # Verified customer reviews & rating distribution
    ├── product-tabs.tsx                      # Description, specs, seller info, and delivery tabs
    ├── product-variants.tsx                  # Interactive variant options selector
    ├── quantity-selector.tsx                 # Quantity stepper bound to stock
    └── related-products.tsx                  # Merchandising grid for related products

lib/
└── product-resolver.ts                       # Dual UUID/slug resolver with demo fallback

resources/
├── apis/
│   ├── cart.api.ts                           # Customer shopping cart API client
│   ├── products.api.ts                       # Marketplace products API client
│   └── reviews.api.ts                        # Public verified reviews API client
└── interfaces/
    ├── cart.interface.ts                     # Cart and CartItem domain types
    └── review.interface.ts                   # ProductReview and ProductReviewSummary types
```

---

## 3. Real Backend API Integration

The Product Details Page integrates directly with the NestJS backend:

| Endpoint | Method | Purpose | Response Structure | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/marketplace/:id` | `GET` | Single published product detail | Full product object with store, variants, images | **Active & Integrated** |
| `/marketplace/products/:productId/reviews` | `GET` | Public verified customer reviews | `{ averageRating, totalReviews, distribution, reviews }` | **Active & Integrated** |
| `/customer/cart/items` | `POST` | Add item to customer cart | `{ productId, variantId, quantity }` | **Active & Integrated** |
| `/marketplace` | `GET` | Related products & slug discovery | `{ data: Product[], total, page, limit }` | **Active & Integrated** |

---

## 4. Variant Selection & Inventory Logic

1. **Variant Attribute Dimensions**:
   - Analyzes available dimensions (`size`, `color`, `model`, `attributeKey`/`attributeValue`).
   - Displays clear option pills with accessible radio semantics (`role="radiogroup"`).
2. **Dynamic Price Updates**:
   - If a selected variant defines an override price (`variant.price`), the main price display immediately reflects the variant price formatted in EUR.
3. **Inventory Bounds**:
   - Real-time stock display (`Varastossa 99 kpl`).
   - If stock is `0`, disables variant selection and marks as *"Loppu"*.
   - Quantity selector limits upper bound to `Math.min(stockQuantity, 99)`.

---

## 5. Verification Results

- **TypeScript Compilation (`bunx tsc --noEmit`)**: Code `0` (0 errors).
- **ESLint (`bun run lint`)**: 0 errors/warnings on all Phase 1–5 application code.
- **Production Build (`bun run build`)**: Code `0` (Next.js 16.4.0 Turbopack).
  - `○ /` (Static 1m ISR)
  - `○ /_not-found` (Static)
  - `○ /categories` (Static 1m ISR)
  - `◐ /categories/[slug]` (Partial Prerendering with dynamic streaming)
  - `◐ /products/[slug]` (Partial Prerendering with dynamic streaming)
  - `◐ /search` (Partial Prerendering with dynamic streaming)
- **Browser Subagent Testing (`browser_subagent`)**:
  - Verified desktop live product (`/products/wireless-bluetooth-headphones`) at 1280x800: EUR price `99,99 €` (or variant price), VAT detail, variants, stock, delivery card, tabs, reviews, related products, and toast feedback.
  - Verified multi-image artisan product (`/products/kasintehty-keraaminen-kahvikuppi`) with thumbnail strip and lightbox dialog zoom.
  - Verified custom 404 page on missing products (`/products/non-existent-item-999`).
  - Verified mobile responsive layout at 375x812 with clean vertical stacking and zero horizontal overflow.
