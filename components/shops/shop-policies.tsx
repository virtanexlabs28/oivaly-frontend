import * as React from "react";
import {
  ShieldCheckIcon,
  PackageIcon,
  ArrowCounterClockwiseIcon,
  InfoIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface ShopPoliciesProps {
  shopName: string;
}

export function ShopPolicies({ shopName }: ShopPoliciesProps) {
  return (
    <section
      id="policies"
      aria-labelledby="shop-policies-heading"
      className="scroll-mt-32 pt-12 border-t border-border/70"
    >
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block mb-1">
            Transparency & Consumer Rights
          </span>
          <h2
            id="shop-policies-heading"
            className="font-heading text-xl sm:text-2xl font-semibold text-foreground tracking-tight"
          >
            Shop & Delivery Policies
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Orders from {shopName} adhere to Oivaly standards and Finnish consumer protection regulations.
          </p>
        </div>

        <div className="max-w-3xl border border-border/80 bg-card">
          <Accordion type="single" collapsible defaultValue="returns" className="w-full">
            {/* Returns & Cancellations */}
            <AccordionItem value="returns" className="border-b border-border/60 px-5">
              <AccordionTrigger className="text-xs sm:text-sm font-medium py-4 hover:no-underline">
                <div className="flex items-center gap-2.5 text-left">
                  <ArrowCounterClockwiseIcon className="size-4 text-primary shrink-0" aria-hidden="true" />
                  <span>14-Day Statutory Returns Policy</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4 pt-1 space-y-2">
                <p>
                  In accordance with the Finnish Consumer Protection Act (Kuluttajansuojalaki) and EU Distance Selling Regulations, consumers have a statutory 14-day right to cancel and return standard marketplace orders from the date of physical receipt.
                </p>
                <p>
                  Items must be returned in their original, unused condition with complete packaging. Unless otherwise stated by the maker or in the case of a defective item, return postage is paid by the purchaser. Made-to-order and custom personalized items are exempt from standard statutory returns.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Dispatch & Shipping */}
            <AccordionItem value="shipping" className="border-b border-border/60 px-5">
              <AccordionTrigger className="text-xs sm:text-sm font-medium py-4 hover:no-underline">
                <div className="flex items-center gap-2.5 text-left">
                  <PackageIcon className="size-4 text-primary shrink-0" aria-hidden="true" />
                  <span>Studio Dispatch & Packaging</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4 pt-1 space-y-2">
                <p>
                  Each piece is carefully inspected and packaged directly by {shopName} to ensure safe transit. Standard orders are typically dispatched within 1–3 business days.
                </p>
                <p>
                  Deliveries within Finland and the Nordic region are handled via tracked postal services (e.g. Posti or Matkahuolto). Real-time tracking details are provided via email as soon as the package is handed to the carrier.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Buyer Protection */}
            <AccordionItem value="buyer-protection" className="border-none px-5">
              <AccordionTrigger className="text-xs sm:text-sm font-medium py-4 hover:no-underline">
                <div className="flex items-center gap-2.5 text-left">
                  <ShieldCheckIcon className="size-4 text-primary shrink-0" aria-hidden="true" />
                  <span>Oivaly Buyer Protection</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4 pt-1 space-y-2">
                <p>
                  Every transaction made on Oivaly is protected by our platform guarantee. In the rare event an item is lost during shipment, arrives damaged, or significantly diverges from the maker&apos;s product specifications, you are eligible for an immediate replacement or full reimbursement.
                </p>
                <div className="flex items-start gap-2 p-2.5 bg-muted/50 rounded-xs text-[11px] text-muted-foreground mt-2">
                  <InfoIcon className="size-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Need assistance with an existing order? Reach out directly to the maker or contact our support team at support@nordicmarket.fi.
                  </span>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
