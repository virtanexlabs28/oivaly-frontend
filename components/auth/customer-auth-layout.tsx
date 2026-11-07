"use client";

import * as React from "react";
import Link from "next/link";
import {
  SparkleIcon,
  StorefrontIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  BagIcon,
  ArrowRightIcon,
  HeartIcon,
  LockKeyIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";

export interface CustomerAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  activeTab?: "login" | "register" | "forgot" | "reset";
}

export function CustomerAuthLayout({
  children,
  title,
  subtitle,
  activeTab = "login",
}: CustomerAuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* ─── LEFT COLUMN: Scandinavian Marketplace Showcase (Hidden on Mobile) ─── */}
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
              Oivaly Artisan Haven
            </Badge>
          </div>

          <div className="pt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] text-emerald-200 font-medium mb-3">
              <SparkleIcon className="size-3.5 text-emerald-300" weight="fill" />
              <span>Suomalainen Käsityö &bull; Curated Oivaly Artisans</span>
            </div>

            <h1 className="font-heading text-2xl xl:text-3xl font-bold tracking-tight text-white leading-tight">
              Exceptional Finnish craftsmanship, curated for conscious living on Oivaly.
            </h1>

            <p className="text-xs xl:text-sm text-white/75 mt-3 leading-relaxed">
              Oivaly connects design enthusiasts directly with independent ceramicists,
              woodworkers, jewelers, and textile artisans across Finland.
              Every piece carries authentic craft heritage.
            </p>
          </div>

          {/* 4 Value Propositions Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="p-3.5 rounded-sm bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
              <div className="size-7 rounded-xs bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <StorefrontIcon className="size-4" />
              </div>
              <h4 className="text-xs font-semibold text-white">Direct from Ateliers</h4>
              <p className="text-[10px] text-white/60 leading-tight">
                Support independent studios directly with zero middlemen.
              </p>
            </div>

            <div className="p-3.5 rounded-sm bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
              <div className="size-7 rounded-xs bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <TruckIcon className="size-4" />
              </div>
              <h4 className="text-xs font-semibold text-white">Posti Smartpost</h4>
              <p className="text-[10px] text-white/60 leading-tight">
                Carbon-neutral delivery to 3,000+ local parcel lockers.
              </p>
            </div>

            <div className="p-3.5 rounded-sm bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
              <div className="size-7 rounded-xs bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <ShieldCheckIcon className="size-4" />
              </div>
              <h4 className="text-xs font-semibold text-white">14-Day Returns</h4>
              <p className="text-[10px] text-white/60 leading-tight">
                Guaranteed statutory right of withdrawal under Finnish law.
              </p>
            </div>

            <div className="p-3.5 rounded-sm bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
              <div className="size-7 rounded-xs bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <LockKeyIcon className="size-4" />
              </div>
              <h4 className="text-xs font-semibold text-white">Secure Payments</h4>
              <p className="text-[10px] text-white/60 leading-tight">
                MobilePay, Finnish online banks & encrypted card checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial & Badges */}
        <div className="relative z-10 pt-8 border-t border-white/10 space-y-4">
          <blockquote className="space-y-1.5">
            <p className="text-[11px] text-white/80 italic leading-relaxed">
              &ldquo;Oivaly makes it effortless to discover authentic Finnish ceramics and artisan homeware.
              The pieces arrived safely packaged with heartfelt personal notes from each maker.&rdquo;
            </p>
            <footer className="text-[10px] text-emerald-300 font-medium">
              &mdash; Sofia Lindholm, Helsinki Design Collector
            </footer>
          </blockquote>

          <div className="flex items-center justify-between text-[10px] text-white/50 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheckIcon className="size-3.5 text-emerald-400" />
              KULUTTAJANSUOJA COMPLIANT
            </span>
            <span>350+ VERIFIED ATELIERS</span>
          </div>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: Modern Customer Authentication Form ─── */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 xl:p-16 max-w-2xl mx-auto w-full">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-border/60 lg:border-none">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-sm bg-brand-deep-forest text-white flex items-center justify-center shadow-xs">
              <BagIcon className="size-5" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm tracking-tight text-foreground block">
                Oivaly
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Customer Account Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={`text-xs font-semibold px-3 py-1.5 rounded-none transition-colors ${
                activeTab === "login"
                  ? "bg-brand-pale-sage text-brand-deep-forest font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className={`text-xs font-semibold px-3 py-1.5 rounded-none transition-colors ${
                activeTab === "register"
                  ? "bg-brand-deep-forest text-white font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
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
            <span>Encrypted 256-bit Customer Security</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

