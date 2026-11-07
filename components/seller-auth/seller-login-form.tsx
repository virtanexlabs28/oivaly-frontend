"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LockKeyIcon,
  EnvelopeSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  WarningCircleIcon,
  CheckCircleIcon,
  StorefrontIcon,
} from "@phosphor-icons/react";
import {
  sellerLoginSchema,
  type SellerLoginFormValues,
} from "@/resources/schemas/seller-auth.schema";
import { useSellerAuth } from "@/lib/seller-auth-context";
import { env } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SellerLoginForm() {
  const router = useRouter();
  const { login } = useSellerAuth();

  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SellerLoginFormValues>({
    resolver: zodResolver(sellerLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (values: SellerLoginFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await login({
        email: values.email,
        password: values.password,
      });

      setSuccessMessage(`Welcome back, ${response.user.name}! Opening studio portal...`);
      toast.success(`Signed in to ${response.store.name}`);

      setTimeout(() => {
        router.push("/seller/dashboard");
      }, 600);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Invalid email or password. Please verify your studio credentials.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handleDemoFill = () => {
    setValue("email", "matti@nordicbakery.fi", { shouldValidate: true });
    setValue("password", "SecureVendor@2026", { shouldValidate: true });
    toast.info("Demo artisan credentials loaded (Nordic Artisan Bakery)");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3.5 bg-destructive/10 border border-destructive/30 rounded-xs flex items-start gap-2.5 text-xs text-destructive animate-in fade-in duration-200">
          <WarningCircleIcon className="size-4 shrink-0 mt-0.5" weight="fill" />
          <div className="flex-1">
            <p className="font-semibold">Sign In Failed</p>
            <p className="mt-0.5 text-[11px] leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Success Notice */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xs flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-200">
          <CheckCircleIcon className="size-4 shrink-0" weight="fill" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Studio Email Input */}
      <div className="space-y-1.5">
        <label htmlFor="seller-email" className="block text-xs font-semibold text-foreground">
          Studio Administrator Email
        </label>
        <div className="relative">
          <EnvelopeSimpleIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            id="seller-email"
            type="email"
            autoComplete="email"
            placeholder="artisan@atelier.fi"
            {...register("email")}
            className="w-full h-10 pl-9 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        {errors.email && (
          <p className="text-[11px] text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="seller-password" className="block text-xs font-semibold text-foreground">
            Password
          </label>
          <Link
            href="/seller/forgot-password"
            className="text-[11px] text-primary hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <LockKeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            id="seller-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            {...register("password")}
            className="w-full h-10 pl-9 pr-10 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[11px] text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register("rememberMe")}
            className="size-3.5 rounded-none border-border text-primary focus:ring-primary"
          />
          <span className="text-xs text-muted-foreground">
            Keep my studio signed in for {env.sellerSessionDays} days
          </span>
        </label>
      </div>

      {/* Primary Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white text-xs font-semibold uppercase tracking-wider rounded-none shadow-xs mt-2"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Authenticating Studio...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1.5">
            <span>Access Atelier Dashboard</span>
            <ArrowRightIcon className="size-3.5" />
          </span>
        )}
      </Button>

      {/* Quick Demo Autofill Bar */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleDemoFill}
          className="w-full py-2 px-3 border border-dashed border-border/80 hover:border-primary/60 bg-muted/20 hover:bg-muted/40 transition-colors text-[11px] text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
        >
          <StorefrontIcon className="size-3.5 text-primary" />
          <span>Autofill Sample Studio (Nordic Artisan Bakery)</span>
        </button>
      </div>

      {/* Link to Studio Application */}
      <div className="pt-4 text-center border-t border-border/60">
        <p className="text-xs text-muted-foreground">
          New artisan or workshop?{" "}
          <Link
            href="/seller/signup"
            className="text-foreground font-semibold hover:text-primary transition-colors underline underline-offset-4"
          >
            Apply to open your Nordic studio
          </Link>
        </p>
      </div>
    </form>
  );
}
