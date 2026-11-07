"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  ShieldCheckIcon,
  EnvelopeIcon,
  KeyIcon,
  SignOutIcon,
  WarningCircleIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth-context";
import { authApi } from "@/resources/apis/auth.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SecurityPage() {
  const { user, logout } = useAuth();
  const [resetEmailSent, setResetEmailSent] = React.useState(false);
  const [sendingReset, setSendingReset] = React.useState(false);
  const [resendVerificationSent, setResendVerificationSent] = React.useState(false);
  const [sendingVerification, setSendingVerification] = React.useState(false);

  const handleRequestPasswordReset = async () => {
    if (!user?.email) return;
    setSendingReset(true);
    try {
      await authApi.forgotPassword({ email: user.email });
      setResetEmailSent(true);
      toast.success("Password reset instructions sent to your email!");
    } catch {
      toast.error("Failed to request password reset. Please try again later.");
    } finally {
      setSendingReset(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;
    setSendingVerification(true);
    try {
      await authApi.resendVerification(user.email);
      setResendVerificationSent(true);
      toast.success("Verification link sent to your email!");
    } catch {
      toast.error("Failed to send verification link.");
    } finally {
      setSendingVerification(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border/70 pb-4">
        <h1 className="font-heading text-xl font-semibold text-foreground tracking-tight">
          Security & Account Access
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your password, email verification status, and active session.
        </p>
      </div>

      <div className="space-y-5 max-w-2xl">
        {/* Email Verification Status Card */}
        <div className="bg-card border border-border/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xs bg-brand-pale-sage text-primary shrink-0">
                <EnvelopeIcon className="size-4" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  Email Verification
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
              </div>
            </div>

            {user?.isEmailVerified ? (
              <Badge
                variant="outline"
                className="bg-brand-pale-sage/60 text-brand-deep-forest border-brand-sage/40 text-[10px] gap-1 shrink-0"
              >
                <CheckCircleIcon className="size-3 text-primary" weight="fill" aria-hidden="true" />
                <span>Verified</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] gap-1 shrink-0"
              >
                <WarningCircleIcon className="size-3" aria-hidden="true" />
                <span>Pending Verification</span>
              </Badge>
            )}
          </div>

          {!user?.isEmailVerified && (
            <div className="p-3 bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-2">
              <p>
                Your email address is not yet verified. Verifying your email ensures you receive order confirmations and delivery updates.
              </p>
              {resendVerificationSent ? (
                <p className="text-brand-deep-forest font-medium">
                  &check; Verification link dispatched. Please check your inbox.
                </p>
              ) : (
                <Button
                  onClick={handleResendVerification}
                  disabled={sendingVerification}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                >
                  {sendingVerification ? "Sending..." : "Send Verification Link"}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Password Security Card */}
        <div className="bg-card border border-border/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xs bg-brand-pale-sage text-primary shrink-0">
              <KeyIcon className="size-4" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold text-foreground">
                Account Password
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Passwords are encrypted using bcrypt hashing on the server.
              </p>
            </div>
          </div>

          <div className="p-3 bg-muted/30 border border-border/60 text-xs text-muted-foreground space-y-2.5">
            <p>
              To change or reset your password securely, click below to receive a secure tokenized password reset link to your registered email address ({user?.email}).
            </p>

            {resetEmailSent ? (
              <p className="text-brand-deep-forest font-medium">
                &check; Reset instructions have been dispatched. Follow the link in your email to choose a new password.
              </p>
            ) : (
              <Button
                onClick={handleRequestPasswordReset}
                disabled={sendingReset}
                variant="outline"
                size="sm"
                className="text-xs h-8"
              >
                {sendingReset ? "Dispatching..." : "Send Password Reset Link"}
              </Button>
            )}
          </div>
        </div>

        {/* Active Session & Sign Out Card */}
        <div className="bg-card border border-border/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xs bg-muted text-muted-foreground shrink-0">
              <ShieldCheckIcon className="size-4" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold text-foreground">
                Session Security
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                You are currently signed in to this browser.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Signing out will invalidate your session tokens on this device.
            </p>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30 shrink-0"
            >
              <SignOutIcon className="size-3.5 mr-1" aria-hidden="true" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
