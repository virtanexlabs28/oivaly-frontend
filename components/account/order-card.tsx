"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PackageIcon,
  StorefrontIcon,
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import type { Order, OrderStatus } from "@/resources/interfaces/order.interface";
import { ordersApi } from "@/resources/apis/orders.api";
import { paymentsApi } from "@/resources/apis/payments.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderTrackerStepper } from "./order-tracker-stepper";

interface OrderCardProps {
  order: Order;
  onTrack: (order: Order) => void;
  onOrderUpdated?: () => void;
  isRecent?: boolean;
}

function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[11px] gap-1"
        >
          <ClockIcon className="size-3" />
          <span>Order Placed</span>
        </Badge>
      );
    case "PAID":
      return (
        <Badge
          variant="outline"
          className="bg-brand-pale-sage/60 text-brand-deep-forest border-brand-sage/40 text-[11px] gap-1"
        >
          <CheckCircleIcon className="size-3 text-primary" />
          <span>Confirmed</span>
        </Badge>
      );
    case "PROCESSING":
      return (
        <Badge
          variant="outline"
          className="bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30 text-[11px] gap-1"
        >
          <PackageIcon className="size-3" />
          <span>In Workshop</span>
        </Badge>
      );
    case "PARTIALLY_SHIPPED":
    case "SHIPPED":
      return (
        <Badge
          variant="outline"
          className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30 text-[11px] gap-1 font-medium"
        >
          <TruckIcon className="size-3" />
          <span>Shipped (In Transit)</span>
        </Badge>
      );
    case "DELIVERED":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[11px] gap-1 font-medium"
        >
          <CheckCircleIcon className="size-3 text-emerald-600" weight="fill" />
          <span>Delivered</span>
        </Badge>
      );
    case "CANCELLED":
    case "REFUNDED":
      return (
        <Badge
          variant="outline"
          className="bg-muted text-muted-foreground border-border text-[11px] gap-1"
        >
          <XCircleIcon className="size-3" />
          <span>{status === "REFUNDED" ? "Refunded" : "Cancelled"}</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-[11px]">
          {status}
        </Badge>
      );
  }
}

export function OrderCard({
  order,
  onTrack,
  onOrderUpdated,
  isRecent = false,
}: OrderCardProps) {
  const [cancelling, setCancelling] = React.useState(false);
  const [payingWithStripe, setPayingWithStripe] = React.useState(false);

  const handlePayWithStripe = async () => {
    try {
      setPayingWithStripe(true);
      toast.info("Generating Stripe payment link...");
      const session = await paymentsApi.createCheckoutSession(
        order.id,
        typeof window !== "undefined" ? window.location.origin : undefined
      );
      if (session.paymentUrl) {
        window.location.href = session.paymentUrl;
      } else {
        toast.error("Could not retrieve Stripe payment link.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to open Stripe checkout.";
      toast.error(msg);
    } finally {
      setPayingWithStripe(false);
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const allItems =
    order.storeOrders && order.storeOrders.length > 0
      ? order.storeOrders.flatMap((so) =>
          (so.items || []).map((item) => ({
            ...item,
            storeName: so.store?.name || "Nordic Artisan Studio",
          }))
        )
      : (order.items || []).map((item) => ({
          ...item,
          storeName: "Nordic Artisan Studio",
        }));

  const firstStoreOrder = order.storeOrders?.[0];
  const carrier = firstStoreOrder?.carrier || "Posti Finland";
  const trackingNumber = firstStoreOrder?.trackingNumber;

  const isActive =
    order.status === "PENDING" ||
    order.status === "PAID" ||
    order.status === "PROCESSING" ||
    order.status === "SHIPPED" ||
    order.status === "PARTIALLY_SHIPPED";

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order? Active stock reservations will be released.")) {
      return;
    }

    setCancelling(true);
    try {
      await ordersApi.cancelOrder(order.id);
      toast.success("Order cancelled successfully.");
      onOrderUpdated?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel order.";
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div
      className={`bg-card border rounded-xs transition-shadow duration-200 overflow-hidden ${
        isRecent
          ? "border-primary/50 shadow-md ring-1 ring-primary/20"
          : "border-border/80 hover:shadow-xs"
      }`}
    >
      {/* Top Header Row */}
      <div className="bg-muted/30 border-b border-border/60 px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-heading text-xs sm:text-sm font-semibold text-foreground">
              {order.orderNumber}
            </span>
            {isRecent && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
                <span className="size-1.5 rounded-full bg-white animate-pulse" />
                Latest Order
              </span>
            )}
          </div>
          <span className="text-border">|</span>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge(order.status)}
          <span className="font-heading font-semibold text-xs sm:text-sm text-foreground">
            {Number(order.totalAmount).toFixed(2)} {order.currency || "EUR"}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Inline Stepper for active orders */}
        {isActive && (
          <div className="bg-brand-pale-sage/20 dark:bg-muted/20 border border-brand-sage/20 rounded-xs p-3.5">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <TruckIcon className="size-4 text-primary" />
                <span>Live Shipment Tracker</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {carrier}
              </span>
            </div>
            <OrderTrackerStepper
              status={order.status}
              carrier={carrier}
              trackingNumber={trackingNumber}
              compact
            />
          </div>
        )}

        {/* Items List */}
        <div className="divide-y divide-border/50">
          {allItems.slice(0, 3).map((item, idx) => (
            <div key={item.id || idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-xs bg-muted flex items-center justify-center shrink-0 border border-border/50 text-muted-foreground">
                  <StorefrontIcon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {item.productName || item.productNameSnapshot || "Handcrafted Product"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.storeName} &bull; Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-medium text-foreground shrink-0">
                {(Number(item.unitPrice) * item.quantity).toFixed(2)} {order.currency || "EUR"}
              </span>
            </div>
          ))}

          {allItems.length > 3 && (
            <p className="pt-2 text-[11px] text-muted-foreground italic">
              + {allItems.length - 3} more {allItems.length - 3 === 1 ? "item" : "items"} in this shipment
            </p>
          )}
        </div>

        {/* Footer Destination & Actions */}
        <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {order.shippingAddress ? (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPinIcon className="size-3.5 text-primary shrink-0" />
              <span className="truncate">
                Delivering to {order.shippingAddress.fullName},{" "}
                {order.shippingAddress.city}
              </span>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {order.status === "PENDING" && (
              <>
                <Button
                  size="sm"
                  onClick={handlePayWithStripe}
                  disabled={payingWithStripe}
                  className="text-xs h-8 bg-[#635BFF] hover:bg-[#5349e0] text-white gap-1.5 shadow-xs font-medium cursor-pointer"
                >
                  <span className="size-3.5 rounded-xs bg-white text-[#635BFF] flex items-center justify-center text-[9px] font-bold">
                    S
                  </span>
                  <span>{payingWithStripe ? "Opening Stripe..." : "Pay with Stripe"}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="text-xs h-8 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                >
                  {cancelling ? "Cancelling..." : "Cancel"}
                </Button>
              </>
            )}

            <Button
              size="sm"
              onClick={() => onTrack(order)}
              className="text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-xs"
            >
              <span>Track Order</span>
              <ArrowRightIcon className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
