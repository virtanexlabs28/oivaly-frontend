"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  HeartIcon,
  ShoppingBagIcon,
  SpinnerIcon,
  CheckIcon,
  LightningIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "./quantity-selector";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { toast } from "sonner";
import type { Product, ProductVariant } from "@/resources/interfaces/product.interface";
import { cn } from "@/lib/utils";

export interface ProductPurchaseActionsProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  personalizationText?: string;
  className?: string;
}

export function ProductPurchaseActions({
  product,
  selectedVariant,
  personalizationText = "",
  className,
}: ProductPurchaseActionsProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = React.useState(1);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isBuyingNow, setIsBuyingNow] = React.useState(false);
  const [justAdded, setJustAdded] = React.useState(false);

  const isWishlisted = isInWishlist(product.id);

  // Check if product has variants that require selection
  const hasMultipleVariants = (product.variants?.length || 0) > 1;
  const isVariantRequired = hasMultipleVariants && !selectedVariant;

  // Determine stock availability
  const currentStock = selectedVariant
    ? selectedVariant.stockQuantity
    : product.variants?.[0]?.stockQuantity ?? (product.trackInventory ? 10 : 99);

  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = async () => {
    if (isVariantRequired) {
      toast.warning("Please select an option before adding to cart.");
      return;
    }

    if (isOutOfStock) {
      toast.error("This item is temporarily out of stock.");
      return;
    }

    setIsAdding(true);

    try {
      await addItem({
        product,
        variant: selectedVariant,
        quantity,
      });

      if (personalizationText.trim()) {
        toast.success(`Personalization noted: "${personalizationText.trim()}"`);
      }

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add to cart.";
      toast.error(msg);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (isVariantRequired) {
      toast.warning("Please select an option before proceeding to checkout.");
      return;
    }

    if (isOutOfStock) {
      toast.error("This item is temporarily out of stock.");
      return;
    }

    setIsBuyingNow(true);

    try {
      await addItem({
        product,
        variant: selectedVariant,
        quantity,
      });

      router.push("/cart");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to proceed to checkout.";
      toast.error(msg);
      setIsBuyingNow(false);
    }
  };

  const handleWishlistToggle = () => {
    const primaryImage =
      product.images?.find((img) => img.isPrimary)?.url ||
      product.images?.[0]?.url ||
      product.featuredImageUrl ||
      null;

    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug || product.id,
      price: Number(selectedVariant?.price ?? product.price),
      imageUrl: primaryImage,
      storeName: product.store?.name,
      storeId: product.storeId || product.store?.id,
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* 1. Quantity Selector & In-Stock indication */}
      <div className="flex items-center gap-4">
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Quantity
          </span>
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            max={Math.max(1, Math.min(currentStock, 99))}
            disabled={isOutOfStock}
          />
        </div>

        <div className="pt-5">
          {isOutOfStock ? (
            <span className="text-xs font-semibold text-destructive">
              Currently out of stock
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              In stock: <strong className="text-foreground">{currentStock} available</strong>
            </span>
          )}
        </div>
      </div>

      {/* 2. Primary Actions: Add to Cart, Buy Now & Wishlist */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            className={cn(
              "flex-1 h-11 text-xs font-semibold uppercase tracking-wider rounded-none transition-all",
              justAdded
                ? "bg-emerald-700 text-white hover:bg-emerald-800"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isAdding ? (
              <>
                <SpinnerIcon className="size-4 animate-spin mr-2" aria-hidden="true" />
                <span>Adding...</span>
              </>
            ) : justAdded ? (
              <>
                <CheckIcon className="size-4 mr-1.5" aria-hidden="true" />
                <span>Added to cart!</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of stock</span>
            ) : (
              <>
                <ShoppingBagIcon className="size-4 mr-2" aria-hidden="true" />
                <span>Add to cart</span>
              </>
            )}
          </Button>

          {/* Wishlist Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleWishlistToggle}
            aria-label={
              isWishlisted
                ? `Remove from wishlist: ${product.name}`
                : `Add to wishlist: ${product.name}`
            }
            className={cn(
              "size-11 shrink-0 rounded-none border-border/80 transition-colors",
              isWishlisted && "text-destructive border-destructive/40 bg-destructive/5"
            )}
          >
            <HeartIcon
              className="size-5"
              weight={isWishlisted ? "fill" : "regular"}
              aria-hidden="true"
            />
          </Button>
        </div>

        {/* Etsy-Style "Buy it now" direct checkout button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleBuyNow}
          disabled={isBuyingNow || isOutOfStock}
          className="w-full h-10 text-xs font-semibold uppercase tracking-wider rounded-none border-foreground/30 hover:bg-muted text-foreground transition-all"
        >
          {isBuyingNow ? (
            <>
              <SpinnerIcon className="size-3.5 animate-spin mr-2" aria-hidden="true" />
              <span>Redirecting...</span>
            </>
          ) : (
            <>
              <LightningIcon className="size-3.5 mr-1.5 text-amber-500" weight="fill" />
              <span>Buy it now</span>
            </>
          )}
        </Button>
      </div>

      {isVariantRequired && (
        <p className="text-[11px] text-amber-700 dark:text-amber-400" role="alert">
          * Please select an option above to continue.
        </p>
      )}
    </div>
  );
}
