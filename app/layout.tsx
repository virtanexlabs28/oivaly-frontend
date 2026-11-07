import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { SellerAuthProvider } from "@/lib/seller-auth-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { CartProvider } from "@/lib/cart-context";
import { MarketplaceShell } from "@/components/layout";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Oivaly | Finnish Multi-Vendor Platform",
    template: "%s | Oivaly",
  },
  description:
    "A modern, trustworthy multi-vendor marketplace connecting stores, brands, and buyers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        jetbrainsMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-primary focus:text-primary-foreground focus:text-xs focus:font-medium focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <SellerAuthProvider>
            <WishlistProvider>
              <CartProvider>
                <TooltipProvider delayDuration={200}>
                  <MarketplaceShell>{children}</MarketplaceShell>
                  <Toaster position="bottom-right" richColors closeButton />
                </TooltipProvider>
              </CartProvider>
            </WishlistProvider>
          </SellerAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
