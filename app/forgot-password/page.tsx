"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EnvelopeSimpleIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/resources/schemas/auth.schema";
import { authApi } from "@/resources/apis/auth.api";
import { Button } from "@/components/ui/button";
import { CustomerAuthLayout } from "@/components/auth/customer-auth-layout";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setErrorMessage(null);
    try {
      await authApi.forgotPassword(values);
      setSubmitted(true);
      toast.success("Password recovery instructions sent!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to process request. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  if (submitted) {
    return (
      <CustomerAuthLayout
        title="Check your inbox"
        subtitle="Password recovery instructions dispatched."
        activeTab="forgot"
      >
        <div className="space-y-6 text-center py-6">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 mx-auto border border-emerald-500/30">
            <CheckCircleIcon className="size-8" weight="fill" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-heading font-bold text-foreground">Instructions Dispatched</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              If a customer account exists with that email address, we&apos;ve sent password reset instructions. Please check your inbox and spam folders.
            </p>
          </div>
          <Button asChild className="w-full h-10 text-xs font-semibold bg-brand-deep-forest text-white hover:bg-brand-deep-forest/90 rounded-none transition-all">
            <Link href="/login">
              Return to Sign In
            </Link>
          </Button>
        </div>
      </CustomerAuthLayout>
    );
  }

  return (
    <CustomerAuthLayout
      title="Reset your password"
      subtitle="Enter your account email to receive secure recovery instructions."
      activeTab="forgot"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 bg-destructive/10 border border-destructive/30 rounded-xs flex items-start gap-2.5 text-xs text-destructive animate-in fade-in duration-200"
          >
            <WarningCircleIcon className="size-4 shrink-0 mt-0.5" weight="fill" />
            <div className="flex-1">
              <p className="font-semibold">Request Failed</p>
              <p className="mt-0.5 text-[11px] leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="recovery-email" className="block text-xs font-semibold text-foreground">
            Account Email Address
          </label>
          <div className="relative">
            <EnvelopeSimpleIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="recovery-email"
              type="email"
              placeholder="customer@example.fi"
              autoComplete="email"
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 text-xs font-semibold bg-brand-deep-forest text-white hover:bg-brand-deep-forest/90 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
        >
          {isSubmitting ? (
            <>
              <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending instructions...</span>
            </>
          ) : (
            <>
              <span>Send Recovery Instructions</span>
              <ArrowRightIcon className="size-3.5" />
            </>
          )}
        </Button>

        <div className="pt-2 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </form>
    </CustomerAuthLayout>
  );
}
