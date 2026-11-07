"use client";

import * as React from "react";
import { toast } from "sonner";
import { cartApi } from "@/resources/apis/cart.api";
import { getAccessToken } from "@/lib/auth-token";
import type { Product, ProductVariant } from "@/resources/interfaces/product.interface";
import type { CartSummaryResponse } from "@/resources/interfaces/cart.interface";

export interface ClientCartItem {
  id: string; // Unique cart item ID (or generated client ID for guest)
  productId: string;
  productName: string;
  productSlug?: string;
  variantId?: string | null;
  variantName?: string | null;
  sku?: string | null;
  imageUrl?: string | null;
  unitPrice: number;
  quantity: number;
  storeId: string;
  storeName: string;
  stock?: number;
}

export interface CartContextType {
  items: ClientCartItem[];
  cartCount: number;
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  isLoading: boolean;
  addItem: (params: {
    product: Product;
    variant?: ProductVariant | null;
    quantity?: number;
  }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isItemInCart: (productId: string, variantId?: string | null) => boolean;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "nordic_cart_items";
const CART_CHANGED_EVENT = "nordic_cart_changed";

function subscribeCart(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CART_CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CART_CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const EMPTY_CART: ClientCartItem[] = [];
let cachedCartSnapshot: ClientCartItem[] = EMPTY_CART;
let cachedCartRaw: string | null = null;

function getClientCartSnapshot(): ClientCartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (raw !== cachedCartRaw) {
    cachedCartRaw = raw;
    try {
      cachedCartSnapshot = raw ? JSON.parse(raw) : EMPTY_CART;
    } catch {
      cachedCartSnapshot = EMPTY_CART;
    }
  }
  return cachedCartSnapshot;
}

function getServerCartSnapshot(): ClientCartItem[] {
  return EMPTY_CART;
}

function saveCart(items: ClientCartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(CART_CHANGED_EVENT));
  } catch {
    // Ignore storage write issues
  }
}

function mapBackendCartToItems(backendCart: CartSummaryResponse): ClientCartItem[] {
  const result: ClientCartItem[] = [];
  if (!backendCart.stores) return result;

  for (const store of backendCart.stores) {
    for (const item of store.items) {
      result.push({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        variantId: item.variantId,
        variantName: item.variantDescription,
        sku: item.sku,
        imageUrl: item.imageUrl,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        storeId: store.storeId,
        storeName: store.storeName,
        stock: item.availableStock,
      });
    }
  }
  return result;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = React.useSyncExternalStore(
    subscribeCart,
    getClientCartSnapshot,
    getServerCartSnapshot
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchBackendCart = React.useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;

    try {
      const backendCart = await cartApi.getCart();
      const mapped = mapBackendCartToItems(backendCart);
      saveCart(mapped);
    } catch {
      // Fallback silently to existing local storage items
    }
  }, []);

  // Sync with backend on authentication
  React.useEffect(() => {
    if (getAccessToken()) {
      fetchBackendCart();
    }

    window.addEventListener("nordic_auth_changed", fetchBackendCart);
    return () => {
      window.removeEventListener("nordic_auth_changed", fetchBackendCart);
    };
  }, [fetchBackendCart]);

  const addItem = React.useCallback(
    async ({
      product,
      variant,
      quantity = 1,
    }: {
      product: Product;
      variant?: ProductVariant | null;
      quantity?: number;
    }) => {
      setIsLoading(true);
      const token = getAccessToken();
      const safeQuantity = Math.max(1, quantity);

      // Determine product image
      const primaryImage =
        product.images?.find((img) => img.isPrimary)?.url ||
        product.images?.[0]?.url ||
        product.featuredImageUrl ||
        null;

      // Determine price
      const price = variant && variant.price !== undefined && variant.price !== null
        ? Number(variant.price)
        : Number(product.price);

      const storeId = product.storeId || product.store?.id || "store-default";
      const storeName = product.store?.name || "Oivaly Artisan Studio";

      // 1. If authenticated, try backend first
      if (token) {
        try {
          const backendCart = await cartApi.addItem({
            productId: product.id,
            variantId: variant?.id,
            quantity: safeQuantity,
          });
          const mapped = mapBackendCartToItems(backendCart);
          saveCart(mapped);
          toast.success(`${product.name} added to cart! (${safeQuantity} item${safeQuantity > 1 ? "s" : ""})`);
          setIsLoading(false);
          return;
        } catch (err: unknown) {
          console.warn("Backend addItem failed, falling back to client storage:", err);
        }
      }

      // 2. Client / Guest fallback
      const currentItems = getClientCartSnapshot();
      const existingIdx = currentItems.findIndex(
        (i) => i.productId === product.id && (variant?.id ? i.variantId === variant.id : true)
      );

      let updated: ClientCartItem[];
      if (existingIdx >= 0) {
        updated = [...currentItems];
        const curr = updated[existingIdx];
        const newQty = curr.quantity + safeQuantity;
        updated[existingIdx] = {
          ...curr,
          quantity: newQty,
        };
      } else {
        const newItem: ClientCartItem = {
          id: `client-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          variantId: variant?.id || product.variants?.[0]?.id || null,
          variantName: variant?.name || variant?.sku || product.variants?.[0]?.sku || null,
          sku: variant?.sku || product.sku || null,
          imageUrl: primaryImage,
          unitPrice: price,
          quantity: safeQuantity,
          storeId,
          storeName,
          stock: variant?.stockQuantity ?? 99,
        };
        updated = [newItem, ...currentItems];
      }

      saveCart(updated);
      toast.success(`${product.name} added to cart! (${safeQuantity} item${safeQuantity > 1 ? "s" : ""})`);
      setIsLoading(false);
    },
    []
  );

  const updateQuantity = React.useCallback(
    async (itemId: string, newQuantity: number) => {
      const validQty = Math.max(1, newQuantity);
      const token = getAccessToken();

      if (token && !itemId.startsWith("client-")) {
        try {
          const backendCart = await cartApi.updateItem(itemId, validQty);
          const mapped = mapBackendCartToItems(backendCart);
          saveCart(mapped);
          return;
        } catch (err: unknown) {
          console.warn("Backend updateItem failed:", err);
        }
      }

      // Fallback local update
      const currentItems = getClientCartSnapshot();
      const updated = currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: validQty } : item
      );
      saveCart(updated);
    },
    []
  );

  const removeItem = React.useCallback(
    async (itemId: string) => {
      const token = getAccessToken();
      const currentItems = getClientCartSnapshot();
      const itemToRemove = currentItems.find((i) => i.id === itemId);

      if (token && !itemId.startsWith("client-")) {
        try {
          const backendCart = await cartApi.removeItem(itemId);
          const mapped = mapBackendCartToItems(backendCart);
          saveCart(mapped);
          if (itemToRemove) {
            toast.info(`Removed "${itemToRemove.productName}" from cart`);
          }
          return;
        } catch (err: unknown) {
          console.warn("Backend removeItem failed:", err);
        }
      }

      // Fallback local remove
      const updated = currentItems.filter((item) => item.id !== itemId);
      saveCart(updated);

      if (itemToRemove) {
        toast.info(`Removed "${itemToRemove.productName}" from cart`);
      }
    },
    []
  );

  const clearCart = React.useCallback(async () => {
    const token = getAccessToken();
    if (token) {
      try {
        await cartApi.clearCart();
      } catch {
        // Ignore
      }
    }
    saveCart([]);
    toast.info("Your shopping cart has been cleared");
  }, []);

  const isItemInCart = React.useCallback(
    (productId: string, variantId?: string | null): boolean => {
      return items.some(
        (i) => i.productId === productId && (variantId ? i.variantId === variantId : true)
      );
    },
    [items]
  );

  // Calculations
  const cartCount = React.useMemo(
    () => items.reduce((acc, curr) => acc + curr.quantity, 0),
    [items]
  );

  const subtotal = React.useMemo(
    () => Number(items.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0).toFixed(2)),
    [items]
  );

  // Free delivery for orders >= 50 EUR, otherwise 4.90 EUR
  const shippingAmount = React.useMemo(
    () => (items.length === 0 ? 0 : subtotal >= 50 ? 0 : 4.9),
    [items.length, subtotal]
  );

  // Finnish standard VAT 25.5% (included in price)
  const taxAmount = React.useMemo(
    () => Number(((subtotal * 0.255) / 1.255).toFixed(2)),
    [subtotal]
  );

  const totalAmount = React.useMemo(
    () => Number((subtotal + shippingAmount).toFixed(2)),
    [subtotal, shippingAmount]
  );

  const value = React.useMemo<CartContextType>(
    () => ({
      items,
      cartCount,
      subtotal,
      shippingAmount,
      taxAmount,
      totalAmount,
      currency: "EUR",
      isLoading,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart: fetchBackendCart,
      isItemInCart,
    }),
    [
      items,
      cartCount,
      subtotal,
      shippingAmount,
      taxAmount,
      totalAmount,
      isLoading,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      fetchBackendCart,
      isItemInCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
