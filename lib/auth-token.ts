/**
 * Authentication token & session storage utilities.
 * Synchronizes HTTP cookies (for Next.js Middleware and SSR) with localStorage.
 */

import type { CustomerAuthTokens } from '@/resources/interfaces/auth.interface';
import { env } from '@/lib/env';

export const ACCESS_TOKEN_COOKIE = 'nordic_access_token';
export const REFRESH_TOKEN_COOKIE = 'nordic_refresh_token';
export const USER_STORAGE_KEY = 'nordic_user_session';

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === 'undefined') return;
  const isSecure = typeof location !== 'undefined' && location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secureFlag}`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAccessToken(): string | null {
  return getCookieValue(ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken(): string | null {
  return getCookieValue(REFRESH_TOKEN_COOKIE);
}

export function getStoredUser(): CustomerAuthTokens['user'] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthSession(data: CustomerAuthTokens) {
  // Store accessToken and refreshToken in cookies based on env session configuration
  setCookie(ACCESS_TOKEN_COOKIE, data.accessToken, env.customerSessionMaxAgeSeconds);
  if (data.refreshToken) {
    setCookie(REFRESH_TOKEN_COOKIE, data.refreshToken, env.customerSessionMaxAgeSeconds);
  }

  // Store user profile in localStorage for quick client-side rendering
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    } catch {
      // Ignore quota errors
    }
    window.dispatchEvent(new Event('nordic_auth_changed'));
  }
}

export function updateStoredUser(user: Partial<CustomerAuthTokens['user']>) {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredUser() || ({} as CustomerAuthTokens['user']);
    const updated = { ...current, ...user };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('nordic_auth_changed'));
  } catch {
    // Ignore quota errors
  }
}

export function clearAuthSession() {
  deleteCookie(ACCESS_TOKEN_COOKIE);
  deleteCookie(REFRESH_TOKEN_COOKIE);

  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // Ignore
    }
    window.dispatchEvent(new Event('nordic_auth_changed'));
  }
}
