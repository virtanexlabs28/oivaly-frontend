import * as React from "react";
import {
  HandshakeIcon,
  ShieldCheckIcon,
  ArrowCounterClockwiseIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

const BENEFITS = [
  {
    icon: HandshakeIcon,
    title: "Direct from the Maker",
    description: "Every purchase directly supports independent Nordic creators and small family studios.",
  },
  {
    icon: CheckCircleIcon,
    title: "Transparent Specifications",
    description: "Clear information on sustainable materials, workshop origin, maker identity, and inclusive VAT.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure Checkout",
    description: "Encrypted transactions and reliable European payment standards protecting every order.",
  },
  {
    icon: ArrowCounterClockwiseIcon,
    title: "14-Day Statutory Returns",
    description: "Standard statutory return rights on eligible items for total peace of mind.",
  },
];

/**
 * Compact Marketplace Benefits & Trust Section.
 * Sets transparent customer expectations using verified Nordic e-commerce standards.
 */
export function MarketplaceBenefits() {
  return (
    <section
      aria-labelledby="benefits-heading"
      className="py-12 sm:py-16 bg-brand-warm-ivory/60 dark:bg-card/20 border-b border-border/70"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="benefits-heading" className="sr-only">
          Marketplace Trust and Customer Principles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="flex items-start gap-3.5 p-4 rounded-md bg-card border border-border/70 shadow-2xs hover:border-primary/40 transition-colors"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground">
                    {b.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
