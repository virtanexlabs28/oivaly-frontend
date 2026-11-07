"use client";

import * as React from "react";
import Link from "next/link";
import {
  EnvelopeSimpleIcon,
  MapPinIcon,
  ClockIcon,
  PaperPlaneTiltIcon,
  CheckCircleIcon,
  SparkleIcon,
  ChatCircleDotsIcon,
  PhoneIcon,
  FileTextIcon,
  BuildingsIcon,
  HeadsetIcon,
  LightningIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";

export default function ContactUsPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [subject, setSubject] = React.useState("order");
  const [urgency, setUrgency] = React.useState("normal");
  const [orderNumber, setOrderNumber] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // Check if Helsinki local time is within business hours (09:00 - 18:00 EET, Mon-Fri)
  const isBusinessHours = React.useMemo(() => {
    try {
      const helsinkiDate = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Europe/Helsinki" })
      );
      const day = helsinkiDate.getDay();
      const hour = helsinkiDate.getHours();
      return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
    } catch {
      return true;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 650));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Message received! Our Helsinki concierge team will respond promptly.");
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
          <span className="text-foreground font-medium">Contact Us</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
              <ChatCircleDotsIcon className="size-4" weight="fill" />
              <span>Direct Helsinki Concierge</span>
            </div>

            {/* Live Operational Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono border border-border bg-card">
              <span
                className={`size-2 rounded-full ${
                  isBusinessHours ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span className="text-foreground font-medium">
                {isBusinessHours ? "Support Desk: Active (EET)" : "Outside Office Hours (Responses in AM)"}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">
            Contact Oivaly
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Whether you need assistance tracking a Posti consignment, requesting a studio return, verifying an artisan&apos;s Finnish Y-tunnus, or discussing a press collaboration, our team in Helsinki is here to assist.
          </p>
        </div>

        {/* 3 Department Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 bg-card border border-border/80 space-y-2">
            <div className="size-9 rounded-full bg-brand-pale-sage text-brand-deep-forest flex items-center justify-center">
              <HeadsetIcon className="size-5" weight="fill" />
            </div>
            <h3 className="font-bold text-foreground">Customer & Order Support</h3>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Order status, Posti locker changes, breakage claims, and buyer protection escrow mediation.
            </p>
            <div className="pt-2">
              <a href="mailto:support@oivaly.fi" className="font-mono text-primary hover:underline font-semibold text-xs">
                support@oivaly.fi
              </a>
            </div>
          </div>

          <div className="p-5 bg-card border border-border/80 space-y-2">
            <div className="size-9 rounded-full bg-brand-pale-sage text-brand-deep-forest flex items-center justify-center">
              <BuildingsIcon className="size-5" weight="fill" />
            </div>
            <h3 className="font-bold text-foreground">Artisan & Studio Relations</h3>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              PRH business verification, onboarding queries, workshop catalog reviews, and payout inquiries.
            </p>
            <div className="pt-2">
              <a href="mailto:makers@oivaly.fi" className="font-mono text-primary hover:underline font-semibold text-xs">
                makers@oivaly.fi
              </a>
            </div>
          </div>

          <div className="p-5 bg-card border border-border/80 space-y-2">
            <div className="size-9 rounded-full bg-brand-pale-sage text-brand-deep-forest flex items-center justify-center">
              <FileTextIcon className="size-5" weight="fill" />
            </div>
            <h3 className="font-bold text-foreground">Press & Partnerships</h3>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Media inquiries, Nordic design features, museum collaborations, and corporate gifting requests.
            </p>
            <div className="pt-2">
              <a href="mailto:press@oivaly.fi" className="font-mono text-primary hover:underline font-semibold text-xs">
                press@oivaly.fi
              </a>
            </div>
          </div>
        </div>

        {/* Main Grid: Form + Office Location */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-card border border-border/80 p-6 sm:p-8">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="size-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircleIcon className="size-8" weight="fill" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-foreground">Message Dispatched!</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Kiitos, <strong className="text-foreground">{name}</strong>. Your ticket has been logged into our Helsinki support queue. A copy has been routed to <span className="font-mono text-foreground">{email}</span>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage("");
                    setOrderNumber("");
                  }}
                  className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-base font-serif font-bold text-foreground pb-2 border-b border-border/60">
                  Send an Inquiry to Our Helsinki Desk
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs font-semibold text-foreground">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alvar Saarinen"
                      className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-brand-deep-forest"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-semibold text-foreground">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.fi"
                      className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-brand-deep-forest"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5 sm:col-span-1">
                    <label htmlFor="subject" className="block text-xs font-semibold text-foreground">
                      Topic Category
                    </label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full h-10 px-2.5 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-brand-deep-forest"
                    >
                      <option value="order">Order & Posti Tracking</option>
                      <option value="return">Return & Refund</option>
                      <option value="damage">Transit Damage / Defect</option>
                      <option value="seller">Seller / Studio Question</option>
                      <option value="press">Press & Corporate</option>
                      <option value="other">General Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-1">
                    <label htmlFor="urgency" className="block text-xs font-semibold text-foreground">
                      Priority Level
                    </label>
                    <select
                      id="urgency"
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="w-full h-10 px-2.5 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-brand-deep-forest"
                    >
                      <option value="normal">Standard Inquiry</option>
                      <option value="urgent">Urgent: Address / Locker Change</option>
                      <option value="breakage">Urgent: Damaged Package</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-1">
                    <label htmlFor="order-num" className="block text-xs font-semibold text-foreground">
                      Order # (Optional)
                    </label>
                    <input
                      id="order-num"
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="OIV-84920"
                      className="w-full h-10 px-3 text-xs font-mono bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-brand-deep-forest"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-semibold text-foreground">
                    Message Details <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your order, parcel inquiry, or studio question..."
                    className="w-full p-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-brand-deep-forest leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <PaperPlaneTiltIcon className="size-4" weight="fill" />
                  <span>{isSubmitting ? "Transmitting..." : "Submit Inquiry to Helsinki Concierge"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Headquarters Location & Legal Registration */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-border/80 p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider text-[11px]">
                Marketplace Headquarters
              </h3>

              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="size-4 text-primary shrink-0 mt-0.5" weight="fill" />
                  <div>
                    <strong className="text-foreground font-semibold block">Oivaly Oy</strong>
                    <span>Mannerheimintie 10 (3rd Floor)</span>
                    <span className="block">00100 Helsinki, Finland</span>
                    <span className="text-[11px] font-mono text-muted-foreground mt-0.5 block">
                      Y-tunnus (Finnish Business ID): 3412984-7
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      VAT / ALV ID: FI34129847
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ClockIcon className="size-4 text-primary shrink-0 mt-0.5" weight="fill" />
                  <div>
                    <strong className="text-foreground font-semibold block">Operating Hours</strong>
                    <span>Monday – Friday: 09:00 – 18:00 (EET)</span>
                    <span className="block text-[11px] text-muted-foreground">Closed on Finnish public holidays</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/80 p-6 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider text-[11px]">
                Visiting Our Helsinki Showroom
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our curated design gallery in central Helsinki showcases rotating seasonal collections from featured Finnish studios. Visits are available by appointment for interior designers, architects, and corporate clients.
              </p>
              <div className="pt-1">
                <a
                  href="mailto:appointments@oivaly.fi"
                  className="font-semibold text-primary hover:underline text-[11px]"
                >
                  Book Showroom Consultation &rarr;
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-5 bg-brand-warm-ivory dark:bg-card border border-border/80 space-y-2 text-xs">
              <span className="font-bold text-foreground block">Looking for fast self-service?</span>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <Link href="/shipping" className="text-primary hover:underline">
                    &rarr; Track Posti JJFI Parcel
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-primary hover:underline">
                    &rarr; Generate a Posti Return Locker Code
                  </Link>
                </li>
                <li>
                  <Link href="/seller-guide" className="text-primary hover:underline">
                    &rarr; View the Seller Onboarding Handbook
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
