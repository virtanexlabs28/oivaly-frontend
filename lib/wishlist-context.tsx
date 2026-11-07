"use client";

import * as React from "react";
import { toast } from "sonner";

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string | null;
  storeName?: string;
  storeId?: string;
  addedAt: string;
}

export type WishlistItemInput = Omit<WishlistItem, "addedAt">;

export interface WishlistContextType {
  items: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: WishlistItemInput) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = React.createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "nordic_wishlist_items";
const WISHLIST_CHANGED_EVENT = "nordic_wishlist_changed";

function subscribeWishlist(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(WISHLIST_CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(WISHLIST_CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const EMPTY_WISHLIST: WishlistItem[] = [];
let cachedWishlistSnapshot: WishlistItem[] = EMPTY_WISHLIST;
let cachedWishlistRaw: string | null = null;

function getClientWishlistSnapshot(): WishlistItem[] {
  if (typeof window === "undefined") return EMPTY_WISHLIST;
  const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
  if (raw !== cachedWishlistRaw) {
    cachedWishlistRaw = raw;
    try {
      cachedWishlistSnapshot = raw ? JSON.parse(raw) : EMPTY_WISHLIST;
    } catch {
      cachedWishlistSnapshot = EMPTY_WISHLIST;
    }
  }
  return cachedWishlistSnapshot;
}

function getServerWishlistSnapshot(): WishlistItem[] {
  return EMPTY_WISHLIST;
}

function saveWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(WISHLIST_CHANGED_EVENT));
  } catch {
    // Ignore write errors
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const items = React.useSyncExternalStore(
    subscribeWishlist,
    getClientWishlistSnapshot,
    getServerWishlistSnapshot
  );

  const isInWishlist = React.useCallback(
    (productId: string): boolean => {
      return items.some((item) => item.productId === productId);
    },
    [items]
  );

  const toggleWishlist = React.useCallback(
    (product: WishlistItemInput): boolean => {
      const exists = items.some((item) => item.productId === product.productId);
      let updated: WishlistItem[];

      if (exists) {
        updated = items.filter((item) => item.productId !== product.productId);
        saveWishlist(updated);
        toast.info(`Removed "${product.name}" from your wishlist`);
        return false;
      } else {
        const newItem: WishlistItem = {
          ...product,
          addedAt: new Date().toISOString(),
        };
        updated = [newItem, ...items];
        saveWishlist(updated);
        toast.success(`Saved "${product.name}" to your wishlist`);
        return true;
      }
    },
    [items]
  );

  const removeFromWishlist = React.useCallback(
    (productId: string) => {
      const itemToRemove = items.find((item) => item.productId === productId);
      const updated = items.filter((item) => item.productId !== productId);
      saveWishlist(updated);
      if (itemToRemove) {
        toast.info(`Removed "${itemToRemove.name}" from your wishlist`);
      }
    },
    [items]
  );

  const clearWishlist = React.useCallback(() => {
    saveWishlist([]);
    toast.info("Your wishlist has been cleared");
  }, []);

  const value = React.useMemo<WishlistContextType>(
    () => ({
      items,
      wishlistCount: items.length,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [items, isInWishlist, toggleWishlist, removeFromWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
