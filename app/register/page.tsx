"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  LockKeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  ArrowRightIcon,
  StorefrontIcon,
} from "@phosphor-icons/react";
import { registerSchema, type RegisterFormValues } from "@/resources/schemas/auth.schema";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerAuthLayout } from "@/components/auth/customer-auth-layout";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { toast } from "sonner";

function RegisterContent() {
  const searchParams = useSearchParams();
  const { register: registerCustomer } = useAuth();

  const rawReturnUrl = searchParams.get("returnUrl");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [registeredSuccess, setRegisteredSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      terms: false,
    },
  });

  const termsChecked = watch("terms");

  const onSubmit = async (values: RegisterFormValues) => {
    setErrorMessage(null);
    try {
      const fullName = `${values.firstName} ${values.lastName}`.trim();
      await registerCustomer({
        name: fullName,
        email: values.email.trim().toLowerCase(),
        password: values.password,
        phone: values.phone?.trim() || undefined,
      });
      setRegisteredSuccess(true);
      toast.success("Account created successfully!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed. An account with this email may already exist.";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleDemoFill = () => {
    setValue("firstName", "Sofia", { shouldValidate: true });
    setValue("lastName", "Lindholm", { shouldValidate: true });
    setValue("email", "sofia.lindholm@oivaly.fi", { shouldValidate: true });
    setValue("phone", "+358 40 123 4567", { shouldValidate: true });
    setValue("password", "Customer@2026", { shouldValidate: true });
    setValue("terms", true, { shouldValidate: true });
    toast.info("Demo customer registration data loaded");
  };

  const loginLink = `/login${rawReturnUrl ? `?returnUrl=${encodeURIComponent(rawReturnUrl)}` : ""}`;

  if (registeredSuccess) {
    return (
      <CustomerAuthLayout
        title="Registration Complete!"
        subtitle="Your Oivaly customer account is ready."
        activeTab="register"
      >
        <div className="space-y-6 text-center py-6">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 mx-auto border border-emerald-500/30">
            <CheckCircleIcon className="size-8" weight="fill" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-heading font-bold text-foreground">Check your inbox</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              We&apos;ve sent a verification link to your email address. You can verify now or proceed directly to sign in.
            </p>
          </div>
          <Button asChild className="w-full h-10 text-xs font-semibold bg-brand-deep-forest text-white hover:bg-brand-deep-forest/90 rounded-none transition-all">
            <Link href={loginLink}>
              Proceed to Sign In
            </Link>
          </Button>
        </div>
      </CustomerAuthLayout>
    );
  }

  return (
    <CustomerAuthLayout
      title="Create your customer account"
      subtitle="Join Oivaly to discover slow craft, save curated collections, and support independent artisans."
      activeTab="register"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Error Notification */}
        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 bg-destructive/10 border border-destructive/30 rounded-xs flex items-start gap-2.5 text-xs text-destructive animate-in fade-in duration-200"
          >
            <WarningCircleIcon className="size-4 shrink-0 mt-0.5" weight="fill" />
            <div className="flex-1">
              <p className="font-semibold">Registration Failed</p>
              <p className="mt-0.5 text-[11px] leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Row 1: First Name & Last Name (2 columns) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="customer-first-name" className="block text-xs font-semibold text-foreground">
              First Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                id="customer-first-name"
                type="text"
                placeholder="Sofia"
                autoComplete="given-name"
                disabled={isSubmitting}
                className="w-full h-10 pl-9 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                aria-invalid={Boolean(errors.firstName)}
                {...register("firstName")}
              />
            </div>
            {errors.firstName && (
              <p className="text-[11px] text-destructive pl-1">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="customer-last-name" className="block text-xs font-semibold text-foreground">
              Last Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                id="customer-last-name"
                type="text"
                placeholder="Lindholm"
                autoComplete="family-name"
                disabled={isSubmitting}
                className="w-full h-10 pl-9 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                aria-invalid={Boolean(errors.lastName)}
                {...register("lastName")}
              />
            </div>
            {errors.lastName && (
              <p className="text-[11px] text-destructive pl-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Row 2: Email Address */}
        <div className="space-y-1.5">
          <label htmlFor="customer-register-email" className="block text-xs font-semibold text-foreground">
            Email Address
          </label>
          <div className="relative">
            <EnvelopeSimpleIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="customer-register-email"
              type="email"
              autoComplete="email"
              placeholder="sofia@example.fi"
              disabled={isSubmitting}
              className="w-full h-10 pl-9 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-destructive pl-1">{errors.email.message}</p>
          )}
        </div>

        {/* Row 3: Phone (Optional for Posti SMS) */}
        <div className="space-y-1.5">
          <label htmlFor="customer-phone" className="block text-xs font-semibold text-foreground">
            Phone Number <span className="text-muted-foreground font-normal">(Optional, for Posti locker SMS)</span>
          </label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="customer-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+358 40 123 4567"
              disabled={isSubmitting}
              className="w-full h-10 pl-9 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              aria-invalid={Boolean(errors.phone)}
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="text-[11px] text-destructive pl-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Row 4: Password with Eye Toggle */}
        <div className="space-y-1.5">
          <label htmlFor="customer-register-password" className="block text-xs font-semibold text-foreground">
            Create Password <span className="text-muted-foreground font-normal">(Min. 8 characters)</span>
          </label>
          <div className="relative">
            <LockKeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="customer-register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={isSubmitting}
              className="w-full h-10 pl-9 pr-10 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeSlashIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-destructive pl-1">{errors.password.message}</p>
          )}
        </div>

        {/* Row 5: Terms Agreement Checkbox */}
        <div className="space-y-1 pt-1">
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="terms"
              checked={termsChecked}
              onCheckedChange={(checked) => setValue("terms", Boolean(checked))}
              className="size-4 rounded-none border-border data-[state=checked]:bg-brand-deep-forest data-[state=checked]:border-brand-deep-forest text-white mt-0.5"
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-snug cursor-pointer select-none">
              I agree to the{" "}
              <Link href="/terms" target="_blank" className="text-foreground underline underline-offset-2 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and acknowledge the{" "}
              <Link href="/privacy" target="_blank" className="text-foreground underline underline-offset-2 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </label>
          </div>
          {errors.terms && (
            <p className="text-[11px] text-destructive pl-6">{errors.terms.message}</p>
          )}
        </div>

        {/* Row 6: Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 text-xs font-semibold bg-brand-deep-forest text-white hover:bg-brand-deep-forest/90 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>Create Customer Account</span>
              <ArrowRightIcon className="size-3.5" />
            </>
          )}
        </Button>

        {/* Row 7: Quick Demo Helper */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full py-2 px-3 text-[11px] text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Fill Demo Customer Data</span>
          </button>
        </div>

        {/* Row 8: Social Auth */}
        <SocialAuthButtons actionText="register" />

        {/* Row 9: Switcher for Artisans/Sellers */}
        <div className="p-3 bg-muted/40 border border-border/60 rounded-xs flex items-center justify-between text-xs mt-4">
          <div className="flex items-center gap-2">
            <StorefrontIcon className="size-4 text-brand-deep-forest" />
            <span className="text-muted-foreground">Want to sell your handcrafted goods?</span>
          </div>
          <Link
            href="/seller/signup"
            className="font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Open Studio</span>
            <ArrowRightIcon className="size-3" />
          </Link>
        </div>
      </form>
    </CustomerAuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-xs">
          Loading...
        </div>
      }
    >
      <RegisterContent />
    </React.Suspense>
  );
}
