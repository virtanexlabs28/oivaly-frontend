"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi, type LoginPayload, type RegisterPayload } from "@/resources/apis/auth.api";
import type { CustomerAuthTokens, RegisterCustomerResponse } from "@/resources/interfaces/auth.interface";
import {
  getAccessToken,
  setAuthSession,
  clearAuthSession,
  updateStoredUser,
} from "@/lib/auth-token";

export interface AuthContextType {
  user: CustomerAuthTokens["user"] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<RegisterCustomerResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

function subscribeAuth(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener("nordic_auth_changed", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("nordic_auth_changed", callback);
    window.removeEventListener("storage", callback);
  };
}

let cachedSnapshot: CustomerAuthTokens["user"] | null = null;
let cachedSnapshotString: string | null = null;

function getClientSnapshot(): CustomerAuthTokens["user"] | null {
  if (typeof window === "undefined") return null;
  const token = getAccessToken();
  if (!token) {
    cachedSnapshot = null;
    cachedSnapshotString = null;
    return null;
  }
  const raw = localStorage.getItem("nordic_customer_user");
  if (raw !== cachedSnapshotString) {
    cachedSnapshotString = raw;
    try {
      cachedSnapshot = raw ? JSON.parse(raw) : null;
    } catch {
      cachedSnapshot = null;
    }
  }
  return cachedSnapshot;
}

function getServerSnapshot(): CustomerAuthTokens["user"] | null {
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = React.useSyncExternalStore(subscribeAuth, getClientSnapshot, getServerSnapshot);
  const [isPending, setIsPending] = React.useState(false);

  // In the background after hydration, verify token validity against backend profile if token exists
  React.useEffect(() => {
    const token = getAccessToken();
    if (token) {
      authApi
        .getProfile(token)
        .then((profile) => {
          updateStoredUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            phone: profile.phone,
            isEmailVerified: profile.isEmailVerified,
          });
        })
        .catch(() => {
          clearAuthSession();
        });
    }
  }, []);

  const login = async (credentials: LoginPayload) => {
    setIsPending(true);
    try {
      const authTokens = await authApi.login(credentials);
      setAuthSession(authTokens);
      toast.success(`Welcome back, ${authTokens.user.name}!`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in. Please verify your credentials.";
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const register = async (data: RegisterPayload): Promise<RegisterCustomerResponse> => {
    setIsPending(true);
    try {
      const response = await authApi.register(data);
      toast.success("Account created successfully! Please check your email for verification.");
      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed. Please check your details.";
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  const logout = () => {
    clearAuthSession();
    toast.info("You have been signed out.");
    router.push("/");
  };

  const refreshUser = async () => {
    const token = getAccessToken();
    if (!token) return;

    try {
      const profile = await authApi.getProfile(token);
      updateStoredUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        phone: profile.phone,
        isEmailVerified: profile.isEmailVerified,
      });
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending,
        isAuthenticated: Boolean(user && getAccessToken()),
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
