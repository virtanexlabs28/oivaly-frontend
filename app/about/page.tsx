"use client";

import Link from "next/link";
import Image from "next/image";
import {
  SparkleIcon,
  HeartIcon,
  TreeEvergreenIcon,
  ShieldCheckIcon,
  GlobeIcon,
  StorefrontIcon,
  CompassIcon,
  ScalesIcon,
  BuildingsIcon,
  ClockIcon,
  FlowerIcon,
  HandshakeIcon,
} from "@phosphor-icons/react";

export default function AboutUsPage() {
  const metrics = [
    { label: "PRH Verified Ateliers", value: "100%", sub: "Zero anonymous drop-shippers" },
    { label: "Direct Artisan Take-Home", value: "90%", sub: "Only 10% platform fee" },
    { label: "Plastic-Free Packaging", value: "100%", sub: "FSC paper honeycomb cushioning" },
    { label: "Posti Carbon Compensation", value: "100%", sub: "Fossil-free Posti Green delivery" },
  ];

  const studioStories = [
    {
      region: "Fiskars Village, Uusimaa",
      title: "Centuries of Smithing & Stoneware",
      craft: "Forged Iron & High-Fire Stoneware",
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
      description: "Nestled in the historic ironworks valley of Fiskars, our resident potters and bladesmiths continue traditions dating back to 1649, shaping functional art designed to endure centuries.",
    },
    {
      region: "Turku Archipelago, Southwest Finland",
      title: "Loomed Flax & Maritime Heritage",
      craft: "100% Pure Finnish Flax Linen",
      image: "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80",
      description: "Woven on vintage wooden floor looms, coastal linen pieces soften with every sauna wash, carrying the cool breezes and mineral character of the Finnish archipelago.",
    },
    {
      region: "Rovaniemi, Finnish Lapland",
      title: "Fallen Curly Birch & Reindeer Antler",
      craft: "Traditional Kuksa & Wood Carving",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      description: "Master woodworkers carve traditional kuksa drinking cups from arctic birch burls, harvested ethically without harming living old-growth pine forests.",
    },
  ];

  const leadership = [
    {
      name: "Eveliina Rantala",
      role: "Co-Founder & Head of Curation",
      bio: "Former curator at the Helsinki Design Museum with 15 years dedicated to preserving traditional Nordic craft lineages.",
    },
    {
      name: "Kari Lindholm",
      role: "Head of Sustainable Logistics",
      bio: "Logistics engineer focused on carbon-negative supply chains and circular packaging partnerships with Posti Group.",
    },
    {
      name: "Milla Haataja",
      role: "Artisan Relations Lead",
      bio: "Master ceramicist guiding independent studios through PRH legal verification and small-batch pricing strategy.",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">About Us</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-brand-pale-sage text-brand-deep-forest dark:bg-muted dark:text-foreground">
            <GlobeIcon className="size-4" weight="fill" />
            <span>Rooted in Helsinki, Finland</span>
          </div>
          <h1 className="text-3xl sm:text-6xl font-serif font-bold text-foreground tracking-tight leading-tight">
            The Soul of Nordic Craftsmanship, Preserved and Celebrated.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Oivaly was born from the Finnish word <strong className="text-foreground font-semibold">Oivallus</strong> — the sudden, breathtaking insight when one discovers something genuine, finely formed, and truly necessary. We are an antidote to disposable mass production.
          </p>
        </div>

        {/* Narrative Chapter: The Counter-Movement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center border-t border-border/60 pt-12">
          <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-brand-deep-forest dark:text-primary uppercase tracking-wider">
              <CompassIcon className="size-4" weight="bold" />
              <span>Our Founding Conviction</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              A Living Sanctuary for Independent Ateliers
            </h2>
            <p>
              In an era dominated by hyper-accelerated e-commerce, algorithmic discount loops, and anonymous overseas factories, genuine human craft was being pushed to the margins. Master Finnish ceramicists, wood carvers, and linen weavers spent more time battling predatory 40% retail markups than doing what they love: creating heirloom goods.
            </p>
            <p>
              We established Oivaly in Helsinki to rebuild the bond between discerning collectors and independent makers. When you acquire a piece on Oivaly, you are not ordering a mass-stamped commodity from a distribution center. You are commissioning a piece created with patience, tactile skill, and deep reverence for Nordic nature.
            </p>
          </div>

          <div className="relative aspect-4/3 w-full bg-muted overflow-hidden border border-border/80 shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80"
              alt="Nordic ceramic artisan throwing clay in studio"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* The 4 Core Principles */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              The Four Pillars of Oivaly
            </h2>
            <p className="text-xs text-muted-foreground">
              Every studio on our marketplace commits to these uncompromising standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-card border border-border/80 space-y-3">
              <div className="size-10 rounded-full bg-brand-pale-sage text-brand-deep-forest flex items-center justify-center">
                <ShieldCheckIcon className="size-5" weight="fill" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                1. PRH Verified Origin
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every atelier is officially verified through the Finnish Trade Register (PRH) with an active Y-tunnus. Zero anonymous middlemen.
              </p>
            </div>

            <div className="p-6 bg-card border border-border/80 space-y-3">
              <div className="size-10 rounded-full bg-brand-pale-sage text-brand-deep-forest flex items-center justify-center">
                <HeartIcon className="size-5" weight="fill" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                2. 90% Direct to Maker
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We take only a modest 10% platform fee. 90% of every euro goes directly to the artisan&apos;s workshop to keep heritage crafts alive.
              </p>
            </div>

            <div className="p-6 bg-card border border-border/80 space-y-3">
              <div className="size-10 rounded-full bg-brand-pale-sage text-brand-deep-forest flex items-center justify-center">
                <TreeEvergreenIcon className="size-5" weight="fill" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                3. Zero Single-Use Plastic
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Packaging is 100% recyclable FSC cardboard and paper honeycomb wrapping. Zero bubble wrap or Styrofoam chips ever.
              </p>
            </div>

            <div className="p-6 bg-card border border-border/80 space-y-3">
              <div className="size-10 rounded-full bg-brand-pale-sage text-brand-deep-forest flex items-center justify-center">
                <ScalesIcon className="size-5" weight="fill" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                4. 14-Day Escrow Security
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Payments remain locked in bank escrow until verified delivery + 14 statutory days. Complete buyer and maker protection.
              </p>
            </div>
          </div>
        </div>

        {/* By The Numbers Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 bg-brand-warm-ivory dark:bg-card border border-border/80">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-1 text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-serif font-bold text-brand-deep-forest dark:text-emerald-400">
                {m.value}
              </div>
              <div className="text-xs font-bold text-foreground">{m.label}</div>
              <div className="text-[11px] text-muted-foreground">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Regional Craft Studios Showcase */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-deep-forest dark:text-primary">
              Living Finnish Heritage
            </span>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              Voices from the Studios
            </h2>
            <p className="text-xs text-muted-foreground">
              A glimpse into the authentic workshops shaping goods on Oivaly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studioStories.map((st, i) => (
              <div key={i} className="bg-card border border-border/80 overflow-hidden flex flex-col justify-between">
                <div className="relative aspect-4/3 w-full bg-muted">
                  <Image src={st.image} alt={st.title} fill className="object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur text-white text-[10px] font-mono uppercase tracking-wider">
                    {st.region}
                  </div>
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-primary uppercase font-semibold">{st.craft}</span>
                    <h3 className="font-serif font-bold text-foreground text-sm">{st.title}</h3>
                    <p className="text-muted-foreground text-[11px] leading-relaxed pt-1">
                      {st.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Curatorial Board & Leadership */}
        <div className="space-y-6 border-t border-border/60 pt-12">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-deep-forest dark:text-primary">
              The Curators
            </span>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              Meet the Helsinki Team
            </h2>
            <p className="text-xs text-muted-foreground">
              Our multidisciplinary team based in Helsinki&apos;s Design District.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            {leadership.map((person, idx) => (
              <div key={idx} className="p-5 bg-card border border-border/80 space-y-2">
                <div className="size-10 rounded-full bg-brand-pale-sage text-brand-deep-forest font-bold font-serif flex items-center justify-center text-sm">
                  {person.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{person.name}</h3>
                  <span className="text-[11px] text-primary font-medium">{person.role}</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed pt-1">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Helsinki Headquarters & Legal Card */}
        <div className="p-8 bg-brand-warm-ivory dark:bg-card border border-border/80 space-y-4">
          <div className="flex items-center gap-2">
            <BuildingsIcon className="size-5 text-brand-deep-forest dark:text-primary" weight="fill" />
            <h3 className="text-base font-serif font-bold text-foreground">
              Oivaly Headquarters & Showroom
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            Oivaly Oy is registered in Helsinki, Finland under Business ID <strong>3412984-7</strong>. Our headquarters and private design showroom are located at <strong>Mannerheimintie 10, 00100 Helsinki</strong>. We invite trade partners, gallery curators, and visitors to schedule an atelier appointment.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-primary">
            <Link href="/contact" className="hover:underline">Contact Helsinki Office &rarr;</Link>
            <Link href="/makers" className="hover:underline">Explore Independent Makers &rarr;</Link>
            <Link href="/sustainability" className="hover:underline">Read Sustainability Manifesto &rarr;</Link>
          </div>
        </div>

        {/* Dual CTA */}
        <div className="border border-border/80 bg-brand-deep-forest text-white p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-serif font-bold">
              Become Part of the Nordic Movement
            </h2>
            <p className="text-xs text-white/80">
              Collect handcrafted masterworks, or bring your own Finnish atelier online.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/categories"
              className="px-5 py-2.5 bg-brand-sage text-brand-deep-forest font-bold text-xs uppercase tracking-wider hover:bg-brand-sage/90 transition-colors"
            >
              Explore Collection
            </Link>
            <Link
              href="/seller/signup"
              className="px-5 py-2.5 border border-white/40 text-white font-semibold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
              Open an Atelier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
