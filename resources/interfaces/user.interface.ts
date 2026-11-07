/**
 * User and customer domain interfaces.
 * Aligned with backend users/entities/user.entity.ts.
 */

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  status: UserStatus;
  isEmailVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  addresses?: CustomerAddressSummary[];
}

export interface CustomerAddressSummary {
  id: string;
  fullName: string;
  city: string;
  country: string;
  isDefault: boolean;
}
