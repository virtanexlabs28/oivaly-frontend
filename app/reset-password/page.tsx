"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LockKeyIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/resources/schemas/auth.schema";
import { authApi } from "@/resources/apis/auth.api";
import { Button } from "@/components/ui/button";
import { CustomerAuthLayout } from "@/components/auth/customer-auth-layout";
import { toast } from "sonner";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenParam,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setErrorMessage(null);
    try {
      await authApi.resetPassword({
        token: values.token.trim(),
        newPassword: values.newPassword,
      });
      setResetSuccess(true);
      toast.success("Password updated successfully!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Password reset token is invalid or has expired.";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  if (resetSuccess) {
    return (
      <CustomerAuthLayout
        title="Password updated!"
        subtitle="Your new credentials are now active."
        activeTab="reset"
      >
        <div className="space-y-6 text-center py-6">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 mx-auto border border-emerald-500/30">
            <CheckCircleIcon className="size-8" weight="fill" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-heading font-bold text-foreground">Password Reset Complete</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Your password has been changed successfully. You can now log into your customer account using your new credentials.
            </p>
          </div>
          <Button asChild className="w-full h-10 text-xs font-semibold bg-brand-deep-forest text-white hover:bg-brand-deep-forest/90 rounded-none transition-all">
            <Link href="/login">
              Sign In to Your Account
            </Link>
          </Button>
        </div>
      </CustomerAuthLayout>
    );
  }

  return (
    <CustomerAuthLayout
      title="Create new password"
      subtitle="Choose a secure password of at least 8 characters."
      activeTab="reset"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 bg-destructive/10 border border-destructive/30 rounded-xs flex items-start gap-2.5 text-xs text-destructive animate-in fade-in duration-200"
          >
            <WarningCircleIcon className="size-4 shrink-0 mt-0.5" weight="fill" />
            <div className="flex-1">
              <p className="font-semibold">Reset Failed</p>
              <p className="mt-0.5 text-[11px] leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Token Field */}
        <div className="space-y-1.5">
          <label htmlFor="reset-token" className="block text-xs font-semibold text-foreground">
            Verification Token
          </label>
          <div className="relative">
            <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="reset-token"
              type="text"
              placeholder="Paste the reset token from your email"
              autoComplete="off"
              disabled={isSubmitting}
              className="w-full h-10 pl-9 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-mono"
              aria-invalid={Boolean(errors.token)}
              {...register("token")}
            />
          </div>
          {errors.token && (
            <p className="text-[11px] text-destructive pl-1">{errors.token.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label htmlFor="new-password" className="block text-xs font-semibold text-foreground">
            New Password <span className="text-muted-foreground font-normal">(Min. 8 characters)</span>
          </label>
          <div className="relative">
            <LockKeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isSubmitting}
              className="w-full h-10 pl-9 pr-10 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              aria-invalid={Boolean(errors.newPassword)}
              {...register("newPassword")}
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
          {errors.newPassword && (
            <p className="text-[11px] text-destructive pl-1">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="block text-xs font-semibold text-foreground">
            Confirm New Password
          </label>
          <div className="relative">
            <LockKeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isSubmitting}
              className="w-full h-10 pl-9 pr-10 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-destructive pl-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 text-xs font-semibold bg-brand-deep-forest text-white hover:bg-brand-deep-forest/90 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Updating password...</span>
            </>
          ) : (
            <>
              <span>Save New Password</span>
              <ArrowRightIcon className="size-3.5" />
            </>
          )}
        </Button>
      </form>
    </CustomerAuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-xs">
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </React.Suspense>
  );
}
