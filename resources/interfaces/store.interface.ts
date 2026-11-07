/**
 * Store (Seller / Tenant) domain interfaces.
 * Aligned with backend stores/entities/store.entity.ts.
 */

export type StoreStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ACTIVE'
  | 'SUSPENDED';

export interface Store {
  id: string;
  name: string;
  legalBusinessName: string;
  businessId: string; // Finnish Business ID (Y-tunnus: XXXXXXX-Y)
  vatId?: string | null; // Finnish VAT ID (FIXXXXXXXX)
  address: string;
  phone: string;
  contactName: string;
  status: StoreStatus;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  websiteUrl?: string | null;
  currency: string;
  timezone: string;
  sellerAgreementAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSummary {
  id: string;
  name: string;
  logoUrl?: string | null;
  status: StoreStatus;
}
