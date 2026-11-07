# Oivaly — Finnish Multi-Vendor Platform

A premium Nordic multi-vendor marketplace connecting Finnish artisans, merchants, and discerning shoppers with a calm, trustworthy Scandinavian shopping experience.

## Getting Started

Run the development server (configured on port `4242`):

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:4242](http://localhost:4242) with your browser to view the application.

## Architectural Documentation

Full technical architecture, design tokens, and domain standards are documented in:
- [Phase 1 Foundation Guide](docs/architecture/phase-1-foundation.md)
- [Phase 2 Global Layout & Navigation Guide](docs/architecture/phase-2-navigation.md)
- [Phase 3 Homepage Implementation Guide](docs/architecture/phase-3-homepage.md)
- [Phase 4 Product Discovery & Search Guide](docs/architecture/phase-4-discovery-search.md)
- [Phase 5 Product Details Page Guide](docs/architecture/phase-5-product-details.md)

## Tech Stack

- **Framework**: Next.js 16.4.0 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 & Scandinavian Sage Design System
- **Components**: shadcn/ui (`radix-lyra` style) with Phosphor Icons
- **Runtime**: Bun 1.3.14
- **Typing & Validation**: TypeScript (Strict), Zod 4.6.5

