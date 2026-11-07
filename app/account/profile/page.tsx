"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  FloppyDiskIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth-context";
import { authApi } from "@/resources/apis/auth.api";
import { profileUpdateSchema, type ProfileUpdateFormValues } from "@/resources/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [profileData, setProfileData] = React.useState<{
    name: string;
    email: string;
    phone: string;
    isEmailVerified: boolean;
    createdAt: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  React.useEffect(() => {
    authApi
      .getProfile()
      .then((data) => {
        setProfileData({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          isEmailVerified: data.isEmailVerified,
          createdAt: data.createdAt,
        });
        reset({
          name: data.name,
          phone: data.phone || "",
        });
      })
      .catch(() => {
        if (user) {
          reset({
            name: user.name,
            phone: user.phone || "",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, reset]);

  const onSubmit = async (values: ProfileUpdateFormValues) => {
    try {
      await authApi.updateProfile({
        name: values.name.trim(),
        phone: values.phone?.trim() || undefined,
      });
      await refreshUser();
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              name: values.name.trim(),
              phone: values.phone?.trim() || "",
            }
          : null
      );
      reset({
        name: values.name.trim(),
        phone: values.phone?.trim() || "",
      });
      toast.success("Personal profile updated successfully!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border/70 pb-4">
        <h1 className="font-heading text-xl font-semibold text-foreground tracking-tight">
          Personal Profile Details
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          View and update your contact information used for orders and notifications.
        </p>
      </div>

      <div className="bg-card border border-border/80 p-6 sm:p-8 max-w-2xl shadow-xs">
        {loading ? (
          <div className="space-y-4 animate-pulse py-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-9 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-9 bg-muted rounded w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email Address (Read-only) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="text-xs font-medium text-foreground">
                  Email Address
                </Label>
                {profileData?.isEmailVerified ? (
                  <Badge
                    variant="outline"
                    className="bg-brand-pale-sage/50 text-brand-deep-forest border-brand-sage/40 text-[10px] gap-1"
                  >
                    <ShieldCheckIcon className="size-3 text-primary" aria-hidden="true" />
                    <span>Verified</span>
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] gap-1"
                  >
                    <WarningCircleIcon className="size-3" aria-hidden="true" />
                    <span>Unverified</span>
                  </Badge>
                )}
              </div>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={profileData?.email || user?.email || ""}
                  disabled
                  className="text-xs h-9 pl-9 bg-muted/40 cursor-not-allowed font-medium text-muted-foreground"
                />
                <EnvelopeIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Your registered email is tied to order confirmations and cannot be changed directly.
              </p>
            </div>

            {/* Full Name (Editable) */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium text-foreground">
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Aino Virtanen"
                  disabled={isSubmitting}
                  className="text-xs h-9 pl-9 focus-visible:ring-1 focus-visible:ring-primary"
                  aria-invalid={Boolean(errors.name)}
                  {...register("name")}
                />
                <UserIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Phone Number (Editable) */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-medium text-foreground">
                Phone Number
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+358 40 123 4567"
                  disabled={isSubmitting}
                  className="text-xs h-9 pl-9 focus-visible:ring-1 focus-visible:ring-primary"
                  aria-invalid={Boolean(errors.phone)}
                  {...register("phone")}
                />
                <PhoneIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Used for parcel carrier delivery notifications (e.g. Posti or Matkahuolto).
              </p>
              {errors.phone && (
                <p className="text-[11px] text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="text-xs h-9 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <FloppyDiskIcon className="size-3.5 mr-1.5" aria-hidden="true" />
                <span>{isSubmitting ? "Saving changes..." : "Save Profile Details"}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
