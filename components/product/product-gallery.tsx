"use client";

import * as React from "react";
import Image from "next/image";
import {
  CaretLeftIcon,
  CaretRightIcon,
  MagnifyingGlassPlusIcon,
  PackageIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ProductImage } from "@/resources/interfaces/product.interface";
import { cn } from "@/lib/utils";

export interface ProductGalleryProps {
  images?: ProductImage[];
  productName: string;
  className?: string;
}

export function ProductGallery({
  images = [],
  productName,
  className,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isZoomOpen, setIsZoomOpen] = React.useState(false);
  const [imageErrorMap, setImageErrorMap] = React.useState<Record<string, boolean>>({});

  // Filter valid image URLs
  const validImages = React.useMemo(() => {
    return images.filter((img) => img && typeof img.url === "string" && img.url.trim() !== "");
  }, [images]);

  const activeImage = validImages[activeIndex] || validImages[0];
  const hasMultipleImages = validImages.length > 1;
  const isBroken = Boolean(activeImage && imageErrorMap[activeImage.url]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={cn("space-y-4 select-none", className)}>
      {/* 1. Main Display Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-card border border-border/70 group">
        {activeImage && !isBroken ? (
          <>
            <Image
              src={activeImage.url}
              alt={activeImage.altText || `${productName} - image ${activeIndex + 1}`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              onError={() => setImageErrorMap((prev) => ({ ...prev, [activeImage.url]: true }))}
              className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {/* Zoom / Lightbox Trigger */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              aria-label={`Enlarge image: ${productName}`}
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-none bg-background/90 text-foreground backdrop-blur-xs border border-border/60 hover:bg-background hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MagnifyingGlassPlusIcon className="size-4" aria-hidden="true" />
            </button>

            {/* Prev / Next controls for multiple images */}
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous image"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 flex size-8 sm:size-9 items-center justify-center rounded-none bg-background/90 text-foreground backdrop-blur-xs border border-border/60 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CaretLeftIcon className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next image"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 flex size-8 sm:size-9 items-center justify-center rounded-none bg-background/90 text-foreground backdrop-blur-xs border border-border/60 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CaretRightIcon className="size-4" aria-hidden="true" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex size-full flex-col items-center justify-center bg-muted/40 text-muted-foreground/50">
            <PackageIcon className="size-16" aria-hidden="true" />
            <span className="text-xs mt-2 font-medium">Image coming soon</span>
          </div>
        )}
      </div>

      {/* 2. Thumbnails Strip */}
      {hasMultipleImages && (
        <div
          role="region"
          aria-label="Product image thumbnails"
          className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none"
        >
          {validImages.map((img, idx) => {
            const isSelected = idx === activeIndex;

            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Select image ${idx + 1} of ${validImages.length}`}
                aria-pressed={isSelected}
                className={cn(
                  "relative aspect-square size-16 sm:size-20 shrink-0 overflow-hidden bg-muted/30 border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary ring-2 ring-primary/40 opacity-100"
                    : "border-border/70 opacity-70 hover:opacity-100 hover:border-foreground"
                )}
              >
                <Image
                  src={img.url}
                  alt={img.altText || `${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Lightbox Dialog */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent
          className="max-w-4xl p-0 border-0 bg-black/95 text-white overflow-hidden"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">
            Enlarged product image: {productName}
          </DialogTitle>
          <div className="relative aspect-square sm:aspect-4/3 w-full flex items-center justify-center">
            {activeImage && (
              <Image
                src={activeImage.url}
                alt={activeImage.altText || productName}
                fill
                sizes="(min-width: 1280px) 1000px, 100vw"
                className="object-contain p-4"
              />
            )}
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              aria-label="Close zoom preview"
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
