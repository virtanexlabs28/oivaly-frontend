# Phase 1: Repository Audit, Architecture Foundation & Scandinavian Design System

## A. Repository Audit Summary

### 1. Discovered Stack & Versions
- **Framework**: Next.js `16.4.0` (Canary/Latest 16.x) with App Router, Turbopack enabled (`next.config.ts`), Partial Prefetching (`ppr`), Cache Components, and `agentFeedback` experiment enabled.
- **Runtime & Package Manager**: Bun `1.3.14` (`bun.lock` lockfile). Dev server configured on port `4242` (`next dev -p 4242`).
- **Language**: TypeScript `5.x` (`ES2017` target, strict mode enabled, path alias `@/*`).
- **Core Library**: React `19.3.0` & React DOM `19.3.0`.
- **CSS Framework**: Tailwind CSS `v4` (`@tailwindcss/turbopack`, `@import "tailwindcss";`, `@import "shadcn/tailwind.css"`). CSS-first configuration via `@theme inline`.
- **Animation**: `tw-animate-css` (`^1.4.0`).
- **Iconography**: Phosphor Icons (`@phosphor-icons/react` `^2.1.10`) configured in `components.json`.
- **UI Components**: shadcn/ui (`radix-lyra` style with Radix UI primitives, `class-variance-authority`, `cn` utility). All 61 component files are installed in `@/components/ui`.
- **Validation**: Zod `4.6.5` installed.
- **Backend Architecture Reference**: NestJS backend (`d:\multi-tanent-store-backend`) with TypeORM, multi-tenant store models, customer auth, products, categories, orders, and addresses defaulting to `'FI'` and `'EUR'`.

### 2. Architectural Gaps & Findings
1. **React 19 Lint Incompatibilities in shadcn/ui**:
   - `components/ui/carousel.tsx:98:5`: `react-hooks/set-state-in-effect` (calling `setState` synchronously within effect).
   - `hooks/use-mobile.ts:14:5`: `react-hooks/set-state-in-effect` (initial window size sync in `useEffect`).
   - *Status*: Pre-existing in generated shadcn code with React 19 / ESLint 9 / Next 16.4 strict hooks rule. Preserved as-is to avoid modifying shadcn internals until Phase 2 component refinement.
2. **TanStack Query (@tanstack/react-query)**:
   - Not installed in `multi-tanent-frontend` (installed only in `plartform-pannel`).
   - *Status*: Documented gap. Intentionally not installed in Phase 1 per prompt boundary rules; will be introduced in Phase 2 alongside API data hooks.
3. **React Hook Form (@hookform/resolvers & react-hook-form)**:
   - Not installed in `multi-tanent-frontend`.
   - *Status*: Documented gap. Will be installed when interactive marketplace forms are created.
4. **Typography Setting in Original Setup**:
   - `app/globals.css` originally had `html { @apply font-mono; }` and `--font-heading: var(--font-mono);`, forcing monospace rendering globally.
   - *Status*: Corrected to `font-sans` with Geist Sans as the primary editorial typeface, reserving `font-mono` for IDs, tracking codes, and postal numbers.

---

## B. Scandinavian Design System

The visual design system is inspired by Finnish editorial design and Nordic simplicity: calm, trustworthy, spacious, and warm.

### 1. Color Tokens & Semantic Mapping
Colors are defined as CSS custom properties in `app/globals.css` and exposed to Tailwind CSS v4 via `@theme inline`:

| Semantic Token | Light Theme Value | Dark Theme Value | Purpose |
|---|---|---|---|
| `--background` | `#FAF9F6` (Warm Off-White) | `#181B18` (Nordic Night) | Page body surface |
| `--foreground` | `#292E29` (Charcoal) | `#EDECE7` (Warm Ivory) | Primary body copy |
| `--card` | `#FFFFFF` | `#202420` | Card background |
| `--card-foreground` | `#292E29` | `#EDECE7` | Card text |
| `--popover` | `#FFFFFF` | `#202420` | Dropdowns and modals |
| `--popover-foreground` | `#292E29` | `#EDECE7` | Popover text |
| `--primary` | `#536F57` (Deep Sage) | `#78947B` (Soft Sage) | Primary CTA, active states |
| `--primary-foreground` | `#FFFFFF` | `#121612` | Text on primary |
| `--secondary` | `#E7EFE5` (Pale Sage) | `#272E27` | Subtle buttons, pill badges |
| `--secondary-foreground` | `#354C38` (Deep Forest) | `#E7EFE5` | Text on secondary |
| `--muted` | `#F0F0EA` (Muted Warm) | `#252A25` | Section backgrounds, tabs |
| `--muted-foreground` | `#696E67` | `#989E96` | Subtitles, helper text |
| `--accent` | `#E7EFE5` | `#272E27` | Hover states |
| `--accent-foreground` | `#354C38` | `#E7EFE5` | Text on accent |
| `--destructive` | `#C24134` (Muted Red) | `#E05A4C` | Destructive alerts, errors |
| `--destructive-foreground` | `#FFFFFF` | `#FFFFFF` | Text on destructive |
| `--border` | `#E5E5DC` (Warm Border) | `#323A32` | Dividers, card borders |
| `--input` | `#DADCD3` | `#323A32` | Form input borders |
| `--ring` | `#78947B` (Sage Ring) | `#78947B` | Focus outline ring |

#### Dedicated Nordic Brand Tokens
- `--brand-sage`: `#78947B`
- `--brand-pale-sage`: `#E7EFE5`
- `--brand-deep-forest`: `#354C38`
- `--brand-warm-ivory`: `#FAF9F6`
- `--brand-soft-beige`: `#F0EDE4`
- `--brand-charcoal`: `#292E29`

### 2. Typography Scale
- **Sans-serif (Primary Body & Editorial Headings)**: `Geist Sans` (`var(--font-geist-sans)`).
- **Monospace (Codes, Barcodes, Postal Codes, Tracking)**: `Geist Mono` & `JetBrains Mono` (`var(--font-mono)`).
- **Scale Hierarchy**:
  - `Display / Hero`: `text-4xl` to `text-5xl`, `tracking-tight`, font-medium/semibold.
  - `Page Heading`: `text-2xl` to `text-3xl`, `tracking-tight`, font-medium.
  - `Section Heading`: `text-xl` to `text-2xl`, `tracking-tight`, font-medium.
  - `Card Title`: `text-sm` to `text-base`, `tracking-tight`, font-medium.
  - `Body Text`: `text-sm` to `text-base`, `leading-relaxed`, font-normal.
  - `Caption / Supporting`: `text-xs`, `text-muted-foreground`.
  - `Badges & Overlines`: `text-[11px]` to `text-xs`, uppercase, `tracking-wider`, font-medium.

### 3. Spacing, Borders & Motion
- **Radius**: Restrained Nordic radius `--radius: 0.375rem` (6px) with proportional scale (`sm: 4px`, `md: 6px`, `lg: 8px`). Avoids bubble-like or excessively rounded cards.
- **Borders**: Clean `1px solid var(--border)` without heavy dropshadows.
- **Elevation**: Flat surfaces with subtle borders; elevation used solely for floating popovers, dropdowns, and dialogs.
- **Motion**: Subtle 150ms-200ms transitions (`transition-colors`, `transition-opacity`). Respects `prefers-reduced-motion`.

---

## C. Centralized Resource Architecture

The `resources/` directory provides the architectural foundation for clean separation of concerns:

```
resources/
├── apis/          # Typed HTTP endpoints & fetch client
│   ├── client.ts  # Base API client wrapper around Fetch API
│   └── index.ts   # Re-exports
├── actions/       # Orchestration layer (UI actions, server actions)
│   └── index.ts   # Action handlers
├── interfaces/    # TypeScript domain types & DTOs
│   ├── api-response.interface.ts # Envelope & pagination metadata
│   ├── user.interface.ts         # User, profile, customer contracts
│   ├── store.interface.ts        # Seller/tenant store contracts
│   ├── product.interface.ts      # Product, variant, image, category
│   ├── address.interface.ts      # Customer shipping/billing address
│   ├── order.interface.ts        # Orders, items, order status
│   └── index.ts                  # Re-exports
└── schemas/       # Zod runtime validation schemas
    ├── finland.schema.ts         # Postal code, phone, Y-tunnus, VAT
    ├── address.schema.ts         # Customer address validation
    └── index.ts                  # Re-exports
```

### Resource Conventions
1. **API Client (`resources/apis/`)**:
   - Centralizes `apiClient<T>(endpoint, options)`.
   - Supports `NEXT_PUBLIC_API_URL` environment configuration.
   - Throws structured `ApiError` with status codes and backend error messages.
2. **Interfaces (`resources/interfaces/`)**:
   - Strict 1:1 alignment with backend models (`Store`, `Product`, `Order`, `CustomerAddress`, `User`).
   - Does not invent speculative properties or enums.
3. **Schemas (`resources/schemas/`)**:
   - Runtime validation with Zod.
   - Decoupled from generic UI controls so components remain reusable.

---

## D. Finland-Specific Architecture Foundation

Located in `lib/finland.ts` and `resources/schemas/finland.schema.ts`:
1. **Postal Code (Postinumero)**:
   - Validates 5-digit format (`^\d{5}$`).
2. **Phone Number (Puhelinnumero)**:
   - Validates domestic (`040...`, `050...`) and international (`+358...`) formats.
   - Normalizes numbers into international E.164 format.
3. **Business ID (Y-tunnus)**:
   - Full Modulo-11 checksum validation according to Finnish PRH / YTJ standards (weights: `[7, 9, 10, 5, 8, 4, 2]`).
   - Differentiates valid checksum from authoritative PRH registration check.
4. **VAT Number (ALV-numero)**:
   - Validates `FI` + 8 digits and derives VAT number from valid Y-tunnus.
5. **Currency Formatting**:
   - `formatFinnishCurrency(amount)` outputs EUR according to Finnish typographic conventions (`1 234,50 €`).
6. **Date Formatting**:
   - `formatFinnishDate(date)` uses `fi-FI` locale and `Europe/Helsinki` timezone.
7. **Address Schema**:
   - Country defaults to `'FI'`.
   - Validates Finnish postal code and phone when country is Finland, while allowing international addresses for cross-border compatibility.
