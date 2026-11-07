import { apiClient } from './client';
import { getAccessToken } from '@/lib/auth-token';
import type {
  CustomerAuthTokens,
  RegisterCustomerResponse,
  CustomerProfileData,
  UpdateCustomerProfileInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  GenericMessageResponse,
} from '../interfaces/auth.interface';

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Customer Authentication & Identity API client.
 * Calls backend /customer/auth endpoints.
 */
export const authApi = {
  /**
   * Registers a new customer account.
   */
  async register(data: RegisterPayload): Promise<RegisterCustomerResponse> {
    return apiClient<RegisterCustomerResponse>('/customer/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Logs in an existing customer, returning tokens and profile.
   */
  async login(data: LoginPayload): Promise<CustomerAuthTokens> {
    return apiClient<CustomerAuthTokens>('/customer/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Verifies customer email using token sent via email.
   */
  async verifyEmail(data: VerifyEmailInput): Promise<GenericMessageResponse> {
    return apiClient<GenericMessageResponse>('/customer/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Requests a new email verification token.
   */
  async resendVerification(email: string): Promise<GenericMessageResponse> {
    return apiClient<GenericMessageResponse>('/customer/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Requests a password reset link.
   */
  async forgotPassword(data: ForgotPasswordInput): Promise<GenericMessageResponse> {
    return apiClient<GenericMessageResponse>('/customer/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Resets password using token and new password.
   */
  async resetPassword(data: ResetPasswordInput): Promise<GenericMessageResponse> {
    return apiClient<GenericMessageResponse>('/customer/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Retrieves current customer profile and address book.
   */
  async getProfile(tokenOverride?: string): Promise<CustomerProfileData> {
    const token = tokenOverride || getAccessToken();
    return apiClient<CustomerProfileData>('/customer/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
    });
  },

  /**
   * Updates customer personal profile details (name, phone).
   */
  async updateProfile(
    data: UpdateCustomerProfileInput,
    tokenOverride?: string
  ): Promise<CustomerProfileData> {
    const token = tokenOverride || getAccessToken();
    return apiClient<CustomerProfileData>('/customer/auth/profile', {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(data),
    });
  },
};
