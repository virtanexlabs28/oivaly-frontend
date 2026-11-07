/**
 * Customer Authentication & Account Domain Interfaces.
 * Aligned with backend customer-auth/ entities and DTOs.
 */

import type { CustomerAddress } from './address.interface';

export interface CustomerAuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string | null;
    isEmailVerified: boolean;
    role: string;
  };
}

export interface RegisterCustomerResponse {
  message: string;
  userId: string;
  email: string;
}

export interface GenericMessageResponse {
  message: string;
}

export interface CustomerProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  status: string;
  isEmailVerified: boolean;
  addresses: CustomerAddress[];
  createdAt: string;
}

export interface UpdateCustomerProfileInput {
  name?: string;
  phone?: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface VerifyEmailInput {
  token: string;
}
