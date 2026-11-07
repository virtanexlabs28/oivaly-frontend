"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EnvelopeSimpleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  KeyIcon,
} from "@phosphor-icons/react";
import {
  sellerForgotPasswordSchema,
  type SellerForgotPasswordFormValues,
} from "@/resources/schemas/seller-auth.schema";
import { sellerAuthApi } from "@/resources/apis/seller-auth.api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SellerForgotPasswordForm() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successInfo, setSuccessInfo] = React.useState<{
    email: string;
    resetToken?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SellerForgotPasswordFormValues>({
    resolver: zodResolver(sellerForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: SellerForgotPasswordFormValues) => {
    setErrorMessage(null);
    try {
      const response = await sellerAuthApi.forgotPassword(values.email);
      setSuccessInfo({
        email: values.email,
        resetToken: response.resetToken,
      });
      toast.success("Password reset instructions dispatched!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send reset link.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  if (successInfo) {
    return (
      <div className="py-6 space-y-5 text-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="size-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center ring-8 ring-emerald-500/5">
          <CheckCircleIcon className="size-7" weight="fill" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-heading text-xl font-bold text-foreground">
            Check Your Studio Inbox
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We have dispatched password reset instructions to{" "}
            <strong className="text-foreground">{successInfo.email}</strong>.
          </p>
        </div>

        {/* Development reset link helper if token returned */}
        {successInfo.resetToken && (
          <div className="p-3 bg-muted/40 border border-border/80 rounded-xs text-left text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <KeyIcon className="size-3.5 text-primary" />
              <span>Development Token Detected:</span>
            </div>
            <p className="font-mono text-[11px] bg-background p-2 border border-border/60 break-all select-all">
              {successInfo.resetToken}
            </p>
            <Button asChild size="sm" className="w-full bg-primary text-primary-foreground text-xs h-8">
              <Link href={`/seller/reset-password?token=${encodeURIComponent(successInfo.resetToken)}`}>
                <span>Proceed to Reset Password Now</span>
              </Link>
            </Button>
          </div>
        )}

        <div className="pt-3">
          <Button asChild variant="outline" className="w-full text-xs h-10">
            <Link href="/seller/login">
              <ArrowLeftIcon className="size-3.5 mr-1.5" />
              <span>Return to Studio Sign In</span>
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

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-xs font-semibold text-foreground">
          Studio Administrator Email
        </label>
        <div className="relative">
          <EnvelopeSimpleIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            id="email"
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

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white text-xs font-semibold uppercase tracking-wider rounded-none shadow-xs mt-2"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Sending Instructions...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1.5">
            <span>Send Reset Instructions</span>
            <ArrowRightIcon className="size-3.5" />
          </span>
        )}
      </Button>

      <div className="pt-4 text-center border-t border-border/60">
        <Link
          href="/seller/login"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeftIcon className="size-3.5" />
          <span>Back to Studio Sign In</span>
        </Link>
      </div>
    </form>
  );
}
