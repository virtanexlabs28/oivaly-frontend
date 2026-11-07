import type { Metadata } from "next";
import { SellerAuthLayout } from "@/components/seller-auth/seller-auth-layout";
import { SellerLoginForm } from "@/components/seller-auth/seller-login-form";

export const metadata: Metadata = {
  title: "Artisan Studio Sign In | Oivaly Seller Portal",
  description:
    "Sign in to your artisan workshop dashboard. Manage Nordic handmade listings, orders, Posti parcel dispatches, and sales payouts.",
};

export default function SellerLoginPage() {
  return (
    <SellerAuthLayout
      title="Sign in to your Studio"
      subtitle="Access your artisan workshop, orders, inventory reservations, and Finnish payout settings."
      activeTab="login"
    >
      <SellerLoginForm />
    </SellerAuthLayout>
  );
}
