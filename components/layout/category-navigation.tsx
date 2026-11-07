"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PROVISIONAL_CATEGORIES, type NavCategory } from "@/config/navigation";
import { categoriesApi } from "@/resources/apis/categories.api";

export interface CategoryNavigationProps {
  categories?: NavCategory[];
  className?: string;
}

function CategoryNavigationList({
  categories: initialCategories,
  className,
}: CategoryNavigationProps) {
  const pathname = usePathname();
  const [categories, setCategories] = React.useState<NavCategory[]>(
    initialCategories || []
  );

  React.useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
      return;
    }

    let isMounted = true;
    categoriesApi
      .getCategories("ACTIVE")
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setCategories(
            data.map((c) => ({
              title: c.name,
              titleEn: c.name,
              slug: c.slug,
              href: `/categories/${c.slug || c.id}`,
              description: c.description || undefined,
            }))
          );
        } else if (isMounted && (!initialCategories || initialCategories.length === 0)) {
          setCategories(PROVISIONAL_CATEGORIES);
        }
      })
      .catch(() => {
        if (isMounted && (!initialCategories || initialCategories.length === 0)) {
          setCategories(PROVISIONAL_CATEGORIES);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialCategories]);

  return (
    <nav
      aria-label="Marketplace categories"
      className={cn(
        "w-full bg-background/95 backdrop-blur-xs",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-start gap-3 sm:gap-6 overflow-x-auto py-2.5 scrollbar-none text-xs font-medium">
          {categories.map((cat) => {
            const isActive = pathname === cat.href;

            return (
              <li key={cat.slug} className="shrink-0">
                <Link
                  href={cat.href}
                  className={cn(
                    "relative inline-flex items-center px-3 py-1.5 text-muted-foreground transition-all duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-full hover:bg-muted/60 whitespace-nowrap",
                    isActive &&
                      "text-foreground font-semibold bg-brand-pale-sage/60 dark:bg-muted/80 shadow-2xs"
                  )}
                >
                  <span>{cat.title}</span>
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function CategoryNavigationFallback({
  categories = PROVISIONAL_CATEGORIES,
  className,
}: CategoryNavigationProps) {
  return (
    <nav
      aria-label="Marketplace categories"
      className={cn("w-full bg-background/95 backdrop-blur-xs", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none text-xs font-medium">
          {categories.map((cat) => (
            <li key={cat.slug} className="shrink-0">
              <Link
                href={cat.href}
                className="inline-flex items-center px-3 py-1.5 text-muted-foreground transition-all duration-150 hover:text-foreground rounded-full whitespace-nowrap"
              >
                {cat.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/**
 * Desktop horizontal category navigation bar below the primary header.
 * Wrapped in Suspense for Next.js 16 Partial Prerendering compatibility.
 */
export function CategoryNavigation(props: CategoryNavigationProps) {
  return (
    <React.Suspense fallback={<CategoryNavigationFallback {...props} />}>
      <CategoryNavigationList {...props} />
    </React.Suspense>
  );
}
