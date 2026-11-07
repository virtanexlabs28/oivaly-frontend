"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { loginSchema, type LoginFormValues } from "@/resources/schemas/auth.schema";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerAuthLayout } from "@/components/auth/customer-auth-layout";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { toast } from "sonner";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const rawReturnUrl = searchParams.get("returnUrl");
  const safeReturnUrl =
    rawReturnUrl && rawReturnUrl.startsWith("/") && !rawReturnUrl.startsWith("//")
      ? rawReturnUrl
      : "/account";

  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const rememberMeChecked = watch("rememberMe");

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      setSuccessMessage("Signed in successfully! Redirecting to your account...");
      setTimeout(() => {
        router.push(safeReturnUrl);
      }, 500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email address or password. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleDemoFill = () => {
    setValue("email", "demo.customer@oivaly.fi", { shouldValidate: true });
    setValue("password", "Customer@2026", { shouldValidate: true });
    toast.info("Demo customer credentials loaded (Sofia Lindholm)");
  };

  return (
    <CustomerAuthLayout
      title="Sign in to your account"
      subtitle="Access your saved favorites, track multi-vendor orders, and manage delivery addresses."
      activeTab="login"
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
              <p className="font-semibold">Sign In Failed</p>
              <p className="mt-0.5 text-[11px] leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div
            role="status"
            className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xs flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-200"
          >
            <CheckCircleIcon className="size-4 shrink-0" weight="fill" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Row 1: Email Address */}
        <div className="space-y-1.5">
          <label htmlFor="customer-email" className="block text-xs font-semibold text-foreground">
            Email Address
          </label>
          <div className="relative">
            <EnvelopeSimpleIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="customer-email"
              type="email"
              autoComplete="email"
              placeholder="customer@example.fi"
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

        {/* Row 2: Password with Eye Toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="customer-password" className="block text-xs font-semibold text-foreground">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-primary hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <LockKeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="customer-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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

        {/* Row 3: Remember me */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMeChecked}
              onCheckedChange={(checked) => setValue("rememberMe", Boolean(checked))}
              className="size-4 rounded-none border-border data-[state=checked]:bg-brand-deep-forest data-[state=checked]:border-brand-deep-forest text-white"
            />
            <label
              htmlFor="rememberMe"
              className="text-xs text-muted-foreground select-none cursor-pointer"
            >
              Remember me on this device
            </label>
          </div>
        </div>

        {/* Row 4: Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 text-xs font-semibold bg-brand-deep-forest text-white hover:bg-brand-deep-forest/90 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In to Oivaly</span>
              <ArrowRightIcon className="size-3.5" />
            </>
          )}
        </Button>

        {/* Row 5: Quick Demo Helper */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleDemoFill}
            className="w-full py-2 px-3 text-[11px] text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Fill Demo Customer Credentials</span>
          </button>
        </div>

        {/* Row 6: Divider & Social Auth */}
        <SocialAuthButtons actionText="sign in" />

        {/* Row 7: Switcher for Artisans/Sellers */}
        <div className="p-3 bg-muted/40 border border-border/60 rounded-xs flex items-center justify-between text-xs mt-4">
          <div className="flex items-center gap-2">
            <StorefrontIcon className="size-4 text-brand-deep-forest" />
            <span className="text-muted-foreground">Are you an artisan seller on Oivaly?</span>
          </div>
          <Link
            href="/seller/login"
            className="font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Seller Portal</span>
            <ArrowRightIcon className="size-3" />
          </Link>
        </div>
      </form>
    </CustomerAuthLayout>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-xs">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </React.Suspense>
  );
}
