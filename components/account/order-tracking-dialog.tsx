"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  PackageIcon,
  TruckIcon,
  MapPinIcon,
  CopyIcon,
  CheckIcon,
  StorefrontIcon,
} from "@phosphor-icons/react";
import type { Order } from "@/resources/interfaces/order.interface";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { OrderTrackerStepper } from "./order-tracker-stepper";

interface OrderTrackingDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderTrackingDialog({
  order,
  open,
  onOpenChange,
}: OrderTrackingDialogProps) {
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const firstStoreOrder = order.storeOrders?.[0];
  const carrier = firstStoreOrder?.carrier || "Posti Logistics (Finland)";
  const trackingNumber =
    firstStoreOrder?.trackingNumber || `POSTI-FI-${order.orderNumber.replace(/[^0-9]/g, "").slice(0, 8) || "8823194"}`;

  const copyTracking = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    toast.success("Tracking number copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-5 sm:p-7 rounded-lg sm:rounded-xl border-border/80 shadow-2xl">
        <DialogHeader className="border-b border-border/70 pb-4 pr-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0 pr-2">
              <DialogTitle className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                <PackageIcon className="size-5 text-primary shrink-0" />
                <span>Order Tracking</span>
                <span className="font-mono text-xs sm:text-sm font-normal text-muted-foreground truncate">
                  #{order.orderNumber}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Placed on {formattedDate} &bull; Total: <span className="font-semibold text-foreground">{Number(order.totalAmount).toFixed(2)} {order.currency || "EUR"}</span>
              </DialogDescription>
            </div>
            <Badge
              variant="outline"
              className="self-start sm:self-auto shrink-0 bg-brand-pale-sage/60 text-brand-deep-forest border-brand-sage/40 text-xs font-medium uppercase tracking-wider"
            >
              {order.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Visual Progress Stepper */}
          <div className="bg-muted/30 border border-border/80 rounded-md p-4 sm:p-5">
            <h4 className="text-xs font-semibold text-foreground mb-4 uppercase tracking-wider">
              Transit Progression
            </h4>
            <OrderTrackerStepper
              status={order.status}
              carrier={carrier}
              trackingNumber={trackingNumber}
            />
          </div>

          {/* Carrier & Tracking Reference Box */}
          <div className="bg-card border border-border/80 rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-full bg-brand-pale-sage text-primary flex items-center justify-center shrink-0">
                <TruckIcon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{carrier}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs text-muted-foreground">
                    {trackingNumber}
                  </span>
                  <button
                    type="button"
                    onClick={copyTracking}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    title="Copy tracking code"
                  >
                    {copied ? (
                      <CheckIcon className="size-3.5 text-emerald-600" />
                    ) : (
                      <CopyIcon className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-[11px] text-muted-foreground block">
                Estimated Service
              </span>
              <span className="text-xs font-medium text-primary">
                Posti Parcel &bull; 1–3 Days
              </span>
            </div>
          </div>

          {/* Delivery Destination Address */}
          {order.shippingAddress && (
            <div className="bg-muted/20 border border-border/70 rounded-md p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <MapPinIcon className="size-4 text-primary shrink-0" />
                <span>Delivery Destination</span>
              </div>
              <div className="text-xs text-muted-foreground pl-6 space-y-0.5">
                <p className="font-medium text-foreground">
                  {order.shippingAddress.fullName} {order.shippingAddress.phone ? `• ${order.shippingAddress.phone}` : ""}
                </p>
                <p>
                  {order.shippingAddress.streetAddress || order.shippingAddress.addressLine1}
                  {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}
                </p>
                <p>
                  {order.shippingAddress.postalCode} {order.shippingAddress.city},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          )}

          {/* Ordered Items Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Ordered Creations ({allItems.length})
            </h4>

            <div className="divide-y divide-border/60 border border-border/80 rounded-md overflow-hidden bg-card">
              {allItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="size-11 rounded-sm bg-muted flex items-center justify-center shrink-0 border border-border/60 text-muted-foreground">
                      <StorefrontIcon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-xs sm:text-sm font-semibold text-foreground truncate">
                        {item.productName || item.productNameSnapshot || "Nordic Artisan Item"}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-medium text-foreground/80">{item.storeName}</span>
                        <span>&bull;</span>
                        <span>Qty: {item.quantity}</span>
                        {item.variantName && (
                          <>
                            <span>&bull;</span>
                            <span>{item.variantName}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      {(Number(item.unitPrice) * item.quantity).toFixed(2)} {order.currency || "EUR"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {Number(item.unitPrice).toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals Summary */}
          <div className="bg-muted/20 border border-border/60 rounded-md p-4 space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-mono text-foreground">{Number(order.subtotal || 0).toFixed(2)} {order.currency || "EUR"}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery (Posti)</span>
              <span className="font-mono text-foreground">
                {Number(order.shippingAmount || 0) === 0
                  ? "Free"
                  : `${Number(order.shippingAmount).toFixed(2)} ${order.currency || "EUR"}`}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>VAT / Tax (Included)</span>
              <span className="font-mono text-foreground">{Number(order.taxAmount || 0).toFixed(2)} {order.currency || "EUR"}</span>
            </div>
            <div className="flex justify-between font-semibold text-foreground pt-2.5 border-t border-border/60 text-sm">
              <span>Total Paid</span>
              <span className="text-primary font-heading font-bold text-base">
                {Number(order.totalAmount).toFixed(2)} {order.currency || "EUR"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
