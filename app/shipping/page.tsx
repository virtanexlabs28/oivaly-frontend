"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TruckIcon,
  PackageIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ClockIcon,
  CalculatorIcon,
  ArrowsClockwiseIcon,
  WarningCircleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  InfoIcon,
  SparkleIcon,
  BuildingsIcon,
  TreeEvergreenIcon,
} from "@phosphor-icons/react";

interface WeightTier {
  id: string;
  label: string;
  weight: string;
  dimensions: string;
  example: string;
}

interface DestinationZone {
  id: string;
  name: string;
  service: string;
  baseDays: string;
  carrier: string;
  rates: Record<string, number>;
  trackingAvailable: boolean;
  co2Offset: string;
}

const WEIGHT_TIERS: WeightTier[] = [
  { id: "xs", label: "Pikkupaketti (XS)", weight: "< 250 g", dimensions: "Max 35 x 25 x 3 cm", example: "Silver jewelry, bookmarks, small leather cardholders" },
  { id: "s", label: "Postipaketti S", weight: "< 2 kg", dimensions: "Max 11 x 32 x 42 cm", example: "Ceramic mugs, linen kitchen towels, hand-poured candles" },
  { id: "m", label: "Postipaketti M", weight: "< 5 kg", dimensions: "Max 19 x 36 x 60 cm", example: "Wool throws, wooden serving boards, tabletop vases" },
  { id: "l", label: "Postipaketti L", weight: "< 10 kg", dimensions: "Max 37 x 36 x 60 cm", example: "Large stoneware bowls, heavy winter knitwear sets" },
  { id: "xl", label: "Postipaketti XL", weight: "< 25 kg", dimensions: "Max 59 x 36 x 60 cm", example: "Solid birch stools, custom furniture pieces, artisan sets" },
];

const DESTINATION_ZONES: DestinationZone[] = [
  {
    id: "fi_locker",
    name: "Finland — Posti SmartPost Locker / Point",
    service: "Posti Postipaketti Automatti",
    baseDays: "1 – 2 business days",
    carrier: "Posti Group Oyj",
    trackingAvailable: true,
    co2Offset: "100% Fossil-Free Posti Green",
    rates: { xs: 4.90, s: 6.90, m: 8.90, l: 11.90, xl: 16.90 },
  },
  {
    id: "fi_home",
    name: "Finland — Kotipaketti (Doorstep Delivery)",
    service: "Posti Kotipaketti Scheduled",
    baseDays: "1 – 2 business days",
    carrier: "Posti Group Oyj",
    trackingAvailable: true,
    co2Offset: "100% Fossil-Free Posti Green",
    rates: { xs: 9.90, s: 12.90, m: 14.90, l: 18.90, xl: 24.90 },
  },
  {
    id: "nordic",
    name: "Nordics (Sweden, Denmark, Norway)",
    service: "Posti Nordic Priority Parcel",
    baseDays: "2 – 4 business days",
    carrier: "Posti + PostNord / Bring",
    trackingAvailable: true,
    co2Offset: "Carbon-Compensated Transit",
    rates: { xs: 8.90, s: 12.90, m: 16.90, l: 22.90, xl: 32.90 },
  },
  {
    id: "eu",
    name: "European Union (Germany, France, Benelux, etc.)",
    service: "Posti Priority Parcel EU",
    baseDays: "3 – 6 business days",
    carrier: "Posti + DHL Euroconnect",
    trackingAvailable: true,
    co2Offset: "Green Logistics Partner",
    rates: { xs: 10.90, s: 15.90, m: 19.90, l: 26.90, xl: 38.90 },
  },
];

export default function ShippingPage() {
  const [selectedZone, setSelectedZone] = useState<string>("fi_locker");
  const [selectedWeight, setSelectedWeight] = useState<string>("s");
  const [trackingQuery, setTrackingQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activeZone = DESTINATION_ZONES.find((z) => z.id === selectedZone) || DESTINATION_ZONES[0];
  const activeWeight = WEIGHT_TIERS.find((w) => w.id === selectedWeight) || WEIGHT_TIERS[1];
  const calculatedRate = activeZone.rates[selectedWeight] ?? 6.90;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;
    const cleanCode = trackingQuery.trim().toUpperCase();
    window.open(`https://www.posti.fi/en/tracking#/seuranta/${cleanCode}`, "_blank", "noopener,noreferrer");
  };

  const faqs = [
    {
      q: "How do Posti SmartPost lockers work in Finland?",
      a: "When your parcel arrives at your chosen parcel locker, Posti sends you an SMS and email notification with a private 6-digit PIN code. You simply walk up to the locker screen, enter the PIN, and the locker door pops open. You have 7 full calendar days to collect your package before it is returned to the studio.",
    },
    {
      q: "Can I redirect a parcel to another locker while in transit?",
      a: "Yes. By using the free OmaPosti mobile app (available on iOS and Android), you can set your preferred permanent locker or reroute eligible incoming parcels before they reach the local distribution terminal.",
    },
    {
      q: "What happens during severe Nordic winter weather?",
      a: "During sub-zero winter temperatures, our makers package freeze-sensitive items (such as botanical oils, ceramics with delicate glazes, and liquids) in insulated thermal wrapping. Posti indoor lockers (inside supermarkets and shopping centers) are temperature-regulated to ensure your goods stay safe.",
    },
    {
      q: "Are duties or customs taxes charged inside the European Union?",
      a: "No. All Oivaly items are dispatched directly from verified studios located within Finland (EU). Cross-border shipments to all EU member states (Germany, Sweden, France, Netherlands, etc.) travel through the EU Single Market with zero customs fees or surprise import taxes.",
    },
    {
      q: "What if my parcel arrives damaged by the courier?",
      a: "Every fragile shipment is insured under Oivaly's 14-Day Buyer Protection. Take 2–3 photos of the outer box and broken piece and email support@oivaly.fi within 48 hours. We coordinate an immediate free artisan replacement or 100% full escrow refund.",
    },
    {
      q: "Can I combine shipments from multiple different makers?",
      a: "Because our marketplace connects you directly to independent maker studios across Finland (from Helsinki workshops to Lapland woodcarvers), each artisan hand-packs and ships their creations from their own atelier. If you order from two distinct makers, you will receive two separate Posti tracking numbers.",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Shipping Information</span>
        </nav>

        {/* Hero Banner */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
            <TruckIcon className="size-4" weight="fill" />
            <span>Fossil-Free Nordic Logistics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">
            Shipping & Posti Delivery
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            We partner with <strong>Posti Group Oyj</strong>, Finland&apos;s national postal service, to provide transparent, carbon-compensated deliveries directly from independent maker studios to over 3,000 automated SmartPost lockers, local pickup points, and doorsteps across Finland and Europe.
          </p>
        </div>

        {/* Live Posti Tracking Widget */}
        <div className="bg-brand-warm-ivory dark:bg-card border border-border/80 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-deep-forest dark:text-primary uppercase tracking-wider">
                <SparkleIcon className="size-3.5" weight="fill" />
                <span>Live Consignment Tracking</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-foreground mt-1">
                Track your Posti JJFI Parcel
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enter your 20-character Finnish postal barcode received in your dispatch confirmation email.
              </p>
            </div>
            <div className="text-xs font-mono bg-background border border-border px-3 py-1.5 rounded text-muted-foreground shrink-0">
              Format: <span className="text-foreground font-semibold">JJFI61234567890123456</span>
            </div>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={trackingQuery}
                onChange={(e) => setTrackingQuery(e.target.value)}
                placeholder="Enter JJFI tracking code..."
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border/80 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-brand-deep-forest"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-deep-forest text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-deep-forest/90 transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              <span>Track on Posti.fi</span>
              <TruckIcon className="size-4" weight="bold" />
            </button>
          </form>
        </div>

        {/* Interactive Delivery Rate & Weight Calculator */}
        <div className="border border-border/80 bg-card p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <CalculatorIcon className="size-4" weight="fill" />
                <span>Cost & Delivery Estimator</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-foreground mt-1">
                Calculate Shipping by Weight & Destination
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Rates are calculated according to official Posti logistics weight classes and standardized studio box dimensions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            {/* Step 1: Destination */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                1. Select Destination Zone
              </label>
              <div className="space-y-2">
                {DESTINATION_ZONES.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZone(zone.id)}
                    className={`w-full text-left p-3 border text-xs transition-colors flex flex-col gap-0.5 ${
                      selectedZone === zone.id
                        ? "border-brand-deep-forest bg-brand-deep-forest/5 font-semibold text-brand-deep-forest dark:border-primary dark:text-primary dark:bg-primary/10"
                        : "border-border/70 hover:border-border hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <span>{zone.name}</span>
                    <span className="text-[11px] text-muted-foreground">{zone.service}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Weight Tier */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                2. Select Parcel Weight Tier
              </label>
              <div className="space-y-2">
                {WEIGHT_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedWeight(tier.id)}
                    className={`w-full text-left p-3 border text-xs transition-colors flex items-center justify-between ${
                      selectedWeight === tier.id
                        ? "border-brand-deep-forest bg-brand-deep-forest/5 font-semibold text-brand-deep-forest dark:border-primary dark:text-primary dark:bg-primary/10"
                        : "border-border/70 hover:border-border hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{tier.label}</div>
                      <div className="text-[11px] text-muted-foreground">{tier.dimensions}</div>
                    </div>
                    <span className="font-mono text-xs font-bold text-muted-foreground">{tier.weight}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Result Summary Card */}
            <div className="bg-muted/30 border border-border/80 p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  3. Estimated Shipping Breakdown
                </span>

                <div className="space-y-2 border-b border-border/60 pb-4">
                  <div className="text-2xl font-serif font-bold text-foreground">
                    €{calculatedRate.toFixed(2)}
                    <span className="text-xs font-normal text-muted-foreground ml-1.5">(incl. ALV 25.5%)</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Example items: <strong className="text-foreground">{activeWeight.example}</strong>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Estimated Delivery:</span>
                    <span className="font-semibold text-foreground">{activeZone.baseDays}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Logistics Partner:</span>
                    <span className="font-semibold text-foreground">{activeZone.carrier}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Tracking Status:</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircleIcon className="size-3.5" weight="fill" />
                      Full Posti JJFI Barcode
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Environmental Standard:</span>
                    <span className="font-semibold text-brand-deep-forest dark:text-emerald-400">
                      {activeZone.co2Offset}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-card border border-border/60 text-[11px] text-muted-foreground leading-relaxed">
                <InfoIcon className="size-3.5 inline mr-1 text-primary shrink-0" weight="fill" />
                Individual artisan studios frequently offer free shipping promotions on orders above €50 or €80. Check individual product pages for studio-specific thresholds.
              </div>
            </div>
          </div>
        </div>

        {/* 5-Stage Nordic Fulfillment Pipeline */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              From the Artisan Studio to Your Hands
            </h2>
            <p className="text-xs text-muted-foreground">
              Every parcel follows an authentic, tracked Scandinavian journey designed for environmental responsibility and fragile protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-card border border-border/80 space-y-2 relative">
              <div className="size-7 rounded-full bg-brand-pale-sage text-brand-deep-forest font-bold flex items-center justify-center text-xs">
                01
              </div>
              <h3 className="font-bold text-xs text-foreground">Order Received</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                The independent maker receives your order notification and begins item preparation or finishing touches.
              </p>
            </div>

            <div className="p-4 bg-card border border-border/80 space-y-2 relative">
              <div className="size-7 rounded-full bg-brand-pale-sage text-brand-deep-forest font-bold flex items-center justify-center text-xs">
                02
              </div>
              <h3 className="font-bold text-xs text-foreground">Eco Packaging</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Makers wrap goods in 100% recyclable honeycomb paper cushioning and unbleached FSC cardboard. Zero plastic chips.
              </p>
            </div>

            <div className="p-4 bg-card border border-border/80 space-y-2 relative">
              <div className="size-7 rounded-full bg-brand-pale-sage text-brand-deep-forest font-bold flex items-center justify-center text-xs">
                03
              </div>
              <h3 className="font-bold text-xs text-foreground">Posti Courier Booking</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                The seller books courier dispatch through Oivaly&apos;s Posti API, generating your unique JJFI barcode and dispatch label.
              </p>
            </div>

            <div className="p-4 bg-card border border-border/80 space-y-2 relative">
              <div className="size-7 rounded-full bg-brand-pale-sage text-brand-deep-forest font-bold flex items-center justify-center text-xs">
                04
              </div>
              <h3 className="font-bold text-xs text-foreground">Carbon-Smart Transit</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Parcels move through Posti&apos;s biogas and electric delivery fleet to your regional Finnish or EU distribution hub.
              </p>
            </div>

            <div className="p-4 bg-card border border-border/80 space-y-2 relative">
              <div className="size-7 rounded-full bg-brand-deep-forest text-white font-bold flex items-center justify-center text-xs">
                05
              </div>
              <h3 className="font-bold text-xs text-foreground">SMS PIN or Doorstep</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Receive an instant SMS with your SmartPost PIN code, or a polite courier ring at your scheduled doorstep window.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Comparison Table of Domestic & EU Services */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-foreground">
            Complete Posti Delivery Service Matrix
          </h2>
          <div className="border border-border/80 bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border/80 text-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Service Type</th>
                    <th className="p-3.5">Estimated Time</th>
                    <th className="p-3.5">Pickup / Dropoff Point</th>
                    <th className="p-3.5">Signature Required</th>
                    <th className="p-3.5">Starting Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">
                      <strong>Postipaketti Locker</strong>
                      <span className="block text-[11px] text-muted-foreground">Over 3,000 SmartPost points across Finland</span>
                    </td>
                    <td className="p-3.5 text-muted-foreground">1 – 3 business days</td>
                    <td className="p-3.5 text-muted-foreground">Self-service locker with SMS PIN</td>
                    <td className="p-3.5 text-muted-foreground">Digital PIN verification</td>
                    <td className="p-3.5 font-mono font-medium text-foreground">€6.90</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">
                      <strong>Kotipaketti Home Delivery</strong>
                      <span className="block text-[11px] text-muted-foreground">Scheduled delivery direct to recipient doorstep</span>
                    </td>
                    <td className="p-3.5 text-muted-foreground">1 – 2 business days</td>
                    <td className="p-3.5 text-muted-foreground">Delivered to door at agreed time window</td>
                    <td className="p-3.5 text-muted-foreground">Yes (Recipient or proxy)</td>
                    <td className="p-3.5 font-mono font-medium text-foreground">€12.90</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">
                      <strong>Pikkupaketti (Letterbox)</strong>
                      <span className="block text-[11px] text-muted-foreground">Slim packages under 3cm thickness</span>
                    </td>
                    <td className="p-3.5 text-muted-foreground">2 – 4 business days</td>
                    <td className="p-3.5 text-muted-foreground">Delivered directly into your home mail slot</td>
                    <td className="p-3.5 text-muted-foreground">No</td>
                    <td className="p-3.5 font-mono font-medium text-foreground">€4.90</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-foreground">
                      <strong>Nordic & EU Priority Parcel</strong>
                      <span className="block text-[11px] text-muted-foreground">Sweden, Denmark, Norway & all EU 27 nations</span>
                    </td>
                    <td className="p-3.5 text-muted-foreground">2 – 6 business days</td>
                    <td className="p-3.5 text-muted-foreground">PostNord / DHL pickup point or doorstep</td>
                    <td className="p-3.5 text-muted-foreground">Yes</td>
                    <td className="p-3.5 font-mono font-medium text-foreground">€12.90</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SmartPost Locker Guide & Winter Transit Advisory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-6 bg-card border border-border/80 space-y-3">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm">
              <BuildingsIcon className="size-5 text-brand-deep-forest dark:text-primary" weight="fill" />
              <span>SmartPost Parcel Locker Guide</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Posti parcel lockers are located in grocery stores (K-Market, S-Market, Prisma), shopping centers, and public transport hubs. When your package is placed in a locker:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
              <li>You receive an SMS & email with a 6-digit locker code.</li>
              <li>Touch &apos;Pick up a parcel&apos; on the screen and enter your code.</li>
              <li>The correct locker door springs open automatically.</li>
              <li>You have <strong>7 full days</strong> to pick up your package.</li>
            </ul>
          </div>

          <div className="p-6 bg-card border border-border/80 space-y-3">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm">
              <TreeEvergreenIcon className="size-5 text-brand-deep-forest dark:text-primary" weight="fill" />
              <span>Sub-Zero Nordic Winter Advisory</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Finnish winters regularly see temperatures dip below -20°C. To protect artisanal goods from freeze cycles:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
              <li>Pottery glazes and natural botanicals are packed with insulation.</li>
              <li>We prioritize indoor, heated SmartPost lockers over outdoor units.</li>
              <li>Customers are advised to allow cold ceramics to adjust to room temperature for 1 hour before pouring boiling liquids.</li>
              <li>Lapland deliveries during heavy snowfall may occasionally take +1 extra transit day.</li>
            </ul>
          </div>
        </div>

        {/* Shipping FAQ Accordion */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-foreground">
            Frequently Asked Shipping Questions
          </h2>
          <div className="divide-y divide-border/60 border border-border/80 bg-card">
            {faqs.map((faq, i) => (
              <div key={i} className="transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-xs text-foreground hover:bg-muted/30"
                >
                  <span>{faq.q}</span>
                  <span className="text-muted-foreground font-mono text-sm shrink-0">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Help CTA Footer */}
        <div className="p-6 sm:p-8 bg-brand-warm-ivory dark:bg-card border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Have questions regarding a dispatched order?</h3>
            <p className="text-xs text-muted-foreground">
              Our Helsinki concierge team is available Monday through Friday from 09:00 to 18:00 EET.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-brand-deep-forest text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-deep-forest/90 transition-colors shrink-0"
          >
            Contact Logistics Support
          </Link>
        </div>
      </div>
    </div>
  );
}
