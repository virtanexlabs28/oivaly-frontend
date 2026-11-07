"use client";

import * as React from "react";
import Link from "next/link";
import {
  SparkleIcon,
  StorefrontIcon,
  CoinsIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  HandshakeIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";

interface SellerAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  activeTab?: "login" | "signup" | "forgot" | "reset";
}

export function SellerAuthLayout({
  children,
  title,
  subtitle,
  activeTab = "login",
}: SellerAuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* ─── LEFT COLUMN: Scandinavian Studio Hero Showcase (Hidden on Mobile) ─── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 bg-gradient-to-br from-[#162518] via-[#1c2e20] to-[#0f1b11] text-white p-8 xl:p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle Background Glow Orbs */}
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-brand-sage/15 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="size-3.5" />
              <span>Back to Marketplace</span>
            </Link>

            <Badge
              variant="outline"
              className="border-white/20 text-emerald-300 bg-white/5 text-[10px] tracking-wider uppercase px-2.5 py-0.5"
            >
              Artisan Atelier Hub
            </Badge>
          </div>

          <div className="pt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] text-emerald-200 font-medium mb-3">
              <SparkleIcon className="size-3.5 text-emerald-300" weight="fill" />
              <span>Suomalainen Käsityö &bull; Nordic Craft Community</span>
            </div>

            <h1 className="font-heading text-2xl xl:text-3xl font-bold tracking-tight text-white leading-tight">
              Bring your handcrafted creations to design enthusiasts worldwide.
            </h1>

            <p className="text-xs xl:text-sm text-white/75 mt-3 leading-relaxed">
              Oivaly is Finland&apos;s premier multi-vendor haven for independent
              ceramicists, carpenters, jewelers, and textile artisans. Maintain full creative
              freedom while we handle the checkout, VAT, and logistics.
            </p>
          </div>

          {/* 4 Value Propositions Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="p-3.5 rounded-sm bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
              <div className="size-7 rounded-xs bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <CoinsIcon className="size-4" />
              </div>
              <h4 className="text-xs font-semibold text-white">Fair 5% Commission</h4>
              <p className="text-[10px] text-white/60 leading-tight">
                Zero listing fees. Only pay when you make a confirmed sale.
              </p>
            </div>

            <div className="p-3.5 rounded-sm bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
              <div className="size-7 rounded-xs bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <TruckIcon className="size-4" />
              </div>
              <h4 className="text-xs font-semibold text-white">Posti & Matkahuolto</h4>
              <p className="text-[10px] text-white/60 leading-tight">
                Discounted rates, instant label generation & parcel lockers.
              </p>
            </div>

            <div className="p-3.5 rounded-sm bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
              <div className="size-7 rounded-xs bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <HandshakeIcon className="size-4" />
              </div>
              <h4 className="text-xs font-semibold text-white">Direct Finnish Payouts</h4>
              <p className="text-[10px] text-white/60 leading-tight">
                Bi-weekly SEPA bank transfers directly to OP, Nordea, Danske.
              </p>
            </div>

            <div className="p-3.5 rounded-sm bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
              <div className="size-7 rounded-xs bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <StorefrontIcon className="size-4" />
              </div>
              <h4 className="text-xs font-semibold text-white">Custom Atelier Story</h4>
              <p className="text-[10px] text-white/60 leading-tight">
                Your own branded shop URL, artisan story & custom banner.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial & Badges */}
        <div className="relative z-10 pt-8 border-t border-white/10 space-y-4">
          <blockquote className="space-y-1.5">
            <p className="text-[11px] text-white/80 italic leading-relaxed">
              &ldquo;Oivaly connected our ceramic workshop with conscious collectors
              across Helsinki and Stockholm. Setup took under 10 minutes.&rdquo;
            </p>
            <footer className="text-[10px] text-emerald-300 font-medium">
              &mdash; Aino &amp; Mikael Virtanen, Savipaja Helsinki
            </footer>
          </blockquote>

          <div className="flex items-center justify-between text-[10px] text-white/50 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheckIcon className="size-3.5 text-emerald-400" />
              VEROHALLINTO COMPLIANT
            </span>
            <span>350+ VERIFIED ATELIERS</span>
          </div>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: Modern Seller Authentication Form ─── */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 xl:p-16 max-w-2xl mx-auto w-full">
        {/* Top Navigation Bar on Mobile */}
        <div className="flex items-center justify-between pb-6 border-b border-border/60 lg:border-none">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-sm bg-brand-deep-forest text-white flex items-center justify-center shadow-xs">
              <StorefrontIcon className="size-5" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm tracking-tight text-foreground block">
                Oivaly
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Seller Atelier Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/seller/login"
              className={`text-xs font-semibold px-3 py-1.5 rounded-none transition-colors ${
                activeTab === "login"
                  ? "bg-brand-pale-sage text-brand-deep-forest font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/seller/signup"
              className={`text-xs font-semibold px-3 py-1.5 rounded-none transition-colors ${
                activeTab === "signup"
                  ? "bg-brand-deep-forest text-white font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Open Studio
            </Link>
          </div>
        </div>

        {/* Form Header */}
        <div className="py-6 sm:py-8 space-y-1.5">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* Active Child Form */}
        <div className="flex-1">{children}</div>

        {/* Bottom Microcopy & Trust Badges */}
        <div className="pt-8 border-t border-border/60 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircleIcon className="size-3.5 text-emerald-600" />
            <span>Encrypted 256-bit Merchant Access</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-foreground transition-colors">
              Marketplace Storefront
            </Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Seller Privacy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Merchant Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
