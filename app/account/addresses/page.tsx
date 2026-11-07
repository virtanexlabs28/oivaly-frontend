"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  PlusIcon,
  PencilSimpleIcon,
  TrashIcon,
  StarIcon,
  HouseLineIcon,
} from "@phosphor-icons/react";
import { addressesApi } from "@/resources/apis/addresses.api";
import type { CustomerAddress } from "@/resources/interfaces/address.interface";
import { addressSchema, type AddressFormValues } from "@/resources/schemas/address.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AddressesPage() {
  const [addresses, setAddresses] = React.useState<CustomerAddress[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<CustomerAddress | null>(null);

  const fetchAddresses = React.useCallback(async () => {
    try {
      const data = await addressesApi.getAddresses();
      setAddresses(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      streetAddress: "",
      apartment: "",
      city: "",
      postalCode: "",
      country: "FI",
      isDefault: false,
    },
  });

  const isDefaultChecked = watch("isDefault");

  const openAddDialog = () => {
    setEditingAddress(null);
    reset({
      fullName: "",
      phone: "",
      streetAddress: "",
      apartment: "",
      city: "",
      postalCode: "",
      country: "FI",
      isDefault: addresses.length === 0,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (addr: CustomerAddress) => {
    setEditingAddress(addr);
    reset({
      fullName: addr.fullName,
      phone: addr.phone,
      streetAddress: addr.streetAddress,
      apartment: addr.apartment || "",
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country || "FI",
      isDefault: addr.isDefault,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: AddressFormValues) => {
    try {
      if (editingAddress) {
        await addressesApi.updateAddress(editingAddress.id, {
          fullName: values.fullName.trim(),
          phone: values.phone.trim(),
          streetAddress: values.streetAddress.trim(),
          apartment: values.apartment?.trim() || null,
          city: values.city.trim(),
          postalCode: values.postalCode.trim(),
          country: values.country.trim().toUpperCase(),
          isDefault: values.isDefault,
        });
        toast.success("Delivery address updated successfully!");
      } else {
        await addressesApi.createAddress({
          fullName: values.fullName.trim(),
          phone: values.phone.trim(),
          streetAddress: values.streetAddress.trim(),
          apartment: values.apartment?.trim() || null,
          city: values.city.trim(),
          postalCode: values.postalCode.trim(),
          country: values.country.trim().toUpperCase(),
          isDefault: values.isDefault,
        });
        toast.success("New delivery address saved!");
      }
      setIsDialogOpen(false);
      await fetchAddresses();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save address. Please verify the fields.";
      toast.error(message);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressesApi.setDefaultAddress(id);
      toast.success("Default delivery address updated!");
      await fetchAddresses();
    } catch {
      toast.error("Failed to update default address.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this delivery address?")) return;

    try {
      await addressesApi.deleteAddress(id);
      toast.success("Address removed from your address book.");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      toast.error("Failed to remove address.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground tracking-tight">
            Saved Delivery Addresses
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your destination shipping addresses for seamless checkout.
          </p>
        </div>
        <Button onClick={openAddDialog} size="sm" className="text-xs h-9 gap-1.5 self-start sm:self-auto">
          <PlusIcon className="size-3.5" aria-hidden="true" />
          <span>Add New Address</span>
        </Button>
      </div>

      {/* Address List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card border border-border/70 p-5 space-y-2 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-card border border-dashed border-border/80 p-8 sm:p-12 text-center space-y-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-pale-sage text-primary mx-auto">
            <HouseLineIcon className="size-6" aria-hidden="true" />
          </div>
          <h3 className="font-heading text-base font-semibold text-foreground">
            No Addresses Saved Yet
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Add your residential or studio shipping address to speed up your checkout with independent makers.
          </p>
          <div className="pt-2">
            <Button onClick={openAddDialog} size="sm" className="text-xs">
              <PlusIcon className="size-3.5 mr-1" aria-hidden="true" />
              <span>Add Your First Address</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-card border p-5 flex flex-col justify-between transition-all ${
                addr.isDefault
                  ? "border-primary/60 ring-1 ring-primary/20 shadow-xs"
                  : "border-border/80 hover:border-border"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-heading text-sm font-semibold text-foreground">
                    {addr.fullName}
                  </h3>
                  {addr.isDefault && (
                    <Badge
                      variant="outline"
                      className="bg-brand-pale-sage/60 text-brand-deep-forest border-brand-sage/40 text-[10px] gap-1 shrink-0"
                    >
                      <StarIcon className="size-3 text-primary" weight="fill" aria-hidden="true" />
                      <span>Default</span>
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-muted-foreground space-y-0.5 leading-relaxed">
                  <p>{addr.streetAddress}</p>
                  {addr.apartment && <p>{addr.apartment}</p>}
                  <p>
                    {addr.postalCode} {addr.city}
                  </p>
                  <p className="font-medium text-foreground/80">{addr.country}</p>
                  <p className="pt-1 text-[11px] text-muted-foreground">{addr.phone}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <div>
                  {!addr.isDefault && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(addr.id)}
                      className="h-7 px-2 text-[11px] text-primary hover:text-primary hover:underline"
                    >
                      Set as default
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(addr)}
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    aria-label={`Edit address for ${addr.fullName}`}
                  >
                    <PencilSimpleIcon className="size-3.5 mr-1" aria-hidden="true" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(addr.id)}
                    className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    aria-label={`Delete address for ${addr.fullName}`}
                  >
                    <TrashIcon className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Address Dialog Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-heading text-lg font-semibold text-foreground">
              {editingAddress ? "Edit Delivery Address" : "Add New Delivery Address"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Please enter accurate recipient details for parcel postal transit.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Recipient Full Name */}
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-xs font-medium text-foreground">
                Recipient Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="e.g. Aino Virtanen"
                disabled={isSubmitting}
                className="text-xs h-9"
                aria-invalid={Boolean(errors.fullName)}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-[11px] text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <Label htmlFor="dialog-phone" className="text-xs font-medium text-foreground">
                Phone Number (for Delivery SMS)
              </Label>
              <Input
                id="dialog-phone"
                type="tel"
                placeholder="+358 40 123 4567"
                disabled={isSubmitting}
                className="text-xs h-9"
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-[11px] text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* Street Address */}
            <div className="space-y-1">
              <Label htmlFor="streetAddress" className="text-xs font-medium text-foreground">
                Street Address
              </Label>
              <Input
                id="streetAddress"
                type="text"
                placeholder="e.g. Mannerheimintie 12 B"
                disabled={isSubmitting}
                className="text-xs h-9"
                aria-invalid={Boolean(errors.streetAddress)}
                {...register("streetAddress")}
              />
              {errors.streetAddress && (
                <p className="text-[11px] text-destructive">{errors.streetAddress.message}</p>
              )}
            </div>

            {/* Apartment / Suite (Optional) */}
            <div className="space-y-1">
              <Label htmlFor="apartment" className="text-xs font-medium text-foreground">
                Apartment / Suite / Entrance (Optional)
              </Label>
              <Input
                id="apartment"
                type="text"
                placeholder="e.g. Apt 4B"
                disabled={isSubmitting}
                className="text-xs h-9"
                {...register("apartment")}
              />
            </div>

            {/* Postal Code & City */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="postalCode" className="text-xs font-medium text-foreground">
                  Postal Code
                </Label>
                <Input
                  id="postalCode"
                  type="text"
                  placeholder="e.g. 00100"
                  disabled={isSubmitting}
                  className="text-xs h-9"
                  aria-invalid={Boolean(errors.postalCode)}
                  {...register("postalCode")}
                />
                {errors.postalCode && (
                  <p className="text-[11px] text-destructive">{errors.postalCode.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="city" className="text-xs font-medium text-foreground">
                  City
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="e.g. Helsinki"
                  disabled={isSubmitting}
                  className="text-xs h-9"
                  aria-invalid={Boolean(errors.city)}
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-[11px] text-destructive">{errors.city.message}</p>
                )}
              </div>
            </div>

            {/* Country ISO code */}
            <div className="space-y-1">
              <Label htmlFor="country" className="text-xs font-medium text-foreground">
                Country (2-Letter ISO Code)
              </Label>
              <Input
                id="country"
                type="text"
                maxLength={2}
                defaultValue="FI"
                disabled={isSubmitting}
                className="text-xs h-9 uppercase w-24"
                aria-invalid={Boolean(errors.country)}
                {...register("country")}
              />
              {errors.country && (
                <p className="text-[11px] text-destructive">{errors.country.message}</p>
              )}
            </div>

            {/* Default Address Checkbox */}
            <div className="pt-1 flex items-center space-x-2">
              <Checkbox
                id="dialog-default"
                checked={isDefaultChecked}
                onCheckedChange={(checked) => setValue("isDefault", Boolean(checked))}
                disabled={isSubmitting}
              />
              <Label htmlFor="dialog-default" className="text-xs text-foreground font-normal">
                Set as my default shipping address
              </Label>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? "Saving..." : editingAddress ? "Save Changes" : "Save Address"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
