"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  PackageIcon,
  CurrencyEurIcon,
  ImageIcon,
  SparkleIcon,
  CheckCircleIcon,
  FloppyDiskIcon,
  TrashIcon,
  PlusIcon,
  InfoIcon,
  ArrowSquareOutIcon,
  ClockCountdownIcon,
  WarningCircleIcon,
  PaperPlaneTiltIcon,
  LockKeyIcon,
  SlidersHorizontalIcon,
  ListBulletsIcon,
  PencilSimpleLineIcon,
} from "@phosphor-icons/react";
import { useSellerAuth } from "@/lib/seller-auth-context";
import { sellerDashboardApi } from "@/resources/apis/seller-dashboard.api";
import { StoreProductItem } from "@/resources/interfaces/seller-dashboard.interface";
import { env } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VariantFormItem {
  id?: string;
  size?: string;
  color?: string;
  model?: string;
  attributeKey?: string;
  attributeValue?: string;
  sku?: string;
  price?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
}

function parseProductSpecs(description: string = "") {
  let materials = "";
  let dimensions = "";
  let careInstructions = "";
  let origin = "";
  let personalizationPrompt = "";
  let allowPersonalization = false;

  const matMatch = description.match(/- \*\*Materials:\*\* ([^\n\r]+)/);
  if (matMatch) materials = matMatch[1].trim();

  const dimMatch = description.match(/- \*\*Dimensions:\*\* ([^\n\r]+)/);
  if (dimMatch) dimensions = dimMatch[1].trim();

  const careMatch = description.match(/- \*\*Care Instructions:\*\* ([^\n\r]+)/);
  if (careMatch) careInstructions = careMatch[1].trim();

  const origMatch = description.match(/- \*\*Workshop Origin:\*\* ([^\n\r]+)/);
  if (origMatch) origin = origMatch[1].trim();

  const persMatch = description.match(/- \*\*Personalization Instructions:\*\* ([^\n\r]+)/);
  if (persMatch) {
    personalizationPrompt = persMatch[1].trim();
    allowPersonalization = true;
  }

  // Clean description without the ### Specifications block
  const cleanDescription = description.split(/### Specifications/i)[0].trim();

  return {
    cleanDescription,
    materials,
    dimensions,
    careInstructions,
    origin,
    personalizationPrompt,
    allowPersonalization,
  };
}

function formatProductDescription(
  cleanDesc: string,
  specs: {
    materials?: string;
    dimensions?: string;
    careInstructions?: string;
    origin?: string;
    allowPersonalization?: boolean;
    personalizationPrompt?: string;
  }
) {
  const parts: string[] = [];
  if (cleanDesc.trim()) {
    parts.push(cleanDesc.trim());
  }

  const specLines: string[] = [];
  if (specs.materials?.trim()) {
    specLines.push(`- **Materials:** ${specs.materials.trim()}`);
  }
  if (specs.dimensions?.trim()) {
    specLines.push(`- **Dimensions:** ${specs.dimensions.trim()}`);
  }
  if (specs.careInstructions?.trim()) {
    specLines.push(`- **Care Instructions:** ${specs.careInstructions.trim()}`);
  }
  if (specs.origin?.trim()) {
    specLines.push(`- **Workshop Origin:** ${specs.origin.trim()}`);
  }
  if (specs.allowPersonalization && specs.personalizationPrompt?.trim()) {
    specLines.push(`- **Personalization Instructions:** ${specs.personalizationPrompt.trim()}`);
  }

  if (specLines.length > 0) {
    parts.push(`### Specifications\n${specLines.join("\n")}`);
  }

  return parts.join("\n\n");
}

function EditProductForm() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params?.id;
  const { store } = useSellerAuth();

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [originalProduct, setOriginalProduct] = React.useState<StoreProductItem | null>(null);

  // Real Categories from database
  const [categories, setCategories] = React.useState<Array<{ id: string; name: string; slug: string }>>([]);

  // Form states populated strictly from database
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [price, setPrice] = React.useState<number | string>(0);
  const [vatRate, setVatRate] = React.useState<number>(env.defaultVatRate);
  const [vatIncluded, setVatIncluded] = React.useState(true);
  const [trackInventory, setTrackInventory] = React.useState(true);
  const [stockQuantity, setStockQuantity] = React.useState<number>(0);
  const [lowStockThreshold, setLowStockThreshold] = React.useState<number>(3);

  // Specifications
  const [materials, setMaterials] = React.useState("");
  const [dimensions, setDimensions] = React.useState("");
  const [careInstructions, setCareInstructions] = React.useState("");
  const [origin, setOrigin] = React.useState("Aleksanterinkatu 15, 00100 Helsinki, Finland");

  // Etsy-Style Buyer Personalization
  const [allowPersonalization, setAllowPersonalization] = React.useState(false);
  const [personalizationPrompt, setPersonalizationPrompt] = React.useState(
    "Enter custom engraving, monogram, or gift message instructions (max 30 characters):"
  );

  // Variants state (multi-dimensional options)
  const [showVariants, setShowVariants] = React.useState(false);
  const [variants, setVariants] = React.useState<VariantFormItem[]>([]);

  // Images state populated strictly from database
  const [imageUrl, setImageUrl] = React.useState("");
  const [images, setImages] = React.useState<Array<{ url: string; altText?: string; isPrimary: boolean }>>([]);

  // Load real product & categories from database
  React.useEffect(() => {
    if (!productId) return;

    async function loadData() {
      setIsLoading(true);
      try {
        const [prod, fetchedCategories] = await Promise.all([
          sellerDashboardApi.getProduct(productId, store?.id),
          sellerDashboardApi.getCategories().catch(() => []),
        ]);

        setOriginalProduct(prod);

        // Ensure product's existing category is present in category list
        let activeCategories = Array.isArray(fetchedCategories) ? [...fetchedCategories] : [];
        if (prod.category && !activeCategories.some((c) => c.id === prod.category?.id)) {
          activeCategories = [
            {
              id: prod.category.id,
              name: prod.category.name,
              slug: prod.category.slug,
            },
            ...activeCategories,
          ];
        }
        setCategories(activeCategories);

        // Populate form strictly from real database product entity
        setName(prod.name || "");

        // Parse structured specifications from description
        const parsed = parseProductSpecs(prod.description || "");
        setDescription(parsed.cleanDescription);
        setMaterials(parsed.materials);
        setDimensions(parsed.dimensions);
        setCareInstructions(parsed.careInstructions);
        setOrigin(
          parsed.origin ||
          (store && "address" in store
            ? (store as unknown as { address?: string }).address || "Aleksanterinkatu 15, 00100 Helsinki, Finland"
            : "Aleksanterinkatu 15, 00100 Helsinki, Finland")
        );
        setAllowPersonalization(parsed.allowPersonalization);
        if (parsed.personalizationPrompt) {
          setPersonalizationPrompt(parsed.personalizationPrompt);
        }

        setCategoryId(prod.categoryId || prod.category?.id || (activeCategories[0]?.id ?? ""));
        setSku(prod.sku || "");
        setPrice(prod.price !== undefined && prod.price !== null ? Number(prod.price) : 0);
        setVatRate(
          prod.vatRate !== undefined && prod.vatRate !== null
            ? Number(prod.vatRate)
            : env.defaultVatRate
        );
        setVatIncluded(prod.vatIncluded ?? true);
        setTrackInventory(prod.trackInventory ?? true);

        // Derive stock quantity and variants from database variants
        if (prod.variants && prod.variants.length > 0) {
          const totalStock = prod.variants.reduce(
            (sum, v) => sum + (Number(v.stockQuantity) || 0),
            0
          );
          setStockQuantity(totalStock);
          setLowStockThreshold(Number(prod.variants[0].lowStockThreshold) || 3);

          const hasMultipleOrNamedVariants =
            prod.variants.length > 1 ||
            Boolean(prod.variants[0]?.size || prod.variants[0]?.color || prod.variants[0]?.model);

          setShowVariants(hasMultipleOrNamedVariants);
          setVariants(
            prod.variants.map((v) => ({
              id: v.id,
              size: v.size || undefined,
              color: v.color || undefined,
              model: v.model || undefined,
              attributeKey: v.attributeKey || undefined,
              attributeValue: v.attributeValue || undefined,
              sku: v.sku || undefined,
              price: v.price !== null && v.price !== undefined ? Number(v.price) : undefined,
              stockQuantity: Number(v.stockQuantity) || 0,
              lowStockThreshold: Number(v.lowStockThreshold) || 3,
            }))
          );
        } else {
          setStockQuantity(Number(prod.totalStock) || 0);
          setLowStockThreshold(3);
          setShowVariants(false);
          setVariants([]);
        }

        // Images strictly from database (empty if none uploaded)
        if (prod.images && prod.images.length > 0) {
          setImages(
            prod.images.map((img) => ({
              url: img.url,
              altText: img.altText || prod.name,
              isPrimary: Boolean(img.isPrimary),
            }))
          );
        } else {
          setImages([]);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load product details from database";
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [productId, store?.id]);

  // Quick SKU generator (only available if product is not published)
  const handleGenerateSku = () => {
    const prefix = name ? name.slice(0, 3).toUpperCase() : "OIV";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setSku(`${prefix}-${randomNum}`);
    toast.info("Generated SKU code");
  };

  // Add Image
  const handleAddImage = () => {
    if (!imageUrl.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }
    setImages((prev) => [
      ...prev,
      {
        url: imageUrl.trim(),
        altText: name || "Product image",
        isPrimary: prev.length === 0,
      },
    ]);
    setImageUrl("");
    toast.success("Image added to gallery");
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  // Set Primary Image
  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  // Presets for Variants
  const handleApplyCeramicsPreset = () => {
    const baseP = Number(price) || 38;
    const baseSku = sku || "CRM";
    setShowVariants(true);
    setVariants([
      {
        size: "Set of 2",
        color: "Sandstone White",
        sku: `${baseSku}-S2-WHT`,
        price: baseP,
        stockQuantity: 10,
        lowStockThreshold: 3,
      },
      {
        size: "Set of 4",
        color: "Sandstone White",
        sku: `${baseSku}-S4-WHT`,
        price: Math.round(baseP * 1.85),
        stockQuantity: 8,
        lowStockThreshold: 2,
      },
      {
        size: "Set of 6",
        color: "Sandstone White",
        sku: `${baseSku}-S6-WHT`,
        price: Math.round(baseP * 2.65),
        stockQuantity: 4,
        lowStockThreshold: 2,
      },
      {
        size: "Set of 2",
        color: "Nordic Sage",
        sku: `${baseSku}-S2-SGE`,
        price: baseP,
        stockQuantity: 6,
        lowStockThreshold: 2,
      },
      {
        size: "Set of 4",
        color: "Nordic Sage",
        sku: `${baseSku}-S4-SGE`,
        price: Math.round(baseP * 1.85),
        stockQuantity: 5,
        lowStockThreshold: 2,
      },
    ]);
    if (!materials) setMaterials("High-fire stoneware clay, non-toxic food-safe mineral glaze");
    if (!dimensions) setDimensions("Ø 9.5 cm × H 5.2 cm (Volume: ~220 ml / 7.5 oz)");
    if (!careInstructions) setCareInstructions("Oven safe to 250°C (480°F), microwave & dishwasher safe. Avoid sudden thermal shocks.");
    toast.success("Applied Ceramics & Tableware options preset");
  };

  const handleApplyTechPreset = () => {
    const baseP = Number(price) || 799;
    const baseSku = sku || "TECH";
    setShowVariants(true);
    setVariants([
      {
        size: "128GB",
        color: "Space Black",
        model: "128GB",
        sku: `${baseSku}-128-BLK`,
        price: baseP,
        stockQuantity: 8,
        lowStockThreshold: 2,
      },
      {
        size: "256GB",
        color: "Space Black",
        model: "256GB",
        sku: `${baseSku}-256-BLK`,
        price: baseP + 120,
        stockQuantity: 5,
        lowStockThreshold: 2,
      },
      {
        size: "512GB",
        color: "Space Black",
        model: "512GB",
        sku: `${baseSku}-512-BLK`,
        price: baseP + 260,
        stockQuantity: 3,
        lowStockThreshold: 2,
      },
      {
        size: "128GB",
        color: "Natural Titanium",
        model: "128GB",
        sku: `${baseSku}-128-TIT`,
        price: baseP,
        stockQuantity: 6,
        lowStockThreshold: 2,
      },
      {
        size: "256GB",
        color: "Natural Titanium",
        model: "256GB",
        sku: `${baseSku}-256-TIT`,
        price: baseP + 120,
        stockQuantity: 4,
        lowStockThreshold: 2,
      },
    ]);
    if (!materials) setMaterials("Aerospace-grade Aluminum, Ceramic Shield front, textured matte glass back");
    if (!dimensions) setDimensions("147.6 mm × 71.6 mm × 7.80 mm (171 grams)");
    if (!careInstructions) setCareInstructions("IP68 water & dust resistance. Clean with soft, slightly damp, lint-free cloth.");
    toast.success("Applied Electronics / Tech options preset");
  };

  const handleAddCustomVariant = () => {
    setShowVariants(true);
    const baseP = Number(price) || 49;
    setVariants((prev) => [
      ...prev,
      {
        size: "Standard",
        color: "Natural",
        sku: sku ? `${sku}-${prev.length + 1}` : undefined,
        price: baseP,
        stockQuantity: 5,
        lowStockThreshold: 2,
      },
    ]);
  };

  const handleUpdateVariant = (index: number, field: keyof VariantFormItem, val: unknown) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: val } : v))
    );
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const isPublished = originalProduct?.status === "PUBLISHED";
  const currentStatus = originalProduct?.status;

  // Real-time Earnings Calculation based on configured platform fee
  const numPrice = Number(price) || 0;
  const commissionRate = (env.platformCommissionPercent || 10) / 100;
  const customerPrice = vatIncluded ? numPrice : numPrice * (1 + vatRate / 100);
  const netPriceBeforeVat = vatIncluded ? numPrice / (1 + vatRate / 100) : numPrice;
  const estimatedVat = customerPrice - netPriceBeforeVat;
  const platformFee = numPrice * commissionRate;
  const sellerTakeHome = Math.max(0, netPriceBeforeVat - platformFee);

  // Handle Save
  const handleSave = async (submitForReview = false) => {
    if (!productId || !originalProduct) return;
    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (numPrice <= 0) {
      toast.error("Please provide a valid price greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullDescription = formatProductDescription(description, {
        materials,
        dimensions,
        careInstructions,
        origin,
        allowPersonalization,
        personalizationPrompt,
      });

      const effectiveVariants =
        showVariants && variants.length > 0
          ? variants.map((v, idx) => ({
            size: v.size?.trim() || undefined,
            color: v.color?.trim() || undefined,
            model: v.model?.trim() || v.size?.trim() || undefined,
            attributeKey: v.attributeKey?.trim() || (v.size ? "Size/Set" : undefined),
            attributeValue: v.attributeValue?.trim() || v.size?.trim() || undefined,
            sku: v.sku?.trim() || (sku ? `${sku}-${idx + 1}` : undefined),
            price: v.price !== undefined && v.price !== null ? Number(v.price) : numPrice,
            stockQuantity: Number(v.stockQuantity) || 0,
            lowStockThreshold: Number(v.lowStockThreshold) || lowStockThreshold,
          }))
          : [
            {
              sku: isPublished ? originalProduct.sku : (sku.trim() || undefined),
              price: numPrice,
              stockQuantity: Number(stockQuantity) || 0,
              lowStockThreshold: Number(lowStockThreshold) || 3,
            },
          ];

      const updatePayload: Record<string, unknown> = {
        name: name.trim(),
        description: fullDescription || undefined,
        price: numPrice,
        vatRate: vatRate,
        vatIncluded: vatIncluded,
        trackInventory: trackInventory,
        images: images.map((img, idx) => ({
          url: img.url,
          altText: img.altText || name,
          isPrimary: img.isPrimary,
          sortOrder: idx,
        })),
        variants: effectiveVariants,
      };

      // Only allow modifying category and SKU if NOT published
      if (!isPublished) {
        updatePayload.categoryId = categoryId || undefined;
        updatePayload.sku = sku.trim() || undefined;
      }

      const updated = await sellerDashboardApi.updateProduct(
        productId,
        updatePayload,
        store?.id
      );

      if (submitForReview) {
        await sellerDashboardApi.submitProductForReview(productId, store?.id);
        toast.success(`Product "${updated.name}" updated and submitted for Platform Admin review!`);
      } else {
        toast.success(`Product "${updated.name}" updated successfully!`);
      }

      router.push("/seller/dashboard/products");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update product";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs text-muted-foreground space-y-3">
        <div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="font-medium text-foreground">Loading listing details from database...</p>
      </div>
    );
  }

  if (!originalProduct) {
    return (
      <div className="py-24 text-center text-xs text-muted-foreground space-y-3">
        <PackageIcon className="size-12 mx-auto text-muted-foreground/30" />
        <p className="text-base font-semibold text-foreground">Product not found</p>
        <p>The product could not be loaded from database or you do not have permission.</p>
        <Button asChild size="sm" className="bg-brand-deep-forest text-white rounded-none">
          <Link href="/seller/dashboard/products">Back to Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full pb-16">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="size-8 p-0 rounded-none text-muted-foreground hover:text-foreground"
          >
            <Link href="/seller/dashboard/products">
              <ArrowLeftIcon className="size-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground tracking-tight">
                Edit Product Listing
              </h1>
              {currentStatus === "PUBLISHED" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircleIcon className="size-3" weight="fill" />
                  <span>PUBLISHED</span>
                </span>
              ) : currentStatus === "PENDING_REVIEW" || currentStatus === "SUBMITTED" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <ClockCountdownIcon className="size-3" weight="fill" />
                  <span>IN REVIEW</span>
                </span>
              ) : currentStatus === "REJECTED" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <WarningCircleIcon className="size-3" weight="fill" />
                  <span>REJECTED</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                  <span>DRAFT</span>
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Modify pricing, stock reservations, selectable Etsy-grade options, and craftsmanship specifications.
            </p>
          </div>
        </div>

        {/* Action Buttons Top */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isPublished && originalProduct.slug && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 text-xs rounded-none border-border"
            >
              <Link href={`/products/${originalProduct.slug}`} target="_blank">
                <ArrowSquareOutIcon className="size-3.5 mr-1.5" />
                <span>View in Store</span>
              </Link>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => handleSave(false)}
            className="h-9 text-xs rounded-none border-border"
          >
            <FloppyDiskIcon className="size-3.5 mr-1.5" />
            <span>Save Changes</span>
          </Button>

          {currentStatus !== "PUBLISHED" && currentStatus !== "PENDING_REVIEW" && currentStatus !== "SUBMITTED" && (
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave(true)}
              className="h-9 px-4 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white rounded-none uppercase text-xs font-semibold tracking-wider"
            >
              <PaperPlaneTiltIcon className="size-3.5 mr-1.5" />
              <span>Submit for Review</span>
            </Button>
          )}
        </div>
      </div>

      {/* Review / Status Banners */}
      {currentStatus === "PENDING_REVIEW" || currentStatus === "SUBMITTED" ? (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
          <ClockCountdownIcon className="size-4 shrink-0 text-amber-600 mt-0.5" weight="fill" />
          <div>
            <span className="font-semibold">Listing is Pending Administrator Review:</span> You can continue editing prices and imagery, but changes will be evaluated before public listing activation.
          </div>
        </div>
      ) : currentStatus === "DRAFT" ? (
        <div className="p-3.5 bg-muted border border-border text-foreground text-xs flex items-start gap-2.5">
          <InfoIcon className="size-4 shrink-0 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Draft Listing:</span> Visible only in your workshop atelier. Click <strong>Submit for Review</strong> when you are ready for a Platform Administrator to review and publish it.
          </div>
        </div>
      ) : currentStatus === "REJECTED" ? (
        <div className="p-3.5 bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-2.5">
          <WarningCircleIcon className="size-4 shrink-0 text-destructive mt-0.5" weight="fill" />
          <div>
            <span className="font-semibold">Rejection Feedback:</span> {originalProduct.rejectionReason || "Please review the product details, Finnish VAT specifications, or imagery to meet artisan guidelines."}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
              <PackageIcon className="size-4 text-primary" />
              <span>General Listing Details</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Product Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ceramic Baking Ramekin Set Oven Safe or iPhone 15 Pro"
                  className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Artisan Story &amp; Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your handmade item, artisanal techniques, finish, and design heritage..."
                  className="w-full p-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Category Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <span>Marketplace Category</span>
                      {isPublished && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-mono bg-muted/80 px-1.5 py-0.5 border border-border">
                          <LockKeyIcon className="size-3 text-muted-foreground" />
                          <span>LOCKED</span>
                        </span>
                      )}
                    </label>
                  </div>
                  <select
                    value={categoryId}
                    disabled={isPublished}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted/70 disabled:text-muted-foreground disabled:cursor-not-allowed"
                  >
                    {categories.length === 0 && (
                      <option value="">No categories available</option>
                    )}
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SKU Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <span>Artisan SKU Code</span>
                      {isPublished && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-mono bg-muted/80 px-1.5 py-0.5 border border-border">
                          <LockKeyIcon className="size-3 text-muted-foreground" />
                          <span>LOCKED</span>
                        </span>
                      )}
                    </label>
                    {!isPublished && (
                      <button
                        type="button"
                        onClick={handleGenerateSku}
                        className="text-[11px] text-primary hover:underline font-mono"
                      >
                        Regenerate
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={sku}
                    disabled={isPublished}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. OIV-CERAMIC-001"
                    className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none font-mono focus:outline-none focus:ring-1 focus:ring-primary uppercase disabled:bg-muted/70 disabled:text-muted-foreground disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Finnish VAT */}
          <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
              <CurrencyEurIcon className="size-4 text-primary" />
              <span>Pricing &amp; Finnish VAT Compliance</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Customer Price (€ EUR) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">
                    €
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-9 pl-7 pr-3 text-xs bg-background border border-border rounded-none font-mono focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Finnish ALV / VAT Rate (%)
                </label>
                <select
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value={25.5}>25.5% (Finnish Standard 2024+)</option>
                  <option value={24}>24.0% (Legacy Standard)</option>
                  <option value={14}>14.0% (Food &amp; Restaurant)</option>
                  <option value={10}>10.0% (Books, Culture &amp; Transport)</option>
                  <option value={0}>0.0% (VAT Exempt / Export)</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer h-9 px-3 border border-border bg-muted/20">
                  <input
                    type="checkbox"
                    checked={vatIncluded}
                    onChange={(e) => setVatIncluded(e.target.checked)}
                    className="size-4 rounded-none border-border accent-primary"
                  />
                  <span className="text-xs text-foreground font-medium">
                    Price includes Finnish VAT (ALV sisältyy)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Selectable Options & Variants (Etsy Style) */}
          <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <SlidersHorizontalIcon className="size-4 text-primary" weight="bold" />
                <span>Selectable Options &amp; Variants </span>
              </h2>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showVariants}
                  onChange={(e) => {
                    setShowVariants(e.target.checked);
                    if (e.target.checked && variants.length === 0) {
                      handleAddCustomVariant();
                    }
                  }}
                  className="size-4 rounded-none border-border text-primary focus:ring-primary"
                />
                <span className="text-xs font-medium text-foreground">
                  Enable Multiple Options
                </span>
              </label>
            </div>

            {showVariants ? (
              <div className="space-y-4 pt-2">
                {/* 1-Click Option Presets */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-medium">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={handleApplyCeramicsPreset}
                    className="px-2.5 py-1 text-xs border border-border hover:bg-muted font-medium transition-colors"
                  >
                    🍶 Ceramics (Sets &amp; Glazes)
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyTechPreset}
                    className="px-2.5 py-1 text-xs border border-border hover:bg-muted font-medium transition-colors"
                  >
                    📱 Tech / Storage (128G/256G/512G)
                  </button>
                </div>

                {/* Variants Editor Table */}
                <div className="border border-border/70 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-muted/50 border-b border-border/70 text-muted-foreground uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-2.5">Size / Set / Capacity</th>
                        <th className="p-2.5">Color / Glaze</th>
                        <th className="p-2.5">SKU Code</th>
                        <th className="p-2.5">Price (€)</th>
                        <th className="p-2.5">Workshop Stock</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {variants.map((v, idx) => (
                        <tr key={idx} className="hover:bg-muted/20">
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.size || ""}
                              onChange={(e) => handleUpdateVariant(idx, "size", e.target.value)}
                              placeholder="e.g. Set of 4"
                              className="w-full h-8 px-2 text-xs bg-background border border-border rounded-none focus:ring-1 focus:ring-primary"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.color || ""}
                              onChange={(e) => handleUpdateVariant(idx, "color", e.target.value)}
                              placeholder="e.g. Sandstone White"
                              className="w-full h-8 px-2 text-xs bg-background border border-border rounded-none focus:ring-1 focus:ring-primary"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={v.sku || ""}
                              onChange={(e) => handleUpdateVariant(idx, "sku", e.target.value)}
                              placeholder="SKU-S4-WHT"
                              className="w-full h-8 px-2 text-xs bg-background border border-border rounded-none font-mono focus:ring-1 focus:ring-primary"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              step="0.01"
                              value={v.price ?? ""}
                              onChange={(e) =>
                                handleUpdateVariant(idx, "price", Number(e.target.value))
                              }
                              placeholder="Override"
                              className="w-20 h-8 px-2 text-xs bg-background border border-border rounded-none font-mono focus:ring-1 focus:ring-primary"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={v.stockQuantity}
                              onChange={(e) =>
                                handleUpdateVariant(idx, "stockQuantity", Number(e.target.value))
                              }
                              className="w-16 h-8 px-2 text-xs bg-background border border-border rounded-none font-mono focus:ring-1 focus:ring-primary"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(idx)}
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              title="Delete variant"
                            >
                              <TrashIcon className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomVariant}
                  className="h-8 text-xs rounded-none border-border"
                >
                  <PlusIcon className="size-3 mr-1" />
                  <span>Add Another Option</span>
                </Button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                This item has a single standard option. Check &quot;Enable Multiple Options&quot; above to add options such as sizes, color glazes, or set packs.
              </p>
            )}
          </div>

          {/* Section 4: Specifications & Craftsmanship */}
          <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
              <ListBulletsIcon className="size-4 text-primary" weight="bold" />
              <span>Specifications &amp; Craftsmanship (Displayed in Product Tabs)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Materials &amp; Composition
                </label>
                <input
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="e.g. Stoneware clay, food-safe mineral glaze"
                  className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Dimensions &amp; Capacity
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. Ø 9.5 cm × H 5.2 cm (Volume: ~220 ml)"
                  className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Care &amp; Usage Instructions
                </label>
                <input
                  type="text"
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  placeholder="e.g. Oven safe to 250°C, microwave & dishwasher safe"
                  className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Workshop Origin
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Aleksanterinkatu 15, 00100 Helsinki, Finland"
                  className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Buyer Personalization (Etsy Style) */}
          <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <PencilSimpleLineIcon className="size-4 text-primary" weight="bold" />
                <span>Buyer Personalization </span>
              </h2>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allowPersonalization}
                  onChange={(e) => setAllowPersonalization(e.target.checked)}
                  className="size-4 rounded-none border-border text-primary focus:ring-primary"
                />
                <span className="text-xs font-medium text-foreground">
                  Allow Customization
                </span>
              </label>
            </div>

            {allowPersonalization && (
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-foreground">
                  Instructions for Buyer (Displayed on product page before Add to Cart)
                </label>
                <input
                  type="text"
                  value={personalizationPrompt}
                  onChange={(e) => setPersonalizationPrompt(e.target.value)}
                  placeholder="e.g. Enter name or initials to hand-engrave on the base (max 30 characters)"
                  className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* Section 6: Inventory & Stock */}
          <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
              <PackageIcon className="size-4 text-primary" />
              <span>Workshop Inventory &amp; Fulfillment</span>
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trackInventory}
                  onChange={(e) => setTrackInventory(e.target.checked)}
                  className="size-4 rounded-none border-border accent-primary"
                />
                <span className="text-xs text-foreground font-medium">
                  Track workshop inventory count for this product
                </span>
              </label>

              {trackInventory && !showVariants && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Available Stock Quantity <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Remaining handcrafted items ready for dispatch.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Low Stock Threshold Alert
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full h-9 px-3 text-xs bg-background border border-border rounded-none font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Sends restock reminder when stock dips to or below this level.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 7: Imagery & Gallery */}
          <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
              <ImageIcon className="size-4 text-primary" />
              <span>Media &amp; Gallery Showcase</span>
            </h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste direct HTTPS image URL..."
                  className="flex-1 h-9 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImage}
                  size="sm"
                  className="h-9 px-4 text-xs rounded-none border-border"
                >
                  <PlusIcon className="size-3.5 mr-1" />
                  <span>Add URL</span>
                </Button>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`group relative aspect-square border overflow-hidden rounded-none ${img.isPrimary ? "border-primary ring-2 ring-primary/20" : "border-border"
                        }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.altText || `Image ${idx + 1}`}
                        className="size-full object-cover"
                      />

                      {/* Primary Badge */}
                      {img.isPrimary && (
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-brand-deep-forest text-white text-[9px] font-semibold uppercase tracking-wider rounded-none">
                          Cover
                        </span>
                      )}

                      {/* Hover Controls */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="self-end p-1 rounded bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                          title="Remove image"
                        >
                          <TrashIcon className="size-3" />
                        </button>
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(idx)}
                            className="py-1 px-2 bg-white text-black text-[10px] font-semibold uppercase tracking-wider rounded-none hover:bg-gray-100"
                          >
                            Set as Cover
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No images uploaded yet. Add high-resolution photos of your item.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Earnings Summary Sticky */}
        <div className="space-y-6">
          <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4 sticky top-6">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
              <SparkleIcon className="size-4 text-emerald-600" weight="fill" />
              <span>Earnings Engine (ALV &amp; Payout)</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Customer Checkout Price</span>
                <span className="font-mono font-semibold text-foreground">
                  €{customerPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-muted-foreground">
                <span>
                  Estimated Finnish ALV ({vatRate}%)
                  <span className="block text-[10px] text-muted-foreground/75">
                    {vatIncluded ? "(Included in price)" : "(Added at checkout)"}
                  </span>
                </span>
                <span className="font-mono text-muted-foreground">
                  -€{estimatedVat.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-muted-foreground">
                <span>Net Sales Revenue (excl. VAT)</span>
                <span className="font-mono font-medium text-foreground">
                  €{netPriceBeforeVat.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-muted-foreground">
                <span>Oivaly Commission ({(commissionRate * 100).toFixed(0)}%)</span>
                <span className="font-mono text-destructive">
                  -€{platformFee.toFixed(2)}
                </span>
              </div>

              <div className="pt-3 border-t border-border/80 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground block">
                    Seller Net Payout
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Remitted after order fulfillment
                  </span>
                </div>
                <span className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">
                  €{sellerTakeHome.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 space-y-2">
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSave(false)}
                className="w-full h-10 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white rounded-none uppercase text-xs font-semibold tracking-wider"
              >
                {isSubmitting ? (
                  <span>Saving...</span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <FloppyDiskIcon className="size-4" />
                    <span>Save Changes</span>
                  </span>
                )}
              </Button>

              {currentStatus !== "PUBLISHED" && currentStatus !== "PENDING_REVIEW" && currentStatus !== "SUBMITTED" && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => handleSave(true)}
                  className="w-full h-9 text-xs rounded-none border-border"
                >
                  <PaperPlaneTiltIcon className="size-3.5 mr-1.5" />
                  <span>Submit for Review</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditProductFallback() {
  return (
    <div className="py-24 text-center text-xs text-muted-foreground space-y-3">
      <div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
      <p className="font-medium text-foreground">Loading listing editor...</p>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <React.Suspense fallback={<EditProductFallback />}>
      <EditProductForm />
    </React.Suspense>
  );
}
