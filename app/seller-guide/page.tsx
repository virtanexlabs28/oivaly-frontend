"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpenIcon,
  StorefrontIcon,
  CameraIcon,
  CurrencyEurIcon,
  PackageIcon,
  BankIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CalculatorIcon,
  CheckCircleIcon,
  SparkleIcon,
  FileTextIcon,
  IdentificationBadgeIcon,
  TreeEvergreenIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react";

export default function SellerGuidePage() {
  const [calcPrice, setCalcPrice] = useState<number>(120);
  const [calcVatRate, setCalcVatRate] = useState<number>(25.5);
  const [calcIsVatInclusive, setCalcIsVatInclusive] = useState<boolean>(true);

  // Earnings calculation
  let customerGross = calcPrice;
  let vatAmount = 0;
  let netPriceBeforeVat = calcPrice;

  if (calcIsVatInclusive) {
    customerGross = calcPrice;
    netPriceBeforeVat = calcPrice / (1 + calcVatRate / 100);
    vatAmount = customerGross - netPriceBeforeVat;
  } else {
    netPriceBeforeVat = calcPrice;
    vatAmount = calcPrice * (calcVatRate / 100);
    customerGross = calcPrice + vatAmount;
  }

  const platformFee = customerGross * 0.10; // 10% platform fee
  const artisanNetTakeHome = customerGross - platformFee;

  return (
    <div className="min-h-screen bg-background py-8 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Seller Handbook</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
            <BookOpenIcon className="size-4" weight="fill" />
            <span>Artisan Atelier Manual</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">
            The Oivaly Seller Handbook
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            A comprehensive operational and business manual for independent craftspeople, design studios, and master artisans in Finland. Learn how to verify your Finnish Business ID (Y-tunnus), navigate the new <strong>ALV 25.5%</strong> tax rate, automate <strong>Posti courier bookings</strong>, and receive direct <strong>SEPA payouts</strong> to your Finnish bank account.
          </p>
        </div>

        {/* Interactive Seller Profit & VAT Engine */}
        <div className="border border-border/80 bg-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <CalculatorIcon className="size-4" weight="fill" />
                <span>Transparent Financial Calculator</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-foreground mt-1">
                Artisan Earnings & Payout Breakdown
              </h2>
              <p className="text-xs text-muted-foreground">
                See exactly what you earn per sale after Finnish VAT (ALV) and the flat 10% Oivaly platform cut.
              </p>
            </div>
            <div className="text-xs font-mono bg-muted/60 px-3 py-1.5 border border-border">
              Platform Fee: <strong className="text-foreground">10% Flat</strong> • Listing Fee: <strong className="text-emerald-600">€0</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Input Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Listing Retail Price (€)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-muted-foreground text-xs">€</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={calcPrice}
                    onChange={(e) => setCalcPrice(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 bg-background border border-border/80 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-brand-deep-forest"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Finnish VAT Rate (ALV)
                </label>
                <select
                  value={calcVatRate}
                  onChange={(e) => setCalcVatRate(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-background border border-border/80 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-deep-forest"
                >
                  <option value={25.5}>25.5% — Standard Finnish VAT (Ceramics, Wood, Jewelry, Goods)</option>
                  <option value={14}>14% — Reduced Rate (Artisan Foods & Confectionery)</option>
                  <option value={10}>10% — Cultural Goods & Books</option>
                  <option value={0}>0% — VAT-Exempt / Small Business Relief (ALV-alarajahuojennus)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vat-inclusive"
                  checked={calcIsVatInclusive}
                  onChange={(e) => setCalcIsVatInclusive(e.target.checked)}
                  className="size-4 accent-brand-deep-forest cursor-pointer"
                />
                <label htmlFor="vat-inclusive" className="text-xs text-muted-foreground cursor-pointer select-none">
                  Retail price already includes VAT (Standard Finnish B2C e-commerce practice)
                </label>
              </div>
            </div>

            {/* Computation Result */}
            <div className="lg:col-span-6 bg-brand-warm-ivory dark:bg-card border border-border/80 p-5 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Payout Summary (Per Unit Sold)
              </span>

              <div className="space-y-2 border-b border-border/60 pb-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Total Paid:</span>
                  <span className="font-mono font-bold text-foreground">€{customerGross.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Finnish VAT ({calcVatRate}%):</span>
                  <span className="font-mono text-muted-foreground">€{vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Oivaly Service Fee (10%):</span>
                  <span className="font-mono text-destructive">-€{platformFee.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                  Artisan Gross Take-Home (90%):
                </span>
                <div className="text-3xl font-serif font-bold text-brand-deep-forest dark:text-emerald-400 mt-0.5">
                  €{artisanNetTakeHome.toFixed(2)}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Disbursed automatically to your Finnish IBAN after the 14-day escrow buyer inspection period clears.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Comprehensive Handbook Chapters */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            The 6 Pillars of Atelier Excellence
          </h2>

          <div className="space-y-6">
            {/* Chapter 1 */}
            <div className="p-6 sm:p-8 bg-card border border-border/80 space-y-4">
              <div className="flex items-center gap-3">
                <span className="size-8 rounded-full bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground font-mono font-bold flex items-center justify-center text-xs">
                  01
                </span>
                <div>
                  <h3 className="text-lg font-serif font-bold text-foreground">
                    Finnish Business Registration & PRH (Y-tunnus) Verification
                  </h3>
                  <span className="text-xs text-muted-foreground">Compliance with Finnish Trade Register & YTJ Database</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-2.5 leading-relaxed pl-11">
                <p>
                  To protect consumers and maintain fair marketplace standards, Oivaly only accepts verified makers holding a legal corporate status registered with the <strong>Finnish Patent and Registration Office (PRH)</strong>.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Eligible Legal Forms:</strong> Toiminimi (Private Trader), Osakeyhtiö (Oy), Avoin yhtiö, or light entrepreneurs (Kevytyrittäjä) operating through invoicing services (e.g. UKKO.fi, Eezy) with an active business ID.</li>
                  <li><strong>Automated PRH Check:</strong> When applying at <Link href="/seller/signup" className="text-primary underline">/seller/signup</Link>, our system validates your Y-tunnus directly against <code className="bg-muted px-1.5 py-0.5 font-mono text-[11px]">avoindata.prh.fi/opendata-ytj-api/v3</code>.</li>
                  <li><strong>Verification Badge:</strong> Approved ateliers receive a verified Nordic Artisan badge on their store profile and product listings.</li>
                </ul>
              </div>
            </div>

            {/* Chapter 2 */}
            <div className="p-6 sm:p-8 bg-card border border-border/80 space-y-4">
              <div className="flex items-center gap-3">
                <span className="size-8 rounded-full bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground font-mono font-bold flex items-center justify-center text-xs">
                  02
                </span>
                <div>
                  <h3 className="text-lg font-serif font-bold text-foreground">
                    Photography & Scandinavian Aesthetic Guidelines
                  </h3>
                  <span className="text-xs text-muted-foreground">Visual standards that showcase texture and materiality</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-2.5 leading-relaxed pl-11">
                <p>
                  Artisan craftsmanship deserves honest, beautiful representation. Avoid artificial flash or heavy filters. We celebrate raw wood grain, textured stoneware glaze, and authentic linen fibers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-muted/30 border border-border/60">
                    <strong className="text-foreground block mb-1">1. Diffused Daylight</strong>
                    Photograph near a window during daytime. Avoid harsh incandescent overhead lighting.
                  </div>
                  <div className="p-3 bg-muted/30 border border-border/60">
                    <strong className="text-foreground block mb-1">2. Macro Texture</strong>
                    Capture close-ups of chiseled wood marks, glaze crackle, or woven textile selvages.
                  </div>
                  <div className="p-3 bg-muted/30 border border-border/60">
                    <strong className="text-foreground block mb-1">3. In-Situ Context</strong>
                    Show the piece in a peaceful Nordic setting: on a pine table, beside a sauna, or in use.
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter 3 */}
            <div className="p-6 sm:p-8 bg-card border border-border/80 space-y-4">
              <div className="flex items-center gap-3">
                <span className="size-8 rounded-full bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground font-mono font-bold flex items-center justify-center text-xs">
                  03
                </span>
                <div>
                  <h3 className="text-lg font-serif font-bold text-foreground">
                    Finnish VAT (ALV 25.5%) & Merchant Tax Obligations
                  </h3>
                  <span className="text-xs text-muted-foreground">Updated statutory taxation as legislated by Verohallinto</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-2.5 leading-relaxed pl-11">
                <p>
                  As of September 1, 2024, Finland&apos;s standard value-added tax rate increased from 24% to <strong>25.5%</strong>. All sellers are required to configure their item listings with the correct tax class in their Seller Portal:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Standard Goods:</strong> 25.5% applies to ceramics, woodwork, glassware, home decor, and leathercraft.</li>
                  <li><strong>Foodstuffs:</strong> 14% applies to artisan honey, berry jams, cloudberry syrups, and baked goods.</li>
                  <li><strong>B2C Retail Pricing:</strong> All prices displayed to retail consumers on Oivaly must be VAT-inclusive.</li>
                  <li><strong>Monthly Invoicing:</strong> On the 1st of every month, Oivaly issues an official Finnish tax statement detailing total gross sales, ALV breakdown, and platform commission.</li>
                </ul>
              </div>
            </div>

            {/* Chapter 4 */}
            <div className="p-6 sm:p-8 bg-card border border-border/80 space-y-4">
              <div className="flex items-center gap-3">
                <span className="size-8 rounded-full bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground font-mono font-bold flex items-center justify-center text-xs">
                  04
                </span>
                <div>
                  <h3 className="text-lg font-serif font-bold text-foreground">
                    Automated Posti Logistics & Plastic-Free Eco Packaging
                  </h3>
                  <span className="text-xs text-muted-foreground">Seamless shipping from your workshop with JJFI barcode tracking</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-2.5 leading-relaxed pl-11">
                <p>
                  Fulfillment is effortless with Oivaly&apos;s Posti API integration:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>One-Click Courier Booking:</strong> In your Seller Orders dashboard, click &apos;Book Posti Dispatch&apos; to instantly generate a registered JJFI tracking barcode.</li>
                  <li><strong>Locker Drop-Off:</strong> No printer needed. Drop the parcel at your local SmartPost locker using your digital dispatch code or affix the printed label.</li>
                  <li><strong>Zero Plastic Mandate:</strong> Oivaly makers agree to avoid plastic bubble wrap. Pack fragile pottery with paper honeycomb wrapping, unbleached kraft paper, and biodegradable tape.</li>
                </ul>
              </div>
            </div>

            {/* Chapter 5 */}
            <div className="p-6 sm:p-8 bg-card border border-border/80 space-y-4">
              <div className="flex items-center gap-3">
                <span className="size-8 rounded-full bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground font-mono font-bold flex items-center justify-center text-xs">
                  05
                </span>
                <div>
                  <h3 className="text-lg font-serif font-bold text-foreground">
                    Customer Care, Custom Commissions & 14-Day EU Returns
                  </h3>
                  <span className="text-xs text-muted-foreground">Fostering lifelong collector relationships</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-2.5 leading-relaxed pl-11">
                <p>
                  Under European Union distance selling regulations, buyers have 14 days to return standard items. Custom bespoke commissions (e.g. customized names, custom dimensions) are legally exempt from remorse returns.
                </p>
                <p>
                  Respond to buyer inquiries within 24 hours. Many shoppers purchase handcrafted goods because they value the personal connection with the maker. Adding a small handwritten card on unbleached paper makes an indelible impression.
                </p>
              </div>
            </div>

            {/* Chapter 6 */}
            <div className="p-6 sm:p-8 bg-card border border-border/80 space-y-4">
              <div className="flex items-center gap-3">
                <span className="size-8 rounded-full bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground font-mono font-bold flex items-center justify-center text-xs">
                  06
                </span>
                <div>
                  <h3 className="text-lg font-serif font-bold text-foreground">
                    14-Day Escrow Security & SEPA Bank Payouts
                  </h3>
                  <span className="text-xs text-muted-foreground">Automated disbursements directly into your Finnish IBAN</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-2.5 leading-relaxed pl-11">
                <p>
                  Customer payments are securely captured at checkout and held in bank-grade escrow for 14 calendar days following Posti delivery confirmation. This protects both sides:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Upon delivery + 14 days, funds automatically move from <em>Held Escrow</em> to <em>Available for Payout</em>.</li>
                  <li>Disbursements are executed via SEPA Direct Credit to all major Finnish banks (OP, Nordea, Danske Bank, S-Pankki, Oma Säästöpankki, Ålandsbanken).</li>
                  <li>Track every transaction, pending release, and historical statement directly inside your Seller Portal.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="border border-border/80 bg-brand-pale-sage/30 dark:bg-muted/30 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-serif font-bold text-foreground">
              Ready to Join the Nordic Craft Movement?
            </h3>
            <p className="text-xs text-muted-foreground">
              Submit your atelier application in less than 5 minutes. PRH verification is automated.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/seller/signup"
              className="px-6 py-3 bg-brand-deep-forest text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-deep-forest/90 transition-colors text-center"
            >
              Start Artisan Application
            </Link>
            <Link
              href="/seller/login"
              className="px-6 py-3 bg-background border border-border text-foreground text-xs font-semibold uppercase tracking-wider hover:border-primary transition-colors text-center"
            >
              Seller Portal Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
