import type { Metadata } from "next";
import { SellerAuthLayout } from "@/components/seller-auth/seller-auth-layout";
import { SellerForgotPasswordForm } from "@/components/seller-auth/seller-forgot-password-form";

export const metadata: Metadata = {
  title: "Recover Studio Password | Oivaly Seller Portal",
  description:
    "Reset your studio administrator password. Enter your registered business email to receive recovery instructions.",
};

export default function SellerForgotPasswordPage() {
  return (
    <SellerAuthLayout
      title="Recover Studio Password"
      subtitle="Enter your studio administrator email address and we will dispatch a secure reset token."
      activeTab="forgot"
    >
      <SellerForgotPasswordForm />
    </SellerAuthLayout>
  );
}
