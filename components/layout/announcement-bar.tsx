"use client";

import * as React from "react";
import Link from "next/link";
import { XIcon, SparkleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface AnnouncementBarProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  subMessage?: string;
  ctaText?: string;
  ctaHref?: string;
  dismissible?: boolean;
}

/**
 * Slim, responsive announcement bar placed above the primary header.
 * Uses restrained Scandinavian Pale Sage styling with accessible contrast
 * and an optional contextual link.
 */
export function AnnouncementBar({
  message = "Discover unique handcrafted pieces from independent Nordic makers",
  subMessage = "Free carbon-neutral delivery on orders over €50",
  ctaText = "Explore",
  ctaHref = "/categories",
  dismissible = true,
  className,
  ...props
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      aria-label="Promotional announcement"
      className={cn(
        "relative w-full bg-brand-deep-forest text-primary-foreground dark:bg-card dark:text-foreground border-b border-border/40 text-xs py-2 px-4 transition-all duration-200 select-none",
        className
      )}
      {...props}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-center text-center pr-7 sm:pr-0">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs font-normal tracking-tight">
          <SparkleIcon className="size-3 text-brand-pale-sage hidden sm:inline shrink-0" weight="fill" aria-hidden="true" />
          <span className="font-medium text-white dark:text-foreground">{message}</span>
          {subMessage && (
            <span className="hidden md:inline text-white/80 dark:text-muted-foreground">
              &bull; {subMessage}
            </span>
          )}
          {ctaHref && (
            <Link
              href={ctaHref}
              className="inline-flex items-center underline underline-offset-2 font-semibold text-white hover:text-brand-pale-sage dark:text-primary dark:hover:underline transition-colors ml-1"
            >
              {ctaText}
            </Link>
          )}
        </p>
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white dark:text-muted-foreground dark:hover:text-foreground rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
        >
          <XIcon className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </aside>
  );
}
