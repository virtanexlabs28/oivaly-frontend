"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onSearchSubmit?: (query: string) => void;
  id?: string;
  size?: "default" | "sm" | "lg";
}

function SearchBarFallback({
  placeholder = "Search for handcrafted ceramics, linen, jewelry, and gifts...",
  className,
  size = "default",
}: {
  placeholder?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  const sizeClasses = {
    sm: "h-9 text-xs",
    default: "h-10 text-xs sm:text-sm",
    lg: "h-11 text-sm",
  }[size];

  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-muted-foreground">
        <MagnifyingGlassIcon className="size-4" aria-hidden="true" />
      </div>
      <input
        type="search"
        disabled
        placeholder={placeholder}
        aria-hidden="true"
        className={cn(
          "w-full rounded-full border border-input bg-card pl-10 pr-12 text-foreground placeholder:text-muted-foreground outline-none opacity-80 shadow-2xs",
          sizeClasses
        )}
      />
    </div>
  );
}

function SearchBarForm({
  placeholder = "Search for handcrafted ceramics, linen, jewelry, and gifts...",
  className,
  autoFocus = false,
  onSearchSubmit,
  id = "marketplace-search",
  size = "default",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [query, setQuery] = React.useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = React.useState(urlQuery);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Adjust state during render when URL query changes (React 19 pattern)
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    const targetUrl = `/search?q=${encodeURIComponent(trimmed)}`;
    router.push(targetUrl);

    if (onSearchSubmit) {
      onSearchSubmit(trimmed);
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const sizeClasses = {
    sm: "h-9 text-xs pl-9 pr-16",
    default: "h-10 text-xs sm:text-sm pl-10 pr-20",
    lg: "h-11 text-sm pl-11 pr-24",
  }[size];

  const buttonSizeClasses = {
    sm: "size-7 right-1",
    default: "h-8 px-3.5 right-1 text-xs",
    lg: "h-9 px-4 right-1 text-xs",
  }[size];

  return (
    <form
      role="search"
      aria-label="Product Search"
      onSubmit={handleSubmit}
      className={cn("relative flex w-full items-center", className)}
    >
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>

      <div className="relative flex w-full items-center">
        {/* Search Icon Prefix */}
        <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-muted-foreground">
          <MagnifyingGlassIcon className="size-4" aria-hidden="true" />
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          id={id}
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className={cn(
            "w-full rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground transition-all duration-150 outline-none shadow-2xs",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            sizeClasses
          )}
        />

        {/* Clear Button (only when text present) */}
        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-14 sm:right-16 p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <XIcon className="size-3.5" aria-hidden="true" />
          </button>
        )}

        {/* Etsy-Style Search Action Button */}
        <button
          type="submit"
          aria-label="Submit search"
          className={cn(
            "absolute flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            buttonSizeClasses
          )}
        >
          <MagnifyingGlassIcon className="size-3.5 sm:mr-1" weight="bold" aria-hidden="true" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </form>
  );
}

/**
 * Reusable product search component with internal Suspense boundary
 * to ensure SSR & Next.js 16 Partial Prerendering compatibility.
 */
export function SearchBar(props: SearchBarProps) {
  return (
    <React.Suspense
      fallback={
        <SearchBarFallback
          placeholder={props.placeholder}
          className={props.className}
          size={props.size}
        />
      }
    >
      <SearchBarForm {...props} />
    </React.Suspense>
  );
}
