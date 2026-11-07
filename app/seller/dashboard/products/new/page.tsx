"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PackageIcon,
  CurrencyEurIcon,
  ImageIcon,
  SparkleIcon,
  CheckCircleIcon,
  PaperPlaneTiltIcon,
  FloppyDiskIcon,
  TrashIcon,
  PlusIcon,
  InfoIcon,
  SlidersHorizontalIcon,
  ListBulletsIcon,
  PencilSimpleLineIcon,
} from "@phosphor-icons/react";
import { useSellerAuth } from "@/lib/seller-auth-context";
import { sellerDashboardApi } from "@/resources/apis/seller-dashboard.api";
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

export default function NewProductPage() {
  const router = useRouter();
  const { store } = useSellerAuth();

  // Categories list
  const [categories, setCategories] = React.useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form states
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [price, setPrice] = React.useState<number | string>(49.0);
  const [vatRate, setVatRate] = React.useState<number>(env.defaultVatRate);
  const [vatIncluded, setVatIncluded] = React.useState(true);
  const [trackInventory, setTrackInventory] = React.useState(true);
  const [stockQuantity, setStockQuantity] = React.useState<number>(10);
  const [lowStockThreshold, setLowStockThreshold] = React.useState<number>(3);

  // Specifications
  const [materials, setMaterials] = React.useState("");
  const [dimensions, setDimensions] = React.useState("");
  const [careInstructions, setCareInstructions] = React.useState("");
  const [origin, setOrigin] = React.useState(
    store && "address" in store ? (store as unknown as { address?: string }).address || "Aleksanterinkatu 15, 00100 Helsinki, Finland" : "Aleksanterinkatu 15, 00100 Helsinki, Finland"
  );

  // Etsy-Style Buyer Personalization
  const [allowPersonalization, setAllowPersonalization] = React.useState(false);
  const [personalizationPrompt, setPersonalizationPrompt] = React.useState(
    "Enter custom engraving, monogram, or gift message instructions (max 30 characters):"
  );

  // Images state
  const [imageUrl, setImageUrl] = React.useState("");
  const [images, setImages] = React.useState<Array<{ url: string; altText?: string; isPrimary: boolean }>>([
    {
      url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      altText: "Handcrafted artisan product photo",
      isPrimary: true,
    },
  ]);

  // Variants state (multi-dimensional options)
  const [showVariants, setShowVariants] = React.useState(false);
  const [variants, setVariants] = React.useState<VariantFormItem[]>([]);

  // Load categories
  React.useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await sellerDashboardApi.getCategories();
        setCategories(cats || []);
        if (cats && cats.length > 0) {
          setCategoryId(cats[0].id);
        }
      } catch {
        // Fallback demo categories
        setCategories([
          { id: "c1", name: "Handmade & Crafts", slug: "crafts" },
          { id: "c2", name: "Oivaly Home & Living", slug: "home" },
          { id: "c3", name: "Finnish Design & Art", slug: "design" },
        ]);
      }
    }
    loadCategories();
  }, []);

  // Quick SKU generator
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

  // Real-time Earnings & Payout Calculation
  const numPrice = Number(price) || 0;
  const customerPrice = vatIncluded ? numPrice : numPrice * (1 + vatRate / 100);
  const netPriceBeforeVat = vatIncluded ? numPrice / (1 + vatRate / 100) : numPrice;
  const estimatedVat = customerPrice - netPriceBeforeVat;
  const platformFee = numPrice * 0.10;
  const sellerTakeHome = Math.max(0, netPriceBeforeVat - platformFee);

  // Handle Form Submission
  const handleSubmit = async (submitForReview: boolean) => {
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
            price: v.price !== undefined ? Number(v.price) : numPrice,
            stockQuantity: Number(v.stockQuantity) || 0,
            lowStockThreshold: Number(v.lowStockThreshold) || lowStockThreshold,
          }))
          : [
            {
              sku: sku.trim() || undefined,
              price: numPrice,
              stockQuantity: stockQuantity,
              lowStockThreshold: lowStockThreshold,
            },
          ];

      const created = await sellerDashboardApi.createProduct(
        {
          name: name.trim(),
          description: fullDescription || undefined,
          categoryId: categoryId || undefined,
          sku: sku.trim() || undefined,
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
        },
        store?.id
      );

      if (submitForReview) {
        try {
          await sellerDashboardApi.submitProductForReview(created.id, store?.id);
          toast.success(`Product "${created.name}" submitted for Platform Admin review!`);
        } catch {
          toast.warning("Product created as draft. Review submission requires admin activation.");
        }
      } else {
        toast.success(`Product "${created.name}" saved as DRAFT!`);
      }

      router.push("/seller/dashboard/products");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create product listing";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground tracking-tight">
              Create New Product Listing
            </h1>
            <p className="text-xs text-muted-foreground">
              Define pricing, Finnish VAT rates, selectable options, and craftsmanship specifications.
            </p>
          </div>
        </div>

        {/* Action Buttons Top */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => handleSubmit(false)}
            className="h-9 text-xs rounded-none border-border"
          >
            <FloppyDiskIcon className="size-3.5 mr-1.5" />
            <span>Save Draft</span>
          </Button>

          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(true)}
            className="h-9 px-4 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white rounded-none uppercase text-xs font-semibold tracking-wider"
          >
            <PaperPlaneTiltIcon className="size-3.5 mr-1.5" />
            <span>Submit for Review</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Form (2 Cols) + Calculator / Summary (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form Sections (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <PackageIcon className="size-4 text-primary" weight="bold" />
              <span>General Listing Details</span>
            </h2>

            {/* Product Title */}
            <div className="space-y-1.5">
              <label htmlFor="prod-name" className="block text-xs font-semibold text-foreground">
                Product Title <span className="text-destructive">*</span>
              </label>
              <input
                id="prod-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ceramic Baking Ramekin Set Oven Safe or iPhone 15 Pro"
                className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Category & SKU row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="prod-cat" className="block text-xs font-semibold text-foreground">
                  Marketplace Category
                </label>
                <select
                  id="prod-cat"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="prod-sku" className="block text-xs font-semibold text-foreground">
                    Base SKU Code
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSku}
                    className="text-[10px] text-primary hover:underline font-medium"
                  >
                    Auto-generate
                  </button>
                </div>
                <input
                  id="prod-sku"
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="OIV-CERAMIC-001"
                  className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="prod-desc" className="block text-xs font-semibold text-foreground">
                Artisan Story &amp; Description
              </label>
              <textarea
                id="prod-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your handmade item, artisanal techniques, finish, and design heritage..."
                className="w-full p-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Finnish VAT */}
          <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CurrencyEurIcon className="size-4 text-emerald-600" weight="bold" />
              <span>Pricing &amp; Finnish VAT (ALV)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Base Price */}
              <div className="space-y-1.5">
                <label htmlFor="prod-price" className="block text-xs font-semibold text-foreground">
                  Listing Base Price (€) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    €
                  </span>
                  <input
                    id="prod-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-10 pl-8 pr-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              {/* Finnish VAT Rate */}
              <div className="space-y-1.5">
                <label htmlFor="prod-vat" className="block text-xs font-semibold text-foreground">
                  Finnish VAT Rate (ALV)
                </label>
                <select
                  id="prod-vat"
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                >
                  <option value={25.5}>25.5% (Standard Finnish ALV)</option>
                  <option value={14.0}>14.0% (Reduced: Food &amp; Groceries)</option>
                  <option value={10.0}>10.0% (Cultural, Books, Artwork)</option>
                  <option value={0.0}>0.0% (Exempt / Reverse Charge)</option>
                </select>
              </div>
            </div>

            {/* VAT Included Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={vatIncluded}
                  onChange={(e) => setVatIncluded(e.target.checked)}
                  className="size-4 rounded-none border-border text-primary focus:ring-primary"
                />
                <span className="text-xs text-foreground font-medium">
                  Price already includes Finnish VAT (Standard B2C Retail)
                </span>
              </label>
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
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ListBulletsIcon className="size-4 text-primary" weight="bold" />
              <span>Specifications &amp; Craftsmanship (Displayed in Product Tabs)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="spec-materials" className="block text-xs font-semibold text-foreground">
                  Materials &amp; Composition
                </label>
                <input
                  id="spec-materials"
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="e.g. Stoneware clay, food-safe glaze"
                  className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="spec-dim" className="block text-xs font-semibold text-foreground">
                  Dimensions &amp; Capacity
                </label>
                <input
                  id="spec-dim"
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. Ø 9.5 cm × H 5.2 cm (Volume: ~220 ml)"
                  className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="spec-care" className="block text-xs font-semibold text-foreground">
                  Care &amp; Usage Instructions
                </label>
                <input
                  id="spec-care"
                  type="text"
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  placeholder="e.g. Oven safe to 250°C, microwave & dishwasher safe"
                  className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="spec-origin" className="block text-xs font-semibold text-foreground">
                  Workshop Origin
                </label>
                <input
                  id="spec-origin"
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Aleksanterinkatu 15, 00100 Helsinki, Finland"
                  className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
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
                <label htmlFor="pers-prompt" className="block text-xs font-semibold text-foreground">
                  Instructions for Buyer (Displayed on product page before Add to Cart)
                </label>
                <input
                  id="pers-prompt"
                  type="text"
                  value={personalizationPrompt}
                  onChange={(e) => setPersonalizationPrompt(e.target.value)}
                  placeholder="e.g. Enter name or initials to hand-engrave on the base (max 30 characters)"
                  className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* Section 6: Inventory & Workshop Stock */}
          <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <PackageIcon className="size-4 text-amber-600" weight="bold" />
              <span>Workshop Inventory</span>
            </h2>

            <div className="flex items-center justify-between pb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={trackInventory}
                  onChange={(e) => setTrackInventory(e.target.checked)}
                  className="size-4 rounded-none border-border text-primary focus:ring-primary"
                />
                <span className="text-xs text-foreground font-medium">
                  Track stock reservations for this item
                </span>
              </label>
            </div>

            {trackInventory && !showVariants && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
                <div className="space-y-1.5">
                  <label htmlFor="stock-qty" className="block text-xs font-semibold text-foreground">
                    Available Workshop Quantity
                  </label>
                  <input
                    id="stock-qty"
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="low-threshold" className="block text-xs font-semibold text-foreground">
                    Low Stock Warning Threshold
                  </label>
                  <input
                    id="low-threshold"
                    type="number"
                    min="0"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 7: Imagery & Product Gallery */}
          <div className="p-5 bg-background border border-border/80 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ImageIcon className="size-4 text-primary" weight="bold" />
              <span>Media &amp; Gallery</span>
            </h2>

            {/* Image input & add */}
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste high-res image URL (e.g. Unsplash or CDN)..."
                className="flex-1 h-10 px-3 text-xs bg-background border border-border rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button
                type="button"
                onClick={handleAddImage}
                size="sm"
                className="h-10 px-4 bg-muted hover:bg-muted/80 text-foreground text-xs rounded-none border border-border"
              >
                <PlusIcon className="size-3.5 mr-1" />
                <span>Add Image</span>
              </Button>
            </div>

            {/* Gallery thumbnails */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
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
          </div>
        </div>

        {/* Right Column: Real-Time Earnings Calculator (1 Col Sticky) */}
        <div className="space-y-6">
          <div className="p-5 bg-background border border-border/80 shadow-xs rounded-none sticky top-20 space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border/60">
              <SparkleIcon className="size-4 text-emerald-600" weight="fill" />
              <span>Earnings &amp; Payout Engine</span>
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
                  Estimated Finnish VAT ({vatRate}%)
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
                <span>Oivaly Platform Fee (10%)</span>
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
                    What you actually receive into your bank account
                  </span>
                </div>
                <span className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">
                  €{sellerTakeHome.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Guarantee Box */}
            <div className="mt-4 p-3 bg-muted/40 border border-border/60 rounded-none text-[11px] text-muted-foreground space-y-1.5">
              <div className="flex items-start gap-2">
                <InfoIcon className="size-3.5 text-primary shrink-0 mt-0.5" />
                <p>
                  Funds are secured on Oivaly and automatically disbursed to your verified bank account after order fulfillment.
                </p>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="pt-3 space-y-2">
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit(true)}
                className="w-full h-11 bg-brand-deep-forest hover:bg-brand-deep-forest/90 text-white rounded-none uppercase text-xs font-semibold tracking-wider shadow-xs"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <PaperPlaneTiltIcon className="size-4" weight="bold" />
                    <span>Submit Listing for Review</span>
                  </span>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleSubmit(false)}
                className="w-full h-9 text-xs rounded-none border-border"
              >
                <FloppyDiskIcon className="size-3.5 mr-1.5" />
                <span>Save as Draft</span>
              </Button>

              <p className="text-[10px] text-muted-foreground text-center pt-1 leading-tight">
                All seller listings are reviewed and published by a Platform Administrator before becoming visible on the marketplace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
