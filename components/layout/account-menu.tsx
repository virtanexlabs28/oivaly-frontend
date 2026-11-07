"use client";

import * as React from "react";
import Link from "next/link";
import { UserIcon, CaretDownIcon } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { User } from "@/resources/interfaces/user.interface";
import type { CustomerAuthTokens } from "@/resources/interfaces/auth.interface";
import { HEADER_NAV_CONFIG } from "@/config/navigation";

import { useAuth } from "@/lib/auth-context";

export interface AccountMenuProps {
  user?: User | CustomerAuthTokens["user"] | null;
  className?: string;
}

/**
 * Account navigation menu utilizing shadcn/ui DropdownMenu.
 * Handles both guest state (default) and authenticated user state cleanly.
 */
export function AccountMenu({ user: propUser, className }: AccountMenuProps) {
  const { user: authUser, logout } = useAuth();
  const user = propUser !== undefined ? propUser : authUser;
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={className}
          aria-label={user ? `Account: ${user.name}` : "Sign in or create account"}
        >
          <UserIcon className="size-4 shrink-0 text-foreground" aria-hidden="true" />
          <span className="hidden md:inline-block ml-1 text-xs font-normal">
            {user ? user.name.split(" ")[0] : "Sign in"}
          </span>
          <CaretDownIcon className="hidden md:inline-block size-3 opacity-60 ml-0.5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1">
        {user ? (
          <>
            <DropdownMenuLabel className="px-2 py-1.5 font-normal">
              <div className="flex flex-col space-y-0.5">
                <p className="text-xs font-medium text-foreground">{user.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onClick={() => setOpen(false)}>
              <Link href={HEADER_NAV_CONFIG.routes.account} className="w-full cursor-pointer">
                My Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild onClick={() => setOpen(false)}>
              <Link href="/account/profile" className="w-full cursor-pointer">
                Personal Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild onClick={() => setOpen(false)}>
              <Link href="/account/addresses" className="w-full cursor-pointer">
                Saved Addresses
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild onClick={() => setOpen(false)}>
              <Link href="/account/security" className="w-full cursor-pointer">
                Security & Password
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="px-2 py-2">
              <p className="text-xs font-medium text-foreground">Welcome to Oivaly</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Sign in to track orders, save favourites, and discover makers.
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onClick={() => setOpen(false)}>
              <Link
                href={HEADER_NAV_CONFIG.routes.login}
                className="w-full font-medium text-primary cursor-pointer"
              >
                Sign In
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild onClick={() => setOpen(false)}>
              <Link href={HEADER_NAV_CONFIG.routes.register} className="w-full cursor-pointer">
                Create Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onClick={() => setOpen(false)}>
              <Link href={HEADER_NAV_CONFIG.routes.sell} className="w-full cursor-pointer">
                Sell on Oivaly
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild onClick={() => setOpen(false)}>
              <Link href="/help" className="w-full cursor-pointer text-muted-foreground">
                Help Center
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
