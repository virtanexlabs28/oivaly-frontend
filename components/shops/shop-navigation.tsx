"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ShopNavigationProps {
  totalProducts?: number;
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export function ShopNavigation({
  totalProducts,
  activeSection = "products",
  onSelectSection,
}: ShopNavigationProps) {
  const [prevActive, setPrevActive] = React.useState(activeSection);
  const [currentSection, setCurrentSection] = React.useState(activeSection);

  if (prevActive !== activeSection) {
    setPrevActive(activeSection);
    setCurrentSection(activeSection);
  }

  const navItems = [
    {
      id: "products",
      label: "Products",
      count: totalProducts,
      href: "#products",
    },
    {
      id: "about",
      label: "About Maker",
      href: "#about",
    },
    {
      id: "policies",
      label: "Shop Policies",
      href: "#policies",
    },
    {
      id: "reviews",
      label: "Reviews",
      href: "#reviews",
    },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setCurrentSection(id);
    if (onSelectSection) {
      onSelectSection(id);
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      aria-label="Storefront navigation"
      className="sticky top-16 z-20 bg-background/95 backdrop-blur-xs border-b border-border/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-1 sm:gap-6 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={item.href}
                  onClick={(e) => handleClick(e, item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 py-3 px-3 text-xs sm:text-sm font-medium transition-colors border-b-2 -mb-[1px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    isActive
                      ? "border-primary text-foreground font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.2 text-[10px] font-semibold",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
