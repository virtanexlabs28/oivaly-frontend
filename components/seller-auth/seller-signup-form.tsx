"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StorefrontIcon,
  BuildingsIcon,
  IdentificationCardIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  LockKeyIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  SparkleIcon,
  ClockIcon,
  ShieldCheckIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react";
import { sellerAuthApi, type BusinessVerificationResult } from "@/resources/apis/seller-auth.api";
import {
  sellerSignupSchema,
  type SellerSignupFormValues,
} from "@/resources/schemas/seller-auth.schema";
import { useSellerAuth } from "@/lib/seller-auth-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SellerSignupForm() {
  const { signup } = useSellerAuth();

  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isVerifyingYtunnus, setIsVerifyingYtunnus] = React.useState(false);
  const [ytunnusResult, setYtunnusResult] = React.useState<BusinessVerificationResult | null>(null);
  const [submittedStore, setSubmittedStore] = React.useState<{
    name: string;
    email: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SellerSignupFormValues>({
    resolver: zodResolver(sellerSignupSchema),
    defaultValues: {
      storeName: "",
      legalBusinessName: "",
      businessId: "",
      vatId: "",
      businessAddress: "",
      contactName: "",
      email: "",
      phone: "+358 ",
      password: "",
      confirmPassword: "",
      sellerAgreementAccepted: true,
    },
    mode: "onBlur",
  });

  // Verify Finnish Business ID (Y-tunnus) with official PRH / YTJ Open Data API
  const handleVerifyBusinessId = async (idToVerify?: string) => {
    const rawVal = idToVerify || watch("businessId");
    if (!rawVal || rawVal.trim().length < 6) {
      toast.error("Please enter a valid Finnish Business ID (Y-tunnus, e.g. 0112038-9)");
      return;
    }

    setIsVerifyingYtunnus(true);
    setYtunnusResult(null);

    try {
      const res = await sellerAuthApi.verifyBusinessId(rawVal);
      setYtunnusResult(res);

      if (res.valid) {
        toast.success(`PRH Verified: ${res.companyName}`);
        setValue("businessId", res.businessId, { shouldValidate: true });

        const currentLegal = watch("legalBusinessName");
        if ((!currentLegal || currentLegal.trim() === "") && res.companyName) {
          setValue("legalBusinessName", res.companyName, { shouldValidate: true });
        }

        const currentVat = watch("vatId");
        if ((!currentVat || currentVat.trim() === "") && res.businessId) {
          const digitsOnly = res.businessId.replace(/\D/g, "");
          setValue("vatId", `FI${digitsOnly}`, { shouldValidate: true });
        }

        const currentAddr = watch("businessAddress");
        if ((!currentAddr || currentAddr.trim() === "") && res.fullAddress) {
          setValue("businessAddress", res.fullAddress, { shouldValidate: false });
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

  // Step validation before advancing
  const handleNextStep = async () => {
    setErrorMessage(null);
    let valid = false;

    if (currentStep === 1) {
      valid = await trigger(["storeName", "legalBusinessName", "businessId", "vatId"]);
    } else if (currentStep === 2) {
      valid = await trigger(["contactName", "email", "phone", "businessAddress"]);
    }

    if (valid) {
      setCurrentStep((prev) => Math.min(3, prev + 1) as 1 | 2 | 3);
    } else {
      toast.error("Please fill in all required fields before proceeding.");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3);
  };

  const onSubmit = async (values: SellerSignupFormValues) => {
    setErrorMessage(null);

    try {
      const response = await signup({
        storeName: values.storeName,
        legalBusinessName: values.legalBusinessName,
        businessAddress: values.businessAddress,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        businessId: values.businessId,
        vatId: values.vatId || undefined,
        sellerAgreementAccepted: Boolean(values.sellerAgreementAccepted),
      });

      setSubmittedStore({
        name: response.store.name,
        email: response.user.email,
      });

      toast.success("Studio application submitted successfully!");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Application failed. Please verify your details or Business ID.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  // Demo fill helper
  const handleFillSampleStudio = () => {
    const randomId = Math.floor(1000000 + Math.random() * 9000000);
    setValue("storeName", "Nordic Artisan Atelier", { shouldValidate: true });
    setValue("legalBusinessName", "Marimekko Oyj", { shouldValidate: true });
    setValue("businessId", "0111316-2", { shouldValidate: true });
    setValue("vatId", "FI01113162", { shouldValidate: true });
    setValue("contactName", "Tapio Korhonen", { shouldValidate: true });
    setValue("email", `tapio.${Date.now()}@woodcraft.fi`, { shouldValidate: true });
    setValue("phone", "+358 40 987 6543", { shouldValidate: true });
    setValue("businessAddress", "Valtakatu 12, 96100 Rovaniemi, Finland", { shouldValidate: true });
    setValue("password", "CraftMaker@2026", { shouldValidate: true });
    setValue("confirmPassword", "CraftMaker@2026", { shouldValidate: true });
    setValue("sellerAgreementAccepted", true, { shouldValidate: true });
    toast.info("Sample Finnish artisan studio data loaded");
  };

  // Submitted Success Screen
  if (submittedStore) {
    return (
      <div className="py-8 space-y-6 text-center max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center ring-8 ring-emerald-500/5">
          <CheckCircleIcon className="size-8" weight="fill" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <ClockIcon className="size-3.5" />
            <span>Status: Under Review (Odottaa Hyväksyntää)</span>
          </div>

          <h3 className="font-heading text-2xl font-bold text-foreground">
            Application Received!
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Thank you for applying to open <strong className="text-foreground">{submittedStore.name}</strong> on Oivaly.
            Our curation team reviews every artisan studio to maintain exceptional Nordic craft standards.
          </p>
        </div>

        <div className="p-4 bg-muted/40 border border-border/70 rounded-xs text-left text-xs space-y-2">
          <p className="font-semibold text-foreground">What happens next?</p>
          <ul className="list-disc pl-4 text-muted-foreground space-y-1 text-[11px]">
            <li>We have dispatched a verification email to <strong>{submittedStore.email}</strong>.</li>
            <li>Our artisan curator will verify your Business ID (Y-tunnus) within 1 business day.</li>
            <li>Once approved, you will receive full access to publish listings and connect Posti shipping.</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="w-full sm:w-auto bg-brand-deep-forest text-white text-xs uppercase tracking-wider font-semibold h-10 px-6">
            <Link href="/seller/login">
              <span>Go to Studio Sign In</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto text-xs uppercase tracking-wider font-semibold h-10 px-6">
            <Link href="/">
              <span>Explore Marketplace</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator Bar */}
      <div className="grid grid-cols-3 gap-2 pb-2">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            currentStep >= 1 ? "bg-brand-deep-forest" : "bg-muted"
          }`}
        />
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            currentStep >= 2 ? "bg-brand-deep-forest" : "bg-muted"
          }`}
        />
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${
            currentStep >= 3 ? "bg-brand-deep-forest" : "bg-muted"
          }`}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">
          Step {currentStep} of 3:{" "}
          {currentStep === 1 && "Studio & Brand Identity"}
          {currentStep === 2 && "Workshop & Contact"}
          {currentStep === 3 && "Security & Terms"}
        </span>
        <button
          type="button"
          onClick={handleFillSampleStudio}
          className="text-primary hover:underline font-medium text-[11px] flex items-center gap-1"
        >
          <SparkleIcon className="size-3" />
          <span>Demo Sample Studio</span>
        </button>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xs flex items-start gap-2 text-xs text-destructive">
          <WarningCircleIcon className="size-4 shrink-0 mt-0.5" weight="fill" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* ─── STEP 1: Studio & Brand Identity ─── */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label htmlFor="storeName" className="block text-xs font-semibold text-foreground">
                Public Studio / Shop Name *
              </label>
              <div className="relative">
                <StorefrontIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="storeName"
                  type="text"
                  placeholder="e.g. Fiskars Ceramic Studio"
                  {...register("storeName")}
                  className="w-full h-10 pl-9 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {errors.storeName && (
                <p className="text-[11px] text-destructive">{errors.storeName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="legalBusinessName" className="block text-xs font-semibold text-foreground">
                Official Legal Business Name (Virallinen Yritysnimi) *
              </label>
              <div className="relative">
                <BuildingsIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="legalBusinessName"
                  type="text"
                  placeholder="e.g. Fiskars Keramiikka Oy / T:mi Matti Meikäläinen"
                  {...register("legalBusinessName")}
                  className="w-full h-10 pl-9 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {errors.legalBusinessName && (
                <p className="text-[11px] text-destructive">{errors.legalBusinessName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="businessId" className="block text-xs font-semibold text-foreground">
                    Business ID / Y-tunnus *
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
                <div className="relative">
                  <IdentificationCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    id="businessId"
                    type="text"
                    placeholder="1234567-8"
                    {...register("businessId")}
                    onBlur={(e) => {
                      if (e.target.value.trim().length >= 7 && !ytunnusResult?.valid) {
                        handleVerifyBusinessId(e.target.value);
                      }
                    }}
                    className="w-full h-10 pl-9 pr-3 text-xs font-mono bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                {errors.businessId && (
                  <p className="text-[11px] text-destructive">{errors.businessId.message}</p>
                )}

                {/* PRH / YTJ Verification Badge */}
                {ytunnusResult?.valid && (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-none flex items-start gap-2 text-emerald-800 dark:text-emerald-300 text-[11px] animate-in fade-in duration-200">
                    <CheckCircleIcon className="size-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" weight="fill" />
                    <div className="space-y-0.5">
                      <div className="font-semibold flex items-center gap-1.5">
                        <span>Verified with PRH Finnish Trade Register</span>
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-bold">
                          {ytunnusResult.tradeRegisterStatus || 'Registered'}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        Official Entity: <strong className="text-foreground font-medium">{ytunnusResult.companyName}</strong>
                        {ytunnusResult.city ? ` • ${ytunnusResult.city}` : ''}
                      </p>
                    </div>
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
                <label htmlFor="vatId" className="block text-xs font-semibold text-foreground">
                  VAT Identifier (ALV-numero)
                </label>
                <input
                  id="vatId"
                  type="text"
                  placeholder="FI12345678 (Optional)"
                  {...register("vatId")}
                  className="w-full h-10 px-3 text-xs font-mono bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.vatId && (
                  <p className="text-[11px] text-destructive">{errors.vatId.message}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={handleNextStep}
                className="w-full h-11 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white text-xs font-semibold uppercase tracking-wider rounded-none"
              >
                <span>Continue to Workshop Details</span>
                <ArrowRightIcon className="size-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Workshop & Contact ─── */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label htmlFor="contactName" className="block text-xs font-semibold text-foreground">
                Primary Artisan / Workshop Manager Full Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="contactName"
                  type="text"
                  placeholder="e.g. Matti Meikäläinen"
                  {...register("contactName")}
                  className="w-full h-10 pl-9 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {errors.contactName && (
                <p className="text-[11px] text-destructive">{errors.contactName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold text-foreground">
                  Studio Admin Email *
                </label>
                <div className="relative">
                  <EnvelopeSimpleIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="matti@atelieri.fi"
                    {...register("email")}
                    className="w-full h-10 pl-9 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-xs font-semibold text-foreground">
                  Phone (for Posti notifications) *
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+358 40 123 4567"
                    {...register("phone")}
                    className="w-full h-10 pl-9 pr-3 text-xs font-mono bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="businessAddress" className="block text-xs font-semibold text-foreground">
                Studio / Workshop Street Address (Finland) *
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="businessAddress"
                  type="text"
                  placeholder="e.g. Aleksanterinkatu 15, 00100 Helsinki, Finland"
                  {...register("businessAddress")}
                  className="w-full h-10 pl-9 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {errors.businessAddress && (
                <p className="text-[11px] text-destructive">{errors.businessAddress.message}</p>
              )}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                className="w-1/3 h-11 text-xs font-semibold uppercase tracking-wider rounded-none"
              >
                <ArrowLeftIcon className="size-4 mr-1.5" />
                <span>Back</span>
              </Button>
              <Button
                type="button"
                onClick={handleNextStep}
                className="w-2/3 h-11 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white text-xs font-semibold uppercase tracking-wider rounded-none"
              >
                <span>Continue to Security</span>
                <ArrowRightIcon className="size-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Security & Terms ─── */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-foreground">
                Account Password (min 6 characters, 1 uppercase, 1 number) *
              </label>
              <div className="relative">
                <LockKeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  {...register("password")}
                  className="w-full h-10 pl-9 pr-10 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-foreground">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                {...register("confirmPassword")}
                className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Seller Agreement */}
            <div className="p-3 bg-muted/30 border border-border/80 rounded-xs space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="sellerAgreementAccepted"
                  {...register("sellerAgreementAccepted")}
                  className="mt-0.5 size-4 rounded-none border-border text-primary focus:ring-primary"
                />
                <span className="text-xs text-foreground leading-snug">
                  I accept the <strong>Oivaly Seller Agreement</strong> and confirm our products comply with Finnish craft &amp; consumer safety regulations.
                </span>
              </label>
              {errors.sellerAgreementAccepted && (
                <p className="text-[11px] text-destructive pl-6">{errors.sellerAgreementAccepted.message}</p>
              )}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                className="w-1/3 h-11 text-xs font-semibold uppercase tracking-wider rounded-none"
              >
                <ArrowLeftIcon className="size-4 mr-1.5" />
                <span>Back</span>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 h-11 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white text-xs font-semibold uppercase tracking-wider rounded-none shadow-xs"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Application...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <span>Submit Studio Application</span>
                    <ArrowRightIcon className="size-3.5" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* Switch to login link */}
      <div className="pt-4 text-center border-t border-border/60">
        <p className="text-xs text-muted-foreground">
          Already registered as a seller?{" "}
          <Link
            href="/seller/login"
            className="text-foreground font-semibold hover:text-primary transition-colors underline underline-offset-4"
          >
            Sign in to your studio dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
