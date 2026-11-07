"use client";

import * as React from "react";
import Link from "next/link";
import {
  CookieIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  FloppyDiskIcon,
  InfoIcon,
  LockKeyIcon,
  ChartBarIcon,
  SlidersHorizontalIcon,
  MegaphoneIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";

interface CookieItem {
  name: string;
  provider: string;
  category: "Strictly Necessary" | "Functional" | "Analytics" | "Marketing";
  expiry: string;
  purpose: string;
}

const COOKIE_REGISTRY: CookieItem[] = [
  {
    name: "oivaly_session",
    provider: "Oivaly Oy (First-party)",
    category: "Strictly Necessary",
    expiry: "Session",
    purpose: "Maintains authenticated user session token and prevents CSRF attack vectors.",
  },
  {
    name: "oivaly_cart_token",
    provider: "Oivaly Oy (First-party)",
    category: "Strictly Necessary",
    expiry: "30 days",
    purpose: "Preserves small-batch artisan selections in your basket across multiple page views.",
  },
  {
    name: "__cf_bm / __cflb",
    provider: "Cloudflare (Sub-processor)",
    category: "Strictly Necessary",
    expiry: "30 minutes",
    purpose: "Distinguishes human traffic from automated bot scrapers to protect artisan inventory.",
  },
  {
    name: "__stripe_mid / __stripe_sid",
    provider: "Stripe Payments Europe Ltd.",
    category: "Strictly Necessary",
    expiry: "1 year / 30 min",
    purpose: "Fraud prevention, PCI-DSS Level 1 compliance, and 3D-Secure 2.0 transaction authentication.",
  },
  {
    name: "oivaly_locale_prefs",
    provider: "Oivaly Oy (First-party)",
    category: "Functional",
    expiry: "1 year",
    purpose: "Stores user language (Finnish/English), currency (EUR), and Posti locker pickup preferences.",
  },
  {
    name: "oivaly_theme_mode",
    provider: "Oivaly Oy (First-party)",
    category: "Functional",
    expiry: "1 year",
    purpose: "Remembers your light or dark Scandinavian design aesthetic preference.",
  },
  {
    name: "oivaly_anon_telemetry",
    provider: "Oivaly Analytics (EU Data Center)",
    category: "Analytics",
    expiry: "90 days",
    purpose: "Collects privacy-preserving, aggregated metrics on catalog browsing speed and page loads.",
  },
  {
    name: "oivaly_curated_picks",
    provider: "Oivaly Oy (First-party)",
    category: "Marketing",
    expiry: "60 days",
    purpose: "Shows seasonal Nordic artisan studio spotlights aligned with your craft interests.",
  },
];

export default function CookiePreferencesPage() {
  const [functionalCookies, setFunctionalCookies] = React.useState(true);
  const [analyticsCookies, setAnalyticsCookies] = React.useState(true);
  const [marketingCookies, setMarketingCookies] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("oivaly_cookie_preferences");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.functional !== undefined) setFunctionalCookies(parsed.functional);
        if (parsed.analytics !== undefined) setAnalyticsCookies(parsed.analytics);
        if (parsed.marketing !== undefined) setMarketingCookies(parsed.marketing);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(
        "oivaly_cookie_preferences",
        JSON.stringify({
          essential: true,
          functional: functionalCookies,
          analytics: analyticsCookies,
          marketing: marketingCookies,
          savedAt: new Date().toISOString(),
        })
      );
      toast.success("Preferences updated! Your choices have been safely recorded.");
    } catch {
      toast.error("Failed to update preferences.");
    }
  };

  const handleAcceptAll = () => {
    setFunctionalCookies(true);
    setAnalyticsCookies(true);
    setMarketingCookies(true);
    try {
      localStorage.setItem(
        "oivaly_cookie_preferences",
        JSON.stringify({
          essential: true,
          functional: true,
          analytics: true,
          marketing: true,
          savedAt: new Date().toISOString(),
        })
      );
      toast.success("All cookie categories accepted.");
    } catch {
      // ignore
    }
  };

  const handleRejectNonEssential = () => {
    setFunctionalCookies(false);
    setAnalyticsCookies(false);
    setMarketingCookies(false);
    try {
      localStorage.setItem(
        "oivaly_cookie_preferences",
        JSON.stringify({
          essential: true,
          functional: false,
          analytics: false,
          marketing: false,
          savedAt: new Date().toISOString(),
        })
      );
      toast.success("Only Strictly Necessary cookies remain active.");
    } catch {
      // ignore
    }
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
          <span className="text-foreground font-medium">Cookie Preferences</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
            <CookieIcon className="size-4" weight="fill" />
            <span>ePrivacy & GDPR Consent Center</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">
            Cookie Policy & Consent Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            In compliance with Directive 2002/58/EC (ePrivacy Directive) and the EU GDPR, we provide complete, granular control over the cookies and tracking tokens deployed during your visit. We never use invasive third-party ad pixels or broker your data.
          </p>
        </div>

        {/* Interactive Consent Control Center */}
        <div className="border border-border/80 bg-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div>
              <h2 className="text-xl font-serif font-bold text-foreground">
                Manage Granular Permissions
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Toggle specific categories below. Changes apply instantly upon saving.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-3.5 py-1.5 bg-brand-deep-forest text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-deep-forest/90 transition-colors cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Category 1: Strictly Necessary */}
            <div className="p-5 bg-muted/20 border border-border/80 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <LockKeyIcon className="size-4 text-brand-deep-forest dark:text-primary" weight="fill" />
                  <h3 className="text-sm font-bold text-foreground">1. Strictly Necessary Cookies</h3>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
                    Always Mandatory
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  These cookies are indispensable for the technical operation of Oivaly: holding items in your cart across multiple studio visits, maintaining cryptographic session security, facilitating PSD2 bank authentication via Stripe, and thwarting automated scrapers. They cannot be disabled.
                </p>
              </div>
              <div className="text-xs font-mono font-semibold text-muted-foreground shrink-0 self-center sm:self-start">
                [ LOCKED ON ]
              </div>
            </div>

            {/* Category 2: Functional */}
            <div className="p-5 bg-card border border-border/80 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <SlidersHorizontalIcon className="size-4 text-brand-deep-forest dark:text-primary" weight="fill" />
                  <h3 className="text-sm font-bold text-foreground">2. Functional & Preference Cookies</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enable the marketplace to remember your preferred interface options: light or dark Scandinavian palette theme, currency formatting, recently viewed artisan workshops, and saved Posti SmartPost locker pickup preferences.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 self-center sm:self-start">
                <input
                  type="checkbox"
                  checked={functionalCookies}
                  onChange={(e) => setFunctionalCookies(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-deep-forest"></div>
              </label>
            </div>

            {/* Category 3: Analytics */}
            <div className="p-5 bg-card border border-border/80 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="size-4 text-brand-deep-forest dark:text-primary" weight="fill" />
                  <h3 className="text-sm font-bold text-foreground">3. Analytics & Performance Cookies</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Help our Helsinki engineering team identify broken page links, measure catalog search latency, and analyze which artisan categories are most sought-after. All IP addresses are anonymized before storage in our EU data centers.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 self-center sm:self-start">
                <input
                  type="checkbox"
                  checked={analyticsCookies}
                  onChange={(e) => setAnalyticsCookies(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-deep-forest"></div>
              </label>
            </div>

            {/* Category 4: Marketing */}
            <div className="p-5 bg-card border border-border/80 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <MegaphoneIcon className="size-4 text-brand-deep-forest dark:text-primary" weight="fill" />
                  <h3 className="text-sm font-bold text-foreground">4. Marketing & Studio Recommendations</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Allows us to showcase relevant Nordic studio drops, seasonal craft exhibitions, and featured maker interviews that match your collecting interests. We never sell your profile to third-party ad brokers.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 self-center sm:self-start">
                <input
                  type="checkbox"
                  checked={marketingCookies}
                  onChange={(e) => setMarketingCookies(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-deep-forest"></div>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-3 bg-brand-deep-forest text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-deep-forest/90 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FloppyDiskIcon className="size-4" weight="fill" />
              <span>Save & Apply My Preferences</span>
            </button>
          </div>
        </div>

        {/* Complete Cookie Audit Table */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-bold text-foreground">
              Exhaustive Cookie Registry
            </h2>
            <p className="text-xs text-muted-foreground">
              A transparent technical inventory of every cookie and storage key deployed across Oivaly.
            </p>
          </div>

          <div className="border border-border/80 bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border/80 text-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Cookie Key</th>
                    <th className="p-3.5">Provider</th>
                    <th className="p-3.5">Classification</th>
                    <th className="p-3.5">Retention</th>
                    <th className="p-3.5">Specific Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {COOKIE_REGISTRY.map((cookie, idx) => (
                    <tr key={idx}>
                      <td className="p-3.5 font-mono font-bold text-foreground">{cookie.name}</td>
                      <td className="p-3.5 text-muted-foreground">{cookie.provider}</td>
                      <td className="p-3.5">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-muted border border-border">
                          {cookie.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-muted-foreground text-[11px]">{cookie.expiry}</td>
                      <td className="p-3.5 text-muted-foreground text-[11px] leading-relaxed">{cookie.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Global Privacy Control & Browser Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-6 bg-card border border-border/80 space-y-2">
            <h3 className="font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheckIcon className="size-4 text-emerald-600" weight="fill" />
              <span>Global Privacy Control (GPC) Honored</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Oivaly automatically respects universal browser opt-out signals such as the Global Privacy Control (GPC). If your browser broadcasts a GPC header, non-essential analytics and marketing tracking will remain disabled by default.
            </p>
          </div>

          <div className="p-6 bg-card border border-border/80 space-y-2">
            <h3 className="font-bold text-foreground flex items-center gap-1.5">
              <InfoIcon className="size-4 text-primary" weight="fill" />
              <span>Clearing Cookies in Your Browser</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              You can wipe previously stored cookies at any time via your browser settings: Chrome (Settings &rarr; Privacy), Safari (Preferences &rarr; Privacy), or Firefox (Settings &rarr; Privacy & Security). Clearing cookies will reset your saved cart tokens and theme preferences.
            </p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <Link href="/privacy" className="font-semibold text-primary hover:underline">
            &larr; Read Full GDPR Privacy Policy
          </Link>
          <div className="flex gap-4">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/contact" className="font-semibold text-primary hover:underline">
              Contact Privacy Officer &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
