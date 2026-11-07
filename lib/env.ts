/**
 * Centralized, type-safe environment configuration for Oivaly Frontend.
 * Reads runtime and build-time variables from process.env with documented fallbacks.
 */

export const env = {
  /**
   * Base URL of the backend API (multi-tanent-store-backend).
   * Example: http://localhost:4040
   */
  apiUrl: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4040').replace(/\/+$/, ''),

  /**
   * Base public URL of the storefront application.
   * Example: http://localhost:4242
   */
  appUrl: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4242').replace(/\/+$/, ''),

  /**
   * Seller atelier session duration in days.
   * Configured via NEXT_PUBLIC_SELLER_SESSION_DAYS (default: 7 days).
   */
  sellerSessionDays: Math.max(1, Number(process.env.NEXT_PUBLIC_SELLER_SESSION_DAYS || 7)),

  /**
   * Seller session duration converted to seconds for cookie max-age.
   */
  get sellerSessionMaxAgeSeconds(): number {
    return this.sellerSessionDays * 24 * 60 * 60;
  },

  /**
   * Customer buyer session duration in days.
   * Configured via NEXT_PUBLIC_CUSTOMER_SESSION_DAYS (default: 7 days).
   */
  customerSessionDays: Math.max(1, Number(process.env.NEXT_PUBLIC_CUSTOMER_SESSION_DAYS || 7)),

  /**
   * Customer session duration converted to seconds for cookie max-age.
   */
  get customerSessionMaxAgeSeconds(): number {
    return this.customerSessionDays * 24 * 60 * 60;
  },

  /**
   * Marketplace default currency code.
   * Example: EUR
   */
  currency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'EUR',

  /**
   * Standard Finnish VAT (ALV) rate percentage.
   * Example: 25.5
   */
  defaultVatRate: Number(process.env.NEXT_PUBLIC_DEFAULT_VAT_RATE || 25.5),

  /**
   * Platform commission percentage deducted from seller gross sales.
   * Example: 10 (representing 10% marketplace fee)
   */
  platformCommissionPercent: Number(process.env.NEXT_PUBLIC_PLATFORM_COMMISSION_PERCENT || 10),

  /**
   * Human-readable platform title.
   */
  platformName: process.env.NEXT_PUBLIC_PLATFORM_NAME || 'Oivaly',
} as const;
