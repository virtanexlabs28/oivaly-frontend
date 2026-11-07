import Link from "next/link";
import { HouseIcon, MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <span className="text-4xl sm:text-5xl font-heading font-bold text-primary tracking-tight block">
          404
        </span>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-heading font-semibold text-foreground">
            Page or product not found
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We couldn&apos;t find the page or handcrafted item you were looking for. It may have moved or is no longer available.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild size="sm" className="rounded-none text-xs">
            <Link href="/">
              <HouseIcon className="size-3.5 mr-1.5" aria-hidden="true" />
              Return home
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="rounded-none text-xs">
            <Link href="/search">
              <MagnifyingGlassIcon className="size-3.5 mr-1.5" aria-hidden="true" />
              Search products
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
