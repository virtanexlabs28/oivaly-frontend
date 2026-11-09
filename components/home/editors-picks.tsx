import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, SparkleIcon } from "@phosphor-icons/react/dist/ssr";
import { formatFinnishCurrency } from "@/lib/finland";
import type { Product } from "@/resources/interfaces/product.interface";

export interface EditorPickItem {
  id: string;
  tag: string;
  title: string;
  maker: string;
  city: string;
  price: number;
  slug: string;
  imageUrl: string;
  storeId: string;
}

export interface EditorsPicksProps {
  realProducts?: Product[];
}

/**
 * Etsy-inspired "Editor's Picks" Discovery Section.
 * Highlights handpicked pieces with rich maker attribution from live products.
 */
export function EditorsPicks({ realProducts = [] }: EditorsPicksProps) {
  if (!realProducts || realProducts.length === 0) {
    return null;
  }

  const items: EditorPickItem[] = realProducts.slice(0, 4).map((p, idx) => {
    const primaryImg = p.images?.find((img) => img.isPrimary) || p.images?.[0];
    const tags = ["Featured Pick", "Artisan Craft", "Studio Drop", "Nordic Design"];
    return {
      id: p.id,
      tag: tags[idx % tags.length],
      title: p.name,
      maker: p.store?.name || "Independent Studio",
      city: "Finland",
      price: typeof p.price === "number" ? p.price : parseFloat(p.price) || 0,
      slug: p.slug,
      imageUrl: primaryImg?.url || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
      storeId: p.storeId || p.store?.id || "",
    };
  });

  return (
    <section
      aria-labelledby="editors-picks-heading"
      className="py-14 sm:py-20 bg-brand-warm-ivory/60 dark:bg-card/20 border-b border-border/70"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">
              <SparkleIcon className="size-3 text-primary" weight="fill" aria-hidden="true" />
              <span>Handpicked by Our Curators</span>
            </div>
            <h2
              id="editors-picks-heading"
              className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
            >
              Editor&apos;s Picks: Everyday Heirlooms
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-lg">
              Meaningful pieces crafted to be cherished, gifted, and used for decades.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span>View all products</span>
            <ArrowRightIcon className="size-3.5 ml-1" aria-hidden="true" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <article
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-md bg-card border border-border/80 hover:border-primary/50 hover:shadow-md transition-all duration-200"
            >
              {/* Product Image */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                <Link href={`/products/${item.slug}`} className="block size-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Tag Badge */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-background/90 backdrop-blur-xs text-foreground border border-border/80">
                  {item.tag}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-[11px] text-muted-foreground truncate mb-1">
                    <Link href={`/shops/${item.storeId}`} className="hover:text-foreground">
                      {item.maker} &bull; {item.city}
                    </Link>
                  </p>
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    <Link href={`/products/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h3>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    {formatFinnishCurrency(item.price)}
                  </span>
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>View item</span>
                    <ArrowRightIcon className="size-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
