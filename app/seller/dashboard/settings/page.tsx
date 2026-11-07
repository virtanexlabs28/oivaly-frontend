"use client";

import * as React from "react";
import {
  GearSixIcon,
  StorefrontIcon,
  MapPinIcon,
  BankIcon,
  FloppyDiskIcon,
  InfoIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  ShieldCheckIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react";
import type { BusinessVerificationResult } from "@/resources/apis/seller-auth.api";
import { useSellerAuth } from "@/lib/seller-auth-context";
import { sellerDashboardApi } from "@/resources/apis/seller-dashboard.api";
import type { StoreProfileData } from "@/resources/interfaces/seller-dashboard.interface";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SellerSettingsPage() {
  const { store } = useSellerAuth();

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  // Form states
  const [storeName, setStoreName] = React.useState("");
  const [legalName, setLegalName] = React.useState("");
  const [businessId, setBusinessId] = React.useState("");
  const [vatId, setVatId] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [businessAddress, setBusinessAddress] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactPhone, setContactPhone] = React.useState("");
  const [bankIban, setBankIban] = React.useState("");
  const [bankBic, setBankBic] = React.useState("");
  const [isVerifyingYtunnus, setIsVerifyingYtunnus] = React.useState(false);
  const [ytunnusResult, setYtunnusResult] = React.useState<BusinessVerificationResult | null>(null);

  React.useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const profile = await sellerDashboardApi.getProfile(store?.id);
        if (profile) {
          setStoreName(profile.name || store?.name || "");
          setLegalName(profile.legalBusinessName || "");
          setBusinessId(profile.businessId || "");
          setVatId(profile.vatId || "");
          setDescription(profile.description || "");
          setBusinessAddress(profile.businessAddress || "");
          setContactEmail(profile.contactEmail || "");
          setContactPhone(profile.contactPhone || "");
          setBankIban(profile.bankIban || "");
          setBankBic(profile.bankBic || "");
        }
      } catch {
        // Fallback with store data
        setStoreName(store?.name || "Nordic Artisan Studio");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [store]);

  const handleVerifyBusinessId = async (idToVerify?: string) => {
    const rawVal = (idToVerify || businessId).trim();
    if (!rawVal || rawVal.length < 6) {
      toast.error("Please enter a valid Finnish Business ID (Y-tunnus, e.g. 0112038-9)");
      return;
    }

    setIsVerifyingYtunnus(true);
    setYtunnusResult(null);

    try {
      const res = await sellerDashboardApi.verifyBusinessId(rawVal);
      setYtunnusResult(res);

      if (res.valid) {
        toast.success(`Verified: ${res.companyName}`);
        setBusinessId(res.businessId);

        if (!legalName || legalName.trim() === "") {
          setLegalName(res.companyName || "");
        }

        if (!vatId || vatId.trim() === "") {
          const digits = res.businessId.replace(/\D/g, "");
          setVatId(`FI${digits}`);
        }

        if ((!businessAddress || businessAddress.trim() === "") && res.fullAddress) {
          setBusinessAddress(res.fullAddress);
        }
      } else {
        toast.error(res.message || "Business ID not found in Finnish Trade Register (PRH / YTJ)");
      }
    } catch {
      toast.error("Failed to verify Business ID with PRH YTJ API");
    } finally {
      setIsVerifyingYtunnus(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await sellerDashboardApi.updateProfile(
        {
          name: storeName.trim(),
          legalBusinessName: legalName.trim(),
          businessId: businessId.trim(),
          vatId: vatId.trim(),
          description: description.trim(),
          businessAddress: businessAddress.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim(),
          bankIban: bankIban.trim(),
          bankBic: bankBic.trim(),
        },
        store?.id
      );

      toast.success("Studio profile and payout preferences saved!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save profile settings";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground tracking-tight">
            Studio Profile & Payout Settings
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Configure your artisan workshop bio, legal Finnish business registration, and bank IBAN for payouts.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Workshop Branding */}
        <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <StorefrontIcon className="size-4 text-primary" weight="bold" />
            <span>Studio Identity & Craftsmanship</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="store-name" className="block text-xs font-semibold text-foreground">
                Public Studio Name <span className="text-destructive">*</span>
              </label>
              <input
                id="store-name"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="legal-name" className="block text-xs font-semibold text-foreground">
                Legal Company Name (Toiminimi / Oy)
              </label>
              <input
                id="legal-name"
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="e.g. Lapland Woodcrafts Tmi"
                className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="desc" className="block text-xs font-semibold text-foreground">
              Artisan Bio & Craft Story
            </label>
            <textarea
              id="desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Introduce your craft workshop, materials, Finnish traditions, and handmade philosophy to marketplace visitors..."
              className="w-full p-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Finnish Business & Workshop Address */}
        <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPinIcon className="size-4 text-emerald-600" weight="bold" />
            <span>Finnish Business Registration & Workshop Location</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="biz-id" className="block text-xs font-semibold text-foreground">
                  Finnish Business ID (Y-tunnus)
                </label>
                <button
                  type="button"
                  disabled={isVerifyingYtunnus}
                  onClick={() => handleVerifyBusinessId()}
                  className="text-[11px] font-semibold text-brand-deep-forest dark:text-emerald-400 hover:underline inline-flex items-center gap-1 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isVerifyingYtunnus ? (
                    <>
                      <CircleNotchIcon className="size-3 animate-spin" />
                      <span>Checking PRH...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="size-3.5" weight="bold" />
                      <span>Verify with PRH</span>
                    </>
                  )}
                </button>
              </div>
              <input
                id="biz-id"
                type="text"
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value.trim().length >= 7 && !ytunnusResult?.valid) {
                    handleVerifyBusinessId(e.target.value);
                  }
                }}
                placeholder="1234567-8"
                className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />

              {/* PRH / YTJ Verification Badge */}
              {ytunnusResult?.valid && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-none flex items-start justify-between gap-2 text-emerald-800 dark:text-emerald-300 text-[11px] animate-in fade-in duration-200">
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="size-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" weight="fill" />
                    <div className="space-y-0.5">
                      <div className="font-semibold flex items-center gap-1.5">
                        <span>Verified with PRH Finnish Trade Register</span>
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-bold">
                          {ytunnusResult.tradeRegisterStatus || 'Registered'}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        Registered Entity: <strong className="text-foreground font-medium">{ytunnusResult.companyName}</strong>
                        {ytunnusResult.city ? ` • ${ytunnusResult.city}` : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (ytunnusResult.companyName) setLegalName(ytunnusResult.companyName);
                      if (ytunnusResult.fullAddress) setBusinessAddress(ytunnusResult.fullAddress);
                      toast.info("Official PRH company details applied to form");
                    }}
                    className="shrink-0 text-[10px] px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Apply Details
                  </button>
                </div>
              )}

              {ytunnusResult && !ytunnusResult.valid && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-none flex items-start gap-2 text-rose-800 dark:text-rose-300 text-[11px] animate-in fade-in duration-200">
                  <WarningCircleIcon className="size-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" weight="fill" />
                  <div>
                    <span className="font-semibold">Registry Notice: </span>
                    <span>{ytunnusResult.message || 'Y-tunnus not found in Finnish YTJ database.'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="vat-id" className="block text-xs font-semibold text-foreground">
                Finnish VAT Number (ALV-numero)
              </label>
              <input
                id="vat-id"
                type="text"
                value={vatId}
                onChange={(e) => setVatId(e.target.value)}
                placeholder="FI12345678"
                className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="address" className="block text-xs font-semibold text-foreground">
              Workshop / Atelier Address
            </label>
            <input
              id="address"
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="e.g. Pohjolankatu 12, 96100 Rovaniemi, Finland"
              className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="block text-xs font-semibold text-foreground">
                Studio Contact Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="artisan@woodcraft.fi"
                className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-phone" className="block text-xs font-semibold text-foreground">
                Contact Phone
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+358 40 123 4567"
                className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Payout Banking Preferences */}
        <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BankIcon className="size-4 text-primary" weight="bold" />
            <span>Finnish Banking Payout Preferences</span>
          </h2>

          <div className="p-3 bg-muted/30 border border-border/60 text-xs text-muted-foreground flex items-start gap-2.5">
            <InfoIcon className="size-4 text-primary shrink-0 mt-0.5" />
            <p>
              Your verified earnings (90% net sales) are transferred directly to your Finnish bank account via SEPA transfer according to your payout cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="iban" className="block text-xs font-semibold text-foreground">
                Finnish IBAN Account
              </label>
              <input
                id="iban"
                type="text"
                value={bankIban}
                onChange={(e) => setBankIban(e.target.value)}
                placeholder="FI21 1234 5678 9012 34"
                className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-mono uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bic" className="block text-xs font-semibold text-foreground">
                Bank SWIFT / BIC Code
              </label>
              <input
                id="bic"
                type="text"
                value={bankBic}
                onChange={(e) => setBankBic(e.target.value)}
                placeholder="OPFIHH2X or NORDFIHH"
                className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-10 px-6 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white rounded-none uppercase text-xs font-semibold tracking-wider shadow-xs"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Studio Preferences...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <FloppyDiskIcon className="size-3.5" weight="bold" />
                <span>Save All Settings</span>
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
