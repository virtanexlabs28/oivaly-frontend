"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSellerAuth } from "@/lib/seller-auth-context";

export default function SellerRootPage() {
  const router = useRouter();
  const { isSellerAuthenticated } = useSellerAuth();

  React.useEffect(() => {
    if (isSellerAuthenticated) {
      router.replace("/seller/dashboard");
    } else {
      router.replace("/seller/login");
    }
  }, [isSellerAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <span>Entering Nordic Atelier...</span>
      </div>
    </div>
  );
}
