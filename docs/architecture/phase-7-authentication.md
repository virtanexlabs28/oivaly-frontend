# Phase 7 — Authentication & Customer Accounts

## 1. Executive Summary & Objective

Phase 7 implements a secure, accessible, customer authentication and account management experience for the Finnish Multi-Vendor Marketplace. The visual architecture combines Scandinavian craftsmanship with a modern dark luxury split-card design for authentication entry points, and an uncluttered account portal.

---

## 2. Authentication UI & Layout Architecture

### 2.1 Dark Luxury Split-Card Layout (`AuthCardLayout`)
The customer entry flows (`/login`, `/register`, `/forgot-password`, `/reset-password`) are built around a focused split-card design:
- **Left Column: Atmospheric Visual Showcase**
  - Atmospheric Scandinavian twilight landscape photography (`public/images/auth-hero.jpg`).
  - Brand identity wordmark: `Oivaly`.
  - Glassmorphic "Back to website →" button for seamless return navigation.
  - Tagline: *"Capturing Moments, Creating Memories"*.
  - Minimalist pagination slider indicator pills.
- **Right Column: Form Panel**
  - Dark surfaces (`#252230` container, `#342f42` input fields, subtle `border-white/10`).
  - High-contrast typography with clear accessible error handling.
  - Custom password visibility toggles (`EyeIcon` / `EyeSlashIcon`).
  - Styled checkboxes for terms acknowledgement and session retention.
  - Solid accent submission button (`#715bc7` / `#624db5`).
  - Social authentication buttons for Google and Apple with authentic vector iconography.

### 2.2 Customer Account Dashboard (`/account/*`)
The authenticated customer portal provides account management:
- `/account`: Central account dashboard overview (profile snapshot, member tenure, email verification status, default delivery address card, security preview, and marketplace catalog link).
- `/account/profile`: Personal profile details editor (update full name and phone number).
- `/account/addresses`: Saved delivery address management with add/edit dialog, default address setting, delete action, and strict Finnish postal code validation.
- `/account/security`: Security settings (email verification trigger, password recovery, session logout).

---

## 3. Backend Integration & Security Architecture

### 3.1 Live Backend API Contract (`http://localhost:4040`)
The authentication system integrates with the real NestJS backend without mock state:
- `POST /customer/auth/register`: Creates new customer account (`name`, `email`, `password`, `phone`).
- `POST /customer/auth/login`: Authenticates customer and issues JWT tokens (`accessToken`, `refreshToken`, `user`).
- `GET /customer/auth/me`: Validates access token and returns authenticated customer entity.
- `GET /customer/auth/profile`: Retrieves customer profile including addresses and order history.
- `PUT /customer/auth/profile`: Updates profile name and phone.
- `POST /customer/auth/forgot-password`: Dispatches password reset token via email.
- `POST /customer/auth/reset-password`: Resets password using token verification.
- `GET /customer/addresses`: Lists saved shipping addresses.
- `POST /customer/addresses`: Creates new saved shipping address.
- `PUT /customer/addresses/:id`: Updates an existing address.
- `DELETE /customer/addresses/:id`: Deletes a saved address.
- `PATCH /customer/addresses/:id/default`: Designates the default shipping destination.

### 3.2 State Synchronization & Session Lifecycle
- `lib/auth-token.ts`:
  - Token persistence: Stores `nordic_access_token` and `nordic_refresh_token` in cookies for server-side Next.js middleware and API authorization headers.
  - User persistence: Stores customer metadata in `localStorage` (`nordic_customer_user`).
  - Reactive notifications: Dispatches custom `nordic_auth_changed` browser events upon session update or invalidation.
- `lib/auth-context.tsx`:
  - Uses React 19's `useSyncExternalStore` primitive for tear-free external storage synchronization.
  - Automatically handles cross-tab and in-tab authentication updates without cascading effect re-renders.
  - Asynchronously verifies token validity with the backend on initial client hydration.
- `middleware.ts`:
  - Route guard: Intercepts requests to `/account/:path*` and redirects unauthenticated users to `/login?returnUrl=...`.
  - Guest guard: Redirects authenticated users away from `/login` and `/register` directly to `/account`.
  - Open redirect protection: Validates and sanitizes all `returnUrl` parameters against untrusted origins.

---

## 4. Verification & Quality Assurance

- **TypeScript Compilation**: `bunx tsc --noEmit` passed with 0 errors.
- **ESLint Validation**: `bun run lint` passed with 0 errors.
- **Next.js Production Build**: `bun run build` compiled all 18 routes cleanly with Partial Prerendering (PPR).
