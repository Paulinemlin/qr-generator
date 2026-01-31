"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "QR Codes" },
  { href: "/links", label: "Liens courts" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/badges/import", label: "Badges" },
  { href: "/teams", label: "Équipes" },
];

export function MainNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Don't show nav on public pages
  const publicPaths = ["/", "/login", "/register", "/pricing", "/about", "/contact", "/faq", "/legal", "/blog", "/use-cases", "/guides", "/forgot-password", "/reset-password", "/verify-email", "/expired", "/link-expired", "/docs"];
  const isPublicPage = publicPaths.some(path => pathname === path || pathname.startsWith("/blog/") || pathname.startsWith("/use-cases/") || pathname.startsWith("/legal/") || pathname.startsWith("/docs/"));

  // Don't show on menu pages (customer-facing)
  const isMenuPage = pathname.startsWith("/m/") || pathname.startsWith("/order/");

  // Don't show on restaurant pages (has its own layout with sidebar)
  const isRestaurantPage = pathname.startsWith("/restaurant");

  // Don't show on redirect/unlock pages
  const isRedirectPage = pathname.startsWith("/r/") || pathname.startsWith("/l/") || pathname.startsWith("/invite/");

  if (isPublicPage || isMenuPage || isRestaurantPage || isRedirectPage || status === "loading") {
    return null;
  }

  if (!session) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname.startsWith("/qrcode/") || pathname === "/create" || pathname === "/import";
    }
    if (href === "/restaurant") {
      return pathname.startsWith("/restaurant");
    }
    if (href === "/badges/import") {
      return pathname.startsWith("/badges");
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              QR Generator
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive(item.href)
                    ? "font-medium bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-muted-foreground">
            {session.user?.email}
          </span>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden overflow-x-auto border-t">
        <div className="flex px-4 py-2 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-sm rounded-md whitespace-nowrap transition-colors ${
                isActive(item.href)
                  ? "font-medium bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
