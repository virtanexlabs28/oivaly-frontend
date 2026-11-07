import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, SparkleIcon, HeartIcon } from "@phosphor-icons/react/dist/ssr";
import { formatFinnishCurrency } from "@/lib/finland";

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

const EDITORS_PICKS_DATA: EditorPickItem[] = [
  {
    id: "pick-1",
    tag: "Personalized Gift",
    title: "Hand-Stamped Sterling Silver Initial Band",
    maker: "Kallio Silversmiths",
    city: "Helsinki",
    price: 89.0,
    slug: "hand-forged-sterling-silver-ring",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
    storeId: "store-kallio-silver",
  },
  {
    id: "pick-2",
    tag: "Studio Tableware",
    title: "Hand-Thrown Speckled Stoneware Teapot",
    maker: "Kupittaa Ceramics",
    city: "Turku",
    price: 72.0,
    slug: "handcrafted-ceramic-coffee-mug",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop",
    storeId: "store-kupittaa",
  },
  {
    id: "pick-3",
    tag: "Heirloom Craft",
    title: "Solid Finnish Birch Serving Platter",
    maker: "Helsinki Woodcraft",
    city: "Helsinki",
    price: 52.0,
    slug: "carved-solid-oak-serving-board",
    imageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=600&auto=format&fit=crop",
    storeId: "store-hki-wood",
  },
  {
    id: "pick-4",
    tag: "Nordic Comfort",
    title: "Waffle-Weave Pure Linen Bath Sheet",
    maker: "Lapland Linen Studio",
    city: "Rovaniemi",
    price: 46.0,
    slug: "pure-washed-linen-tablecloth",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop",
    storeId: "store-lapin-pellava",
  },
];

/**
 * Etsy-inspired "Editor's Picks" Discovery Section.
 * Highlights handpicked gifting ideas and heirloom pieces with rich maker attribution.
 */
export function EditorsPicks() {
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
            href="/search?q=handcrafted"
            className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span>View gift guide</span>
            <ArrowRightIcon className="size-3.5 ml-1" aria-hidden="true" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EDITORS_PICKS_DATA.map((item) => (
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

