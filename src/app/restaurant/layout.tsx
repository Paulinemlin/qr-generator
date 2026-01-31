import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth";
import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  ClipboardList,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/restaurant", label: "Dashboard", icon: LayoutDashboard },
  { href: "/restaurant/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/restaurant/tables", label: "Tables", icon: QrCode },
  { href: "/restaurant/orders", label: "Commandes", icon: ClipboardList },
  { href: "/restaurant/settings", label: "Parametres", icon: Settings },
];

export default async function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/restaurant");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/restaurant" className="font-bold text-xl text-violet-600">
                QR Menu
              </Link>
              <nav className="hidden lg:flex items-center gap-1">
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  QR Codes
                </Link>
                <Link
                  href="/links"
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Liens courts
                </Link>
                <Link
                  href="/restaurant"
                  className="px-3 py-2 text-sm font-medium text-violet-600 bg-violet-50 rounded-md"
                >
                  Restaurant
                </Link>
                <Link
                  href="/badges/import"
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Badges
                </Link>
              </nav>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-700 lg:hidden"
            >
              Retour au dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="bg-white border-b md:hidden overflow-x-auto">
        <div className="flex px-4 py-2 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg whitespace-nowrap"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-64 border-r bg-white min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
