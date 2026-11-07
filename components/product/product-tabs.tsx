"use client";

import * as React from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Product } from "@/resources/interfaces/product.interface";
import type { Store } from "@/resources/interfaces/store.interface";
import { cn } from "@/lib/utils";
import {
  ShieldCheckIcon,
  TruckIcon,
  ArrowCounterClockwiseIcon,
  StorefrontIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";

export interface ProductTabsProps {
  product: Product;
  className?: string;
}

export function ProductTabs({ product, className }: ProductTabsProps) {
  const store = product.store;
  const fullStore =
    product.store && "address" in product.store ? (product.store as Store) : null;

  const effectiveMaker = store?.name || "Nordic Artisan Bakery";
  const effectiveAddress =
    fullStore?.address ||
    (store && "address" in store ? (store as unknown as { address?: string }).address : null) ||
    "Aleksanterinkatu 15, 00100 Helsinki, Finland";

  const productNameLower = (product.name || "").toLowerCase();
  const isTech = productNameLower.includes("iphone") || productNameLower.includes("phone");
  const isCeramic =
    productNameLower.includes("ceramic") ||
    productNameLower.includes("ramekin") ||
    productNameLower.includes("bowl") ||
    productNameLower.includes("mug") ||
    productNameLower.includes("baking");

  // Extract seller-configured specifications if present in description
  const descriptionText = product.description || "";
  const matMatch = descriptionText.match(/- \*\*Materials:\*\* ([^\n\r]+)/);
  const dimMatch = descriptionText.match(/- \*\*Dimensions:\*\* ([^\n\r]+)/);
  const careMatch = descriptionText.match(/- \*\*Care Instructions:\*\* ([^\n\r]+)/);
  const origMatch = descriptionText.match(/- \*\*Workshop Origin:\*\* ([^\n\r]+)/);

  const effectiveMaterials =
    matMatch?.[1]?.trim() ||
    (isTech
      ? "Aerospace-grade Aluminum, Ceramic Shield front, textured matte glass back"
      : isCeramic
      ? "High-fire stoneware clay, non-toxic food-safe mineral glaze"
      : "Sustainable natural materials, artisan handcrafted");

  const effectiveDimensions =
    dimMatch?.[1]?.trim() ||
    (isTech
      ? "147.6 mm × 71.6 mm × 7.80 mm (171 grams)"
      : isCeramic
      ? "Ø 9.5 cm × H 5.2 cm (Volume: ~220 ml / 7.5 oz)"
      : "Standard workshop dimensions (refer to option selection)");

  const effectiveCare =
    careMatch?.[1]?.trim() ||
    (isCeramic
      ? "Oven safe to 250°C (480°F), microwave & dishwasher safe. Avoid sudden thermal shocks."
      : isTech
      ? "IP68 water & dust resistance. Clean with soft, slightly damp, lint-free cloth."
      : "Hand clean with gentle soap and water. Dry thoroughly.");

  const effectiveWorkshopLocation =
    origMatch?.[1]?.trim() || effectiveAddress;

  // Clean description narrative without specifications markdown
  const cleanDescription = descriptionText.split(/### Specifications/i)[0].trim();

  return (
    <div className={cn("pt-8 border-t border-border/70", className)}>
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start border-b border-border/70 bg-transparent p-0 rounded-none h-auto gap-4 sm:gap-8 overflow-x-auto scrollbar-none">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent px-1 pb-3 text-xs sm:text-sm font-medium text-muted-foreground transition-colors data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:bg-transparent"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="specs"
            className="rounded-none border-b-2 border-transparent px-1 pb-3 text-xs sm:text-sm font-medium text-muted-foreground transition-colors data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:bg-transparent"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="maker"
            className="rounded-none border-b-2 border-transparent px-1 pb-3 text-xs sm:text-sm font-medium text-muted-foreground transition-colors data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:bg-transparent"
          >
            About Maker
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="rounded-none border-b-2 border-transparent px-1 pb-3 text-xs sm:text-sm font-medium text-muted-foreground transition-colors data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:bg-transparent"
          >
            Shipping &amp; Returns
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Description */}
        <TabsContent value="description" className="pt-6 space-y-4">
          <div className="prose prose-sm max-w-2xl text-muted-foreground leading-relaxed space-y-4">
            {cleanDescription ? (
              cleanDescription.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-foreground/90">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-foreground/90">
                Each piece is crafted with meticulous care by independent artisans. Highlighting natural textures and enduring craftsmanship, this item is built for daily appreciation and long-lasting quality.
              </p>
            )}

            {/* Highlights block */}
            <div className="mt-6 pt-5 border-t border-border/60">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
                Item Highlights
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-emerald-600 shrink-0" weight="fill" />
                  <span>Handcrafted &amp; dispatched directly by independent artisan workshop</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-emerald-600 shrink-0" weight="fill" />
                  <span>Sourced from high-grade, sustainable materials</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-emerald-600 shrink-0" weight="fill" />
                  <span>Oivaly Buyer Protection included on every order</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-emerald-600 shrink-0" weight="fill" />
                  <span>Fast tracked delivery to your door or nearest pick-up locker</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Specifications */}
        <TabsContent value="specs" className="pt-6">
          <div className="max-w-2xl border border-border/70 bg-card overflow-hidden">
            <Table>
              <TableBody className="text-xs">
                {product.sku && (
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground w-1/3 py-2.5">
                      SKU Code
                    </TableCell>
                    <TableCell className="text-foreground font-mono py-2.5">{product.sku}</TableCell>
                  </TableRow>
                )}
                {product.category?.name && (
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground py-2.5">
                      Category
                    </TableCell>
                    <TableCell className="text-foreground py-2.5">
                      {product.category.name}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground py-2.5">
                    Materials &amp; Composition
                  </TableCell>
                  <TableCell className="text-foreground py-2.5">
                    {effectiveMaterials}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground py-2.5">
                    Dimensions &amp; Sizing
                  </TableCell>
                  <TableCell className="text-foreground py-2.5">
                    {effectiveDimensions}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground py-2.5">
                    Care &amp; Usage Instructions
                  </TableCell>
                  <TableCell className="text-foreground py-2.5">
                    {effectiveCare}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground py-2.5">
                    Workshop Origin
                  </TableCell>
                  <TableCell className="text-foreground py-2.5">
                    {effectiveWorkshopLocation}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground py-2.5">
                    Finnish VAT (ALV)
                  </TableCell>
                  <TableCell className="text-foreground py-2.5">
                    {product.vatRate ? `${product.vatRate}%` : "25.5%"} (
                    {product.vatIncluded !== false ? "included in price" : "calculated at checkout"})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground py-2.5">
                    Return Policy
                  </TableCell>
                  <TableCell className="text-foreground py-2.5">
                    {product.isReturnEligible !== false
                      ? "14-Day Statutory Returns (Standard statutory consumer rights for unused items)"
                      : "Personalized / Made-to-order (Exempt from standard statutory returns)"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground py-2.5">
                    Fulfillment
                  </TableCell>
                  <TableCell className="text-foreground py-2.5">
                    Dispatched directly by independent maker ({effectiveMaker})
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 3: About Maker */}
        <TabsContent value="maker" className="pt-6 space-y-4">
          <div className="max-w-xl border border-border/70 bg-card p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <StorefrontIcon className="size-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-foreground">
                    {effectiveMaker}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{effectiveWorkshopLocation}</p>
                </div>
              </div>

              {store?.id && (
                <Link
                  href={`/shops/${store.id}`}
                  className="text-xs text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shrink-0"
                >
                  Visit storefront &rarr;
                </Link>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/60">
              You are supporting an independent artisan workshop based in {effectiveWorkshopLocation}. Every order is prepared by hand with genuine care, ensuring high craftsmanship and supporting local creative enterprise.
            </p>

            <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p>
                <strong>Business ID:</strong> {fullStore?.businessId || "FI3492819-2"}
              </p>
              <p>
                <strong>Finnish VAT ID:</strong> {fullStore?.vatId || "FI34928192"}
              </p>
              <p>
                <strong>Workshop Location:</strong> Aleksanterinkatu 15
              </p>
              <p>
                <strong>Support Contact:</strong> {fullStore?.phone || "+358 40 123 4567"}
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Shipping & Returns */}
        <TabsContent value="shipping" className="pt-6 space-y-6 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          {/* Shipping */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TruckIcon className="size-4.5 text-primary shrink-0" />
              <h4 className="font-semibold text-sm text-foreground">
                Fast Nordic Delivery (2–4 business days)
              </h4>
            </div>
            <p>
              Tracked dispatch to local parcel pick-up lockers (Posti, Matkahuolto) or direct to your door.
            </p>
            <p>
              All orders are packaged and dispatched directly from the independent maker&apos;s workshop at {effectiveWorkshopLocation}. As soon as your order is on its way, you will receive an email confirmation with an active parcel tracking code.
            </p>
          </div>

          {/* Returns */}
          <div className="pt-4 border-t border-border/60 space-y-3">
            <div className="flex items-center gap-2">
              <ArrowCounterClockwiseIcon className="size-4.5 text-primary shrink-0" />
              <h4 className="font-semibold text-sm text-foreground">
                14-Day Statutory Returns
              </h4>
            </div>
            <p>
              Standard 14-day statutory return rights for unused items. If for any reason you are not completely satisfied with your purchase, you have 14 days from delivery to request a return. Items must be in their original, unused condition with all tags and protective packaging intact.
            </p>
          </div>

          {/* Buyer Protection */}
          <div className="pt-4 border-t border-border/60 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="size-4.5 text-primary shrink-0" />
              <h4 className="font-semibold text-sm text-foreground">
                Oivaly Buyer Protection
              </h4>
            </div>
            <p>
              Secure bank-grade encrypted checkout. Payment is held securely until your order is fulfilled and delivered to your complete satisfaction.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
