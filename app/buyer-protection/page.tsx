"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheckIcon,
  LockKeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparkleIcon,
  ScalesIcon,
  ChatCircleDotsIcon,
  WarningCircleIcon,
  ClockIcon,
  HandshakeIcon,
  FileTextIcon,
  IdentificationBadgeIcon,
  CreditCardIcon,
} from "@phosphor-icons/react";

interface Scenario {
  id: string;
  title: string;
  problem: string;
  solution: string;
  timeline: string;
  guaranteeOutcome: string;
}

const PROTECTION_SCENARIOS: Scenario[] = [
  {
    id: "transit_breakage",
    title: "Item Arrived Damaged / Broken in Posti Transit",
    problem: "A handmade stoneware cup or mouth-blown vase arrived cracked or shattered due to courier transit impact.",
    solution: "Upload 2–3 photos of the damaged item and packaging. Oivaly escrow immediately halts payout to the studio and triggers an immediate free replacement or 100% full refund.",
    timeline: "Resolved within 24–48 hours",
    guaranteeOutcome: "100% Covered (Zero return shipping required)",
  },
  {
    id: "lost_parcel",
    title: "Posti Tracking Stalled or Parcel Marked Missing",
    problem: "Posti JJFI tracking stops updating for more than 7 consecutive business days or is declared lost by Posti depot.",
    solution: "Oivaly concierge coordinates with Posti Group directly. Once missing status is confirmed, a full reimbursement is automatically credited back to your account.",
    timeline: "Investigated within 48 hours",
    guaranteeOutcome: "100% Full Refund Guarantee",
  },
  {
    id: "not_as_described",
    title: "Item Materially Differs from Studio Description",
    problem: "The received piece has an entirely different color glaze, wrong wood species, or major measurement discrepancies.",
    solution: "Artisan is required to provide a free prepaid Posti return label. Once returned to the workshop, full escrow is returned to you.",
    timeline: "Resolved within 2–4 business days",
    guaranteeOutcome: "100% Free Return & Full Refund",
  },
  {
    id: "late_dispatch",
    title: "Artisan Exceeds Promised Production SLA",
    problem: "A custom wood or knitted piece is not dispatched within the promised production lead-time window.",
    solution: "You may cancel the order with a single click for an immediate full escrow refund, or agree with the artisan on an updated timeline.",
    timeline: "Instant cancellation on demand",
    guaranteeOutcome: "Immediate 100% Escrow Release to Buyer",
  },
];

export default function BuyerProtectionPage() {
  const [activeScenario, setActiveScenario] = useState<string>("transit_breakage");
  const selectedScenario = PROTECTION_SCENARIOS.find((s) => s.id === activeScenario) || PROTECTION_SCENARIOS[0];

  return (
    <div className="min-h-screen bg-background py-8 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Buyer Protection</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
            <ShieldCheckIcon className="size-4" weight="fill" />
            <span>Institutional-Grade Artisan Commerce</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">
            The Oivaly Buyer Protection Guarantee
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            When you purchase handmade Nordic goods on Oivaly, your transaction is safeguarded at every milestone. By combining <strong>PRH-verified Finnish business registries</strong>, <strong>bank-level 14-day escrow payment protection</strong>, and <strong>official Posti barcode tracking</strong>, we ensure you never bear financial risk when supporting independent artisans.
          </p>
        </div>

        {/* Escrow Timeline Infographic */}
        <div className="border border-border/80 bg-card p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-deep-forest dark:text-primary">
              Financial Security Architecture
            </span>
            <h2 className="text-xl font-serif font-bold text-foreground">
              How Oivaly 14-Day Escrow Safeguards Your Money
            </h2>
            <p className="text-xs text-muted-foreground">
              Unlike peer-to-peer boards or direct wire transfers, your funds never flow straight into an unvetted account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            <div className="p-4 bg-muted/30 border border-border/70 space-y-2 relative">
              <span className="size-6 rounded-full bg-brand-deep-forest text-white font-mono text-xs flex items-center justify-center font-bold">1</span>
              <h3 className="text-xs font-bold text-foreground">Secured Checkout</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                You pay via encrypted Finnish bank transfer or card. Funds are locked into high-security Nordic escrow.
              </p>
            </div>

            <div className="p-4 bg-muted/30 border border-border/70 space-y-2 relative">
              <span className="size-6 rounded-full bg-brand-deep-forest text-white font-mono text-xs flex items-center justify-center font-bold">2</span>
              <h3 className="text-xs font-bold text-foreground">Artisan Handcrafts</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                The maker finishes your order, wraps it in eco-protective honeycomb paper, and books Posti courier pickup.
              </p>
            </div>

            <div className="p-4 bg-muted/30 border border-border/70 space-y-2 relative">
              <span className="size-6 rounded-full bg-brand-deep-forest text-white font-mono text-xs flex items-center justify-center font-bold">3</span>
              <h3 className="text-xs font-bold text-foreground">Tracked Delivery</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Parcel travels with registered Posti JJFI barcode to your locker or door. Handover timestamp is logged.
              </p>
            </div>

            <div className="p-4 bg-brand-pale-sage/30 dark:bg-muted border border-brand-deep-forest/30 space-y-2 relative">
              <span className="size-6 rounded-full bg-emerald-700 text-white font-mono text-xs flex items-center justify-center font-bold">4</span>
              <h3 className="text-xs font-bold text-foreground">14-Day Inspection</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                You have 14 full days to inspect the craft in your home. Escrow remains held in your favor.
              </p>
            </div>

            <div className="p-4 bg-muted/30 border border-border/70 space-y-2 relative">
              <span className="size-6 rounded-full bg-brand-deep-forest text-white font-mono text-xs flex items-center justify-center font-bold">5</span>
              <h3 className="text-xs font-bold text-foreground">Maker Disbursal</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Once satisfied, the 90% net earnings are safely disbursed to the artisan&apos;s verified Finnish IBAN bank account.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Buyer Protection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-card border border-border/80 space-y-3">
            <div className="size-10 rounded-full bg-brand-pale-sage text-brand-deep-forest flex items-center justify-center">
              <IdentificationBadgeIcon className="size-5" weight="fill" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              1. PRH & YTJ Verified Business Identities
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every seller on Oivaly is verified against the Finnish Patent and Registration Office (PRH) database. We confirm real corporate identity (Y-tunnus), physical atelier location in Finland, and VAT registration with the Finnish Tax Administration (Verohallinto).
            </p>
          </div>

          <div className="p-6 bg-card border border-border/80 space-y-3">
            <div className="size-10 rounded-full bg-brand-pale-sage text-brand-deep-forest flex items-center justify-center">
              <ShieldCheckIcon className="size-5" weight="fill" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              2. Transit Breakage & Damage Guarantee
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nordic pottery and mouth-blown glass are fragile by nature. If your parcel is mistreated in transit by courier handling, our guarantee covers 100% of the replacement or refund cost without requiring you to pay return postage.
            </p>
          </div>

          <div className="p-6 bg-card border border-border/80 space-y-3">
            <div className="size-10 rounded-full bg-brand-pale-sage text-brand-deep-forest flex items-center justify-center">
              <CreditCardIcon className="size-5" weight="fill" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              3. Bank-Grade PSD2 & PCI-DSS Level 1 Security
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Transactions are handled via Stripe Payments Europe and certified Finnish Open Banking APIs (BankID). Your payment credentials and Finnish bank account details are never stored on our servers and are encrypted with end-to-end TLS 1.3.
            </p>
          </div>

          <div className="p-6 bg-card border border-border/80 space-y-3">
            <div className="size-10 rounded-full bg-brand-pale-sage text-brand-deep-forest flex items-center justify-center">
              <HandshakeIcon className="size-5" weight="fill" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              4. Helsinki-Based Human Concierge Mediation
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You are never left alone with automated chat bots. Our dedicated bilingual (Finnish & English) dispute team in Helsinki mediates with studios directly and issues binding escrow determinations within 48 business hours.
            </p>
          </div>
        </div>

        {/* Interactive Dispute Scenario Simulator */}
        <div className="border border-border/80 bg-card p-6 sm:p-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
              <ScalesIcon className="size-4" weight="fill" />
              <span>Resolution Guarantee Simulator</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground mt-1">
              What Happens When Something Goes Wrong?
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select a real-world scenario below to see how our Buyer Protection protocol automatically steps in.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {PROTECTION_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setActiveScenario(sc.id)}
                className={`p-3 text-left text-xs border transition-colors ${
                  activeScenario === sc.id
                    ? "border-brand-deep-forest bg-brand-deep-forest/5 font-semibold text-brand-deep-forest dark:border-primary dark:text-primary dark:bg-primary/10"
                    : "border-border/70 hover:border-border text-foreground hover:bg-muted/40"
                }`}
              >
                {sc.title}
              </button>
            ))}
          </div>

          {/* Active Scenario Card */}
          <div className="p-6 bg-brand-warm-ivory dark:bg-card border border-border/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <h3 className="font-bold text-sm text-foreground">{selectedScenario.title}</h3>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircleIcon className="size-3.5" weight="fill" />
                <span>{selectedScenario.guaranteeOutcome}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] block">
                  Reported Issue
                </span>
                <p className="text-foreground leading-relaxed">{selectedScenario.problem}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] block">
                  Oivaly Protection Action & Outcome
                </span>
                <p className="text-foreground leading-relaxed">{selectedScenario.solution}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-2 border-t border-border/40">
              <ClockIcon className="size-3.5 text-primary" weight="fill" />
              <span>Standard Resolution Timeline: <strong>{selectedScenario.timeline}</strong></span>
            </div>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-foreground">
            Oivaly Protected vs. Unregulated Alternatives
          </h2>
          <div className="border border-border/80 bg-card overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/40 border-b border-border/80 text-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Security Feature</th>
                    <th className="p-3.5 text-brand-deep-forest dark:text-emerald-400 font-bold">Oivaly Nordic Marketplace</th>
                    <th className="p-3.5 text-muted-foreground">Classified Boards & Direct Wire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">Payment Custody</td>
                    <td className="p-3.5 text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircleIcon className="size-4 shrink-0" weight="fill" />
                      <span>Held in 14-day escrow until safe delivery</span>
                    </td>
                    <td className="p-3.5 text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <XCircleIcon className="size-4 shrink-0" weight="fill" />
                      <span>Direct wire / MobilePay with zero recourse</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">Artisan Identity</td>
                    <td className="p-3.5 text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircleIcon className="size-4 shrink-0" weight="fill" />
                      <span>Finnish Y-tunnus & PRH trade register verified</span>
                    </td>
                    <td className="p-3.5 text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <XCircleIcon className="size-4 shrink-0" weight="fill" />
                      <span>Anonymous social media profiles</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">Breakage Coverage</td>
                    <td className="p-3.5 text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircleIcon className="size-4 shrink-0" weight="fill" />
                      <span>100% Free replacement or immediate refund</span>
                    </td>
                    <td className="p-3.5 text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <XCircleIcon className="size-4 shrink-0" weight="fill" />
                      <span>Buyer bears total loss</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">Statutory Rights</td>
                    <td className="p-3.5 text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircleIcon className="size-4 shrink-0" weight="fill" />
                      <span>Full Finnish Consumer Protection Act compliance</span>
                    </td>
                    <td className="p-3.5 text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <XCircleIcon className="size-4 shrink-0" weight="fill" />
                      <span>Exempt private sales (Ostajan omalla vastuulla)</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Contact Dispute Concierge */}
        <div className="p-6 sm:p-8 bg-brand-warm-ivory dark:bg-card border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Need to open a buyer protection claim?</h3>
            <p className="text-xs text-muted-foreground">
              Our Helsinki concierge will evaluate your order and step in within 24 hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-brand-deep-forest text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-deep-forest/90 transition-colors shrink-0"
          >
            Open a Protection Claim
          </Link>
        </div>
      </div>
    </div>
  );
}
