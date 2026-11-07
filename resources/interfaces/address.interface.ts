/**
 * Customer address domain interfaces.
 * Aligned with backend customer-auth/entities/customer-address.entity.ts.
 */

export interface CustomerAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  apartment?: string | null;
  city: string;
  postalCode: string;
  country: string; // ISO 3166-1 alpha-2, default 'FI'
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateAddressInput = Omit<CustomerAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateAddressInput = Partial<CreateAddressInput>;
