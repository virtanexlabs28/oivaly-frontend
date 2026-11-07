"use client";

import Link from "next/link";
import {
  ScalesIcon,
  ShieldCheckIcon,
  FileTextIcon,
  PrinterIcon,
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

export default function TermsOfServicePage() {
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
          <span className="text-foreground font-medium">Terms of Service</span>
        </nav>

        {/* Hero & Print Action */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-border/60 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
              <ScalesIcon className="size-4" weight="fill" />
              <span>Consumer Agreement (B2C)</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">
              Terms of Service & Consumer Agreement
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Effective Date: October 1, 2026. These terms govern your use of the Oivaly platform, digital checkout, order placement, and deliveries arranged through independent Nordic artisans. Governed by Finnish Law and the Finnish Consumer Protection Act.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="print:hidden px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 self-start"
          >
            <PrinterIcon className="size-4" />
            <span>Print Terms</span>
          </button>
        </div>

        {/* Consumer Rights Highlights */}
        <div className="p-5 bg-brand-warm-ivory dark:bg-card border border-border/80 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ShieldCheckIcon className="size-4 text-brand-deep-forest dark:text-primary" weight="fill" />
            <span>Statutory Consumer Guarantees Under Finnish Law (Kuluttajansuojalaki 38/1978)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-muted-foreground">
            <div>
              <strong className="text-foreground block">14-Day Right of Withdrawal:</strong> You have 14 days from physical parcel delivery to inspect and return non-customized goods.
            </div>
            <div>
              <strong className="text-foreground block">Zero Transit Risk:</strong> Risk of loss or damage remains with the seller and courier until the parcel is physically collected by you.
            </div>
            <div>
              <strong className="text-foreground block">14-Day Escrow Payout:</strong> Your money remains locked in secure escrow until you receive and approve your artisan piece.
            </div>
          </div>
        </div>

        {/* Deep Sections */}
        <div className="space-y-10 text-xs leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              1. Platform Scope & Intermediary Marketplace Role
            </h2>
            <p>
              Oivaly is an online multi-vendor curated marketplace operated by <strong>Oivaly Oy</strong> (Business ID: 3412984-7), having its registered office at Mannerheimintie 10, 00100 Helsinki, Finland.
            </p>
            <p>
              Items featured on the platform are produced and sold directly by verified independent maker studios (&ldquo;Sellers&rdquo;). When you place an order, a legally binding sales contract is formed directly between you (&ldquo;Buyer&rdquo;) and the respective artisan studio. Oivaly acts as a commercial marketplace facilitator, providing technological infrastructure, high-security escrow payment custody, automated Posti courier routing, and dispute resolution mediation.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              2. Account Registration, Conduct & Authenticity
            </h2>
            <p>
              You may browse the marketplace and complete purchases as a registered user or via express guest checkout. You agree to provide accurate, up-to-date delivery and contact details. In particular, providing a valid mobile telephone number is mandatory for domestic Finnish shipments to receive Posti SmartPost automated parcel locker PIN codes.
            </p>
            <p>
              You agree not to engage in unauthorized scraping, exploitation of platform APIs, fraudulent chargebacks, or abusive conduct toward independent craftspeople.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              3. Handcrafted Nature & Organic Variations
            </h2>
            <p>
              We celebrate the authentic uniqueness of handmade creations:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Natural Materials:</strong> Items made of solid Nordic birch, pine, clay, sheep&apos;s wool, and blown glass possess organic variances in grain, flame markings, glaze crystallization, and subtle hue shifts. These natural characteristics are hallmarks of authentic craftsmanship and do not constitute manufacturing defects.</li>
              <li><strong>Color Representation:</strong> While studios strive for exact photographic representation in natural daylight, differences in monitor calibration may produce slight variations in perceptible color tone.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              4. Prices, Currency & Finnish Value Added Tax (ALV 25.5%)
            </h2>
            <p>
              All prices displayed on Oivaly are denominated in <strong>Euros (€)</strong>.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>VAT-Inclusive Pricing:</strong> In strict compliance with Finnish and European consumer pricing transparency directives, all product prices displayed to retail shoppers include Finnish Value-Added Tax (Arvonlisävero / ALV). The standard VAT rate in Finland is <strong>25.5%</strong> (or 14% for artisan pantry goods).</li>
              <li><strong>Shipping Charges:</strong> Applicable courier delivery costs based on parcel weight and destination (Posti SmartPost locker, Kotipaketti doorstep, or EU Priority) are calculated and displayed transparently prior to order completion.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              5. Order Formation, Payment & Escrow Protection
            </h2>
            <p>
              Clicking &apos;Pay Now&apos; constitutes a legally binding purchase offer. An electronic order confirmation is dispatched immediately upon payment authorization.
            </p>
            <p>
              Payments are processed via authorized payment institutions (Stripe Payments Europe) and Finnish Open Banking APIs. For your protection, customer funds are held in secure escrow for <strong>14 calendar days</strong> following confirmed Posti delivery before disbursement to the maker, ensuring your satisfaction and statutory inspection rights are fully honored.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              6. Shipping, Posti Delivery & Transfer of Risk
            </h2>
            <p>
              Orders are dispatched directly from the artisan&apos;s atelier via <strong>Posti Group Oyj</strong> with registered barcode tracking (JJFI...):
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Transfer of Risk (Vaaranvastuu):</strong> Pursuant to Chapter 4 of the Finnish Sale of Goods Act, the risk of accidental loss or transit damage remains with the merchant and carrier until you (or your authorized recipient) take physical possession of the parcel from the locker or courier.</li>
              <li><strong>Breakage in Transit:</strong> If a delicate piece arrives broken or cracked, notify Oivaly within 48 hours with photographic proof. Under our Buyer Protection Guarantee, you are entitled to an immediate free artisan replacement or 100% full refund with zero return postage costs.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              7. Statutory Right of Withdrawal (Peruutusoikeus)
            </h2>
            <p>
              Under Chapter 6 of the Finnish Consumer Protection Act (Kuluttajansuojalaki 38/1978):
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>You have <strong>14 calendar days</strong> from the date of physical receipt to withdraw from the contract without giving reasons.</li>
              <li><strong>Return Exclusions:</strong> In accordance with statutory law, the right of withdrawal does not apply to: (a) Bespoke, made-to-order commissions crafted to unique buyer measurements; (b) Monogrammed or personalized items; (c) Sealed health and hygiene items (e.g. sauna salves, botanical oils) once unsealed; (d) Perishable artisanal foodstuffs.</li>
              <li><strong>Refund Disbursal:</strong> Refunds are returned to the original payment method within 2 to 5 business days after the studio receives the returned item in its original condition.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              8. Defect Responsibility & Statutory Warranty (Virhevastuu)
            </h2>
            <p>
              Artisan merchants are legally liable for latent defects (virhevastuu) present in the piece at the time of delivery under Finnish law. If a piece reveals a structural defect not resulting from normal wear and tear or improper care, you are entitled to free repair, a replacement piece, a price reduction, or contract cancellation.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              9. Force Majeure & Extreme Nordic Weather
            </h2>
            <p>
              Neither Oivaly nor the independent artisan studios shall be held liable for fulfillment delays caused by circumstances beyond reasonable control, including extreme Nordic winter storms, severe blizzards disrupting Posti road and rail transport, national strikes, or official logistical blockades.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3 bg-card p-6 border border-border/80">
            <h2 className="text-base font-serif font-bold text-foreground">
              10. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms of Service and any contractual disputes shall be governed by, and interpreted in accordance with, the laws of the Republic of Finland, without regard to conflict of laws principles.
            </p>
            <p>
              If a dispute cannot be resolved directly with our Helsinki concierge team, consumers have the legal right to submit the matter to the <strong>Finnish Consumer Disputes Board (Kuluttajariitalautakunta)</strong> at <a href="https://www.kuluttajariita.fi" target="_blank" rel="noopener noreferrer" className="text-primary underline">kuluttajariita.fi</a> or utilize the European Commission&apos;s Online Dispute Resolution (ODR) portal. Judicial proceedings may be initiated in the District Court of Helsinki (Helsingin käräjäoikeus) or the consumer&apos;s local Finnish district court.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs print:hidden">
          <Link href="/privacy" className="font-semibold text-primary hover:underline">
            &larr; View Privacy Policy
          </Link>
          <div className="flex gap-4">
            <Link href="/buyer-protection" className="text-muted-foreground hover:text-foreground">
              Buyer Protection Guarantee
            </Link>
            <Link href="/contact" className="font-semibold text-primary hover:underline">
              Contact Concierge &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
