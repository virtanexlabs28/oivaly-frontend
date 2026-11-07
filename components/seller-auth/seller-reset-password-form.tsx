"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LockKeyIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import {
  sellerResetPasswordSchema,
  type SellerResetPasswordFormValues,
} from "@/resources/schemas/seller-auth.schema";
import { sellerAuthApi } from "@/resources/apis/seller-auth.api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function SellerResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SellerResetPasswordFormValues>({
    resolver: zodResolver(sellerResetPasswordSchema),
    defaultValues: {
      token: tokenParam,
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Keep token synced if updated in URL
  React.useEffect(() => {
    if (tokenParam) {
      setValue("token", tokenParam);
    }
  }, [tokenParam, setValue]);

  const passwordValue = watch("newPassword") || "";
  const hasMinLength = passwordValue.length >= 6;
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasLower = /[a-z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);

  const onSubmit = async (values: SellerResetPasswordFormValues) => {
    setErrorMessage(null);
    try {
      await sellerAuthApi.resetPassword(values.token, values.newPassword);
      setIsSuccess(true);
      toast.success("Studio password updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Password reset failed.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-6 space-y-5 text-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="size-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center ring-8 ring-emerald-500/5">
          <CheckCircleIcon className="size-7" weight="fill" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-heading text-xl font-bold text-foreground">
            Password Reset Complete!
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your studio administrator password has been updated securely. You can now access your atelier dashboard.
          </p>
        </div>

        <div className="pt-3">
          <Button
            asChild
            className="w-full h-11 bg-brand-deep-forest text-white text-xs font-semibold uppercase tracking-wider rounded-none"
          >
            <Link href="/seller/login">
              <span>Sign In with New Password</span>
              <ArrowRightIcon className="size-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-xs flex items-start gap-2 text-xs text-destructive">
          <WarningCircleIcon className="size-4 shrink-0 mt-0.5" weight="fill" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden or read-only token field */}
      <div className="space-y-1">
        <label htmlFor="token" className="block text-xs font-semibold text-foreground">
          Security Verification Token *
        </label>
        <input
          id="token"
          type="text"
          placeholder="Paste reset token from email"
          {...register("token")}
          className="w-full h-9 px-3 text-xs font-mono bg-muted/40 border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {errors.token && (
          <p className="text-[11px] text-destructive">{errors.token.message}</p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <label htmlFor="newPassword" className="block text-xs font-semibold text-foreground">
          New Studio Password *
        </label>
        <div className="relative">
          <LockKeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            {...register("newPassword")}
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
        {errors.newPassword && (
          <p className="text-[11px] text-destructive">{errors.newPassword.message}</p>
        )}

        {/* Strength Helper Badges */}
        <div className="pt-1 flex flex-wrap gap-2 text-[10px]">
          <span className={`px-1.5 py-0.5 rounded-xs border ${hasMinLength ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" : "bg-muted text-muted-foreground border-border"}`}>
            6+ characters
          </span>
          <span className={`px-1.5 py-0.5 rounded-xs border ${hasUpper ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" : "bg-muted text-muted-foreground border-border"}`}>
            Uppercase
          </span>
          <span className={`px-1.5 py-0.5 rounded-xs border ${hasLower ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" : "bg-muted text-muted-foreground border-border"}`}>
            Lowercase
          </span>
          <span className={`px-1.5 py-0.5 rounded-xs border ${hasNumber ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" : "bg-muted text-muted-foreground border-border"}`}>
            Number
          </span>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-xs font-semibold text-foreground">
          Confirm New Password *
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

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white text-xs font-semibold uppercase tracking-wider rounded-none shadow-xs mt-2"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Updating Password...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1.5">
            <ShieldCheckIcon className="size-4" />
            <span>Save New Studio Password</span>
          </span>
        )}
      </Button>

      <div className="pt-4 text-center border-t border-border/60">
        <Link
          href="/seller/login"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          Remembered your password? Sign In
        </Link>
      </div>
    </form>
  );
}

export function SellerResetPasswordForm() {
  return (
    <React.Suspense
      fallback={
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Loading reset verification...</span>
        </div>
      }
    >
      <SellerResetPasswordContent />
    </React.Suspense>
  );
}
