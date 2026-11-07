import { apiClient } from './client';

export interface SellerStoreInfo {
  id: string;
  name: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
}

export interface SellerUserInfo {
  id: string;
  name: string;
  email: string;
}

export interface SellerLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: SellerUserInfo;
  store: SellerStoreInfo;
}

export interface SellerSignupResponse {
  message: string;
  store: SellerStoreInfo;
  user: SellerUserInfo;
}

export interface SellerProfileResponse {
  user: SellerUserInfo;
  store: SellerStoreInfo;
  role: string;
  permissions: string[];
}

export interface SellerLoginPayload {
  email: string;
  password: string;
}

export interface SellerSignupPayload {
  storeName: string;
  legalBusinessName: string;
  businessAddress: string;
  contactName: string;
  email: string;
  phone: string;
  password: string;
  businessId: string;
  vatId?: string;
  sellerAgreementAccepted: boolean;
}

export interface BusinessVerificationResult {
  valid: boolean;
  businessId: string;
  companyName?: string;
  companyForm?: string | null;
  registrationDate?: string | null;
  tradeRegisterStatus?: string | null;
  street?: string | null;
  postCode?: string | null;
  city?: string | null;
  fullAddress?: string | null;
  message?: string;
}

export const sellerAuthApi = {
  /**
   * Verify Finnish Business ID (Y-tunnus) with PRH / YTJ Open Data API
   */
  async verifyBusinessId(businessId: string): Promise<BusinessVerificationResult> {
    const cleanId = businessId.trim();
    const prhPublicBase = process.env.NEXT_PUBLIC_PRH_YTJ_API_URL || 'https://avoindata.prh.fi/opendata-ytj-api/v3';

    try {
      // First attempt via backend verification service
      return await apiClient<BusinessVerificationResult>(
        `/store-auth/verify-business-id?businessId=${encodeURIComponent(cleanId)}`,
        { method: 'GET' }
      );
    } catch {
      // Fallback: Direct query to PRH Open Data API if backend proxy is unavailable
      try {
        let formatted = cleanId.replace(/\s+/g, '');
        if (/^\d{8}$/.test(formatted)) {
          formatted = `${formatted.slice(0, 7)}-${formatted.slice(7)}`;
        }
        const res = await fetch(`${prhPublicBase.replace(/\/+$/, '')}/companies?businessId=${encodeURIComponent(formatted)}`);
        if (!res.ok) {
          return { valid: false, businessId: formatted, message: `PRH registry responded with HTTP ${res.status}` };
        }
        const data = await res.json();
        const companies = data?.companies || [];
        if (!companies.length || data?.totalResults === 0) {
          return { valid: false, businessId: formatted, message: 'Business ID (Y-tunnus) not found in the Finnish Trade Register (PRH / YTJ).' };
        }
        const comp = companies[0];
        const primaryAddress = comp?.addresses?.[0] || null;
        const postOffice = primaryAddress?.postOffices?.[0]?.city || null;
        const street = primaryAddress?.street ? `${primaryAddress.street} ${primaryAddress.buildingNumber || ''}`.trim() : null;
        const postCode = primaryAddress?.postCode || null;

        return {
          valid: true,
          businessId: comp?.businessId?.value || formatted,
          companyName: comp?.names?.[0]?.name || comp?.name || 'Registered Finnish Entity',
          companyForm: comp?.companyForms?.[0]?.name || null,
          registrationDate: comp?.registrationDate || comp?.businessId?.registrationDate || null,
          tradeRegisterStatus: comp?.tradeRegisterStatus === '1' ? 'Registered' : 'Active',
          street,
          postCode,
          city: postOffice,
          fullAddress: [street, postCode, postOffice, 'Finland'].filter(Boolean).join(', '),
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Registry lookup error';
        return { valid: false, businessId: cleanId, message: `Could not reach PRH / YTJ registry: ${msg}` };
      }
    }
  },

  /**
   * Seller / Store Admin Login
   */
  async login(payload: SellerLoginPayload): Promise<SellerLoginResponse> {
    return apiClient<SellerLoginResponse>('/store-auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Seller / Store Application Signup
   */
  async signup(payload: SellerSignupPayload): Promise<SellerSignupResponse> {
    return apiClient<SellerSignupResponse>('/store-auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch authenticated store admin profile
   */
  async getProfile(tokenOverride?: string): Promise<SellerProfileResponse> {
    const token =
      tokenOverride ||
      (typeof window !== 'undefined' ? localStorage.getItem('nordic_seller_token') : null);

    return apiClient<SellerProfileResponse>('/store-auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
    });
  },

  /**
   * Refresh seller authentication session (7 days)
   */
  async refresh(refreshToken: string): Promise<SellerLoginResponse> {
    return apiClient<SellerLoginResponse>('/store-auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  /**
   * Request password reset instructions
   */
  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    return apiClient<{ message: string; resetToken?: string }>('/store-auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/store-auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};
