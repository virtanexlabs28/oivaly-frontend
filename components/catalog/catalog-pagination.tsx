"use client";

import * as React from "react";
import Link from "next/link";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { buildCatalogUrl, type CatalogFilterState } from "@/lib/search-url";
import { cn } from "@/lib/utils";

export interface CatalogPaginationProps {
  total: number;
  page: number;
  limit: number;
  basePath: string;
  filters: CatalogFilterState;
  className?: string;
}

export function CatalogPagination({
  total,
  page,
  limit,
  basePath,
  filters,
  className,
}: CatalogPaginationProps) {
  const totalPages = Math.ceil(total / limit);

  // If only 1 page or no results, do not render pagination
  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (targetPage: number) => {
    return buildCatalogUrl(basePath, filters, {
      page: targetPage === 1 ? undefined : targetPage,
    });
  };

  // Build page numbers window (e.g. current ± 2)
  const pageNumbers: (number | "ellipsis")[] = [];
  const maxButtons = 5;

  if (totalPages <= maxButtons + 2) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
    if (page > 3) {
      pageNumbers.push("ellipsis");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (page < totalPages - 2) {
      pageNumbers.push("ellipsis");
    }
    pageNumbers.push(totalPages);
  }

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav
      role="navigation"
      aria-label="Sivutus / Pagination"
      className={cn("flex items-center justify-center pt-8 pb-4", className)}
    >
      <ul className="flex items-center gap-1 text-xs">
        {/* Previous Page */}
        <li>
          {isFirst ? (
            <span
              aria-disabled="true"
              className="flex h-8 items-center px-2.5 text-muted-foreground/40 cursor-not-allowed select-none border border-border/40"
            >
              <CaretLeftIcon className="size-3.5 mr-1" aria-hidden="true" />
              <span className="hidden sm:inline">Edellinen</span>
            </span>
          ) : (
            <Link
              href={getPageUrl(page - 1)}
              aria-label="Siirry edelliselle sivulle"
              className="flex h-8 items-center px-2.5 text-foreground hover:bg-muted border border-border/80 transition-colors"
            >
              <CaretLeftIcon className="size-3.5 mr-1" aria-hidden="true" />
              <span className="hidden sm:inline">Edellinen</span>
            </Link>
          )}
        </li>

        {/* Page numbers */}
        {pageNumbers.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <li
                key={`ellipsis-${index}`}
                className="flex size-8 items-center justify-center text-muted-foreground"
              >
                &hellip;
              </li>
            );
          }

          const isActive = item === page;

          return (
            <li key={item}>
              {isActive ? (
                <span
                  aria-current="page"
                  className="flex size-8 items-center justify-center font-semibold bg-primary text-primary-foreground border border-primary select-none"
                >
                  {item}
                </span>
              ) : (
                <Link
                  href={getPageUrl(item)}
                  aria-label={`Siirry sivulle ${item}`}
                  className="flex size-8 items-center justify-center text-foreground hover:bg-muted border border-border/80 transition-colors"
                >
                  {item}
                </Link>
              )}
            </li>
          );
        })}

        {/* Next Page */}
        <li>
          {isLast ? (
            <span
              aria-disabled="true"
              className="flex h-8 items-center px-2.5 text-muted-foreground/40 cursor-not-allowed select-none border border-border/40"
            >
              <span className="hidden sm:inline">Seuraava</span>
              <CaretRightIcon className="size-3.5 ml-1" aria-hidden="true" />
            </span>
          ) : (
            <Link
              href={getPageUrl(page + 1)}
              aria-label="Siirry seuraavalle sivulle"
              className="flex h-8 items-center px-2.5 text-foreground hover:bg-muted border border-border/80 transition-colors"
            >
              <span className="hidden sm:inline">Seuraava</span>
              <CaretRightIcon className="size-3.5 ml-1" aria-hidden="true" />
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
