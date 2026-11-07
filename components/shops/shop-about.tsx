import * as React from "react";
import {
  IdentificationBadgeIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeIcon,
  BuildingsIcon,
  ReceiptIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Store } from "@/resources/interfaces/store.interface";

export interface ShopAboutProps {
  store: Store;
}

export function ShopAbout({ store }: ShopAboutProps) {
  const hasBusinessDetails = Boolean(
    store.legalBusinessName ||
      store.businessId ||
      store.vatId ||
      store.address ||
      store.phone ||
      store.websiteUrl
  );

  return (
    <section
      id="about"
      aria-labelledby="about-maker-heading"
      className="scroll-mt-32 pt-12 border-t border-border/70"
    >
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block mb-1">
            Studio & Craft
          </span>
          <h2
            id="about-maker-heading"
            className="font-heading text-xl sm:text-2xl font-semibold text-foreground tracking-tight"
          >
            About {store.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Public Description / Story */}
          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {store.description ? (
              <p className="whitespace-pre-line text-foreground/90 font-normal">
                {store.description}
              </p>
            ) : (
              <p className="italic">
                The maker has not yet provided a detailed public studio biography. All items from {store.name} are curated directly through Oivaly.
              </p>
            )}

            <div className="p-4 bg-brand-pale-sage/30 border border-brand-sage/20 text-xs text-foreground/80 space-y-1 mt-4">
              <p className="font-semibold text-brand-deep-forest">
                Direct Artisan Connection
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When you place an order with {store.name}, your items are prepared, inspected, and shipped directly from their dedicated studio to your doorstep.
              </p>
            </div>
          </div>

          {/* Right Column: Authoritative Business & Contact Information */}
          {hasBusinessDetails && (
            <div className="lg:col-span-5 bg-card border border-border/80 p-5 space-y-4">
              <div className="border-b border-border/60 pb-2.5">
                <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                  <IdentificationBadgeIcon className="size-4 text-primary" aria-hidden="true" />
                  <span>Public Business Information</span>
                </h3>
              </div>

              <dl className="text-xs space-y-3">
                {store.legalBusinessName && (
                  <div>
                    <dt className="text-muted-foreground text-[11px] font-medium flex items-center gap-1.5">
                      <BuildingsIcon className="size-3 text-muted-foreground shrink-0" aria-hidden="true" />
                      <span>Registered Business Name</span>
                    </dt>
                    <dd className="font-medium text-foreground mt-0.5">
                      {store.legalBusinessName}
                    </dd>
                  </div>
                )}

                {store.businessId && (
                  <div>
                    <dt className="text-muted-foreground text-[11px] font-medium flex items-center gap-1.5">
                      <ReceiptIcon className="size-3 text-muted-foreground shrink-0" aria-hidden="true" />
                      <span>Finnish Business ID (Y-tunnus)</span>
                    </dt>
                    <dd className="font-mono text-foreground mt-0.5">
                      {store.businessId}
                    </dd>
                  </div>
                )}

                {store.vatId && (
                  <div>
                    <dt className="text-muted-foreground text-[11px] font-medium">
                      VAT Identification Number
                    </dt>
                    <dd className="font-mono text-foreground mt-0.5">
                      {store.vatId}
                    </dd>
                  </div>
                )}

                {store.address && (
                  <div>
                    <dt className="text-muted-foreground text-[11px] font-medium flex items-center gap-1.5">
                      <MapPinIcon className="size-3 text-muted-foreground shrink-0" aria-hidden="true" />
                      <span>Studio & Dispatch Address</span>
                    </dt>
                    <dd className="text-foreground mt-0.5">
                      {store.address}
                    </dd>
                  </div>
                )}

                {store.phone && (
                  <div>
                    <dt className="text-muted-foreground text-[11px] font-medium flex items-center gap-1.5">
                      <PhoneIcon className="size-3 text-muted-foreground shrink-0" aria-hidden="true" />
                      <span>Customer Support Inquiries</span>
                    </dt>
                    <dd className="text-foreground mt-0.5">
                      <a
                        href={`tel:${store.phone.replace(/\s+/g, "")}`}
                        className="text-primary hover:underline"
                      >
                        {store.phone}
                      </a>
                    </dd>
                  </div>
                )}

                {store.websiteUrl && (
                  <div>
                    <dt className="text-muted-foreground text-[11px] font-medium flex items-center gap-1.5">
                      <GlobeIcon className="size-3 text-muted-foreground shrink-0" aria-hidden="true" />
                      <span>Official Maker Website</span>
                    </dt>
                    <dd className="text-foreground mt-0.5 truncate">
                      <a
                        href={store.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate block"
                      >
                        {store.websiteUrl.replace(/^https?:\/\//, "")}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
