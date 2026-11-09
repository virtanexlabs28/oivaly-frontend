# 🌲 Oivaly — Nordic Multi-Tenant Marketplace Ecosystem

An enterprise-grade, Scandinavian-inspired multi-vendor marketplace platform built for independent Nordic artisans, studio workshops, and discerning shoppers. Built strictly according to Finnish and EU eCommerce laws, featuring automated Finnish business ID verification (PRH/YTJ), standard 25.5% Finnish VAT calculations, 14-day statutory consumer withdrawal guarantees, multi-vendor cart isolation, and atomic escrow checkout.

---

## 📑 Table of Contents

1. [System Architecture Overview](#-system-architecture-overview)
2. [Ecosystem Repositories & Subsystems](#-ecosystem-repositories--subsystems)
   - [Marketplace Storefront (`multi-tanent-frontend`)](#1-marketplace-storefront-multi-tanent-frontend)
   - [Platform Administration Panel (`plartform-pannel`)](#2-platform-administration-panel-plartform-pannel)
   - [Core Multi-Tenant API (`multi-tanent-store-backend`)](#3-core-multi-tenant-api-multi-tanent-store-backend)
   - [Primary Managed Database (PostgreSQL 18.6)](#4-primary-database-postgresql-186)
3. [Finnish & EU Compliance Standards](#-finnish--eu-compliance-standards)
4. [Project Directory Layout](#-project-directory-layout)
5. [Environment Configuration Reference](#-environment-configuration-reference)
6. [Local Development & Quickstart](#-local-development--quickstart)
7. [Production Deployment (Vercel & Railway)](#-production-deployment-vercel--railway)
8. [Complete API Reference Directory](#-complete-api-reference-directory)
9. [Default Credentials & Initial Access](#-default-credentials--initial-access)

---

## 🏛️ System Architecture Overview

The Oivaly platform decouples public consumer storefronts, administrative operations, business logic, and relational persistence into an edge-distributed, containerized architecture.

```mermaid
flowchart TB
    subgraph VERCEL["Vercel Cloud Platform (Global Edge Network)"]
        direction LR
        MKT["Oivaly Marketplace Storefront<br/><b>Next.js 16 (App Router)</b><br/>• Public Catalog & Artisan Discovery<br/>• Multi-Vendor Cart & Escrow Checkout<br/>• Verified Customer Reviews<br/><i>(oivaly-market.vercel.app)</i>"]
        ADM["Oivaly Platform Panel<br/><b>Next.js Admin Dashboard</b><br/>• Merchant PRH / YTJ Verification<br/>• Multi-Tenant Catalog Moderation<br/>• Escrow & Payout Reconciliation"]
    end

    subgraph RAILWAY["Railway Cloud Infrastructure (Production Cluster)"]
        direction TB
        subgraph RAILWAY_API["Railway Container Engine"]
            API["Oivaly Core API Service<br/><b>NestJS (Node.js & TypeScript)</b><br/>• Multi-Tenant Domain Boundary<br/>• Role-Based Access Control (RBAC)<br/>• Atomic Inventory & 15-Min Reservation<br/>• Finnish VAT Engine (25.5% / 14% / 10%)<br/><i>(oivaly-backend-production.up.railway.app)</i>"]
        end

        subgraph RAILWAY_DB["Railway Managed Database Service"]
            DB[("Oivaly Primary Database<br/><b>PostgreSQL 18.6</b><br/>• Multi-Tenant Relational Schema<br/>• ACID Transactions & Cascading FKs<br/>• SSL-Encrypted Connection Pool")]
        end
    end

    MKT -->|"HTTPS / REST API<br/>(Client & Server Components)"| API
    ADM -->|"HTTPS / REST API<br/>(Bearer JWT Authorization)"| API
    API -->|"TypeORM Connection Pool<br/>(SSL TCP / Port 5432)"| DB

    classDef vercelNode fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef railwayNode fill:#181824,stroke:#a855f7,stroke-width:2px,color:#ffffff;
    classDef dbNode fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#ffffff;

    class MKT,ADM vercelNode;
    class API railwayNode;
    class DB dbNode;
```

---

## 📦 Ecosystem Repositories & Subsystems

### 1. Marketplace Storefront (`multi-tanent-frontend`)
- **Location**: `d:\BrothersITSolution\multi-tanent-frontend`
- **Hosting Provider**: **Vercel** (`oivaly-market.vercel.app`)
- **Target Audience**: End-consumers, shoppers, and registered artisan sellers.
- **Key Features**:
  - **Zero-Demo Policy**: 100% of catalog data, categories, stores, and products stream in real-time from the backend database. No static fixture mockups.
  - **Dynamic Department Navigation**: Dynamic category chips and circular discovery hub streaming from `GET /categories`.
  - **Curated Artisan Studios**: Highlights verified workshops with studio photos, Finnish city origins, and seller listings from `GET /marketplace/stores`.
  - **Atomic Multi-Vendor Cart**: Handles items across multiple independent makers simultaneously.
  - **Live Search & Fuzzy Filtering**: Instant multi-attribute search across prices, departments, and artisan studios.
  - **Nordic Sage Design System**: Minimalist Scandinavian design tokens using Tailwind CSS v4 and Radix UI primitives.

### 2. Platform Administration Panel (`plartform-pannel`)
- **Location**: `d:\BrothersITSolution\Client-Frontend\plartform-pannel`
- **Hosting Provider**: **Vercel**
- **Target Audience**: Platform Super Admins, Compliance Officers, and Operators.
- **Key Features**:
  - **Merchant Onboarding & KYC**: Verification of Finnish Business IDs (`Y-tunnus`) against official PRH/YTJ registry.
  - **Store Lifecycle Management**: Approval, suspension, review, and fee configuration for independent studios.
  - **Catalog Moderation**: Product publishing approvals, content vetting, and category tree management.
  - **Financial Reconciliation**: Escrow order holding, commission split calculations, and dispute arbitration.

### 3. Core Multi-Tenant API (`multi-tanent-store-backend`)
- **Location**: `d:\multi-tanent-store-backend`
- **Hosting Provider**: **Railway** (`oivaly-backend-production.up.railway.app`)
- **Framework**: **NestJS 11** with Express runtime, TypeScript, and TypeORM.
- **Architectural Highlights**:
  - **Granular RBAC**: 25+ permissions across `users`, `roles`, `permissions`, and `audit` domains.
  - **15-Minute Inventory Reservation**: Prevents checkout race conditions by temporarily locking stock quantities during payment initiation.
  - **Parent-to-Store Order Decomposition**: When a buyer purchases items from multiple makers, the checkout service creates one master Customer Order and automatically generates isolated Store Orders for each respective maker.
  - **Statutory Returns Engine**: Manages the mandatory 14-day consumer return window with automated audit trails.

### 4. Primary Database (PostgreSQL 18.6)
- **Engine**: **PostgreSQL 18.6** with UUIDv4 primary keys and strict foreign key integrity.
- **Hosting Provider**: **Railway Managed Database**
- **Security**: Auto-reconnecting connection pool over SSL (`ssl: { rejectUnauthorized: false }`).
- **Core Tables**: `users`, `roles`, `permissions`, `stores`, `categories`, `products`, `product_images`, `product_variants`, `orders`, `store_orders`, `order_items`, `reviews`, `audit_logs`.

---

## 🇫🇮 Finnish & EU Compliance Standards

| Regulatory Requirement | Implementation in Oivaly |
| :--- | :--- |
| **Finnish VAT (Arvonlisävero - ALV)** | Enforces Finnish standard rate of **25.5%** (updated September 2024), 14% reduced rate for food/catering, and 10% for books/cultural services. Displayed with transparent `incl. VAT` labeling on all cards. |
| **Business Verification (PRH / YTJ)** | Automated validation of Finnish Trade Register records (`Y-tunnus`, e.g., `1234567-8`) prior to merchant activation. |
| **Statutory 14-Day Right of Withdrawal** | Built-in consumer return portal (`/returns`, `/customer/returns`) fulfilling the EU Consumer Rights Directive and Finnish *Kuluttajansuojalaki*. |
| **Split-Escrow Settlement** | Funds held in platform escrow until carrier marks delivery as completed or statutory 14-day return period elapses. |
| **Posti & Nordic Shipping** | Integrated shipping manifests compatible with Posti and Matkahuolto parcel lockers. |

---

## 📁 Project Directory Layout

```
d:\
├── BrothersITSolution\
│   ├── multi-tanent-frontend\             # Public Marketplace (Next.js 16)
│   │   ├── app\                           # App Router routes (catalog, cart, checkout)
│   │   │   ├── categories\                # Department browsing
│   │   │   ├── gifts\                     # Gift guides (Live API)
│   │   │   ├── makers\                    # Artisan registry (Live API)
│   │   │   ├── new-arrivals\              # New drops (Live API)
│   │   │   ├── products\[slug]\           # Product Details Page
│   │   │   ├── search\                    # Search catalog
│   │   │   └── shops\[slug]\              # Maker Studio Storefront
│   │   ├── components\                    # UI & Home Components
│   │   │   ├── home\                      # Hero, FeaturedProducts, FeaturedSellers
│   │   │   ├── layout\                    # Header, Footer, Navigation
│   │   │   └── product\                   # ProductCard, RelatedProducts
│   │   ├── lib\                           # Finland helpers, resolvers, utils
│   │   └── resources\apis\                # Type-safe API clients (products, stores, categories)
│   │
│   └── Client-Frontend\
│       └── plartform-pannel\              # Admin Platform Control Panel
│           ├── app\                       # Admin routes (merchants, orders, catalog)
│           ├── components\                # Data tables, verification widgets
│           └── lib\                       # Platform auth & state management
│
└── multi-tanent-store-backend\            # Core NestJS API Engine
    ├── src\
    │   ├── admin\                         # Platform admin, RBAC, KYC verification
    │   ├── common\                        # Guards, interceptors, decorators
    │   ├── customer\                      # Consumer auth, cart, checkout, returns
    │   ├── database\                      # TypeORM configuration & status health checks
    │   ├── marketplace\                   # Public catalog endpoints (/marketplace)
    │   ├── products\                      # Product CRUD & inventory management
    │   ├── stores\                        # Store registration & isolation logic
    │   └── orders\                        # Multi-vendor parent/child order processing
    └── test\                              # Vitest & integration test suites
```

---

## ⚙️ Environment Configuration Reference

### 1. Marketplace Storefront (`multi-tanent-frontend/.env.local`)
```ini
# Core Backend API Connection (Live Railway Production Endpoint)
NEXT_PUBLIC_API_URL=https://oivaly-backend-production.up.railway.app

# Optional Local Override
# NEXT_PUBLIC_API_URL=http://localhost:4040

# Client Configuration
PORT=4242
NEXT_PUBLIC_SITE_URL=https://oivaly-market.vercel.app
NEXT_PUBLIC_DEFAULT_CURRENCY=EUR
NEXT_PUBLIC_DEFAULT_LOCALE=fi-FI
```

### 2. Platform Admin Panel (`plartform-pannel/.env.local`)
```ini
NEXT_PUBLIC_API_URL=https://oivaly-backend-production.up.railway.app
NEXT_PUBLIC_ADMIN_PORTAL_URL=https://admin.oivaly.com
```

### 3. NestJS Backend (`multi-tanent-store-backend/.env`)
```ini
PORT=4040
NODE_ENV=production

# Database Connection (Railway PostgreSQL)
DATABASE_URL=postgresql://postgres:PASSWORD@ROUNDROBIN.railway.internal:5432/railway
DB_HOST=ROUNDROBIN.railway.internal
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=railway
DB_SSL=true

# Security & JWT Tokens
JWT_ACCESS_SECRET=your-super-secure-jwt-access-secret-32-chars
JWT_REFRESH_SECRET=your-super-secure-jwt-refresh-secret-32-chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# CORS Allowed Origins
FRONTEND_URL=https://oivaly-market.vercel.app,http://localhost:4242,http://localhost:3000
```

---

## 🚦 Local Development & Quickstart

### Prerequisites
- **Node.js** v20.x or higher
- **Bun** v1.2+ (Recommended for frontend and backend)
- **PostgreSQL** 16+ (or connection to Railway staging database)

### Step 1: Start the NestJS Backend
```bash
cd d:\multi-tanent-store-backend
bun install
bun run start:dev
# Backend runs at http://localhost:4040
# Swagger API docs available at http://localhost:4040/api/docs
```

### Step 2: Start the Marketplace Storefront
```bash
cd d:\BrothersITSolution\multi-tanent-frontend
bun install
bun dev
# Frontend runs at http://localhost:4242
```

### Step 3: Start the Admin Platform Panel
```bash
cd d:\BrothersITSolution\Client-Frontend\plartform-pannel
npm install
npm run dev
# Admin dashboard runs at http://localhost:3000
```

---

## 🚀 Production Deployment (Vercel & Railway)

### Frontend Deployment (Vercel)
Both frontends are optimized for Vercel's global Edge network.
- **Repository**: [`https://github.com/virtanexlabs28/oivaly-frontend`](https://github.com/virtanexlabs28/oivaly-frontend)
- **Build Command**: `bun run build`
- **Output Directory**: `.next`
- **Deployment Trigger**: Automated upon git push to `main` branch.

### Backend Deployment (Railway)
The backend runs as a high-performance containerized service on Railway.
- **Service Name**: `oivaly-backend`
- **Production URL**: `https://oivaly-backend-production.up.railway.app`
- **Health Checks**:
  - `GET /database/health` $\rightarrow$ Returns `200 OK` when PostgreSQL connection pool is healthy.
  - `GET /database/status` $\rightarrow$ Diagnostics, latency, and connection details.

---

## 📡 Complete API Reference Directory

### Public Marketplace (`/marketplace`, `/categories`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/marketplace` | Paginated live product catalog with filters (`search`, `categoryId`, `minPrice`, `maxPrice`, `storeId`). |
| `GET` | `/marketplace/stores` | Verified maker directory with studio profiles and featured listings. |
| `GET` | `/marketplace/stores/:id` | Individual artisan atelier profile and contact information. |
| `GET` | `/categories` | Active marketplace department categories tree. |
| `GET` | `/marketplace/reviews` | Verified buyer customer reviews. |

### Customer Commerce (`/customer`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/customer/auth/register` | Customer sign-up with Finnish address validation. |
| `POST` | `/customer/auth/login` | Issues customer JWT token. |
| `GET` | `/customer/cart` | Active multi-vendor customer cart. |
| `POST` | `/customer/cart/items` | Adds item to cart with inventory check. |
| `POST` | `/customer/checkout` | Creates order with 15-minute stock lock. |
| `POST` | `/customer/returns` | Submits statutory 14-day return request. |

### Merchant Studio (`/store`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/store-auth/register` | Studio onboarding application with Business ID (`Y-tunnus`). |
| `GET` | `/store/profile` | Studio profile, banner, and settings. |
| `POST` | `/store/products` | Publishes new small-batch artisan product. |
| `GET` | `/store/orders` | Store-specific orders pending workshop dispatch. |

### Platform Administration (`/admin`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/admin/auth/login` | Super admin and staff authentication. |
| `GET` | `/admin/stores` | Studio applications pending PRH/YTJ verification. |
| `PATCH` | `/admin/stores/:id/status` | Approves or suspends a merchant studio. |
| `GET` | `/admin/audit-logs` | Tamper-evident administrative audit log stream. |

---

## 🔑 Default Credentials & Initial Access

On initial database boot, the backend automatically seeds system permissions and the primary platform super administrator:

| Domain | Role | Default Email | Default Password |
| :--- | :--- | :--- | :--- |
| **Platform Admin** | `SUPER_ADMIN` | `admin@platform.com` | `Admin@123456` |
| **Artisan Studio** | Verified Maker | `nordic@artisan.fi` | *Configured on registration* |
| **Shopper** | Verified Buyer | `buyer@oivaly.fi` | *Configured on checkout/registration* |

> [!NOTE]
> For production environments, immediately rotate the super admin password upon initial setup via the Platform Admin settings panel or `/admin/users/password` endpoint.

---

## 📜 License & Intellectual Property

Copyright © 2026 Oivaly Oy / Brothers IT Solution. All rights reserved.
Built for the Finnish slow-craft community with modern web performance and Scandinavian functional elegance.
