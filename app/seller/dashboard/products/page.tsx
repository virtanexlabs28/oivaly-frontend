"use client";

import * as React from "react";
import Link from "next/link";
import {
  PackageIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DotsThreeVerticalIcon,
  PaperPlaneTiltIcon,
  ArchiveIcon,
  TrashIcon,
  PencilSimpleIcon,
  CheckCircleIcon,
  ClockCountdownIcon,
  WarningCircleIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";
import { useSellerAuth } from "@/lib/seller-auth-context";
import { sellerDashboardApi } from "@/resources/apis/seller-dashboard.api";
import type {
  StoreProductItem,
  ProductStatus,
} from "@/resources/interfaces/seller-dashboard.interface";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function SellerProductsPage() {
  const { store } = useSellerAuth();

  const [products, setProducts] = React.useState<StoreProductItem[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<ProductStatus | "ALL">("ALL");
  const [page, setPage] = React.useState(1);

  const loadProducts = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const backendStatus =
        statusFilter === "ALL"
          ? undefined
          : statusFilter === "PENDING_REVIEW"
            ? ("SUBMITTED" as ProductStatus)
            : statusFilter;

      const res = await sellerDashboardApi.getProducts({
        page,
        limit: 20,
        status: backendStatus,
        search: search.trim() || undefined,
        storeId: store?.id,
      });

      setProducts(res.data || []);
      setTotalCount(res.total || 0);
    } catch {
      toast.error("Failed to load store products");
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, search, store?.id]);

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle Submit for Review
  const handleSubmitForReview = async (id: string, name: string) => {
    try {
      await sellerDashboardApi.submitProductForReview(id, store?.id);
      toast.success(`"${name}" submitted for marketplace administrator review`);
      loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      toast.error(msg);
    }
  };

  // Handle Publish Approved Product to Marketplace
  const handlePublish = async (id: string, name: string) => {
    try {
      await sellerDashboardApi.publishProduct(id, store?.id);
      toast.success(`"${name}" is now live and published on the marketplace!`);
      loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Publishing failed";
      toast.error(msg);
    }
  };


  // Handle Archive
  const handleArchive = async (id: string, name: string) => {
    try {
      await sellerDashboardApi.archiveProduct(id, store?.id);
      toast.success(`"${name}" archived`);
      loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Archive failed";
      toast.error(msg);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await sellerDashboardApi.deleteProduct(id, store?.id);
      toast.success(`"${name}" deleted permanently`);
      loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Deletion failed";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & New Product CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground tracking-tight">
            Products & Inventory
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your Nordic artisan listings, pricing, VAT rates, and inventory stock levels.
          </p>
        </div>

        <Button
          asChild
          size="sm"
          className="h-9 px-4 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white rounded-none uppercase text-xs font-semibold tracking-wider shadow-xs self-start sm:self-auto"
        >
          <Link href="/seller/dashboard/products/new">
            <PlusIcon className="size-3.5 mr-1.5" weight="bold" />
            <span>Add New Product</span>
          </Link>
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-background p-3 border border-border/80 shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { label: "All", value: "ALL" },
              { label: "Published", value: "PUBLISHED" },
              { label: "In Review", value: "SUBMITTED" },
              { label: "Drafts", value: "DRAFT" },
              { label: "Archived", value: "ARCHIVED" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-none whitespace-nowrap transition-colors ${statusFilter === tab.value
                ? "bg-brand-deep-forest text-white font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, SKU..."
            className="w-full h-8.5 pl-8 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-background border border-border/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            <div className="size-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            <p>Loading artisan catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-xs text-muted-foreground space-y-3">
            <PackageIcon className="size-10 mx-auto text-muted-foreground/30" />
            <div>
              <p className="font-semibold text-foreground text-sm">No products found</p>
              <p className="text-[11px] mt-0.5">
                {search || statusFilter !== "ALL"
                  ? "Try clearing your filters or search keyword."
                  : "Start listing your handcrafted Finnish products."}
              </p>
            </div>
            <Button
              asChild
              size="sm"
              className="text-xs bg-brand-deep-forest text-white rounded-none"
            >
              <Link href="/seller/dashboard/products/new">Add Product Now</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Price & VAT</th>
                  <th className="py-3 px-3">Inventory</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-normal">
                {products.map((prod) => {
                  const primaryImg =
                    prod.images?.find((img) => img.isPrimary)?.url || prod.images?.[0]?.url;

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-muted/15 transition-colors group"
                    >
                      {/* Product Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="size-12 rounded-none bg-muted shrink-0 overflow-hidden border border-border flex items-center justify-center">
                            {primaryImg ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={primaryImg}
                                alt={prod.name}
                                className="size-full object-cover"
                              />
                            ) : (
                              <PackageIcon className="size-5 text-muted-foreground/40" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <p className="font-medium text-foreground truncate">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {prod.category?.name || "Handcrafted Goods"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground">
                        {prod.sku || "—"}
                      </td>

                      {/* Price & Finnish VAT */}
                      <td className="py-3 px-3">
                        <span className="font-mono font-semibold text-foreground block">
                          €{Number(prod.price).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {prod.vatRate !== undefined
                            ? `${prod.vatRate}% ALV ${prod.vatIncluded ? "(incl.)" : "(+tax)"}`
                            : "Standard VAT"}
                        </span>
                      </td>

                      {/* Inventory / Stock */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {(() => {
                            const stockCount = prod.variants?.length
                              ? prod.variants.reduce((acc, v) => acc + Number(v.stockQuantity || 0), 0)
                              : (prod.totalStock ?? 0);
                            return (
                              <>
                                <span
                                  className={`size-2 rounded-full ${prod.trackInventory === false || stockCount > 5
                                    ? "bg-emerald-500"
                                    : stockCount > 0
                                      ? "bg-amber-500"
                                      : "bg-rose-500"
                                    }`}
                                />
                                <span className="font-mono text-xs text-foreground">
                                  {prod.trackInventory === false
                                    ? "Always in stock"
                                    : `${stockCount} in stock`}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col items-start gap-1">
                          {prod.status === "PUBLISHED" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                              <CheckCircleIcon className="size-3" weight="bold" />
                              <span>PUBLISHED</span>
                            </span>
                          ) : prod.status === "SUBMITTED" || prod.status === "PENDING_REVIEW" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                              <ClockCountdownIcon className="size-3" weight="bold" />
                              <span>IN REVIEW</span>
                            </span>
                          ) : prod.status === "APPROVED" ? (
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-semibold bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-500/20">
                                <CheckCircleIcon className="size-3" weight="bold" />
                                <span>APPROVED</span>
                              </span>
                              <Button
                                size="sm"
                                onClick={() => handlePublish(prod.id, prod.name)}
                                className="h-6 px-2 text-[10px] font-semibold rounded-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                              >
                                Publish
                              </Button>
                            </div>
                          ) : prod.status === "DRAFT" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                              <span>DRAFT</span>
                            </span>
                          ) : prod.status === "REJECTED" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                              <WarningCircleIcon className="size-3" weight="bold" />
                              <span>REJECTED</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                              <span>{prod.status}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions Dropdown */}
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 rounded-none text-muted-foreground hover:text-foreground"
                            >
                              <DotsThreeVerticalIcon className="size-4" weight="bold" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 text-xs">
                            {/* Edit Listing (Always available for ALL products including Published) */}
                            <DropdownMenuItem asChild className="cursor-pointer font-medium">
                              <Link href={`/seller/dashboard/products/${prod.id}/edit`}>
                                <PencilSimpleIcon className="size-3.5 mr-2 text-primary" />
                                <span>Edit Listing</span>
                              </Link>
                            </DropdownMenuItem>


                            {/* Publish to Marketplace (if Approved by Admin) */}
                            {prod.status === "APPROVED" && (
                              <DropdownMenuItem
                                onClick={() => handlePublish(prod.id, prod.name)}
                                className="cursor-pointer text-emerald-700 dark:text-emerald-300 font-semibold"
                              >
                                <CheckCircleIcon className="size-3.5 mr-2 text-emerald-600" weight="fill" />
                                <span>Publish to Marketplace</span>
                              </DropdownMenuItem>
                            )}

                            {/* Submit for Review (if Draft or Rejected) */}
                            {(prod.status === "DRAFT" || prod.status === "REJECTED") && (
                              <DropdownMenuItem
                                onClick={() => handleSubmitForReview(prod.id, prod.name)}
                                className="cursor-pointer text-amber-700 dark:text-amber-300"
                              >
                                <PaperPlaneTiltIcon className="size-3.5 mr-2" />
                                <span>Submit for Review</span>
                              </DropdownMenuItem>
                            )}

                            {/* View live in store (if Published) */}
                            {prod.status === "PUBLISHED" && (
                              <DropdownMenuItem asChild className="cursor-pointer">
                                <Link
                                  href={`/products/${prod.slug || prod.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ArrowSquareOutIcon className="size-3.5 mr-2 text-primary" />
                                  <span>View in Storefront</span>
                                </Link>
                              </DropdownMenuItem>
                            )}

                            {/* Archive (if Published) */}
                            {prod.status === "PUBLISHED" && (
                              <DropdownMenuItem
                                onClick={() => handleArchive(prod.id, prod.name)}
                                className="cursor-pointer text-amber-700 dark:text-amber-300"
                              >
                                <ArchiveIcon className="size-3.5 mr-2" />
                                <span>Archive Listing</span>
                              </DropdownMenuItem>
                            )}

                            {/* Delete (if Draft, Rejected, or Archived) */}
                            {(prod.status === "DRAFT" || prod.status === "ARCHIVED" || prod.status === "REJECTED") && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(prod.id, prod.name)}
                                  className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                  <TrashIcon className="size-3.5 mr-2" />
                                  <span>Delete Listing</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Count & Pagination */}
        <div className="p-3 border-t border-border/60 bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {products.length} of {totalCount} listings</span>
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
              disabled={products.length < 20}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 px-2 text-[11px] rounded-none"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
