"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon, XCircleIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { authApi } from "@/resources/apis/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = React.useState<"idle" | "verifying" | "success" | "error">(
    token ? "verifying" : "idle"
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Resend form state
  const [resendEmail, setResendEmail] = React.useState("");
  const [resendSubmitted, setResendSubmitted] = React.useState(false);
  const [resending, setResending] = React.useState(false);

  React.useEffect(() => {
    if (!token) return;

    authApi
      .verifyEmail({ token: token.trim() })
      .then(() => {
        setStatus("success");
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error
            ? err.message
            : "Verification link is invalid or has expired. Please request a new one.";
        setErrorMessage(message);
        setStatus("error");
      });
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setResending(true);
    try {
      await authApi.resendVerification(resendEmail.trim());
      setResendSubmitted(true);
    } catch {
      setResendSubmitted(true); // Don't disclose error
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-primary block mb-1">
          Oivaly
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Email Verification
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-card border border-border/80 p-6 sm:p-8 shadow-xs text-center space-y-4">
          {status === "verifying" && (
            <div className="py-6 space-y-3">
              <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                Verifying your email address with Oivaly...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-brand-pale-sage text-primary mx-auto">
                <CheckCircleIcon className="size-8" weight="fill" aria-hidden="true" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Email Address Verified!
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Thank you for verifying your email address. Your customer account is now fully active.
              </p>
              <div className="pt-2">
                <Button asChild className="w-full text-xs h-10 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/login">Sign In to Your Account</Link>
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mx-auto">
                <XCircleIcon className="size-8" weight="fill" aria-hidden="true" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Verification Failed
              </h2>
              <p className="text-xs sm:text-sm text-destructive leading-relaxed">
                {errorMessage}
              </p>

              <div className="pt-4 border-t border-border/60 text-left space-y-3">
                <h3 className="text-xs font-semibold text-foreground">
                  Request a new verification link:
                </h3>
                {resendSubmitted ? (
                  <p className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-xs">
                    If an unverified account exists with that email, a new verification link has been dispatched.
                  </p>
                ) : (
                  <form onSubmit={handleResend} className="space-y-2">
                    <Label htmlFor="resend-email" className="text-xs text-muted-foreground">
                      Your Email Address
                    </Label>
                    <Input
                      id="resend-email"
                      type="email"
                      required
                      placeholder="name@example.fi"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="text-xs h-9"
                    />
                    <Button type="submit" disabled={resending} size="sm" className="w-full text-xs h-8">
                      {resending ? "Sending..." : "Resend Link"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )}

          {status === "idle" && (
            <div className="space-y-4 text-left">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mx-auto">
                <EnvelopeSimpleIcon className="size-6" aria-hidden="true" />
              </div>
              <div className="text-center">
                <h2 className="font-heading text-base font-semibold text-foreground">
                  Check Your Inbox
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Click the link in your email to verify your account, or request a new link below.
                </p>
              </div>

              {resendSubmitted ? (
                <div className="p-3 bg-brand-pale-sage/50 text-xs text-brand-deep-forest rounded-xs text-center">
                  Verification email sent. Please check your inbox.
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-2.5 pt-2">
                  <Label htmlFor="idle-email" className="text-xs text-muted-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="idle-email"
                    type="email"
                    required
                    placeholder="name@example.fi"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="text-xs h-9"
                  />
                  <Button type="submit" disabled={resending} size="sm" className="w-full text-xs h-8">
                    {resending ? "Dispatching..." : "Send Verification Link"}
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <VerifyEmailContent />
    </React.Suspense>
  );
}
