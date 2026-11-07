"use client";

import * as React from "react";
import { CustomerAuthLayout, type CustomerAuthLayoutProps } from "./customer-auth-layout";

export interface AuthCardLayoutProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  tagline?: React.ReactNode;
  children: React.ReactNode;
}

export function AuthCardLayout({
  title,
  subtitle,
  linkHref,
  children,
}: AuthCardLayoutProps) {
  const activeTab: CustomerAuthLayoutProps["activeTab"] =
    linkHref?.includes("login") ? "register" : "login";

  return (
    <CustomerAuthLayout
      title={title}
      subtitle={subtitle || "Join Oivaly to discover authentic craftsmanship."}
      activeTab={activeTab}
    >
      {children}
    </CustomerAuthLayout>
  );
}
