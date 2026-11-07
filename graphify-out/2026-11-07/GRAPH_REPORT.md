# Graph Report - multi-tanent-frontend  (2026-11-07)

## Corpus Check
- 239 files · ~123,459 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 1, .ico 1, .css 1)

## Summary
- 1239 nodes · 3258 edges · 69 communities (57 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cabd77fc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- addresses/page.tsx
- catalog-view.tsx
- Global Navigation & Drawer
- products/[slug]/page.tsx
- Customer Auth Context (JWT)
- shops/[slug]/page.tsx
- cart-context.tsx
- seller-dashboard.api.ts
- Seller Atelier Auth & Session
- next
- addresses/page.tsx
- client.ts
- seller-auth-context.tsx
- finland.ts
- categories.ts
- dependencies
- Scandinavian Design System UI (3)
- Product
- category-navigation.tsx
- useSellerAuth
- Scandinavian Design System UI (5)
- Scandinavian Design System UI (6)
- marketplace-shell.tsx
- eslint.config.mjs Module
- tsconfig.json Module
- Button
- Category Discovery & Browsing (4)
- Scandinavian Design System UI (7)
- Badge
- Product Details & Variants (2)
- Scandinavian Design System UI (8)
- package.json
- Seller Dashboard & Atelier Management (2)
- product-purchase-actions.tsx
- Scandinavian Design System UI (11)
- auth.schema.ts
- toggle-group.tsx
- Scandinavian Design System UI (14)
- Scandinavian Design System UI (15)
- Scandinavian Design System UI (16)
- Scandinavian Design System UI (17)
- product-card.tsx
- Scandinavian Design System UI (18)
- @phosphor-icons/react
- app/login/page.tsx
- Global Navigation & Drawer (4)
- catalog-header.tsx
- Scandinavian Design System UI (20)
- Scandinavian Design System UI (21)
- Category Discovery & Browsing (6)
- product-details-view.tsx
- Scandinavian Design System UI (24)
- Scandinavian Design System UI (25)
- cn
- Shipping & Posti Courier Tracking
- alert.tsx
- Scandinavian Design System UI (28)
- Scandinavian Design System UI (29)
- seller-auth-layout.tsx
- Scandinavian Design System UI (30)
- edit/page.tsx
- product-reviews.tsx
- sonner
- stores.api.ts
- @stripe/react-stripe-js@^7.0.0

## God Nodes (most connected - your core abstractions)
1. `react` - 160 edges
2. `@phosphor-icons/react` - 113 edges
3. `Button()` - 112 edges
4. `next` - 92 edges
5. `cn` - 60 edges
6. `Badge()` - 42 edges
7. `radix-ui` - 38 edges
8. `sonner` - 37 edges
9. `Product` - 33 edges
10. `useSellerAuth()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `StoreProductsResult` --references--> `Product`  [EXTRACTED]
  lib/seller-resolver.ts → resources/interfaces/product.interface.ts
- `EditProductForm()` --calls--> `Button()`  [EXTRACTED]
  app/seller/dashboard/products/[id]/edit/page.tsx → components/ui/button.tsx
- `EditProductForm()` --calls--> `useSellerAuth()`  [EXTRACTED]
  app/seller/dashboard/products/[id]/edit/page.tsx → lib/seller-auth-context.tsx
- `NewProductPage()` --calls--> `Button()`  [EXTRACTED]
  app/seller/dashboard/products/new/page.tsx → components/ui/button.tsx
- `NewProductPage()` --calls--> `useSellerAuth()`  [EXTRACTED]
  app/seller/dashboard/products/new/page.tsx → lib/seller-auth-context.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Oivaly Marketplace Frontend Architecture Phases** — docs_architecture_phase1_foundation, docs_architecture_phase2_navigation, docs_architecture_phase3_homepage, docs_architecture_phase4_discovery_search, docs_architecture_phase5_product_details, docs_architecture_phase6_seller_storefronts, docs_architecture_phase7_authentication [EXTRACTED 0.95]

## Communities (69 total, 12 thin omitted)

### Community 0 - "addresses/page.tsx"
Cohesion: 0.11
Nodes (13): ComboboxChip(), ComboboxClear(), ComboboxInput(), ComboboxTrigger(), CommandInput(), InputGroup(), InputGroupAddon(), inputGroupAddonVariants (+5 more)

### Community 1 - "catalog-view.tsx"
Cohesion: 0.20
Nodes (19): ActiveFilters(), ActiveFiltersProps, CatalogEmptyState(), CatalogEmptyStateProps, CatalogErrorState(), CatalogErrorStateProps, CatalogHeaderProps, CatalogPagination() (+11 more)

### Community 2 - "Global Navigation & Drawer"
Cohesion: 0.09
Nodes (27): FilterMobileDrawer(), MobileNavigation(), MobileNavigationProps, Sheet(), SheetClose(), SheetContent(), SheetDescription(), SheetHeader() (+19 more)

### Community 3 - "products/[slug]/page.tsx"
Cohesion: 0.22
Nodes (12): generateMetadata(), ProductDetailsContent(), ProductPage(), ProductPageProps, ProductDetailsSkeleton(), RelatedProducts(), RelatedProductsProps, DEMO_FEATURED_PRODUCTS (+4 more)

### Community 4 - "Customer Auth Context (JWT)"
Cohesion: 0.06
Nodes (48): SellerProductsPage(), AccountMenu(), AccountMenuProps, SiteHeaderProps, DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel() (+40 more)

### Community 5 - "shops/[slug]/page.tsx"
Cohesion: 0.10
Nodes (31): generateMetadata(), ShopPage(), ShopPageContent(), ShopPageProps, ShopAbout(), ShopAboutProps, ShopHeader(), ShopHeaderProps (+23 more)

### Community 6 - "cart-context.tsx"
Cohesion: 0.07
Nodes (36): geistMono, geistSans, jetbrainsMono, metadata, RootLayout(), ProductPurchaseActionsProps, ProductVariantsProps, Toaster() (+28 more)

### Community 7 - "seller-dashboard.api.ts"
Cohesion: 0.14
Nodes (22): SellerOrdersPage(), SellerOverviewPage(), sellerDashboardApi, CreateStoreProductPayload, PaginatedResult, ProductStatus, StoreInventorySummary, StoreOrderCustomer (+14 more)

### Community 8 - "Seller Atelier Auth & Session"
Cohesion: 0.15
Nodes (18): metadata, SellerResetPasswordPage(), SellerResetPasswordContent(), SellerResetPasswordForm(), @hookform/resolvers@^5.9.1, react-hook-form@^7.89.0, @hookform/resolvers, react-hook-form (+10 more)

### Community 9 - "next"
Cohesion: 0.07
Nodes (9): PROTECTION_SCENARIOS, Scenario, RETURN_REASONS, ReturnReason, metadata, EditorPickItem, EDITORS_PICKS_DATA, nextConfig (+1 more)

### Community 10 - "addresses/page.tsx"
Cohesion: 0.08
Nodes (37): AddressesPage(), AccountOverviewPage(), getStatusBadge(), OrderCard(), OrderCardProps, getStepIndex(), OrderTrackerStepper(), OrderTrackerStepperProps (+29 more)

### Community 11 - "client.ts"
Cohesion: 0.16
Nodes (11): apiClient(), ApiError, RequestOptions, newsletterApi, NewsletterSubscribeResponse, CustomerOrderQueryParams, ApiErrorResponse, ApiMeta (+3 more)

### Community 12 - "seller-auth-context.tsx"
Cohesion: 0.16
Nodes (22): deleteSellerCookie(), getCookieValue(), getStoredSellerAuth(), isJwtExpired(), SELLER_AUTH_EVENT, SELLER_REFRESH_TOKEN_KEY, SELLER_SESSION_MAX_AGE_SECONDS, SELLER_STORE_KEY (+14 more)

### Community 13 - "finland.ts"
Cohesion: 0.12
Nodes (19): BusinessIdValidationResult, formatFinnishVatNumber(), isValidFinnishPhone(), isValidFinnishPostalCode(), isValidFinnishVatNumber(), validateFinnishBusinessId(), Y_TUNNUS_WEIGHTS, zod@^4.6.5 (+11 more)

### Community 14 - "categories.ts"
Cohesion: 0.14
Nodes (21): CategoriesContent(), CategoriesIndexPage(), CategoriesSkeleton(), metadata, CategoryPage(), CategoryPageProps, CategoryProductsContent(), generateMetadata() (+13 more)

### Community 15 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @base-ui/react@^1.9.0, class-variance-authority@^0.7.1, cmdk@^1.1.1, cn@^0.4.0, date-fns@^4.4.0, next@16.4.3, @phosphor-icons/react@^2.1.10 (+14 more)

### Community 16 - "Scandinavian Design System UI (3)"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 17 - "Product"
Cohesion: 0.17
Nodes (13): CatalogProductGridProps, CATEGORY_IMAGES_MAP, CategoryDiscoveryProps, CategoryHubItem, FeaturedProductsProps, ProductDetailsViewProps, ProductTabsProps, ShopProductGridProps (+5 more)

### Community 18 - "category-navigation.tsx"
Cohesion: 0.24
Nodes (10): CategoryNavigation(), CategoryNavigationFallback(), CategoryNavigationList(), CategoryNavigationProps, FOOTER_SECTIONS, FooterLink, FooterSection, HEADER_NAV_CONFIG (+2 more)

### Community 19 - "useSellerAuth"
Cohesion: 0.19
Nodes (12): DashboardLayout(), metadata, SellerSettingsPage(), SellerRootPage(), SellerDashboardLayout(), SellerDashboardLayoutProps, NAV_ITEMS, NavItem (+4 more)

### Community 20 - "Scandinavian Design System UI (5)"
Cohesion: 0.13
Nodes (7): buttonVariants, Calendar(), CalendarDayButton(), QuestionnaireNext(), QuestionnairePrevious(), QuestionnaireSkip(), QuestionnaireSubmit()

### Community 21 - "Scandinavian Design System UI (6)"
Cohesion: 0.12
Nodes (18): ProfilePage(), VerifyEmailContent(), VerifyEmailPage(), FilterSidebar(), PRICE_PRESETS, ButtonGroup(), ButtonGroupSeparator(), buttonGroupVariants (+10 more)

### Community 22 - "marketplace-shell.tsx"
Cohesion: 0.46
Nodes (7): ConditionalFooter(), ConditionalHeader(), isBareLayoutRoute(), MarketplaceShell(), MarketplaceShellProps, SiteFooter(), SiteHeader()

### Community 23 - "eslint.config.mjs Module"
Cohesion: 0.11
Nodes (18): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.4.3, tailwindcss@^4, @tailwindcss/turbopack@^4, @types/node@^20, @types/react@^19 (+10 more)

### Community 24 - "tsconfig.json Module"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 25 - "Button"
Cohesion: 0.16
Nodes (9): NotFound(), HomeHeroProps, QUICK_TAGS, TRUST_PILLS, ShopEmptyState(), ShopEmptyStateProps, ShopProductGrid(), Button() (+1 more)

### Community 26 - "Category Discovery & Browsing (4)"
Cohesion: 0.23
Nodes (17): HomePage(), LiveCategoryDiscovery(), LiveCustomerReviews(), LiveFeaturedProducts(), LiveFeaturedSellers(), CategoryDiscovery(), CategoryDiscoverySkeleton(), CuratedCollections() (+9 more)

### Community 28 - "Badge"
Cohesion: 0.26
Nodes (11): AccountLayout(), NAV_ITEMS, SecurityPage(), CheckoutContent(), CheckoutPage(), StripeCardDetails, StripePaymentForm(), StripePaymentFormProps (+3 more)

### Community 29 - "Product Details & Variants (2)"
Cohesion: 0.24
Nodes (10): ProductTabs(), Table(), TableBody(), TableCell(), TableRow(), Tabs(), TabsContent(), TabsList() (+2 more)

### Community 31 - "package.json"
Cohesion: 0.12
Nodes (16): embla-carousel-react@^8.6.0, next-themes@^0.4.6, react-dom@19.3.0, recharts@3.8.0, shadcn@^4.21.4, ignoreScripts, name, packageManager (+8 more)

### Community 32 - "Seller Dashboard & Atelier Management (2)"
Cohesion: 0.19
Nodes (11): CuratedCollectionsProps, CustomerReviewsProps, FeaturedSellersProps, BENEFITS, DEMO_CURATED_COLLECTIONS, DEMO_CUSTOMER_REVIEWS, DEMO_FEATURED_SELLERS, DemoCollectionItem (+3 more)

### Community 34 - "product-purchase-actions.tsx"
Cohesion: 0.27
Nodes (10): CartPage(), CheckoutSuccessContent(), CheckoutSuccessPage(), WishlistPage(), ProductPurchaseActions(), QuantitySelector(), QuantitySelectorProps, useCart() (+2 more)

### Community 35 - "Scandinavian Design System UI (11)"
Cohesion: 0.19
Nodes (12): CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions, CarouselPlugin (+4 more)

### Community 36 - "auth.schema.ts"
Cohesion: 0.17
Nodes (13): ForgotPasswordPage(), ResetPasswordContent(), ResetPasswordPage(), ForgotPasswordFormValues, forgotPasswordSchema, LoginFormValues, loginSchema, ProfileUpdateFormValues (+5 more)

### Community 37 - "toggle-group.tsx"
Cohesion: 0.22
Nodes (7): Marker(), markerVariants, ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants, class-variance-authority

### Community 38 - "Scandinavian Design System UI (14)"
Cohesion: 0.18
Nodes (5): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogOverlay(), AlertDialogPortal()

### Community 39 - "Scandinavian Design System UI (15)"
Cohesion: 0.22
Nodes (12): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+4 more)

### Community 40 - "Scandinavian Design System UI (16)"
Cohesion: 0.18
Nodes (5): DrawerContent(), DrawerOverlay(), DrawerPortal(), vaul@^1.1.2, vaul

### Community 41 - "Scandinavian Design System UI (17)"
Cohesion: 0.20
Nodes (4): Item(), ItemMedia(), itemMediaVariants, itemVariants

### Community 42 - "product-card.tsx"
Cohesion: 0.22
Nodes (8): GIFT_CATALOG, GiftItem, GiftsPage(), CATEGORIES, DisplayProduct, NEW_ARRIVALS_FIXTURES, NewArrivalsPage(), ProductCard()

### Community 43 - "Scandinavian Design System UI (18)"
Cohesion: 0.20
Nodes (5): Attachment(), AttachmentAction(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 44 - "@phosphor-icons/react"
Cohesion: 0.22
Nodes (10): CATEGORY_TABS, AnnouncementBar(), AnnouncementBarProps, SearchBar(), SearchBarFallback(), SearchBarForm(), SearchBarProps, SiteFooterProps (+2 more)

### Community 45 - "app/login/page.tsx"
Cohesion: 0.28
Nodes (10): LoginContent(), LoginPage(), RegisterContent(), RegisterPage(), AuthCardLayout(), AuthCardLayoutProps, CustomerAuthLayout(), CustomerAuthLayoutProps (+2 more)

### Community 47 - "Global Navigation & Drawer (4)"
Cohesion: 0.24
Nodes (4): NavigationMenu(), NavigationMenuTrigger(), navigationMenuTriggerStyle, NavigationMenuViewport()

### Community 48 - "catalog-header.tsx"
Cohesion: 0.31
Nodes (10): CatalogHeader(), ShopFilters(), ShopFiltersProps, Select(), SelectContent(), SelectItem(), SelectScrollDownButton(), SelectScrollUpButton() (+2 more)

### Community 49 - "Scandinavian Design System UI (20)"
Cohesion: 0.28
Nodes (4): PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 52 - "Category Discovery & Browsing (6)"
Cohesion: 0.25
Nodes (8): Architecture Phase 1: Frontend Foundation & Design System, Architecture Phase 2: Global Navigation & Category Hierarchy, Architecture Phase 3: Marketplace Homepage & Artisan Showcase, Architecture Phase 4: Product Discovery & Faceted Search, Architecture Phase 5: Product Details & Variant Selection, Architecture Phase 6: Seller Ateliers & Public Storefronts, Architecture Phase 7: Customer & Seller Authentication (PRH Y-tunnus), Oivaly Nordic Marketplace Client Frontend

### Community 53 - "product-details-view.tsx"
Cohesion: 0.35
Nodes (11): CategoriesDirectory(), ProductDeliveryInfo(), ProductDeliveryInfoProps, ProductDetailsView(), ProductVariants(), Breadcrumb(), BreadcrumbItem(), BreadcrumbLink() (+3 more)

### Community 54 - "Scandinavian Design System UI (24)"
Cohesion: 0.38
Nodes (4): Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 56 - "cn"
Cohesion: 0.10
Nodes (4): NativeSelectProps, ScrollArea(), ScrollBar(), cn

### Community 57 - "Shipping & Posti Courier Tracking"
Cohesion: 0.33
Nodes (4): DESTINATION_ZONES, DestinationZone, WEIGHT_TIERS, WeightTier

### Community 60 - "Scandinavian Design System UI (29)"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 61 - "seller-auth-layout.tsx"
Cohesion: 0.22
Nodes (11): metadata, SellerForgotPasswordPage(), metadata, SellerLoginPage(), metadata, SellerSignupPage(), SellerAuthLayout(), SellerAuthLayoutProps (+3 more)

### Community 64 - "edit/page.tsx"
Cohesion: 0.21
Nodes (10): EditProductForm(), loadData(), EditProductPage(), formatProductDescription(), parseProductSpecs(), VariantFormItem, formatProductDescription(), NewProductPage() (+2 more)

### Community 65 - "product-reviews.tsx"
Cohesion: 0.29
Nodes (7): ProductReviews(), ProductReviewsProps, Progress(), reviewsApi, ProductReview, ProductReviewSummary, ReviewStatus

### Community 66 - "sonner"
Cohesion: 0.17
Nodes (5): COOKIE_REGISTRY, CookieItem, EXTENSIVE_FAQS, FAQItem, sonner

### Community 67 - "stores.api.ts"
Cohesion: 0.43
Nodes (4): MakerDetail, MAKERS_DIRECTORY, MarketplaceStorePreview, storesApi

## Knowledge Gaps
- **3 isolated node(s):** `Architecture Phase 7: Customer & Seller Authentication (PRH Y-tunnus)`, `Oivaly Nordic Marketplace Client Frontend`, `Next.js Agent Guidelines & Dev Conventions`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 437 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Scandinavian Design System UI (6)` to `addresses/page.tsx`, `catalog-view.tsx`, `Global Navigation & Drawer`, `products/[slug]/page.tsx`, `Customer Auth Context (JWT)`, `shops/[slug]/page.tsx`, `cart-context.tsx`, `seller-dashboard.api.ts`, `Seller Atelier Auth & Session`, `next`, `addresses/page.tsx`, `client.ts`, `seller-auth-context.tsx`, `categories.ts`, `dependencies`, `Product`, `category-navigation.tsx`, `useSellerAuth`, `Scandinavian Design System UI (5)`, `marketplace-shell.tsx`, `Button`, `Category Discovery & Browsing (4)`, `Scandinavian Design System UI (7)`, `Badge`, `Product Details & Variants (2)`, `Scandinavian Design System UI (8)`, `package.json`, `Seller Dashboard & Atelier Management (2)`, `Scandinavian Design System UI (10)`, `product-purchase-actions.tsx`, `Scandinavian Design System UI (11)`, `auth.schema.ts`, `toggle-group.tsx`, `Scandinavian Design System UI (14)`, `Scandinavian Design System UI (15)`, `Scandinavian Design System UI (16)`, `Scandinavian Design System UI (17)`, `product-card.tsx`, `Scandinavian Design System UI (18)`, `@phosphor-icons/react`, `app/login/page.tsx`, `card.tsx`, `Global Navigation & Drawer (4)`, `catalog-header.tsx`, `Scandinavian Design System UI (20)`, `Scandinavian Design System UI (22)`, `product-details-view.tsx`, `Scandinavian Design System UI (24)`, `Scandinavian Design System UI (25)`, `cn`, `Shipping & Posti Courier Tracking`, `alert.tsx`, `seller-auth-layout.tsx`, `edit/page.tsx`, `product-reviews.tsx`, `sonner`, `stores.api.ts`?**
  _High betweenness centrality (0.404) - this node is a cross-community bridge._
- **What connects `Architecture Phase 7: Customer & Seller Authentication (PRH Y-tunnus)`, `Oivaly Nordic Marketplace Client Frontend`, `Next.js Agent Guidelines & Dev Conventions` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `addresses/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10837438423645321 - nodes in this community are weakly interconnected._
- **Why does `@phosphor-icons/react` connect `@phosphor-icons/react` to `addresses/page.tsx`, `catalog-view.tsx`, `Global Navigation & Drawer`, `products/[slug]/page.tsx`, `Customer Auth Context (JWT)`, `shops/[slug]/page.tsx`, `seller-dashboard.api.ts`, `Seller Atelier Auth & Session`, `next`, `addresses/page.tsx`, `client.ts`, `dependencies`, `Product`, `useSellerAuth`, `Scandinavian Design System UI (5)`, `Scandinavian Design System UI (6)`, `Button`, `Badge`, `Product Details & Variants (2)`, `Scandinavian Design System UI (8)`, `package.json`, `Seller Dashboard & Atelier Management (2)`, `Scandinavian Design System UI (10)`, `product-purchase-actions.tsx`, `Scandinavian Design System UI (11)`, `auth.schema.ts`, `product-card.tsx`, `app/login/page.tsx`, `Global Navigation & Drawer (4)`, `catalog-header.tsx`, `Scandinavian Design System UI (20)`, `product-details-view.tsx`, `Scandinavian Design System UI (25)`, `cn`, `Shipping & Posti Courier Tracking`, `seller-auth-layout.tsx`, `edit/page.tsx`, `product-reviews.tsx`, `sonner`, `stores.api.ts`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Should `Global Navigation & Drawer` be split into smaller, more focused modules?**
  _Cohesion score 0.08503401360544217 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `catalog-view.tsx`, `Global Navigation & Drawer`, `products/[slug]/page.tsx`, `Customer Auth Context (JWT)`, `shops/[slug]/page.tsx`, `cart-context.tsx`, `seller-dashboard.api.ts`, `Seller Atelier Auth & Session`, `addresses/page.tsx`, `seller-auth-context.tsx`, `categories.ts`, `dependencies`, `Product`, `category-navigation.tsx`, `useSellerAuth`, `Scandinavian Design System UI (6)`, `marketplace-shell.tsx`, `Button`, `Badge`, `Product Details & Variants (2)`, `package.json`, `Seller Dashboard & Atelier Management (2)`, `product-purchase-actions.tsx`, `auth.schema.ts`, `product-card.tsx`, `@phosphor-icons/react`, `app/login/page.tsx`, `catalog-header.tsx`, `product-details-view.tsx`, `Shipping & Posti Courier Tracking`, `seller-auth-layout.tsx`, `edit/page.tsx`, `sonner`, `stores.api.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `Customer Auth Context (JWT)` be split into smaller, more focused modules?**
  _Cohesion score 0.060455486542443065 - nodes in this community are weakly interconnected._