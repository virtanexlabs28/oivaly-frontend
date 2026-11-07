"use client";

import * as React from "react";
import Link from "next/link";
import { WarningCircleIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export interface CatalogErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function CatalogErrorState({
  message = "Unable to load products. Please check your network connection or try again shortly.",
  onRetry,
}: CatalogErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card/40 border border-destructive/30 my-4"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
        <WarningCircleIcon className="size-6" aria-hidden="true" />
      </div>

      <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground">
        Unable to load products
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-md">
        {message}
      </p>

      <div className="flex items-center gap-2.5 mt-6">
        {onRetry ? (
          <Button
            type="button"
            onClick={onRetry}
            size="sm"
            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium h-9 px-4"
          >
            <ArrowCounterClockwiseIcon className="size-3.5 mr-1.5" aria-hidden="true" />
            Try again
          </Button>
        ) : (
          <Button
            asChild
            size="sm"
            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium h-9 px-4"
          >
            <Link href="/search">
              <ArrowCounterClockwiseIcon className="size-3.5 mr-1.5" aria-hidden="true" />
              Reload catalog
            </Link>
          </Button>
        )}

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-none border-border/80 text-xs font-medium h-9 px-4"
        >
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
