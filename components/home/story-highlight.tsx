import * as React from "react";
import Link from "next/link";
import { ArrowRightIcon, BookOpenIcon, StorefrontIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

/**
 * Editorial Craft Story Highlight Section.
 * Highlights Scandinavian craft philosophy, slow living, and community values.
 */
export function StoryHighlight() {
  return (
    <section
      aria-labelledby="story-heading"
      className="py-16 sm:py-24 bg-brand-warm-ivory dark:bg-card/40 border-b border-border/70"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary bg-brand-pale-sage/80 dark:bg-muted mb-4 rounded-full">
          <BookOpenIcon className="size-3.5" aria-hidden="true" />
          <span>Our Philosophy</span>
        </div>

        <h2
          id="story-heading"
          className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground max-w-2xl mx-auto leading-tight"
        >
          A home for mindful Nordic craft and independent studios.
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
          We believe the most meaningful objects are made slowly and intentionally. 
          Our platform connects discerning shoppers directly with skilled woodworkers, ceramicists, 
          textile weavers, and silversmiths across Finland and the Nordic region.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="default" className="px-6 h-11 rounded-full text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/about">
              <span>Read our story</span>
              <ArrowRightIcon className="size-3.5 ml-1.5" aria-hidden="true" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="default"
            className="px-6 h-11 rounded-full text-xs sm:text-sm font-semibold border-border hover:bg-muted"
          >
            <Link href="/seller/signup">
              <StorefrontIcon className="size-4 mr-1.5 text-primary" aria-hidden="true" />
              <span>Sell on Oivaly</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
