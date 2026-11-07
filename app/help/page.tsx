"use client";

import * as React from "react";
import Link from "next/link";
import {
  QuestionIcon,
  PackageIcon,
  ArrowsClockwiseIcon,
  CreditCardIcon,
  StorefrontIcon,
  EnvelopeSimpleIcon,
  MagnifyingGlassIcon,
  CaretDownIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";

interface FAQItem {
  q: string;
  a: string;
  category: "orders" | "shipping" | "returns" | "payments" | "sellers";
}

const EXTENSIVE_FAQS: FAQItem[] = [
  {
    category: "orders",
    q: "How do I track my Posti package?",
    a: "As soon as the artisan workshop books courier pickup, an automated email and SMS notification is dispatched with your registered Finnish Posti barcode tracking number (e.g. JJFI61234567890123456). You can track live parcel milestones directly on posti.fi, inside your Oivaly account orders dashboard, or by entering the tracking code in the tracking box above.",
  },
  {
    category: "orders",
    q: "Can I modify my shipping address or cancel an order after placing it?",
    a: "Because each piece is prepared in an independent atelier, please contact customer support or the artisan directly within 2 hours of checkout. If the studio has not yet booked the courier consignment or begun bespoke fabrication, we can update delivery details or cancel with a 100% full refund.",
  },
  {
    category: "orders",
    q: "What should I do if my package appears delayed in transit?",
    a: "Domestic Posti deliveries typically take 1–3 business days. If your tracking status has not updated for more than 4 business days, please contact support@oivaly.fi with your order number. Our Helsinki team will immediately contact Posti dispatch to locate the consignment.",
  },
  {
    category: "shipping",
    q: "How does Postipaketti SmartPost locker delivery work?",
    a: "Posti operates over 3,000 automated SmartPost lockers in supermarkets and kiosks (K-Market, S-Market, Prisma, R-Kioski) across Finland. When your parcel arrives, you receive an SMS with a unique 6-digit locker code. You have 7 days to collect your parcel at your convenience.",
  },
  {
    category: "shipping",
    q: "How long does shipping take for made-to-order bespoke items?",
    a: "In-stock pieces are dispatched within 24–48 hours. For bespoke commissions (such as customized kuksas, hand-carved furniture, or custom ceramic dinnerware sets), craft production times range from 5 to 14 business days, which is clearly listed on each product page.",
  },
  {
    category: "shipping",
    q: "Do you ship internationally outside Finland?",
    a: "Yes! Oivaly delivers across Sweden, Norway, Denmark, Germany, and the entire European Union via Posti Priority EU and DHL Express. EU delivery typically takes 3 to 6 business days with full customs clearance included.",
  },
  {
    category: "returns",
    q: "What is the 14-day statutory return policy?",
    a: "In accordance with Chapter 6 of the Finnish Consumer Protection Act and EU statutory law, you have 14 days from the date of physical delivery to withdraw from your purchase and return the item in its original, undamaged condition for a 100% refund.",
  },
  {
    category: "returns",
    q: "How do I return a package via Posti?",
    a: "Simply request a return via your account or email support@oivaly.fi. We will generate a digital Posti return code (Helposti-koodi). You take the packaged parcel to any Posti locker, enter the 6-digit code, and place the parcel inside. No home printer is required.",
  },
  {
    category: "returns",
    q: "What items are exempt from returns?",
    a: "Custom personalized commissions (e.g. items engraved with individual names or custom-sized garments) and unsealed hygiene items (such as botanical sauna salves with broken tamper seals) cannot be returned unless defective.",
  },
  {
    category: "returns",
    q: "What if an item arrives broken or cracked?",
    a: "All ceramic and glass pieces are insured. Snap 2–3 photos of the broken piece and outer box, then email support@oivaly.fi within 48 hours. We arrange an immediate replacement piece or a 100% full refund with zero hassle.",
  },
  {
    category: "payments",
    q: "Is Finnish VAT (ALV 25.5%) included in the listed price?",
    a: "Yes. All retail prices displayed on Oivaly are in Euros (€) and include Finnish Value Added Tax (ALV 25.5%) where applicable. You will never be surprised by hidden checkout surcharges or unexpected customs fees within the EU.",
  },
  {
    category: "payments",
    q: "How does the 14-Day Escrow Buyer Protection safeguard my money?",
    a: "When you pay via Stripe, card, or European bank transfer, your payment is held in high-security escrow for 14 days following verified courier delivery. Funds are only disbursed to the independent maker once you have received and inspected the item.",
  },
  {
    category: "payments",
    q: "What payment methods are supported?",
    a: "We support Visa, Mastercard, American Express, Apple Pay, Google Pay, and Finnish online banking via Stripe Payments Europe, certified to PCI-DSS Level 1 security.",
  },
  {
    category: "sellers",
    q: "How do I become an approved artisan seller on Oivaly?",
    a: "Independent craft creators in Finland and Scandinavia can apply at /seller/signup. You will need a registered Finnish Business ID (Y-tunnus) or Nordic commercial registration, workshop photos, and portfolio details. We review and approve applications within 24 hours.",
  },
  {
    category: "sellers",
    q: "What fees does Oivaly charge sellers?",
    a: "Oivaly charges a flat 10% platform commission on completed orders. There are zero listing fees, zero setup costs, and zero monthly subscriptions. 90% of every sale goes directly to the creator.",
  },
  {
    category: "sellers",
    q: "When and how do sellers receive payouts?",
    a: "Following the 14-day escrow protection period after Posti delivery, funds automatically clear to your Available Balance. Payouts are transferred automatically to your Finnish IBAN account every Monday.",
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [openItems, setOpenItems] = React.useState<Record<number, boolean>>({ 0: true, 1: true });
  const [trackInput, setTrackInput] = React.useState("");

  const toggleItem = (idx: number) => {
    setOpenItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = trackInput.trim().toUpperCase();
    if (!clean) {
      toast.error("Please enter a valid Posti tracking code (e.g. JJFI...)");
      return;
    }
    window.open(`https://www.posti.fi/en/tracking#/seuranta/${clean}`, "_blank");
  };

  const filteredFaqs = EXTENSIVE_FAQS.filter((faq) => {
    const matchesCat = activeCategory === "all" || faq.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-background py-8 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Help Center & FAQ</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
            <QuestionIcon className="size-4" weight="fill" />
            <span>Customer Service & Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-6xl font-serif font-bold text-foreground tracking-tight leading-tight">
            How Can We Support You?
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Find immediate answers on Posti courier deliveries, parcel lockers, European 14-day statutory returns, Finnish ALV 25.5% tax, and artisan atelier standards.
          </p>

          {/* Quick Search */}
          <div className="pt-2 relative max-w-lg mx-auto">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics (e.g. Posti tracking, returns, ALV tax, escrow)..."
              className="w-full h-11 pl-10 pr-4 text-xs bg-card border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            />
          </div>
        </div>

        {/* Quick Posti Tracking Widget */}
        <div className="border border-border/80 bg-brand-warm-ivory dark:bg-card p-6 sm:p-8 max-w-2xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <PackageIcon className="size-4 text-primary" weight="fill" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Instant Posti Parcel Tracker
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Have a tracking barcode from an artisan? Enter your JJFI number to jump directly to official Posti consignment updates.
          </p>
          <form onSubmit={handleTrackSubmit} className="flex gap-2 pt-1">
            <input
              type="text"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              placeholder="e.g. JJFI61234567890123456"
              className="h-10 px-3 text-xs font-mono bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary flex-1"
            />
            <button
              type="submit"
              className="px-5 bg-brand-deep-forest text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-deep-forest/90 transition-colors cursor-pointer shrink-0"
            >
              Track on Posti &rarr;
            </button>
          </form>
        </div>

        {/* Topic Filters */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 border transition-all cursor-pointer ${
                activeCategory === "all"
                  ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              All Topics ({EXTENSIVE_FAQS.length})
            </button>
            <button
              onClick={() => setActiveCategory("orders")}
              className={`px-3.5 py-1.5 border transition-all cursor-pointer ${
                activeCategory === "orders"
                  ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              Orders & Milestones
            </button>
            <button
              onClick={() => setActiveCategory("shipping")}
              className={`px-3.5 py-1.5 border transition-all cursor-pointer ${
                activeCategory === "shipping"
                  ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              Posti & Delivery
            </button>
            <button
              onClick={() => setActiveCategory("returns")}
              className={`px-3.5 py-1.5 border transition-all cursor-pointer ${
                activeCategory === "returns"
                  ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              Returns & Refunds
            </button>
            <button
              onClick={() => setActiveCategory("payments")}
              className={`px-3.5 py-1.5 border transition-all cursor-pointer ${
                activeCategory === "payments"
                  ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              Payments & ALV Tax
            </button>
            <button
              onClick={() => setActiveCategory("sellers")}
              className={`px-3.5 py-1.5 border transition-all cursor-pointer ${
                activeCategory === "sellers"
                  ? "bg-brand-deep-forest text-white border-brand-deep-forest font-semibold"
                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              For Artisans
            </button>
          </div>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground bg-card border border-border/80">
              No matching questions found for &ldquo;{searchQuery}&rdquo;. Contact our support team below.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = !!openItems[idx];
              return (
                <div
                  key={faq.q}
                  className="bg-card border border-border/80 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-foreground">
                      {faq.q}
                    </span>
                    <CaretDownIcon
                      className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40 mt-1 pt-3 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Direct Contact Support Box */}
        <div className="border border-border/80 bg-brand-pale-sage/20 dark:bg-muted/20 p-8 sm:p-10 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-serif font-bold text-foreground">
              Need personalized assistance?
            </h3>
            <p className="text-xs text-muted-foreground">
              Our Helsinki support desk responds Monday–Friday within 1 business day.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 bg-brand-deep-forest text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-deep-forest/90 transition-colors shrink-0"
          >
            Open Support Ticket
          </Link>
        </div>
      </div>
    </div>
  );
}
