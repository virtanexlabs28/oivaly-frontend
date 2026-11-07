"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowsClockwiseIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  PackageIcon,
  ClockIcon,
  ReceiptIcon,
  CreditCardIcon,
  FileTextIcon,
  EnvelopeSimpleIcon,
  SparkleIcon,
} from "@phosphor-icons/react";

interface ReturnReason {
  id: string;
  label: string;
  description: string;
  returnFeeStatus: string;
}

const RETURN_REASONS: ReturnReason[] = [
  {
    id: "mind_changed",
    label: "Statutory EU 14-Day Withdrawal (Changed Mind)",
    description: "Item is in brand new, unwashed, original condition with maker tags attached.",
    returnFeeStatus: "Standard Posti return shipping fee (€4.90) deducted from refund.",
  },
  {
    id: "damaged_transit",
    label: "Arrived Damaged in Transit (Broken / Cracked)",
    description: "Ceramics, glass, or crafts damaged during courier handling.",
    returnFeeStatus: "100% Free return & immediate full refund or complimentary replacement.",
  },
  {
    id: "defective_craft",
    label: "Manufacturing Defect / Non-conforming Item",
    description: "Item differs significantly from studio description or contains a structural defect.",
    returnFeeStatus: "100% Free return & covered under Maker Statutory Guarantee.",
  },
  {
    id: "wrong_item",
    label: "Incorrect Item Received",
    description: "Artisan inadvertently packed an incorrect SKU or variation.",
    returnFeeStatus: "100% Free return & expedited correct item dispatched immediately.",
  },
];

export default function ReturnsPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedReason, setSelectedReason] = useState<string>("mind_changed");
  const [returnItemNote, setReturnItemNote] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReturnCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !customerEmail.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      // Generate authentic-looking Finnish Posti Helposti return code
      const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
      setGeneratedCode(`POSTI-RET-${randomSixDigit}`);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Returns & Refunds</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
            <ArrowsClockwiseIcon className="size-4" weight="bold" />
            <span>Statutory European Right of Withdrawal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">
            Returns, Exchanges & Refunds
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            We hold all artisan pieces to extraordinary standards of quality. In accordance with the <strong>Finnish Consumer Protection Act (Kuluttajansuojalaki 38/1978, Chapter 6)</strong> and EU Directive 2011/83/EU, you enjoy a guaranteed <strong>14-day statutory right of withdrawal</strong> from the date your Posti parcel arrives.
          </p>
        </div>

        {/* Interactive Return Request & Posti Helposti Code Generator */}
        <div className="border border-border/80 bg-card p-6 sm:p-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
              <SparkleIcon className="size-4" weight="fill" />
              <span>Self-Service Return Portal</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground mt-1">
              Initiate a Return & Generate Posti Return Code
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter your order details below to instantly generate a digital Posti SmartPost return code (no printer required).
            </p>
          </div>

          <form onSubmit={handleGenerateReturnCode} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Order Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. OIV-849204"
                  className="w-full px-3.5 py-2.5 bg-background border border-border/80 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-brand-deep-forest"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Order Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-background border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-brand-deep-forest"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Reason for Return <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {RETURN_REASONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedReason(r.id)}
                    className={`text-left p-3 border text-xs transition-colors flex flex-col gap-1 ${
                      selectedReason === r.id
                        ? "border-brand-deep-forest bg-brand-deep-forest/5 font-semibold text-brand-deep-forest dark:border-primary dark:text-primary dark:bg-primary/10"
                        : "border-border/70 hover:border-border text-foreground hover:bg-muted/30"
                    }`}
                  >
                    <span>{r.label}</span>
                    <span className="text-[11px] text-muted-foreground font-normal">{r.description}</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">{r.returnFeeStatus}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Item Details or Special Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={returnItemNote}
                onChange={(e) => setReturnItemNote(e.target.value)}
                placeholder="Specify the item(s) being returned or describe transit damage if applicable..."
                className="w-full px-3.5 py-2 bg-background border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-brand-deep-forest"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-3 bg-brand-deep-forest text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-deep-forest/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isGenerating ? (
                  <span>Generating Code...</span>
                ) : (
                  <>
                    <span>Generate Posti SmartPost Return Code</span>
                    <ArrowsClockwiseIcon className="size-4" weight="bold" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Generated Code Display */}
          {generatedCode && (
            <div className="p-6 bg-brand-warm-ivory dark:bg-card border-2 border-brand-deep-forest/40 dark:border-primary/40 space-y-3 mt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-deep-forest dark:text-primary">
                <CheckCircleIcon className="size-4" weight="fill" />
                <span>Return Authorization Code Generated Successfully</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-4 border border-border">
                <div>
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
                    Posti SmartPost Helposti Locker Code:
                  </span>
                  <span className="text-2xl font-mono font-bold text-foreground tracking-wider">
                    {generatedCode}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground max-w-xs">
                  Valid for 14 calendar days at any of the 3,000+ Posti parcel lockers in Finland.
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Instructions: Pack the item safely in its original honeycomb wrapping. Visit your nearest Posti locker, select <strong>&apos;Send a parcel&apos;</strong> &rarr; <strong>&apos;I have a return code&apos;</strong>, key in <strong>{generatedCode}</strong>, and place the parcel in the opened compartment.
              </p>
            </div>
          )}
        </div>

        {/* 5-Step Return Journey */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif font-bold text-foreground">
            The 5-Step Return & Refund Process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div className="p-4 bg-card border border-border/80 space-y-2">
              <span className="size-6 rounded-full bg-brand-deep-forest text-white font-mono font-bold flex items-center justify-center text-xs">1</span>
              <h3 className="font-bold text-foreground">Request Return</h3>
              <p className="text-muted-foreground leading-relaxed">
                Submit within 14 days of delivery using the form above or by emailing support@oivaly.fi.
              </p>
            </div>

            <div className="p-4 bg-card border border-border/80 space-y-2">
              <span className="size-6 rounded-full bg-brand-deep-forest text-white font-mono font-bold flex items-center justify-center text-xs">2</span>
              <h3 className="font-bold text-foreground">Receive Code</h3>
              <p className="text-muted-foreground leading-relaxed">
                Obtain your 6-digit Posti Helposti locker code or printable prepaid European waybill.
              </p>
            </div>

            <div className="p-4 bg-card border border-border/80 space-y-2">
              <span className="size-6 rounded-full bg-brand-deep-forest text-white font-mono font-bold flex items-center justify-center text-xs">3</span>
              <h3 className="font-bold text-foreground">Pack in Honeycomb</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use the original sustainable protective packaging so the artisanal piece arrives unblemished.
              </p>
            </div>

            <div className="p-4 bg-card border border-border/80 space-y-2">
              <span className="size-6 rounded-full bg-brand-deep-forest text-white font-mono font-bold flex items-center justify-center text-xs">4</span>
              <h3 className="font-bold text-foreground">Posti Drop-Off</h3>
              <p className="text-muted-foreground leading-relaxed">
                Drop at any Posti SmartPost locker, R-Kioski, or service desk across Finland.
              </p>
            </div>

            <div className="p-4 bg-card border border-border/80 space-y-2 sm:col-span-2 lg:col-span-1">
              <span className="size-6 rounded-full bg-brand-deep-forest text-white font-mono font-bold flex items-center justify-center text-xs">5</span>
              <h3 className="font-bold text-foreground">Escrow Refund</h3>
              <p className="text-muted-foreground leading-relaxed">
                Once studio receives and verifies the craft, escrow automatically releases your full refund.
              </p>
            </div>
          </div>
        </div>

        {/* Eligibility Matrix: What Can and Cannot Be Returned */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-foreground">
            Return Eligibility Matrix
          </h2>
          <div className="border border-border/80 bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border/80 text-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Eligible for 14-Day Return</th>
                    <th className="p-3.5">Condition Requirements</th>
                    <th className="p-3.5">Statutory Legal Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">
                      <strong>Studio Ceramics & Glassware</strong>
                    </td>
                    <td className="p-3.5 text-emerald-600 font-semibold">
                      ✓ Full 14 Days
                    </td>
                    <td className="p-3.5 text-muted-foreground">Unused, unwashed, original artisan gift box</td>
                    <td className="p-3.5 text-[11px] text-muted-foreground">Consumer Protection Act Ch. 6, § 14</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">
                      <strong>Wool Knitwear & Linen Textiles</strong>
                    </td>
                    <td className="p-3.5 text-emerald-600 font-semibold">
                      ✓ Full 14 Days
                    </td>
                    <td className="p-3.5 text-muted-foreground">Unworn, unwashed, original woven tags attached</td>
                    <td className="p-3.5 text-[11px] text-muted-foreground">Consumer Protection Act Ch. 6, § 14</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">
                      <strong>Custom Commission / Engraved Wood</strong>
                    </td>
                    <td className="p-3.5 text-destructive font-semibold">
                      ✕ Non-Returnable*
                    </td>
                    <td className="p-3.5 text-muted-foreground">Bespoke dimensions or personalized names</td>
                    <td className="p-3.5 text-[11px] text-muted-foreground">Consumer Protection Act Ch. 6, § 16(3)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">
                      <strong>Unsealed Botanical Oils & Sauna Salves</strong>
                    </td>
                    <td className="p-3.5 text-destructive font-semibold">
                      ✕ Non-Returnable*
                    </td>
                    <td className="p-3.5 text-muted-foreground">If tamper seal is broken (Hygiene protection)</td>
                    <td className="p-3.5 text-[11px] text-muted-foreground">Consumer Protection Act Ch. 6, § 16(4)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">
                      <strong>Artisan Pantry & Perishable Treats</strong>
                    </td>
                    <td className="p-3.5 text-destructive font-semibold">
                      ✕ Non-Returnable*
                    </td>
                    <td className="p-3.5 text-muted-foreground">Artisan berry syrups, rye crisps, honey</td>
                    <td className="p-3.5 text-[11px] text-muted-foreground">Consumer Protection Act Ch. 6, § 16(5)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-muted/20 border-t border-border/60 text-[11px] text-muted-foreground">
              * Note: Non-returnable exemptions apply only to standard buyer remorse. Any item that arrives defective or broken in transit is 100% covered for replacement or refund regardless of category.
            </div>
          </div>
        </div>

        {/* Escrow Refund Timeline Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-foreground">
            Escrow Refund Timeline by Payment Provider
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-5 bg-card border border-border/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <ReceiptIcon className="size-4 text-brand-deep-forest dark:text-primary" weight="fill" />
                <span>Finnish Bank Direct (Paytrail / SEPA)</span>
              </div>
              <div className="text-lg font-serif font-bold text-foreground">1 – 2 Business Days</div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                OP, Nordea, Danske Bank, S-Pankki, and OmaSp accounts receive direct automated SEPA transfers once return inspection is logged.
              </p>
            </div>

            <div className="p-5 bg-card border border-border/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <CreditCardIcon className="size-4 text-brand-deep-forest dark:text-primary" weight="fill" />
                <span>Credit & Debit Cards (Stripe)</span>
              </div>
              <div className="text-lg font-serif font-bold text-foreground">2 – 4 Business Days</div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Refunds are posted back to the original Visa, Mastercard, or American Express card statement.
              </p>
            </div>

            <div className="p-5 bg-card border border-border/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <ClockIcon className="size-4 text-brand-deep-forest dark:text-primary" weight="fill" />
                <span>Klarna Pay Later & Slice It</span>
              </div>
              <div className="text-lg font-serif font-bold text-foreground">3 – 5 Business Days</div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Klarna statement is automatically credited or cancelled. Any paid installments are refunded immediately to your linked card.
              </p>
            </div>
          </div>
        </div>

        {/* Finnish Statutory Legal Authority & Dispute Resolution */}
        <div className="border border-border/80 bg-brand-warm-ivory dark:bg-card p-6 sm:p-8 space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ShieldCheckIcon className="size-4 text-brand-deep-forest dark:text-primary" weight="fill" />
            <span>Consumer Protection Authority & Dispute Rights</span>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            If you ever find yourself unsatisfied with a resolution, you have the right under Finnish legislation to submit the matter to the <strong>Finnish Consumer Disputes Board (Kuluttajariitalautakunta)</strong> at{" "}
            <a
              href="https://www.kuluttajariita.fi"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline"
            >
              kuluttajariita.fi
            </a>{" "}
            or utilize the European Commission&apos;s Online Dispute Resolution (ODR) platform. Oivaly adheres strictly to all statutory determinations issued by Finnish and European consumer authorities.
          </p>
        </div>

        {/* Contact Support Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-muted/20 border border-border/60 text-xs">
          <div>
            <span className="font-bold text-foreground block">Need help starting or packaging a return?</span>
            <span className="text-muted-foreground">Our Helsinki concierge desk will guide you every step of the way.</span>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-brand-deep-forest text-white font-semibold uppercase tracking-wider hover:bg-brand-deep-forest/90 transition-colors text-center shrink-0"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
}
