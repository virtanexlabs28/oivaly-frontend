"use client";

import Link from "next/link";
import {
  ScalesIcon,
  ShieldCheckIcon,
  FileTextIcon,
  PrinterIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  BuildingsIcon,
  ClockIcon,
} from "@phosphor-icons/react";

export default function SellerTermsPage() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground print:hidden">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Seller Terms</span>
        </nav>

        {/* Hero & Print Action */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-border/60 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
              <ScalesIcon className="size-4" weight="fill" />
              <span>EU Platform-to-Business (P2B) Compliant</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">
              Seller Terms of Service & Merchant Agreement
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Standard commercial terms governing independent artisan workshops, studios, and verified merchants on the Oivaly marketplace. Effective Date: October 1, 2026. Governed by Finnish Law (Helsinki Jurisdiction).
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="print:hidden px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 self-start"
          >
            <PrinterIcon className="size-4" />
            <span>Print Agreement</span>
          </button>
        </div>

        {/* P2B Executive Summary Banner */}
        <div className="p-5 bg-brand-warm-ivory dark:bg-card border border-border/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ShieldCheckIcon className="size-4 text-brand-deep-forest dark:text-primary" weight="fill" />
            <span>Key Commercial Terms Summary (EU Regulation 2019/1150)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-muted-foreground">
            <div>
              <strong className="text-foreground block">10% Performance Fee:</strong> Zero listing fees or monthly subscriptions. We only earn when you make a verified sale.
            </div>
            <div>
              <strong className="text-foreground block">14-Day Escrow Protection:</strong> Funds clear automatically 14 days after Posti delivers your parcel to the buyer.
            </div>
            <div>
              <strong className="text-foreground block">Nordic Authenticity:</strong> All sellers must possess an active Finnish Y-tunnus and craft genuine handmade or small-batch pieces.
            </div>
          </div>
        </div>

        {/* Legal Sections */}
        <div className="space-y-10 text-xs leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              1. Contracting Parties & Marketplace Scope
            </h2>
            <p>
              This Marketplace Merchant Agreement (&ldquo;Agreement&rdquo;) is entered into by and between <strong>Oivaly Oy</strong>, a Finnish limited liability company registered under Business ID (Y-tunnus) <strong>3412984-7</strong>, having its principal registered office at Mannerheimintie 10, 00100 Helsinki, Finland (&ldquo;Oivaly&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), and the individual artisan, workshop, or legal commercial entity submitting an application to sell on the marketplace (&ldquo;Seller&rdquo;, &ldquo;Merchant&rdquo;, &ldquo;Atelier&rdquo;).
            </p>
            <p>
              Oivaly operates an online multi-vendor curated platform connecting independent artisans with discerning retail purchasers (&ldquo;Buyers&rdquo;). Oivaly acts solely as an intermediary commercial agent facilitating the presentation, checkout, payment custody, and courier dispatch of handcrafted goods.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              2. Merchant Eligibility & Finnish Business ID (Y-tunnus) Verification
            </h2>
            <p>
              To maintain the integrity and lawful operation of the marketplace, all Merchants must satisfy the following admission standards:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Possess an active business registration recorded in the Finnish Trade Register (Kaupparekisteri) or official Business Information System (YTJ) maintained by the Finnish Patent and Registration Office (PRH) and the Finnish Tax Administration (Verohallinto).</li>
              <li>Permissible business forms include Sole Trader (Toiminimi / Yksityinen elinkeinonharjoittaja), Limited Liability Company (Osakeyhtiö / Oy), General or Limited Partnership (Avoin yhtiö / Kommandiittiyhtiö), Cooperative (Osuuskunta), or registered Light Entrepreneurship (Kevytyrittäjä) through an authorized invoicing service.</li>
              <li>Consent to automated real-time verification of their Business ID against the PRH open API (<code className="bg-muted px-1.5 py-0.5 font-mono text-[11px]">avoindata.prh.fi/opendata-ytj-api/v3</code>).</li>
              <li>Maintain valid and unencumbered commercial bank accounts denominated in Euros (EUR) located within the Single Euro Payments Area (SEPA).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              3. Artisan Handcrafted Standards & Prohibited Merchandising
            </h2>
            <p>
              Oivaly is an exclusive cultural platform for genuine Nordic craft. By publishing listings on Oivaly, the Merchant explicitly covenants and warrants that:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>All pieces offered are designed, hand-thrown, carved, woven, forged, or small-batch fabricated by the Merchant or within the Merchant&apos;s direct Finnish studio.</li>
              <li><strong>Strict Drop-Shipping Prohibition:</strong> The listing, sale, or fulfillment of drop-shipped goods manufactured by third-party industrial factories (including platforms such as AliExpress, Temu, or mass wholesalers) is strictly prohibited. Violation results in immediate, non-appealable termination of the seller atelier and forfeiture of held escrow funds.</li>
              <li><strong>Zero Counterfeiting & IP Infringement:</strong> Sellers shall not infringe upon any copyright, registered trademark, design patent, or cultural heritage rights of any third party.</li>
              <li>Goods must comply with all mandatory European Union chemical and consumer safety standards (e.g. lead-free ceramic glazes for food-contact items, nickel-free jewelry alloys, CE marks where mandated).</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              4. Pricing, Value Added Tax (ALV 25.5%) & Fiscal Responsibilities
            </h2>
            <p>
              Sellers retain full autonomy to set retail pricing for their products, subject to the following statutory provisions:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>B2C Retail Law:</strong> Under Finnish consumer regulations, all prices displayed to end consumers on the marketplace must be inclusive of applicable Finnish Value Added Tax (Arvonlisävero / ALV).</li>
              <li><strong>Applicable ALV Rates:</strong> As of September 1, 2024, the standard Finnish VAT rate is <strong>25.5%</strong>. Sellers are solely responsible for assigning the appropriate VAT classification (25.5% standard, 14% foodstuffs, 10% books/art, or 0% small business relief) in their Seller Portal.</li>
              <li><strong>Tax Remittance:</strong> The Merchant remains the legal merchant of record for indirect taxation purposes and is solely liable for reporting and remitting VAT collections to the Finnish Tax Administration (Verohallinto).</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              5. Marketplace Commission, Platform Fees & Billing
            </h2>
            <p>
              Oivaly charges a transparent, performance-based commission:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Commission Rate:</strong> A flat ten percent (10%) platform service fee is deducted from the gross item retail price upon successful order payment.</li>
              <li><strong>Zero Insertion Fees:</strong> Listing creation, storefront customization, catalog indexing, and imagery hosting are provided at zero cost.</li>
              <li><strong>Payment Processing:</strong> Card processing fees, 3D-Secure 2.0 authentication, and Finnish bank open-banking API costs are absorbed within Oivaly&apos;s standard commission structure.</li>
              <li><strong>Monthly Tax Invoices:</strong> On the first business day of each calendar month, Oivaly provides an itemized PDF VAT invoice reflecting platform commission deducted and applicable ALV for the Merchant&apos;s accounting records.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              6. High-Security Escrow Custody & SEPA Payout Protocol
            </h2>
            <p>
              To protect the marketplace ecosystem and guarantee compliance with statutory consumer withdrawal rights:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>14-Day Escrow Holding Period:</strong> Net customer funds (90% of item price) are held in secure escrow custody for fourteen (14) calendar days commencing upon the recorded delivery timestamp by Posti.</li>
              <li><strong>Automatic Clearance:</strong> If no dispute, damage report, or statutory return notification is lodged within the 14-day window, funds automatically transition to &apos;Available for Payout&apos; status.</li>
              <li><strong>Direct SEPA Transfers:</strong> Cleared balances are disbursed via SEPA Credit Transfer directly to the Merchant&apos;s verified Finnish IBAN bank account on a recurring weekly schedule.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              7. Posti Logistics SLA & Plastic-Free Packaging Mandate
            </h2>
            <p>
              Sellers agree to adhere strictly to the following fulfillment service levels:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>48-Hour Dispatch:</strong> In-stock creations must be securely packaged and transferred to Posti Group Oyj within two (2) business days of order receipt.</li>
              <li><strong>Mandatory Tracking:</strong> Every parcel must carry a registered Posti JJFI barcode generated through the Seller Portal or integrated Posti API. Untracked shipments are strictly prohibited.</li>
              <li><strong>Plastic-Free Eco Packaging:</strong> To honor Oivaly&apos;s sustainability charter, Merchants agree to refrain from non-recyclable plastic bubble wrap or polystyrene foam peanuts. Fragile ceramics, glassware, and woodwork must be protected using corrugated paper honeycomb cushioning and unbleached kraft paper.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              8. Statutory Returns, Defects & Seller Indemnification
            </h2>
            <p>
              In accordance with Chapter 6 of the Finnish Consumer Protection Act (Kuluttajansuojalaki 38/1978):
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>14-Day Right of Withdrawal:</strong> Consumers retain an unconditional right to return non-customized goods within 14 days of receipt.</li>
              <li><strong>Custom Commission Exemptions:</strong> Bespoke commissions crafted to unique buyer measurements or custom monogrammed goods are legally exempt from remorse returns pursuant to Chapter 6, Section 16 of the Act.</li>
              <li><strong>Defect Rectification (Virhevastuu):</strong> If a product contains latent structural defects or arrives broken from transit mishandling, the Seller is legally obligated to either provide a prompt artisan replacement or authorize a 100% full escrow refund.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              9. Suspension, Delisting & Dispute Jurisdiction
            </h2>
            <p>
              Pursuant to the EU Platform-to-Business Regulation (2019/1150), Oivaly provides transparent procedures for account actions:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Statement of Reasons:</strong> In the event Oivaly suspends, delists, or restricts a Merchant&apos;s storefront, a detailed written statement specifying the factual and regulatory basis will be delivered via email at least 30 days prior to definitive termination, except in cases of fraud or severe safety breaches.</li>
              <li><strong>Internal Complaint Handling:</strong> Merchants may submit grievances regarding platform decisions to <a href="mailto:legal@oivaly.fi" className="text-primary underline">legal@oivaly.fi</a>. We commit to a formal executive review within 15 business days.</li>
              <li><strong>Governing Law & Forum:</strong> This Agreement is governed by the laws of Finland. Any intractable dispute arising out of or in connection with this Agreement shall be submitted to the exclusive jurisdiction of the <strong>Helsinki District Court (Helsingin käräjäoikeus)</strong>.</li>
            </ul>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs print:hidden">
          <Link href="/seller-guide" className="font-semibold text-primary hover:underline">
            &larr; Return to Seller Handbook
          </Link>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/seller/signup" className="font-semibold text-primary hover:underline">
              Apply to Sell on Oivaly &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
