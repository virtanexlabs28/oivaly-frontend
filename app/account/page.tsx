"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  PackageIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  UserIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth-context";
import { authApi } from "@/resources/apis/auth.api";
import { ordersApi } from "@/resources/apis/orders.api";
import type { CustomerProfileData } from "@/resources/interfaces/auth.interface";
import type { Order } from "@/resources/interfaces/order.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { OrderCard } from "@/components/account/order-card";
import { OrderTrackingDialog } from "@/components/account/order-tracking-dialog";
import { OrderTrackerStepper } from "@/components/account/order-tracker-stepper";

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState<CustomerProfileData | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = React.useState(true);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = React.useState<Order | null>(null);
  const [trackingDialogOpen, setTrackingDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"all" | "active" | "past">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [creatingDemoOrder, setCreatingDemoOrder] = React.useState(false);

  const refreshOrders = React.useCallback(async () => {
    try {
      const res = await ordersApi.getCustomerOrders({ limit: 50 });
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
    } catch {
      // Fail safely
    }
  }, []);

  React.useEffect(() => {
    authApi
      .getProfile()
      .then((data) => setProfile(data))
      .catch(() => {});

    ordersApi
      .getCustomerOrders({ limit: 50 })
      .then((res) => {
        const sorted = (res.data || []).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sorted);
      })
      .catch(() => {})
      .finally(() => {
        setLoadingOrders(false);
      });
  }, []);

  const handleOpenTracking = (order: Order) => {
    setSelectedOrderForTracking(order);
    setTrackingDialogOpen(true);
  };

  // Helper to partition orders
  const activeOrders = React.useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === "PENDING" ||
        o.status === "PAID" ||
        o.status === "PROCESSING" ||
        o.status === "PARTIALLY_SHIPPED" ||
        o.status === "SHIPPED"
    );
  }, [orders]);

  const pastOrders = React.useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === "DELIVERED" ||
        o.status === "CANCELLED" ||
        o.status === "REFUNDED"
    );
  }, [orders]);

  // The latest order (orders placed right now show first)
  const latestOrder = orders.length > 0 ? orders[0] : null;

  // Filtered orders according to active tab and search query
  const displayedOrders = React.useMemo(() => {
    let list: Order[] = orders;
    if (activeTab === "active") {
      list = activeOrders;
    } else if (activeTab === "past") {
      list = pastOrders;
    }

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase().trim();
    return list.filter((order) => {
      const matchNumber = order.orderNumber.toLowerCase().includes(query);
      const matchItem = order.storeOrders?.some((so) =>
        so.items?.some((i) =>
          (i.productName || i.productNameSnapshot || "").toLowerCase().includes(query)
        )
      );
      return matchNumber || matchItem;
    });
  }, [orders, activeOrders, pastOrders, activeTab, searchQuery]);

  // Demo test order trigger to verify instant order creation and tracking
  const handleCreateTestOrder = async () => {
    setCreatingDemoOrder(true);
    try {
      // Use existing marketplace products or demo order
      toast.info("Generating a sample handcrafted order...");
      // Simulate quick order for testing
      const defaultAddr = profile?.addresses?.[0] || {
        fullName: user?.name || "Aino Virtanen",
        phone: user?.phone || "+358401234567",
        streetAddress: "Mannerheimintie 10",
        city: "Helsinki",
        postalCode: "00100",
        country: "FI",
      };

      const demoOrder: Order = {
        id: `demo-${Date.now()}`,
        orderNumber: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        customerId: user?.id || null,
        isGuest: false,
        status: "PROCESSING",
        subtotal: 68.0,
        shippingAmount: 4.9,
        taxAmount: 16.32,
        totalAmount: 72.9,
        currency: "EUR",
        shippingAddress: {
          fullName: defaultAddr.fullName,
          phone: defaultAddr.phone,
          streetAddress: defaultAddr.streetAddress,
          city: defaultAddr.city,
          postalCode: defaultAddr.postalCode,
          country: defaultAddr.country,
        },
        storeOrders: [
          {
            id: `so-${Date.now()}`,
            orderId: `demo-${Date.now()}`,
            storeId: "store-1",
            status: "PROCESSING",
            subtotal: 68.0,
            taxAmount: 16.32,
            shippingAmount: 4.9,
            totalAmount: 72.9,
            carrier: "Posti Logistics",
            trackingNumber: `POSTI-FI-994${Math.floor(Math.random() * 90000 + 10000)}`,
            store: {
              id: "store-1",
              name: "Nordic Artisan Pottery Studio",
              slug: "nordic-artisan-pottery",
            },
            items: [
              {
                id: `item-${Date.now()}`,
                productName: "Hand-thrown Nordic Ceramic Mug Set (Set of 2)",
                unitPrice: 34.0,
                quantity: 2,
                totalPrice: 68.0,
              },
            ],
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setOrders((prev) => [demoOrder, ...prev]);
      toast.success("New order placed! Active shipment tracker is now live at the top.");
    } catch {
      toast.error("Could not create sample order.");
    } finally {
      setCreatingDemoOrder(false);
    }
  };

  const defaultAddress = profile?.addresses?.find((a) => a.isDefault) || profile?.addresses?.[0];

  return (
    <div className="space-y-8">
      {/* 1. Header Greeting & Order Metrics */}
      <div className="border-b border-border/70 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block mb-1">
            Customer Dashboard
          </span>
          <h1 className="font-heading text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
            Welcome, {user?.name || "Customer"}!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track active deliveries, review past artisan purchases, and manage shipping addresses.
          </p>
        </div>

        {/* Quick Metrics Bar */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xs bg-card border border-border/70 text-center">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
              Active Orders
            </span>
            <span className="text-sm font-heading font-bold text-primary">
              {activeOrders.length}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xs bg-card border border-border/70 text-center">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
              Total Orders
            </span>
            <span className="text-sm font-heading font-bold text-foreground">
              {orders.length}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Spotlight: Most Recent / Just-Ordered Active Order Live Tracker */}
      {latestOrder && (
        <div className="bg-card border-2 border-primary/40 rounded-xs p-5 sm:p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary/10 text-primary px-3 py-1 rounded-bl-xs text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border-l border-b border-primary/20">
            <span className="size-2 rounded-full bg-primary animate-ping" />
            <span>Latest Order &bull; Live Tracking</span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pr-24">
              <div>
                <h2 className="font-heading text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                  <PackageIcon className="size-5 text-primary shrink-0" />
                  <span>Order {latestOrder.orderNumber}</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Placed on{" "}
                  {new Date(latestOrder.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" "}&bull; Total: {Number(latestOrder.totalAmount).toFixed(2)}{" "}
                  {latestOrder.currency || "EUR"}
                </p>
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="pt-2 pb-1">
              <OrderTrackerStepper
                status={latestOrder.status}
                carrier={latestOrder.storeOrders?.[0]?.carrier || "Posti Logistics"}
                trackingNumber={latestOrder.storeOrders?.[0]?.trackingNumber}
              />
            </div>

            {/* Quick Actions for Latest Order */}
            <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-muted-foreground flex items-center gap-1.5 truncate">
                <MapPinIcon className="size-3.5 text-primary shrink-0" />
                <span className="truncate">
                  Destination: {latestOrder.shippingAddress?.fullName},{" "}
                  {latestOrder.shippingAddress?.city}
                </span>
              </div>

              <Button
                size="sm"
                onClick={() => handleOpenTracking(latestOrder)}
                className="text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 self-end sm:self-auto"
              >
                <span>View Full Tracking Details</span>
                <ArrowRightIcon className="size-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Orders Section Header & Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground tracking-tight flex items-center gap-2">
              <TruckIcon className="size-5 text-primary" />
              <span>Order History &amp; Tracking</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Review all items ordered previously and monitor parcels in transit.
            </p>
          </div>

          {/* Test order simulator button for dev/user validation */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateTestOrder}
            disabled={creatingDemoOrder}
            className="text-xs h-8 gap-1.5 border-dashed border-primary/50 text-primary hover:bg-primary/10 self-start sm:self-auto"
          >
            <PlusIcon className="size-3.5" />
            <span>Simulate Order Now</span>
          </Button>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/30 border border-border/70 p-2 rounded-xs">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 text-xs rounded-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span>All Orders</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-background/20 font-mono">
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={`px-3 py-1.5 text-xs rounded-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "active"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <ClockIcon className="size-3.5" />
              <span>Active &amp; Now</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-background/20 font-mono">
                {activeOrders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={`px-3 py-1.5 text-xs rounded-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "past"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <CheckCircleIcon className="size-3.5" />
              <span>Past Orders</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-background/20 font-mono">
                {pastOrders.length}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative sm:w-64">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by order # or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs h-8 pl-8 bg-background border-border/80"
            />
          </div>
        </div>

        {/* 4. Orders List Display */}
        {loadingOrders ? (
          <div className="space-y-3 py-8 text-center animate-pulse">
            <div className="h-28 bg-muted rounded-xs" />
            <div className="h-28 bg-muted rounded-xs" />
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="bg-card border border-border/80 p-8 sm:p-12 text-center space-y-4 rounded-xs">
            <div className="size-12 rounded-full bg-brand-pale-sage text-primary flex items-center justify-center mx-auto">
              <PackageIcon className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-sm font-semibold text-foreground">
                {searchQuery
                  ? "No matching orders found"
                  : activeTab === "active"
                  ? "No active orders in transit"
                  : "No order history yet"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {searchQuery
                  ? "Try searching with a different order number or clear your filter."
                  : "When you place an order with Nordic artisans, you can track parcel transit and delivery right here."}
              </p>
            </div>
            <div className="pt-2">
              <Button asChild size="sm" className="text-xs h-9">
                <Link href="/search">
                  <span>Browse Nordic Catalog</span>
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                onTrack={handleOpenTracking}
                onOrderUpdated={refreshOrders}
                isRecent={index === 0 && !searchQuery && activeTab === "all"}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Account Quick Summaries (Profile, Addresses, Security) */}
      <div className="pt-6 border-t border-border/70 space-y-4">
        <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
          Account Shortcuts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Profile Card */}
          <div className="bg-card border border-border/80 p-4 rounded-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex size-8 items-center justify-center rounded-xs bg-brand-pale-sage text-primary">
                  <UserIcon className="size-4" />
                </div>
                {profile?.isEmailVerified ? (
                  <Badge variant="outline" className="text-[10px] text-primary border-brand-sage/40">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30">
                    Unverified
                  </Badge>
                )}
              </div>
              <h4 className="font-heading text-xs font-semibold text-foreground">
                Personal Profile
              </h4>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {profile?.name || user?.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {profile?.email || user?.email}
              </p>
            </div>
            <Link
              href="/account/profile"
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 pt-2 border-t border-border/60"
            >
              <span>Edit profile</span>
              <ArrowRightIcon className="size-3" />
            </Link>
          </div>

          {/* Addresses Card */}
          <div className="bg-card border border-border/80 p-4 rounded-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex size-8 items-center justify-center rounded-xs bg-brand-pale-sage text-primary">
                  <MapPinIcon className="size-4" />
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {profile?.addresses?.length || 0} saved
                </span>
              </div>
              <h4 className="font-heading text-xs font-semibold text-foreground">
                Delivery Addresses
              </h4>
              {defaultAddress ? (
                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <p className="font-medium text-foreground truncate">{defaultAddress.fullName}</p>
                  <p className="truncate">
                    {defaultAddress.streetAddress}, {defaultAddress.city}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  No default address set.
                </p>
              )}
            </div>
            <Link
              href="/account/addresses"
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 pt-2 border-t border-border/60"
            >
              <span>Manage addresses</span>
              <ArrowRightIcon className="size-3" />
            </Link>
          </div>

          {/* Security Card */}
          <div className="bg-card border border-border/80 p-4 rounded-xs space-y-3 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex size-8 items-center justify-center rounded-xs bg-brand-pale-sage text-primary">
                  <ShieldCheckIcon className="size-4" />
                </div>
              </div>
              <h4 className="font-heading text-xs font-semibold text-foreground">
                Security &amp; Password
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Update account password, email preferences, and session controls.
              </p>
            </div>
            <Link
              href="/account/security"
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 pt-2 border-t border-border/60"
            >
              <span>Security settings</span>
              <ArrowRightIcon className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 6. Order Tracking Detail Dialog */}
      <OrderTrackingDialog
        order={selectedOrderForTracking}
        open={trackingDialogOpen}
        onOpenChange={setTrackingDialogOpen}
      />
    </div>
  );
}
