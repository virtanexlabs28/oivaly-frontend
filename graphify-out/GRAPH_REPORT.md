# Graph Report - multi-tanent-frontend  (2026-11-07)

## Corpus Check
- 239 files · ~123,485 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 1, .ico 1, .css 1)

## Summary
- 1240 nodes · 3260 edges · 71 communities (55 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `814c199f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- addresses/page.tsx
- catalog-header.tsx
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
- account-menu.tsx
- dependencies
- Scandinavian Design System UI (3)
- Product
- category-navigation.tsx
- useSellerAuth
- Scandinavian Design System UI (5)
- profile/page.tsx
- app/layout.tsx
- eslint.config.mjs Module
- tsconfig.json Module
- Button
- Category Discovery & Browsing (4)
- Scandinavian Design System UI (7)
- Badge
- Product Details & Variants (2)
- Scandinavian Design System UI (8)
- account/page.tsx
- Seller Dashboard & Atelier Management (2)
- success/page.tsx
- Scandinavian Design System UI (11)
- category-discovery.tsx
- toggle-group.tsx
- Scandinavian Design System UI (14)
- Scandinavian Design System UI (15)
- Scandinavian Design System UI (16)
- Scandinavian Design System UI (17)
- product-card.tsx
- Scandinavian Design System UI (18)
- @phosphor-icons/react
- wishlist-context.tsx
- Global Navigation & Drawer (4)
- Scandinavian Design System UI (20)
- Scandinavian Design System UI (21)
- Category Discovery & Browsing (6)
- product-details-view.tsx
- Scandinavian Design System UI (24)
- Scandinavian Design System UI (25)
- cn
- Shipping & Posti Courier Tracking
- Scandinavian Design System UI (28)
- Scandinavian Design System UI (29)
- api-response.interface.ts
- Scandinavian Design System UI (30)
- edit/page.tsx
- native-select.tsx
- cookies/page.tsx
- stores.api.ts
- buyer-protection/page.tsx
- help/page.tsx
- returns/page.tsx

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

## Communities (71 total, 16 thin omitted)

### Community 0 - "addresses/page.tsx"
Cohesion: 0.11
Nodes (11): ComboboxChip(), ComboboxClear(), ComboboxInput(), ComboboxTrigger(), CommandInput(), InputGroup(), InputGroupAddon(), inputGroupAddonVariants (+3 more)

### Community 1 - "catalog-header.tsx"
Cohesion: 0.09
Nodes (45): CategoryPage(), CategoryPageProps, CategoryProductsContent(), generateMetadata(), SearchPage(), SearchPageProps, SearchResultsContent(), ActiveFilters() (+37 more)

### Community 2 - "Global Navigation & Drawer"
Cohesion: 0.06
Nodes (35): FilterMobileDrawer(), MobileNavigation(), MobileNavigationProps, ButtonGroupSeparator(), Field(), FieldLabel(), FieldSeparator(), fieldVariants (+27 more)

### Community 3 - "products/[slug]/page.tsx"
Cohesion: 0.14
Nodes (18): generateMetadata(), ProductDetailsContent(), ProductPage(), ProductPageProps, ProductDetailsSkeleton(), ProductReviews(), ProductReviewsProps, RelatedProducts() (+10 more)

### Community 4 - "Customer Auth Context (JWT)"
Cohesion: 0.10
Nodes (33): AuthContext, AuthContextType, AuthProvider(), getClientSnapshot(), getServerSnapshot(), subscribeAuth(), ACCESS_TOKEN_COOKIE, clearAuthSession() (+25 more)

### Community 5 - "shops/[slug]/page.tsx"
Cohesion: 0.08
Nodes (38): CategoriesContent(), CategoriesIndexPage(), CategoriesSkeleton(), metadata, ShopLoading(), generateMetadata(), ShopPage(), ShopPageContent() (+30 more)

### Community 6 - "cart-context.tsx"
Cohesion: 0.18
Nodes (15): CartContext, CartProvider(), ClientCartItem, EMPTY_CART, getClientCartSnapshot(), getServerCartSnapshot(), mapBackendCartToItems(), saveCart() (+7 more)

### Community 7 - "seller-dashboard.api.ts"
Cohesion: 0.14
Nodes (21): SellerOrdersPage(), SellerOverviewPage(), sellerDashboardApi, CreateStoreProductPayload, PaginatedResult, StoreInventorySummary, StoreOrderCustomer, StoreOrderItem (+13 more)

### Community 8 - "Seller Atelier Auth & Session"
Cohesion: 0.20
Nodes (12): SellerResetPasswordContent(), SellerResetPasswordForm(), BusinessVerificationResult, sellerAuthApi, SellerForgotPasswordFormValues, sellerForgotPasswordSchema, SellerLoginFormValues, sellerLoginSchema (+4 more)

### Community 9 - "next"
Cohesion: 0.07
Nodes (16): metadata, SellerForgotPasswordPage(), metadata, SellerLoginPage(), metadata, SellerResetPasswordPage(), metadata, SellerSignupPage() (+8 more)

### Community 10 - "addresses/page.tsx"
Cohesion: 0.19
Nodes (13): AddressesPage(), OrderTrackingDialog(), ProductGallery(), ProductGalleryProps, CommandDialog(), Dialog(), DialogContent(), DialogDescription() (+5 more)

### Community 11 - "client.ts"
Cohesion: 0.24
Nodes (9): apiClient(), ApiError, RequestOptions, newsletterApi, NewsletterSubscribeResponse, MarketplaceProductsResponse, productsApi, ProductFilterParams (+1 more)

### Community 12 - "seller-auth-context.tsx"
Cohesion: 0.16
Nodes (22): deleteSellerCookie(), getCookieValue(), getStoredSellerAuth(), isJwtExpired(), SELLER_AUTH_EVENT, SELLER_REFRESH_TOKEN_KEY, SELLER_SESSION_MAX_AGE_SECONDS, SELLER_STORE_KEY (+14 more)

### Community 13 - "finland.ts"
Cohesion: 0.07
Nodes (44): ForgotPasswordPage(), LoginContent(), LoginPage(), RegisterContent(), RegisterPage(), ResetPasswordContent(), ResetPasswordPage(), AuthCardLayout() (+36 more)

### Community 14 - "account-menu.tsx"
Cohesion: 0.14
Nodes (15): SellerProductsPage(), AccountMenu(), AccountMenuProps, SiteHeaderProps, DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel() (+7 more)

### Community 15 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, @base-ui/react@^1.9.0, class-variance-authority@^0.7.1, cmdk@^1.1.1, cn@^0.4.0, date-fns@^4.4.0, next@16.4.3, @phosphor-icons/react@^2.1.10 (+18 more)

### Community 16 - "Scandinavian Design System UI (3)"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 17 - "Product"
Cohesion: 0.20
Nodes (12): CatalogProductGridProps, CATEGORY_TABS, FeaturedProductsProps, ProductDetailsViewProps, ProductPurchaseActionsProps, ProductTabsProps, ProductVariantsProps, ShopProductGridProps (+4 more)

### Community 18 - "category-navigation.tsx"
Cohesion: 0.22
Nodes (11): CategoryNavigation(), CategoryNavigationFallback(), CategoryNavigationList(), CategoryNavigationProps, FOOTER_SECTIONS, FooterLink, FooterSection, HEADER_NAV_CONFIG (+3 more)

### Community 19 - "useSellerAuth"
Cohesion: 0.19
Nodes (12): DashboardLayout(), metadata, SellerSettingsPage(), SellerRootPage(), SellerDashboardLayout(), SellerDashboardLayoutProps, NAV_ITEMS, NavItem (+4 more)

### Community 20 - "Scandinavian Design System UI (5)"
Cohesion: 0.13
Nodes (7): buttonVariants, QuestionnaireNext(), QuestionnairePrevious(), QuestionnaireSkip(), QuestionnaireSubmit(), @shadcn/react@^0.3.1, @shadcn/react

### Community 21 - "profile/page.tsx"
Cohesion: 0.38
Nodes (7): ProfilePage(), VerifyEmailContent(), VerifyEmailPage(), ProductVariants(), Input(), Label(), authApi

### Community 22 - "app/layout.tsx"
Cohesion: 0.14
Nodes (16): geistMono, geistSans, jetbrainsMono, metadata, RootLayout(), ConditionalFooter(), ConditionalHeader(), isBareLayoutRoute() (+8 more)

### Community 23 - "eslint.config.mjs Module"
Cohesion: 0.10
Nodes (24): eslintConfig, devDependencies, eslint@^9, eslint-config-next@16.4.3, tailwindcss@^4, @tailwindcss/turbopack@^4, @types/node@^20, @types/react@^19 (+16 more)

### Community 24 - "tsconfig.json Module"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 25 - "Button"
Cohesion: 0.16
Nodes (11): NotFound(), CatalogErrorStateProps, ShopEmptyState(), ShopEmptyStateProps, ShopProductGrid(), Button(), Calendar(), CalendarDayButton() (+3 more)

### Community 26 - "Category Discovery & Browsing (4)"
Cohesion: 0.23
Nodes (17): HomePage(), LiveCategoryDiscovery(), LiveCustomerReviews(), LiveFeaturedProducts(), LiveFeaturedSellers(), CategoryDiscovery(), CategoryDiscoverySkeleton(), CuratedCollections() (+9 more)

### Community 27 - "Scandinavian Design System UI (7)"
Cohesion: 0.09
Nodes (3): ButtonGroup(), buttonGroupVariants, radix-ui

### Community 28 - "Badge"
Cohesion: 0.19
Nodes (19): SecurityPage(), CartPage(), CheckoutContent(), CheckoutPage(), GIFT_CATALOG, GiftItem, GiftsPage(), WishlistPage() (+11 more)

### Community 29 - "Product Details & Variants (2)"
Cohesion: 0.24
Nodes (10): ProductTabs(), Table(), TableBody(), TableCell(), TableRow(), Tabs(), TabsContent(), TabsList() (+2 more)

### Community 31 - "account/page.tsx"
Cohesion: 0.18
Nodes (18): AccountOverviewPage(), getStatusBadge(), OrderCard(), OrderCardProps, getStepIndex(), OrderTrackerStepper(), OrderTrackerStepperProps, STEPS (+10 more)

### Community 32 - "Seller Dashboard & Atelier Management (2)"
Cohesion: 0.23
Nodes (10): CuratedCollectionsProps, CustomerReviewsProps, FeaturedSellersProps, DEMO_CURATED_COLLECTIONS, DEMO_CUSTOMER_REVIEWS, DEMO_FEATURED_SELLERS, DemoCollectionItem, DemoReviewItem (+2 more)

### Community 34 - "success/page.tsx"
Cohesion: 0.24
Nodes (8): CheckoutSuccessContent(), CheckoutSuccessPage(), CreateCheckoutSessionResponse, CreatePaymentIntentResponse, InvoiceSummary, PaymentRecord, paymentsApi, VerifySessionResponse

### Community 35 - "Scandinavian Design System UI (11)"
Cohesion: 0.16
Nodes (14): CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions, CarouselPlugin (+6 more)

### Community 36 - "category-discovery.tsx"
Cohesion: 0.14
Nodes (10): CATEGORY_IMAGES_MAP, CategoryDiscoveryProps, CategoryHubItem, EditorPickItem, EDITORS_PICKS_DATA, HomeHeroProps, QUICK_TAGS, TRUST_PILLS (+2 more)

### Community 37 - "toggle-group.tsx"
Cohesion: 0.14
Nodes (9): Alert(), alertVariants, Marker(), markerVariants, ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants (+1 more)

### Community 38 - "Scandinavian Design System UI (14)"
Cohesion: 0.18
Nodes (5): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogOverlay(), AlertDialogPortal()

### Community 39 - "Scandinavian Design System UI (15)"
Cohesion: 0.18
Nodes (14): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+6 more)

### Community 40 - "Scandinavian Design System UI (16)"
Cohesion: 0.18
Nodes (5): DrawerContent(), DrawerOverlay(), DrawerPortal(), vaul@^1.1.2, vaul

### Community 41 - "Scandinavian Design System UI (17)"
Cohesion: 0.20
Nodes (4): Item(), ItemMedia(), itemMediaVariants, itemVariants

### Community 42 - "product-card.tsx"
Cohesion: 0.33
Nodes (4): CATEGORIES, DisplayProduct, NEW_ARRIVALS_FIXTURES, NewArrivalsPage()

### Community 43 - "Scandinavian Design System UI (18)"
Cohesion: 0.20
Nodes (5): Attachment(), AttachmentAction(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 44 - "@phosphor-icons/react"
Cohesion: 0.19
Nodes (12): AccountLayout(), NAV_ITEMS, AnnouncementBar(), AnnouncementBarProps, SearchBar(), SearchBarFallback(), SearchBarForm(), SearchBarProps (+4 more)

### Community 45 - "wishlist-context.tsx"
Cohesion: 0.25
Nodes (10): EMPTY_WISHLIST, getClientWishlistSnapshot(), getServerWishlistSnapshot(), saveWishlist(), subscribeWishlist(), WishlistContext, WishlistContextType, WishlistItem (+2 more)

### Community 47 - "Global Navigation & Drawer (4)"
Cohesion: 0.24
Nodes (4): NavigationMenu(), NavigationMenuTrigger(), navigationMenuTriggerStyle, NavigationMenuViewport()

### Community 49 - "Scandinavian Design System UI (20)"
Cohesion: 0.28
Nodes (4): PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 52 - "Category Discovery & Browsing (6)"
Cohesion: 0.25
Nodes (8): Architecture Phase 1: Frontend Foundation & Design System, Architecture Phase 2: Global Navigation & Category Hierarchy, Architecture Phase 3: Marketplace Homepage & Artisan Showcase, Architecture Phase 4: Product Discovery & Faceted Search, Architecture Phase 5: Product Details & Variant Selection, Architecture Phase 6: Seller Ateliers & Public Storefronts, Architecture Phase 7: Customer & Seller Authentication (PRH Y-tunnus), Oivaly Nordic Marketplace Client Frontend

### Community 53 - "product-details-view.tsx"
Cohesion: 0.35
Nodes (11): CategoriesDirectory(), ProductDeliveryInfo(), ProductDeliveryInfoProps, ProductDetailsView(), ProductPurchaseActions(), Breadcrumb(), BreadcrumbItem(), BreadcrumbLink() (+3 more)

### Community 54 - "Scandinavian Design System UI (24)"
Cohesion: 0.38
Nodes (4): Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 56 - "cn"
Cohesion: 0.18
Nodes (5): InputGroupTextarea(), ScrollArea(), ScrollBar(), Textarea(), cn

### Community 57 - "Shipping & Posti Courier Tracking"
Cohesion: 0.33
Nodes (4): DESTINATION_ZONES, DestinationZone, WEIGHT_TIERS, WeightTier

### Community 60 - "Scandinavian Design System UI (29)"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 61 - "api-response.interface.ts"
Cohesion: 0.33
Nodes (5): ApiErrorResponse, ApiMeta, ApiResponse, PaginatedResponse, PaginationParams

### Community 64 - "edit/page.tsx"
Cohesion: 0.20
Nodes (11): EditProductFallback(), EditProductForm(), loadData(), EditProductPage(), formatProductDescription(), parseProductSpecs(), VariantFormItem, formatProductDescription() (+3 more)

### Community 67 - "stores.api.ts"
Cohesion: 0.40
Nodes (4): MakerDetail, MAKERS_DIRECTORY, MarketplaceStorePreview, storesApi

## Knowledge Gaps
- **3 isolated node(s):** `Architecture Phase 7: Customer & Seller Authentication (PRH Y-tunnus)`, `Oivaly Nordic Marketplace Client Frontend`, `Next.js Agent Guidelines & Dev Conventions`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 437 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `shops/[slug]/page.tsx` to `addresses/page.tsx`, `catalog-header.tsx`, `Global Navigation & Drawer`, `products/[slug]/page.tsx`, `Customer Auth Context (JWT)`, `cart-context.tsx`, `seller-dashboard.api.ts`, `Seller Atelier Auth & Session`, `next`, `addresses/page.tsx`, `seller-auth-context.tsx`, `finland.ts`, `account-menu.tsx`, `dependencies`, `Product`, `category-navigation.tsx`, `useSellerAuth`, `Scandinavian Design System UI (5)`, `profile/page.tsx`, `app/layout.tsx`, `eslint.config.mjs Module`, `Button`, `Category Discovery & Browsing (4)`, `Scandinavian Design System UI (7)`, `Badge`, `Product Details & Variants (2)`, `Scandinavian Design System UI (8)`, `account/page.tsx`, `Seller Dashboard & Atelier Management (2)`, `Scandinavian Design System UI (10)`, `success/page.tsx`, `Scandinavian Design System UI (11)`, `category-discovery.tsx`, `toggle-group.tsx`, `Scandinavian Design System UI (14)`, `Scandinavian Design System UI (15)`, `Scandinavian Design System UI (16)`, `Scandinavian Design System UI (17)`, `product-card.tsx`, `Scandinavian Design System UI (18)`, `@phosphor-icons/react`, `wishlist-context.tsx`, `card.tsx`, `Global Navigation & Drawer (4)`, `avatar.tsx`, `Scandinavian Design System UI (20)`, `Scandinavian Design System UI (22)`, `product-details-view.tsx`, `Scandinavian Design System UI (24)`, `Scandinavian Design System UI (25)`, `cn`, `Shipping & Posti Courier Tracking`, `message.tsx`, `edit/page.tsx`, `native-select.tsx`, `cookies/page.tsx`, `stores.api.ts`, `buyer-protection/page.tsx`, `help/page.tsx`, `returns/page.tsx`?**
  _High betweenness centrality (0.378) - this node is a cross-community bridge._
- **What connects `Architecture Phase 7: Customer & Seller Authentication (PRH Y-tunnus)`, `Oivaly Nordic Marketplace Client Frontend`, `Next.js Agent Guidelines & Dev Conventions` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `addresses/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11231884057971014 - nodes in this community are weakly interconnected._
- **Why does `@phosphor-icons/react` connect `Button` to `addresses/page.tsx`, `catalog-header.tsx`, `Global Navigation & Drawer`, `products/[slug]/page.tsx`, `shops/[slug]/page.tsx`, `seller-dashboard.api.ts`, `Seller Atelier Auth & Session`, `next`, `addresses/page.tsx`, `finland.ts`, `account-menu.tsx`, `dependencies`, `Product`, `useSellerAuth`, `Scandinavian Design System UI (5)`, `profile/page.tsx`, `app/layout.tsx`, `eslint.config.mjs Module`, `Badge`, `Product Details & Variants (2)`, `Scandinavian Design System UI (8)`, `account/page.tsx`, `Seller Dashboard & Atelier Management (2)`, `Scandinavian Design System UI (10)`, `success/page.tsx`, `Scandinavian Design System UI (11)`, `category-discovery.tsx`, `product-card.tsx`, `@phosphor-icons/react`, `Global Navigation & Drawer (4)`, `Scandinavian Design System UI (20)`, `product-details-view.tsx`, `Scandinavian Design System UI (25)`, `cn`, `Shipping & Posti Courier Tracking`, `edit/page.tsx`, `native-select.tsx`, `cookies/page.tsx`, `stores.api.ts`, `buyer-protection/page.tsx`, `help/page.tsx`, `returns/page.tsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Should `catalog-header.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08653353814644137 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `catalog-header.tsx`, `Global Navigation & Drawer`, `products/[slug]/page.tsx`, `Customer Auth Context (JWT)`, `shops/[slug]/page.tsx`, `seller-dashboard.api.ts`, `Seller Atelier Auth & Session`, `addresses/page.tsx`, `seller-auth-context.tsx`, `finland.ts`, `account-menu.tsx`, `dependencies`, `Product`, `category-navigation.tsx`, `useSellerAuth`, `profile/page.tsx`, `app/layout.tsx`, `eslint.config.mjs Module`, `Button`, `Badge`, `Product Details & Variants (2)`, `account/page.tsx`, `Seller Dashboard & Atelier Management (2)`, `success/page.tsx`, `category-discovery.tsx`, `product-card.tsx`, `@phosphor-icons/react`, `product-details-view.tsx`, `Shipping & Posti Courier Tracking`, `edit/page.tsx`, `cookies/page.tsx`, `stores.api.ts`, `buyer-protection/page.tsx`, `help/page.tsx`, `returns/page.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `Global Navigation & Drawer` be split into smaller, more focused modules?**
  _Cohesion score 0.058173076923076925 - nodes in this community are weakly interconnected._