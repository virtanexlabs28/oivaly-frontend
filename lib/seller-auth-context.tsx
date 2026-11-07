"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  sellerAuthApi,
  type SellerUserInfo,
  type SellerStoreInfo,
  type SellerLoginPayload,
  type SellerSignupPayload,
  type SellerLoginResponse,
  type SellerSignupResponse,
} from "@/resources/apis/seller-auth.api";
import { env } from "@/lib/env";

interface SellerAuthState {
  user: SellerUserInfo | null;
  store: SellerStoreInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface SellerAuthContextType {
  seller: SellerUserInfo | null;
  store: SellerStoreInfo | null;
  isSellerAuthenticated: boolean;
  sellerToken: string | null;
  login: (payload: SellerLoginPayload) => Promise<SellerLoginResponse>;
  signup: (payload: SellerSignupPayload) => Promise<SellerSignupResponse>;
  refreshSession: () => Promise<boolean>;
  logout: () => void;
}

const SellerAuthContext = React.createContext<SellerAuthContextType | undefined>(undefined);

export const SELLER_TOKEN_KEY = "nordic_seller_token";
export const SELLER_REFRESH_TOKEN_KEY = "nordic_seller_refresh_token";
export const SELLER_USER_KEY = "nordic_seller_user";
export const SELLER_STORE_KEY = "nordic_seller_store";
export const SELLER_AUTH_EVENT = "nordic_seller_auth_changed";

// Session max age read from environment configuration (NEXT_PUBLIC_SELLER_SESSION_DAYS)
export const SELLER_SESSION_MAX_AGE_SECONDS = env.sellerSessionMaxAgeSeconds;

/**
 * Cookie persistence helper for 7-day seller session
 */
function setSellerCookie(name: string, value: string, maxAgeSeconds: number = SELLER_SESSION_MAX_AGE_SECONDS) {
  if (typeof document === "undefined") return;
  const isSecure = typeof location !== "undefined" && location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secureFlag}`;
}

function deleteSellerCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Validates JWT expiry with a 30-second leeway buffer
 */
export function isJwtExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    if (!parsed.exp) return false;
    // Check if expired (with 30-second clock skew buffer)
    return Date.now() >= (parsed.exp * 1000) - 30000;
  } catch {
    return false;
  }
}

function getStoredSellerAuth(): SellerAuthState {
  if (typeof window === "undefined") {
    return { user: null, store: null, accessToken: null, refreshToken: null };
  }
  try {
    let token = localStorage.getItem(SELLER_TOKEN_KEY);
    let refreshToken = localStorage.getItem(SELLER_REFRESH_TOKEN_KEY);
    const userRaw = localStorage.getItem(SELLER_USER_KEY);
    const storeRaw = localStorage.getItem(SELLER_STORE_KEY);

    // Synchronize from cookie if localStorage was cleared
    if (!token) {
      token = getCookieValue(SELLER_TOKEN_KEY);
      if (token) {
        localStorage.setItem(SELLER_TOKEN_KEY, token);
      }
    }
    if (!refreshToken) {
      refreshToken = getCookieValue(SELLER_REFRESH_TOKEN_KEY);
      if (refreshToken) {
        localStorage.setItem(SELLER_REFRESH_TOKEN_KEY, refreshToken);
      }
    }

    // If access token is expired but refresh token exists, we retain state to attempt refresh
    if (token && isJwtExpired(token)) {
      if (!refreshToken || isJwtExpired(refreshToken)) {
        // Both tokens expired - clear session
        localStorage.removeItem(SELLER_TOKEN_KEY);
        localStorage.removeItem(SELLER_REFRESH_TOKEN_KEY);
        localStorage.removeItem(SELLER_USER_KEY);
        localStorage.removeItem(SELLER_STORE_KEY);
        deleteSellerCookie(SELLER_TOKEN_KEY);
        deleteSellerCookie(SELLER_REFRESH_TOKEN_KEY);
        return { user: null, store: null, accessToken: null, refreshToken: null };
      }
    }

    return {
      accessToken: token,
      refreshToken: refreshToken,
      user: userRaw ? JSON.parse(userRaw) : null,
      store: storeRaw ? JSON.parse(storeRaw) : null,
    };
  } catch {
    return { user: null, store: null, accessToken: null, refreshToken: null };
  }
}

export function SellerAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authState, setAuthState] = React.useState<SellerAuthState>(getStoredSellerAuth);

  // Background token refresh handler
  const refreshSession = React.useCallback(async (): Promise<boolean> => {
    const refreshToken = authState.refreshToken || (typeof window !== "undefined" ? localStorage.getItem(SELLER_REFRESH_TOKEN_KEY) : null);
    if (!refreshToken || isJwtExpired(refreshToken)) {
      return false;
    }

    try {
      const response = await sellerAuthApi.refresh(refreshToken);
      if (typeof window !== "undefined") {
        localStorage.setItem(SELLER_TOKEN_KEY, response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem(SELLER_REFRESH_TOKEN_KEY, response.refreshToken);
        }
        localStorage.setItem(SELLER_USER_KEY, JSON.stringify(response.user));
        localStorage.setItem(SELLER_STORE_KEY, JSON.stringify(response.store));

        // Keep session cookies set for 7 days
        setSellerCookie(SELLER_TOKEN_KEY, response.accessToken, SELLER_SESSION_MAX_AGE_SECONDS);
        if (response.refreshToken) {
          setSellerCookie(SELLER_REFRESH_TOKEN_KEY, response.refreshToken, SELLER_SESSION_MAX_AGE_SECONDS);
        }
        window.dispatchEvent(new Event(SELLER_AUTH_EVENT));
      }

      setAuthState({
        user: response.user,
        store: response.store,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken || refreshToken,
      });

      return true;
    } catch {
      return false;
    }
  }, [authState.refreshToken]);

  // Initial check on mount: if access token is expired, auto-refresh seamlessly
  React.useEffect(() => {
    if (authState.accessToken && isJwtExpired(authState.accessToken)) {
      refreshSession();
    }
  }, [authState.accessToken, refreshSession]);

  React.useEffect(() => {
    // Sync on window focus or storage event
    const handleStorageChange = () => {
      setAuthState(getStoredSellerAuth());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(SELLER_AUTH_EVENT, handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(SELLER_AUTH_EVENT, handleStorageChange);
    };
  }, []);

  const login = React.useCallback(
    async (payload: SellerLoginPayload): Promise<SellerLoginResponse> => {
      const response = await sellerAuthApi.login(payload);

      if (typeof window !== "undefined") {
        // Store in localStorage
        localStorage.setItem(SELLER_TOKEN_KEY, response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem(SELLER_REFRESH_TOKEN_KEY, response.refreshToken);
        }
        localStorage.setItem(SELLER_USER_KEY, JSON.stringify(response.user));
        localStorage.setItem(SELLER_STORE_KEY, JSON.stringify(response.store));

        // Store in 7-day persistent cookies
        setSellerCookie(SELLER_TOKEN_KEY, response.accessToken, SELLER_SESSION_MAX_AGE_SECONDS);
        if (response.refreshToken) {
          setSellerCookie(SELLER_REFRESH_TOKEN_KEY, response.refreshToken, SELLER_SESSION_MAX_AGE_SECONDS);
        }

        window.dispatchEvent(new Event(SELLER_AUTH_EVENT));
      }

      setAuthState({
        user: response.user,
        store: response.store,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken || null,
      });

      return response;
    },
    []
  );

  const signup = React.useCallback(
    async (payload: SellerSignupPayload): Promise<SellerSignupResponse> => {
      return sellerAuthApi.signup(payload);
    },
    []
  );

  const logout = React.useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SELLER_TOKEN_KEY);
      localStorage.removeItem(SELLER_REFRESH_TOKEN_KEY);
      localStorage.removeItem(SELLER_USER_KEY);
      localStorage.removeItem(SELLER_STORE_KEY);
      deleteSellerCookie(SELLER_TOKEN_KEY);
      deleteSellerCookie(SELLER_REFRESH_TOKEN_KEY);
      window.dispatchEvent(new Event(SELLER_AUTH_EVENT));
    }

    setAuthState({
      user: null,
      store: null,
      accessToken: null,
      refreshToken: null,
    });

    router.push("/seller/login");
  }, [router]);

  const value = React.useMemo<SellerAuthContextType>(
    () => ({
      seller: authState.user,
      store: authState.store,
      isSellerAuthenticated: Boolean(
        authState.accessToken && !isJwtExpired(authState.accessToken) && authState.user
      ),
      sellerToken: authState.accessToken,
      login,
      signup,
      refreshSession,
      logout,
    }),
    [authState, login, signup, refreshSession, logout]
  );

  return <SellerAuthContext.Provider value={value}>{children}</SellerAuthContext.Provider>;
}

export function useSellerAuth() {
  const context = React.useContext(SellerAuthContext);
  if (!context) {
    throw new Error("useSellerAuth must be used within a SellerAuthProvider");
  }
  return context;
}
