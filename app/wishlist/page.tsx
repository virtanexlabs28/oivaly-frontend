"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon,
  ArrowRightIcon,
  StorefrontIcon,
  PackageIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatFinnishCurrency } from "@/lib/finland";

import type { Product } from "@/resources/interfaces/product.interface";

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const [movingAll, setMovingAll] = React.useState(false);
  const [addedItemIds, setAddedItemIds] = React.useState<Record<string, boolean>>({});

  const handleAddToCart = async (item: (typeof items)[0]) => {
    // Construct lightweight product representation
    const productPayload: Product = {
      id: item.productId,
      name: item.name,
      slug: item.slug,
      price: item.price,
      featuredImageUrl: item.imageUrl,
      storeId: item.storeId || "",
      status: "PUBLISHED",
      createdAt: "",
      updatedAt: "",
      store: item.storeName ? { id: item.storeId || "", name: item.storeName, status: "ACTIVE" } : undefined,
    };

    try {
      await addItem({ product: productPayload, quantity: 1 });
      setAddedItemIds((prev) => ({ ...prev, [item.productId]: true }));
      setTimeout(() => {
        setAddedItemIds((prev) => ({ ...prev, [item.productId]: false }));
      }, 2000);
    } catch {
      toast.error("Could not add item to cart.");
    }
  };

  const handleMoveAllToCart = async () => {
    if (items.length === 0) return;
    setMovingAll(true);
    try {
      for (const item of items) {
        const productPayload: Product = {
          id: item.productId,
          name: item.name,
          slug: item.slug,
          price: item.price,
          featuredImageUrl: item.imageUrl,
          storeId: item.storeId || "",
          status: "PUBLISHED",
          createdAt: "",
          updatedAt: "",
          store: item.storeName ? { id: item.storeId || "", name: item.storeName, status: "ACTIVE" } : undefined,
        };
        await addItem({ product: productPayload, quantity: 1 });
      }
      toast.success(`Moved ${items.length} item${items.length > 1 ? "s" : ""} to your shopping cart!`);
    } catch {
      toast.error("Some items could not be moved to cart.");
    } finally {
      setMovingAll(false);
    }
  };

  return (
    <div className="min-h-[75vh] bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center space-x-2 text-xs text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">&bull;</li>
            <li className="text-foreground font-medium" aria-current="page">
              Wishlist
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/80 gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <span>My Wishlist</span>
              {items.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-brand-pale-sage text-brand-deep-forest text-xs font-semibold px-2.5 py-0.5 rounded-full"
                >
                  {items.length} {items.length === 1 ? "item" : "items"}
                </Badge>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Curated handmade and design creations saved for your Nordic lifestyle.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={clearWishlist}
                className="text-xs h-9 border-border text-muted-foreground hover:text-destructive hover:border-destructive/30"
              >
                <TrashIcon className="size-3.5 mr-1.5" />
                Clear Wishlist
              </Button>
              <Button
                size="sm"
                onClick={handleMoveAllToCart}
                disabled={movingAll}
                className="text-xs h-9 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
              >
                <ShoppingBagIcon className="size-4 mr-1.5" />
                {movingAll ? "Moving items..." : "Move All to Cart"}
              </Button>
            </div>
          )}
        </div>

        {/* Content: Wishlist Grid or Empty State */}
        {items.length === 0 ? (
          <div className="py-16 sm:py-24 text-center max-w-md mx-auto">
            <div className="size-16 rounded-full bg-brand-pale-sage/60 text-primary mx-auto flex items-center justify-center mb-5">
              <HeartIcon className="size-8" weight="light" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Your wishlist is currently empty
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Explore independent Finnish studios, ceramists, glassmakers, and Nordic designers.
              Click the heart icon on any creation to save it here for later.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild className="w-full sm:w-auto bg-primary text-primary-foreground text-xs uppercase tracking-wider font-semibold h-10 px-6">
                <Link href="/categories">
                  <span>Explore Categories</span>
                  <ArrowRightIcon className="size-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto text-xs uppercase tracking-wider font-semibold h-10 px-6">
                <Link href="/">
                  <span>Featured Collections</span>
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const isAdded = addedItemIds[item.productId];

              return (
                <div
                  key={item.productId}
                  className="group relative flex flex-col bg-card border border-border/80 rounded-xs overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square w-full bg-muted/30 overflow-hidden">
                    <Link href={`/products/${item.slug || item.productId}`} className="block size-full">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="size-full flex flex-col items-center justify-center text-muted-foreground/50">
                          <PackageIcon className="size-8" />
                          <span className="text-[10px] mt-1">Nordic Artisan Item</span>
                        </div>
                      )}
                    </Link>

                    {/* Quick Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.productId)}
                      className="absolute top-2.5 right-2.5 size-8 rounded-full bg-background/90 backdrop-blur-xs text-muted-foreground hover:text-destructive flex items-center justify-center shadow-xs transition-colors"
                      title="Remove from wishlist"
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {item.storeName && (
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1 truncate">
                          <StorefrontIcon className="size-3 text-primary shrink-0" />
                          <span className="truncate">{item.storeName}</span>
                        </p>
                      )}
                      <Link
                        href={`/products/${item.slug || item.productId}`}
                        className="font-heading text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
                      >
                        {item.name}
                      </Link>
                    </div>

                    <div className="space-y-3 pt-1 border-t border-border/60">
                      <div className="flex items-baseline justify-between">
                        <span className="font-heading text-base font-bold text-foreground">
                          {formatFinnishCurrency(item.price)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">VAT 25.5% included</span>
                      </div>

                      {/* Add to Cart CTA */}
                      <Button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className={`w-full text-xs font-semibold uppercase tracking-wider h-9 transition-colors ${
                          isAdded
                            ? "bg-emerald-700 text-white hover:bg-emerald-800"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <CheckIcon className="size-4 mr-1.5" />
                            <span>In Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBagIcon className="size-3.5 mr-1.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
