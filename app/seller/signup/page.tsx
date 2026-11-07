import type { Metadata } from "next";
import { SellerAuthLayout } from "@/components/seller-auth/seller-auth-layout";
import { SellerSignupForm } from "@/components/seller-auth/seller-signup-form";

export const metadata: Metadata = {
  title: "Open a Nordic Artisan Studio | Seller Onboarding",
  description:
    "Apply to become an approved seller on Oivaly. Reach design collectors across Finland, Sweden, and Scandinavia with zero monthly listing fees.",
};

export default function SellerSignupPage() {
  return (
    <SellerAuthLayout
      title="Open Your Nordic Studio"
      subtitle="Complete your artisan atelier application. We verify Finnish Business IDs (Y-tunnus) within 24 hours."
      activeTab="signup"
    >
      <SellerSignupForm />
    </SellerAuthLayout>
  );
}
