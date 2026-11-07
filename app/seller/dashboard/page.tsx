"use client";

import * as React from "react";
import Link from "next/link";
import {
  CurrencyEurIcon,
  ShoppingBagOpenIcon,
  PackageIcon,
  TrendUpIcon,
  ArrowRightIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
  WarningIcon,
  StorefrontIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSellerAuth } from "@/lib/seller-auth-context";
import { sellerDashboardApi } from "@/resources/apis/seller-dashboard.api";
import type {
  StoreSalesSummary,
  StoreSalesAnalyticsItem,
  StoreOrderItemDetail,
  StoreProductItem,
} from "@/resources/interfaces/seller-dashboard.interface";
import { Button } from "@/components/ui/button";

export default function SellerOverviewPage() {
  const { store, seller } = useSellerAuth();

  const [isLoading, setIsLoading] = React.useState(true);
  const [salesSummary, setSalesSummary] = React.useState<StoreSalesSummary | null>(null);
  const [analyticsData, setAnalyticsData] = React.useState<StoreSalesAnalyticsItem[]>([]);
  const [recentOrders, setRecentOrders] = React.useState<StoreOrderItemDetail[]>([]);
  const [recentProducts, setRecentProducts] = React.useState<StoreProductItem[]>([]);
  const [period, setPeriod] = React.useState<"7d" | "30d">("7d");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const loadDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [summaryRes, analyticsRes, ordersRes, productsRes] = await Promise.allSettled([
        sellerDashboardApi.getSalesSummary(store?.id),
        sellerDashboardApi.getSalesAnalytics(period, store?.id),
        sellerDashboardApi.getOrders({ limit: 5, storeId: store?.id }),
        sellerDashboardApi.getProducts({ limit: 4, storeId: store?.id }),
      ]);

      if (summaryRes.status === "fulfilled") {
        setSalesSummary(summaryRes.value);
      }
      if (analyticsRes.status === "fulfilled" && Array.isArray(analyticsRes.value)) {
        setAnalyticsData(analyticsRes.value);
      } else {
        // Fallback default sample trend if new store
        setAnalyticsData([
          { date: "Mon", revenue: 0, orders: 0, earnings: 0 },
          { date: "Tue", revenue: 0, orders: 0, earnings: 0 },
          { date: "Wed", revenue: 0, orders: 0, earnings: 0 },
          { date: "Thu", revenue: 0, orders: 0, earnings: 0 },
          { date: "Fri", revenue: 0, orders: 0, earnings: 0 },
          { date: "Sat", revenue: 0, orders: 0, earnings: 0 },
          { date: "Sun", revenue: 0, orders: 0, earnings: 0 },
        ]);
      }

      if (ordersRes.status === "fulfilled" && ordersRes.value?.data) {
        setRecentOrders(ordersRes.value.data);
      }

      if (productsRes.status === "fulfilled" && productsRes.value?.data) {
        setRecentProducts(productsRes.value.data);
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false);
    }
  }, [store?.id, period]);

  React.useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Derived metrics
  const netEarnings = salesSummary?.netEarnings ?? 0;
  const grossSales = salesSummary?.grossSales ?? 0;
  const totalOrders = salesSummary?.totalOrdersCount ?? recentOrders.length;
  const availablePayout = salesSummary?.availablePayoutBalance ?? 0;

  return (
    <div className="space-y-8">
      {/* Studio Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground tracking-tight" suppressHydrationWarning>
              {mounted ? (store?.name || "Artisan Workshop") : "Artisan Workshop"}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20" suppressHydrationWarning>
              {mounted ? (store?.status || "ACTIVE") : "ACTIVE"}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground" suppressHydrationWarning>
            Welcome back, {mounted ? (seller?.name || "Artisan") : "Artisan"}. Here is your workshop activity, order queue, and revenue overview.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 text-xs rounded-none border-border"
          >
            <Link href="/seller/dashboard/orders">
              <ShoppingBagOpenIcon className="size-3.5 mr-1.5" />
              <span>Manage Orders</span>
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="h-9 text-xs bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white rounded-none uppercase font-semibold tracking-wider shadow-xs"
          >
            <Link href="/seller/dashboard/products/new">
              <PlusIcon className="size-3.5 mr-1.5" weight="bold" />
              <span>Add Listing</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Earnings Card */}
        <div className="p-5 bg-background border border-border/80 shadow-xs rounded-none relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Net Earnings (90%)
            </span>
            <div className="size-8 rounded-none bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <CurrencyEurIcon className="size-4.5" weight="bold" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {isLoading ? (
                <span className="inline-block w-20 h-6 bg-muted animate-pulse rounded" />
              ) : (
                `€${netEarnings.toFixed(2)}`
              )}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
              <span>After 10% marketplace commission</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Gross Sales Card */}
        <div className="p-5 bg-background border border-border/80 shadow-xs rounded-none relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Gross Sales Volume
            </span>
            <div className="size-8 rounded-none bg-primary/10 text-primary flex items-center justify-center">
              <TrendUpIcon className="size-4.5" weight="bold" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {isLoading ? (
                <span className="inline-block w-20 h-6 bg-muted animate-pulse rounded" />
              ) : (
                `€${grossSales.toFixed(2)}`
              )}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Total checkout value
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Total Orders Card */}
        <div className="p-5 bg-background border border-border/80 shadow-xs rounded-none relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Fulfillment Orders
            </span>
            <div className="size-8 rounded-none bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <ShoppingBagOpenIcon className="size-4.5" weight="bold" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {isLoading ? (
                <span className="inline-block w-12 h-6 bg-muted animate-pulse rounded" />
              ) : (
                totalOrders
              )}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Orders requiring fulfillment
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Available Payout Card */}
        <div className="p-5 bg-background border border-border/80 shadow-xs rounded-none relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Available Payout
            </span>
            <div className="size-8 rounded-none bg-blue-500/10 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <CheckCircleIcon className="size-4.5" weight="bold" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
              {isLoading ? (
                <span className="inline-block w-20 h-6 bg-muted animate-pulse rounded" />
              ) : (
                `€${availablePayout.toFixed(2)}`
              )}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Ready for Finnish IBAN transfer
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Sales Analytics Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Left: Recharts Revenue Area Chart (2 Cols on lg, 3 Cols on xl) */}
        <div className="lg:col-span-2 xl:col-span-3 p-5 bg-background border border-border/80 shadow-xs rounded-none flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Revenue & Sales Trends
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Visual analysis of studio gross volume & net artisan earnings
              </p>
            </div>
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-none border border-border">
              <button
                type="button"
                onClick={() => setPeriod("7d")}
                className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  period === "7d"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => setPeriod("30d")}
                className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  period === "30d"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyticsData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3721" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1E3721" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="#8BA490"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="#8BA490"
                  tickFormatter={(val) => `€${val}`}
                />
                <Tooltip
                  formatter={(value: any) => [`€${Number(value || 0).toFixed(2)}`, "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#142416",
                    borderColor: "#223B25",
                    color: "#fff",
                    borderRadius: "2px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2D5030"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Quick Studio Catalog Status (1 Col) */}
        <div className="p-5 bg-background border border-border/80 shadow-xs rounded-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h2 className="text-sm font-semibold text-foreground">
                Artisan Listings
              </h2>
              <Link
                href="/seller/dashboard/products"
                className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <span>View all</span>
                <ArrowRightIcon className="size-3" />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {recentProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  <PackageIcon className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p>No listings added yet.</p>
                  <p className="text-[11px] mt-1">Start showcasing your handmade Nordic items.</p>
                  <Button
                    asChild
                    size="sm"
                    className="mt-3 text-xs bg-brand-deep-forest text-white rounded-none"
                  >
                    <Link href="/seller/dashboard/products/new">Create First Product</Link>
                  </Button>
                </div>
              ) : (
                recentProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-none border border-border/60 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-10 rounded-none bg-muted shrink-0 overflow-hidden border border-border flex items-center justify-center">
                        {prod.images?.[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={prod.images[0].url}
                            alt={prod.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <PackageIcon className="size-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          €{Number(prod.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-none shrink-0 ${
                        prod.status === "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                          : prod.status === "PENDING_REVIEW"
                          ? "bg-amber-500/10 text-amber-800 dark:text-amber-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {prod.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <Link
              href="/seller/dashboard/products/new"
              className="w-full py-2 px-3 border border-dashed border-border hover:border-primary text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
            >
              <PlusIcon className="size-3.5" />
              <span>Create New Listing</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Fulfillment Orders Table */}
      <div className="p-5 bg-background border border-border/80 shadow-xs rounded-none">
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Recent Fulfillment Orders
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Customer orders requiring fulfillment and shipping dispatch
            </p>
          </div>
          <Link
            href="/seller/dashboard/orders"
            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
          >
            <span>Inspect All Orders</span>
            <ArrowUpRightIcon className="size-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            <ShoppingBagOpenIcon className="size-9 mx-auto text-muted-foreground/30 mb-2" />
            <p className="font-semibold text-foreground">No recent orders</p>
            <p className="text-[11px] mt-0.5">
              Customer orders placed for your studio listings will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-medium uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Order Number</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-normal">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-foreground">
                      {ord.storeOrderNumber || ord.id.slice(0, 8)}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {ord.order?.customer?.name || "Marketplace Guest"}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {ord.items?.length || 1} item(s)
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-foreground">
                      €{Number(ord.grandTotal || ord.subtotal || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-semibold ${
                          ord.status === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                            : ord.status === "SHIPPED"
                            ? "bg-blue-500/10 text-blue-800 dark:text-blue-300"
                            : ord.status === "PROCESSING"
                            ? "bg-amber-500/10 text-amber-800 dark:text-amber-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-xs hover:bg-muted rounded-none"
                      >
                        <Link href="/seller/dashboard/orders">Fulfill</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
