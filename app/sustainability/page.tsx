import type { Metadata } from "next";
import Link from "next/link";
import {
  LeafIcon,
  ArrowsClockwiseIcon,
  HandshakeIcon,
  TreeEvergreenIcon,
  ShieldCheckIcon,
  SparkleIcon,
  CheckCircleIcon,
  DropIcon,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Sustainability & Ethical Craftsmanship | Oivaly",
  description:
    "Explore Oivaly's ecological manifesto: natural Nordic raw materials, 100% plastic-free packaging, circular Posti logistics, and 90% direct payouts to creators.",
};

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Sustainability</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
            <LeafIcon className="size-4" weight="fill" />
            <span>The Oivaly Ecological Charter &bull; 2026</span>
          </div>
          <h1 className="text-3xl sm:text-6xl font-serif font-bold text-foreground tracking-tight leading-tight">
            Crafted for Generations, Not Landfills.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            In an era of mass-produced, petroleum-derived disposable items, Oivaly is anchored in the traditional Nordic philosophy of <strong className="text-foreground font-serif">kestävyys</strong> — longevity, ecological restraint, and profound respect for living natural materials.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-card border border-border/80 space-y-3">
            <div className="size-12 rounded-full bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground flex items-center justify-center">
              <TreeEvergreenIcon className="size-6" weight="fill" />
            </div>
            <h2 className="text-lg font-serif font-bold text-foreground">
              1. Renewable Regional Raw Materials
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our artisans work exclusively with traceable Scandinavian materials: PEFC-certified curly birch and slow-grown kelo pine from Finnish boreal forests, unbleached Baltic flax linen, natural stoneware clay, and organic sheep wool from local farms. We disallow petroleum-based synthetic resins and disposable virgin plastics.
            </p>
          </div>

          <div className="p-8 bg-card border border-border/80 space-y-3">
            <div className="size-12 rounded-full bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground flex items-center justify-center">
              <ArrowsClockwiseIcon className="size-6" weight="bold" />
            </div>
            <h2 className="text-lg font-serif font-bold text-foreground">
              2. 100% Plastic-Free Studio Packaging
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every seller on Oivaly adheres to our zero-plastic packaging standard. Delicate ceramics and glassware are cushioned in biodegradable unbleached kraft honeycomb wrap, recycled paper fill, and sealed with water-activated paper gum tape. 100% curbside recyclable throughout Europe.
            </p>
          </div>

          <div className="p-8 bg-card border border-border/80 space-y-3">
            <div className="size-12 rounded-full bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground flex items-center justify-center">
              <HandshakeIcon className="size-6" weight="fill" />
            </div>
            <h2 className="text-lg font-serif font-bold text-foreground">
              3. Living Artisan Wages (90% Direct)
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mainstream commercial retail markups typically claim 50% to 75% of an artisan&apos;s product price. Oivaly operates with a transparent 10% platform fee, returning 90% of every euro directly to the maker&apos;s studio to sustain regional craft guilds and rural workshops.
            </p>
          </div>

          <div className="p-8 bg-card border border-border/80 space-y-3">
            <div className="size-12 rounded-full bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground flex items-center justify-center">
              <ShieldCheckIcon className="size-6" weight="fill" />
            </div>
            <h2 className="text-lg font-serif font-bold text-foreground">
              4. Carbon-Smart Posti Delivery
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By partnering with Posti Finland, parcels move through high-efficiency smart locker networks (SmartPost) and renewable electric/biofuel transport fleets. Pickups from local lockers reduce last-mile courier carbon emissions by up to 40% across Finnish municipalities.
            </p>
          </div>
        </div>

        {/* Detailed Material Standards Matrix */}
        <div className="space-y-6">
          <div className="border-b border-border/60 pb-3">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              Our Material Standards & Traceability
            </h2>
            <p className="text-xs text-muted-foreground">What goes into the handcrafted pieces offered on Oivaly.</p>
          </div>

          <div className="border border-border/80 bg-card overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/40 border-b border-border/80 text-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Material</th>
                    <th className="p-3.5">Approved Provenance</th>
                    <th className="p-3.5">Prohibited In Studio</th>
                    <th className="p-3.5">Longevity Life</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="p-3.5 font-bold text-foreground">Nordic Birch & Pine</td>
                    <td className="p-3.5 text-muted-foreground">PEFC/FSC certified Finnish forests, storm-fallen kelo wood</td>
                    <td className="p-3.5 text-rose-600 dark:text-rose-400">Polyurethane varnishes, chemical wood preservatives</td>
                    <td className="p-3.5 font-medium text-foreground">50+ Years (Heirloom)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-foreground">Studio Ceramics</td>
                    <td className="p-3.5 text-muted-foreground">High-fire stoneware (1220°C+), riverbed Finnish clays</td>
                    <td className="p-3.5 text-rose-600 dark:text-rose-400">Lead, cadmium, or food-unsafe glazes</td>
                    <td className="p-3.5 font-medium text-foreground">Generations</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-foreground">Flax Linen & Wool</td>
                    <td className="p-3.5 text-muted-foreground">OEKO-TEX certified Baltic linen, unbleached virgin sheep wool</td>
                    <td className="p-3.5 text-rose-600 dark:text-rose-400">Polyester blends, acrylic fibers, microplastics</td>
                    <td className="p-3.5 font-medium text-foreground">20+ Years (Softens over time)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-foreground">Artisan Metals</td>
                    <td className="p-3.5 text-muted-foreground">100% recycled 925 sterling silver, solid brass, Nordic sea amber</td>
                    <td className="p-3.5 text-rose-600 dark:text-rose-400">Nickel alloys, mystery plated pot-metal</td>
                    <td className="p-3.5 font-medium text-foreground">Indefinite (Recyclable)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Circular Economy Impact Callout */}
        <div className="border border-border/80 bg-brand-warm-ivory dark:bg-card p-8 sm:p-12 space-y-4">
          <h3 className="text-xl font-serif font-bold text-foreground">
            Repair, Restore & Cherish
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            In traditional Finnish households, a well-made kuksa or wool throw is never discarded when aged. Wooden pieces are re-oiled with cold-pressed linseed; linen is re-stitched with sashiko-style darning; ceramic chips are sealed with natural pine gum. Our makers offer lifetime repair advice for all original creations.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-primary">
            <Link href="/categories" className="hover:underline">Browse Natural Materials &rarr;</Link>
            <Link href="/makers" className="hover:underline">Meet the Regional Guilds &rarr;</Link>
            <Link href="/shipping" className="hover:underline">Learn About Posti SmartPost &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
