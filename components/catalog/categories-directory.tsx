"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import type { MarketplaceCategory } from "@/lib/categories";

export interface CategoriesDirectoryProps {
  categories: MarketplaceCategory[];
}

export function CategoriesDirectory({ categories }: CategoriesDirectoryProps) {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>All Categories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/70">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block mb-1">
            Department Directory
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            All Departments & Categories
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Explore Nordic design, studio ceramics, handcrafted textiles, and unique pieces from independent makers.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="rounded-none text-xs">
          <Link href="/search">
            <span>Browse all products</span>
            <ArrowRightIcon className="size-3.5 ml-1.5" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col bg-card border border-border/70 hover:border-primary/50 hover:shadow-md transition-all duration-200 overflow-hidden rounded-md"
          >
            <div className="relative aspect-4/3 w-full bg-muted/40 overflow-hidden">
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="size-full flex items-center justify-center text-muted-foreground/40 text-xs">
                  Category
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white drop-shadow-xs">
                  {cat.name}
                </span>
                {typeof cat.productCount === "number" && (
                  <span className="text-[10px] font-medium text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
                    {cat.productCount} {cat.productCount === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 flex flex-1 flex-col justify-between">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {cat.description || (typeof cat.productCount === "number" && cat.productCount > 0
                  ? `Browse ${cat.productCount} live products in ${cat.name}.`
                  : `Explore unique pieces in this department.`)}
              </p>
              <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Explore department</span>
                <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
