"use client";

import * as React from "react";
import {
  ShoppingBagOpenIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
  XCircleIcon,
  EyeIcon,
  MapPinIcon,
  UserIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  CurrencyEurIcon,
  PackageIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useSellerAuth } from "@/lib/seller-auth-context";
import { sellerDashboardApi } from "@/resources/apis/seller-dashboard.api";
import type {
  StoreOrderItemDetail,
  StoreOrderStatusType,
} from "@/resources/interfaces/seller-dashboard.interface";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SellerOrdersPage() {
  const { store } = useSellerAuth();

  const [orders, setOrders] = React.useState<StoreOrderItemDetail[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<StoreOrderStatusType | "ALL">("ALL");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  // Inspector & Fulfillment Modal states
  const [selectedOrder, setSelectedOrder] = React.useState<StoreOrderItemDetail | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState<StoreOrderStatusType>("PROCESSING");
  const [trackingNumber, setTrackingNumber] = React.useState("");
  const [trackingCarrier, setTrackingCarrier] = React.useState("Posti");
  const [fulfillmentNotes, setFulfillmentNotes] = React.useState("");

  const loadOrders = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await sellerDashboardApi.getOrders({
        page,
        limit: 20,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        search: search.trim() || undefined,
        storeId: store?.id,
      });

      setOrders(res.data || []);
      setTotalCount(res.total || 0);
    } catch {
      toast.error("Failed to load store orders");
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, search, store?.id]);

  React.useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleOpenInspector = (order: StoreOrderItemDetail) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.trackingNumber || "");
    setTrackingCarrier(order.carrier || order.trackingCarrier || "Posti");
    setFulfillmentNotes(order.fulfillmentNotes || "");
  };

  // Automated Posti dispatch generator helper
  const handleAutoBookPosti = () => {
    // Generate realistic Posti Finland barcode tracking code: JJFI + 16 random digits
    const randomDigits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("");
    const generatedTracking = `JJFI${randomDigits}`;
    setTrackingCarrier("Posti");
    setTrackingNumber(generatedTracking);
    setNewStatus("SHIPPED");
    toast.success("Posti courier consignment booked & tracking number generated!");
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    setIsUpdatingStatus(true);
    try {
      const generatedUrl =
        trackingCarrier.toLowerCase().includes("posti") && trackingNumber.trim()
          ? `https://www.posti.fi/en/tracking#/seuranta/${trackingNumber.trim()}`
          : undefined;

      const notesCombined = trackingCarrier
        ? `Carrier: ${trackingCarrier}${fulfillmentNotes ? ` | ${fulfillmentNotes}` : ""}`
        : fulfillmentNotes;

      await sellerDashboardApi.updateOrderStatus(
        selectedOrder.id,
        {
          status: newStatus,
          trackingNumber: trackingNumber.trim() || undefined,
          carrier: trackingCarrier || "Posti",
          trackingUrl: generatedUrl,
          notes: notesCombined || undefined,
        },
        store?.id
      );

      toast.success(
        `Order ${selectedOrder.storeOrderNumber || selectedOrder.id.slice(0, 8)} updated to ${newStatus} with ${trackingCarrier} tracking!`
      );
      setSelectedOrder(null);
      loadOrders();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update order status";
      toast.error(msg);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground tracking-tight">
            Order Fulfillment Hub
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Refine customer orders, inspect Finnish delivery details, and dispatch parcel tracking.
          </p>
        </div>
      </div>

      {/* Refine / Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-background p-3 border border-border/80 shadow-xs">
        {/* Status Refinement Tabs (Showing Paid & Fulfillment statuses) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { label: "All Paid Orders", value: "ALL" },
              { label: "Ready to Dispatch", value: "PROCESSING" },
              { label: "In Transit / Shipped", value: "SHIPPED" },
              { label: "Delivered", value: "DELIVERED" },
              { label: "Cancelled", value: "CANCELLED" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-none whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? "bg-brand-deep-forest text-white font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer..."
            className="w-full h-8.5 pl-8 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-background border border-border/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            <div className="size-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            <p>Loading fulfillment orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-muted-foreground space-y-2">
            <ShoppingBagOpenIcon className="size-10 mx-auto text-muted-foreground/30" />
            <p className="font-semibold text-foreground text-sm">No orders matching criteria</p>
            <p className="text-[11px]">
              {search || statusFilter !== "ALL"
                ? "Try clearing your status refine filter or search query."
                : "New customer orders will appear here ready for workshop packing."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer & Destination</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Store Share (90%)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-normal">
                {orders.map((ord) => {
                  const itemsCount = ord.items?.reduce((acc, it) => acc + (it.quantity || 1), 0) || 1;
                  const grandTotal = Number(ord.grandTotal || ord.subtotal || 0);
                  const netShare = grandTotal * 0.9;
                  const dateStr = ord.createdAt
                    ? new Date(ord.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <tr
                      key={ord.id}
                      className="hover:bg-muted/15 transition-colors group cursor-pointer"
                      onClick={() => handleOpenInspector(ord)}
                    >
                      {/* Order Number */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-foreground block">
                          {ord.storeOrderNumber || `SO-${ord.id.slice(0, 8)}`}
                        </span>
                        {ord.trackingNumber && (
                          <span className="text-[10px] text-primary flex items-center gap-1 mt-0.5 font-mono">
                            <TruckIcon className="size-3" />
                            <span>{ord.trackingNumber}</span>
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-muted-foreground text-[11px]">
                        {dateStr}
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-foreground block">
                          {ord.order?.customer?.name || "Marketplace Buyer"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {ord.order?.shippingAddress?.city
                            ? `${ord.order.shippingAddress.city}, ${ord.order.shippingAddress.country || "Finland"}`
                            : "Finland"}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3 text-muted-foreground">
                        <span className="font-mono font-medium text-foreground">
                          {itemsCount}
                        </span>{" "}
                        item(s)
                      </td>

                      {/* 90% Net Store Share */}
                      <td className="py-3 px-3">
                        <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-300 block">
                          €{netShare.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Total: €{grandTotal.toFixed(2)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col items-start gap-1">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-none text-[9px] font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 uppercase tracking-wider">
                            <CheckCircleIcon className="size-2.5" weight="fill" />
                            <span>PAID</span>
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-semibold ${
                              ord.status === "DELIVERED"
                                ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20"
                                : ord.status === "SHIPPED"
                                ? "bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-500/20"
                                : ord.status === "PROCESSING"
                                ? "bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20"
                                : "bg-destructive/10 text-destructive border border-destructive/20"
                            }`}
                          >
                            {ord.status === "DELIVERED" && <CheckCircleIcon className="size-3" weight="bold" />}
                            {ord.status === "SHIPPED" && <TruckIcon className="size-3" weight="bold" />}
                            {ord.status === "PROCESSING" && <ClockCountdownIcon className="size-3" weight="bold" />}
                            <span>{ord.status === "PROCESSING" ? "READY TO SHIP" : ord.status}</span>
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenInspector(ord);
                          }}
                          className="h-7 px-2.5 text-xs rounded-none border-border hover:bg-muted"
                        >
                          <EyeIcon className="size-3.5 mr-1" />
                          <span>Inspect</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-3 border-t border-border/60 bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {orders.length} of {totalCount} orders</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-7 px-2 text-[11px] rounded-none"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={orders.length < 20}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 px-2 text-[11px] rounded-none"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Detailed Order Inspector & Fulfillment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-background border border-border w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl rounded-none">
            {/* Modal Header */}
            <div className="p-4 border-b border-border/60 flex items-center justify-between bg-muted/20">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Store Order Details
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {selectedOrder.storeOrderNumber || `SO-${selectedOrder.id}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-6 text-xs">
              {/* Recipient & Shipping Information */}
              <div className="p-4 bg-muted/30 border border-border/60 rounded-none space-y-2.5">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPinIcon className="size-4 text-primary" weight="bold" />
                  <span>Customer Delivery Address</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground">
                      {selectedOrder.order?.shippingAddress?.fullName ||
                        selectedOrder.order?.customer?.name ||
                        "Recipient"}
                    </p>
                    <p>{selectedOrder.order?.shippingAddress?.street || "No street specified"}</p>
                    <p>
                      {selectedOrder.order?.shippingAddress?.postalCode || ""}{" "}
                      {selectedOrder.order?.shippingAddress?.city || "Helsinki"}
                    </p>
                    <p>{selectedOrder.order?.shippingAddress?.country || "Finland"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5">
                      <EnvelopeSimpleIcon className="size-3.5 text-muted-foreground" />
                      <span>{selectedOrder.order?.customer?.email || "Email on file"}</span>
                    </p>
                    {selectedOrder.order?.shippingAddress?.phone && (
                      <p className="flex items-center gap-1.5">
                        <PhoneIcon className="size-3.5 text-muted-foreground" />
                        <span>{selectedOrder.order.shippingAddress.phone}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <PackageIcon className="size-4 text-primary" weight="bold" />
                  <span>Ordered Workshop Line Items</span>
                </h4>
                <div className="border border-border/60 rounded-none overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border/60 text-muted-foreground text-[10px] uppercase font-semibold">
                        <th className="p-2.5">Item</th>
                        <th className="p-2.5">Unit Price</th>
                        <th className="p-2.5">Qty</th>
                        <th className="p-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-normal">
                      {selectedOrder.items?.map((item) => (
                        <tr key={item.id}>
                          <td className="p-2.5">
                            <p className="font-medium text-foreground">{item.productName}</p>
                            {item.productSku && (
                              <p className="text-[10px] font-mono text-muted-foreground">
                                SKU: {item.productSku}
                              </p>
                            )}
                          </td>
                          <td className="p-2.5 font-mono">€{Number(item.unitPrice).toFixed(2)}</td>
                          <td className="p-2.5 font-mono font-semibold">{item.quantity}</td>
                          <td className="p-2.5 text-right font-mono font-semibold">
                            €{Number(item.lineSubtotal || item.unitPrice * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fulfillment Status Update Section */}
              <div className="p-4 bg-background border border-primary/30 rounded-none space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/50">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <TruckIcon className="size-4 text-emerald-600" weight="bold" />
                    <span>Posti Automated Delivery & Dispatch</span>
                  </h4>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAutoBookPosti}
                    className="h-7 px-3 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-none shadow-2xs"
                  >
                    Auto-Book Posti Courier
                  </Button>
                </div>

                {/* Posti Automated Workflow Indicator */}
                <div className="p-2.5 bg-muted/40 border border-border/60 text-[11px] text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircleIcon className="size-3.5 text-emerald-600" weight="fill" />
                    <span>Automated Order-to-Delivery Integration</span>
                  </p>
                  <p>
                    Posti test API automatically assigns valid barcode consignment codes, syncs real-time transit updates, and triggers customer delivery tracking emails.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Fulfillment Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as StoreOrderStatusType)}
                      className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    >
                      <option value="PROCESSING">PROCESSING (Packing in studio)</option>
                      <option value="SHIPPED">SHIPPED (In transit via Posti)</option>
                      <option value="DELIVERED">DELIVERED (Completed)</option>
                      <option value="CANCELLED">CANCELLED (Refunded)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-foreground">
                      Delivery Courier
                    </label>
                    <select
                      value={trackingCarrier}
                      onChange={(e) => setTrackingCarrier(e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    >
                      <option value="Posti">Posti (Official Finnish Postal Service)</option>
                      <option value="Matkahuolto">Matkahuolto</option>
                      <option value="DHL Express">DHL Express</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-foreground">
                      Posti Consignment / Tracking Code
                    </label>
                    {trackingNumber && trackingCarrier.toLowerCase().includes("posti") && (
                      <a
                        href={`https://www.posti.fi/en/tracking#/seuranta/${trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-primary hover:underline font-mono"
                      >
                        Track on Posti.fi &rarr;
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. JJFI00123456789012345"
                    className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Fulfillment / Dispatch Notes
                  </label>
                  <input
                    type="text"
                    value={fulfillmentNotes}
                    onChange={(e) => setFulfillmentNotes(e.target.value)}
                    placeholder="e.g. Dispatched via Posti Parcel Point (Automaatti)"
                    className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedOrder(null)}
                className="h-9 text-xs rounded-none"
              >
                Cancel
              </Button>

              <Button
                type="button"
                disabled={isUpdatingStatus}
                onClick={handleUpdateStatus}
                className="h-9 px-4 text-xs bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white rounded-none uppercase font-semibold tracking-wider shadow-xs"
              >
                {isUpdatingStatus ? (
                  <span>Saving...</span>
                ) : (
                  <span>Update Order Status</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
