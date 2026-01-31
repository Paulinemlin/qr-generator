"use client";

import { useEffect, useState, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Plus,
  Minus,
  Loader2,
  ChefHat,
  AlertCircle,
} from "lucide-react";
import { useCart, formatPrice } from "@/lib/cart";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  priceInCents: number;
  imageUrl: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  items: MenuItem[];
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  currency: string;
  canAcceptPayments: boolean;
}

interface Table {
  id: string;
  tableNumber: string;
}

function MenuContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId") || undefined;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [addingItem, setAddingItem] = useState<string | null>(null);

  const { items, addItem, updateQuantity, totalItems, totalInCents, isLoaded } =
    useCart(slug, tableId);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const url = tableId
          ? `/api/menu/${slug}?tableId=${tableId}`
          : `/api/menu/${slug}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Erreur lors du chargement");
          return;
        }

        setRestaurant(data.restaurant);
        setCategories(data.categories);
        setTable(data.table);

        if (data.categories.length > 0) {
          setActiveCategory(data.categories[0].id);
        }
      } catch {
        setError("Erreur de connexion");
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, [slug, tableId]);

  const handleAddItem = (item: MenuItem) => {
    setAddingItem(item.id);
    addItem({
      menuItemId: item.id,
      name: item.name,
      priceInCents: item.priceInCents,
    });
    setTimeout(() => setAddingItem(null), 300);
  };

  const getItemQuantity = (menuItemId: string): number => {
    const item = items.find((i) => i.menuItemId === menuItemId);
    return item?.quantity || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Restaurant introuvable"}
          </h1>
          <Link href="/" className="text-violet-600 hover:underline">
            Retour a l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {restaurant.logoUrl ? (
              <Image
                src={restaurant.logoUrl}
                alt={restaurant.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-violet-600" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg text-gray-900">
                {restaurant.name}
              </h1>
              {table && (
                <p className="text-sm text-gray-500">
                  Table {table.tableNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="overflow-x-auto scrollbar-hide border-t">
            <div className="flex px-4 py-2 gap-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category.id
                      ? "bg-violet-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Menu items */}
      <main className="max-w-lg mx-auto px-4 py-4">
        {!restaurant.canAcceptPayments && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Ce restaurant ne peut pas encore accepter les paiements en ligne.
            </p>
          </div>
        )}

        {categories.map((category) => (
          <div
            key={category.id}
            className={activeCategory === category.id ? "block" : "hidden"}
          >
            {category.description && (
              <p className="text-gray-600 text-sm mb-4">
                {category.description}
              </p>
            )}

            <div className="space-y-3">
              {category.items.map((item) => {
                const quantity = getItemQuantity(item.id);
                const isAdding = addingItem === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 shadow-sm border"
                  >
                    <div className="flex gap-4">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <p className="font-bold text-violet-600 mt-2">
                          {formatPrice(item.priceInCents, restaurant.currency)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="mt-3 flex justify-end">
                      {quantity === 0 ? (
                        <button
                          onClick={() => handleAddItem(item)}
                          disabled={!restaurant.canAcceptPayments}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            isAdding
                              ? "bg-violet-700 text-white scale-95"
                              : restaurant.canAcceptPayments
                                ? "bg-violet-600 text-white hover:bg-violet-700"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, quantity - 1)
                            }
                            className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold w-6 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, quantity + 1)
                            }
                            className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {category.items.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Aucun plat disponible dans cette categorie
                </p>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Floating cart button */}
      {isLoaded && totalItems > 0 && restaurant.canAcceptPayments && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50">
          <div className="max-w-lg mx-auto">
            <Link
              href={`/m/${slug}/checkout${tableId ? `?tableId=${tableId}` : ""}`}
              className="flex items-center justify-between w-full bg-violet-600 text-white rounded-full px-6 py-4 shadow-lg hover:bg-violet-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-violet-600 rounded-full text-xs font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
                <span className="font-semibold">Voir le panier</span>
              </div>
              <span className="font-bold">
                {formatPrice(totalInCents, restaurant.currency)}
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
    </div>
  );
}

export default function MenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <MenuContent slug={slug} />
    </Suspense>
  );
}
