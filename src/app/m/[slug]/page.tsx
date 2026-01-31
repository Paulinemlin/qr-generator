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
  X,
} from "lucide-react";
import { useCart, formatPrice } from "@/lib/cart";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  priceInCents: number;
  imageUrl: string | null;
  allergens?: string[];
}

// 14 allergens EU + dietary labels
const ALLERGENS = [
  { id: "gluten", label: "Gluten", icon: "🌾" },
  { id: "crustaces", label: "Crustacés", icon: "🦐" },
  { id: "oeufs", label: "Œufs", icon: "🥚" },
  { id: "poisson", label: "Poisson", icon: "🐟" },
  { id: "arachides", label: "Arachides", icon: "🥜" },
  { id: "soja", label: "Soja", icon: "🫘" },
  { id: "lait", label: "Lait", icon: "🥛" },
  { id: "fruits-coques", label: "Fruits à coque", icon: "🌰" },
  { id: "celeri", label: "Céleri", icon: "🥬" },
  { id: "moutarde", label: "Moutarde", icon: "🟡" },
  { id: "sesame", label: "Sésame", icon: "⚪" },
  { id: "sulfites", label: "Sulfites", icon: "🍷" },
  { id: "lupin", label: "Lupin", icon: "🌸" },
  { id: "mollusques", label: "Mollusques", icon: "🦪" },
];

const DIETS = [
  { id: "vegetarien", label: "Végétarien", icon: "🥬", color: "bg-green-100 text-green-700" },
  { id: "vegan", label: "Végan", icon: "🌱", color: "bg-emerald-100 text-emerald-700" },
  { id: "sans-gluten", label: "Sans gluten", icon: "🌾", color: "bg-amber-100 text-amber-700" },
  { id: "halal", label: "Halal", icon: "☪️", color: "bg-blue-100 text-blue-700" },
  { id: "casher", label: "Casher", icon: "✡️", color: "bg-indigo-100 text-indigo-700" },
  { id: "bio", label: "Bio", icon: "🌿", color: "bg-lime-100 text-lime-700" },
  { id: "fait-maison", label: "Fait maison", icon: "👨‍🍳", color: "bg-orange-100 text-orange-700" },
  { id: "epice", label: "Épicé", icon: "🌶️", color: "bg-red-100 text-red-700" },
];

interface Category {
  id: string;
  name: string;
  description: string | null;
  items: MenuItem[];
}

type MenuTheme = "DEFAULT" | "DARK" | "ELEGANT" | "VIBRANT" | "MINIMAL" | "CUSTOM";
type MenuFont = "SYSTEM" | "INTER" | "PLAYFAIR" | "POPPINS" | "LORA" | "ROBOTO" | "MERRIWEATHER";
type OrderingMode = "PAYMENT_REQUIRED" | "CALL_WAITER" | "PAY_LATER";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  currency: string;
  canAcceptPayments: boolean;
  menuTheme: MenuTheme;
  menuFont: MenuFont;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  showItemImages: boolean;
  orderingMode: OrderingMode;
}

// Font configurations
const fontConfigs: Record<MenuFont, { family: string; googleUrl: string | null }> = {
  SYSTEM: { family: "system-ui, sans-serif", googleUrl: null },
  INTER: { family: "'Inter', sans-serif", googleUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
  PLAYFAIR: { family: "'Playfair Display', serif", googleUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" },
  POPPINS: { family: "'Poppins', sans-serif", googleUrl: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" },
  LORA: { family: "'Lora', serif", googleUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap" },
  ROBOTO: { family: "'Roboto', sans-serif", googleUrl: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" },
  MERRIWEATHER: { family: "'Merriweather', serif", googleUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" },
};

interface Table {
  id: string;
  tableNumber: string;
}

// Theme presets matching the settings page
const themePresets: Record<MenuTheme, { primary: string; accent: string; bg: string; text: string }> = {
  DEFAULT: { primary: "#7c3aed", accent: "#8b5cf6", bg: "#f9fafb", text: "#111827" },
  DARK: { primary: "#8b5cf6", accent: "#a78bfa", bg: "#1f2937", text: "#f9fafb" },
  ELEGANT: { primary: "#b45309", accent: "#d97706", bg: "#fffbeb", text: "#78350f" },
  VIBRANT: { primary: "#db2777", accent: "#ec4899", bg: "#fdf2f8", text: "#831843" },
  MINIMAL: { primary: "#374151", accent: "#6b7280", bg: "#ffffff", text: "#111827" },
  CUSTOM: { primary: "#7c3aed", accent: "#8b5cf6", bg: "#f9fafb", text: "#111827" },
};

function getThemeColors(restaurant: Restaurant) {
  if (restaurant.menuTheme === "CUSTOM") {
    return {
      primary: restaurant.primaryColor,
      accent: restaurant.accentColor,
      bg: restaurant.backgroundColor,
      text: restaurant.textColor,
    };
  }
  return themePresets[restaurant.menuTheme] || themePresets.DEFAULT;
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
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

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

  // Load Google Font when restaurant data is available
  useEffect(() => {
    if (!restaurant?.menuFont) return;

    const fontConfig = fontConfigs[restaurant.menuFont];
    if (fontConfig.googleUrl) {
      const existingLink = document.getElementById(`font-${restaurant.menuFont}`);
      if (!existingLink) {
        const link = document.createElement("link");
        link.href = fontConfig.googleUrl;
        link.rel = "stylesheet";
        link.id = `font-${restaurant.menuFont}`;
        document.head.appendChild(link);
      }
    }
  }, [restaurant?.menuFont]);

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

  // Check if ordering is enabled (either with payment or without)
  const canOrder = (r: Restaurant): boolean => {
    if (r.orderingMode === "PAYMENT_REQUIRED") {
      return r.canAcceptPayments;
    }
    // CALL_WAITER and PAY_LATER modes don't require Stripe
    return true;
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

  const theme = getThemeColors(restaurant);
  const orderingEnabled = canOrder(restaurant);
  const isDarkTheme = restaurant.menuTheme === "DARK";
  const fontFamily = fontConfigs[restaurant.menuFont || "SYSTEM"].family;

  return (
    <div
      className="min-h-screen pb-24"
      style={{ backgroundColor: theme.bg, color: theme.text, fontFamily }}
    >
      {/* Header */}
      <header
        className="border-b sticky top-0 z-40"
        style={{
          backgroundColor: isDarkTheme ? "#111827" : "#ffffff",
          borderColor: isDarkTheme ? "#374151" : "#e5e7eb"
        }}
      >
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
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${theme.primary}20` }}
              >
                <ChefHat className="w-6 h-6" style={{ color: theme.primary }} />
              </div>
            )}
            <div>
              <h1
                className="font-bold text-lg"
                style={{ color: isDarkTheme ? "#f9fafb" : theme.text }}
              >
                {restaurant.name}
              </h1>
              {table && (
                <p
                  className="text-sm"
                  style={{ color: isDarkTheme ? "#9ca3af" : "#6b7280" }}
                >
                  Table {table.tableNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Category tabs */}
        {categories.length > 1 && (
          <div
            className="overflow-x-auto scrollbar-hide border-t"
            style={{ borderColor: isDarkTheme ? "#374151" : "#e5e7eb" }}
          >
            <div className="flex px-4 py-2 gap-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
                  style={{
                    backgroundColor: activeCategory === category.id ? theme.primary : (isDarkTheme ? "#374151" : "#f3f4f6"),
                    color: activeCategory === category.id ? "#ffffff" : (isDarkTheme ? "#d1d5db" : "#374151"),
                  }}
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
        {/* Show ordering mode info */}
        {restaurant.orderingMode === "CALL_WAITER" && (
          <div
            className="mb-4 p-4 rounded-lg border"
            style={{
              backgroundColor: `${theme.primary}10`,
              borderColor: `${theme.primary}30`
            }}
          >
            <p className="text-sm" style={{ color: theme.text }}>
              📞 Passez commande et appelez un serveur pour payer
            </p>
          </div>
        )}
        {restaurant.orderingMode === "PAY_LATER" && (
          <div
            className="mb-4 p-4 rounded-lg border"
            style={{
              backgroundColor: `${theme.primary}10`,
              borderColor: `${theme.primary}30`
            }}
          >
            <p className="text-sm" style={{ color: theme.text }}>
              💳 Commandez maintenant, payez a la fin du repas
            </p>
          </div>
        )}
        {restaurant.orderingMode === "PAYMENT_REQUIRED" && !restaurant.canAcceptPayments && (
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
              <p
                className="text-sm mb-4"
                style={{ color: isDarkTheme ? "#9ca3af" : "#6b7280" }}
              >
                {category.description}
              </p>
            )}

            <div className="space-y-3">
              {category.items.map((item) => {
                const quantity = getItemQuantity(item.id);
                const isAdding = addingItem === item.id;
                const showImage = restaurant.showItemImages && item.imageUrl;

                // Get diet/allergen icons for this item
                const itemDiets = item.allergens?.filter(id => DIETS.some(d => d.id === id)) || [];
                const itemAllergens = item.allergens?.filter(id => ALLERGENS.some(a => a.id === id)) || [];

                return (
                  <div
                    key={item.id}
                    className="rounded-xl p-4 shadow-sm border cursor-pointer transition-shadow hover:shadow-md"
                    style={{
                      backgroundColor: isDarkTheme ? "#1f2937" : "#ffffff",
                      borderColor: isDarkTheme ? "#374151" : "#e5e7eb"
                    }}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex gap-4">
                      {showImage && (
                        <Image
                          src={item.imageUrl!}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            className="font-semibold"
                            style={{ color: isDarkTheme ? "#f9fafb" : theme.text }}
                          >
                            {item.name}
                          </h3>
                          {/* Diet icons */}
                          {itemDiets.length > 0 && (
                            <div className="flex gap-0.5 flex-shrink-0">
                              {itemDiets.slice(0, 3).map(id => {
                                const diet = DIETS.find(d => d.id === id);
                                return diet ? (
                                  <span key={id} className="text-sm" title={diet.label}>
                                    {diet.icon}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                        {item.description && (
                          <p
                            className="text-sm mt-1 line-clamp-2"
                            style={{ color: isDarkTheme ? "#9ca3af" : "#6b7280" }}
                          >
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <p
                            className="font-bold"
                            style={{ color: theme.primary }}
                          >
                            {formatPrice(item.priceInCents, restaurant.currency)}
                          </p>
                          {/* Allergen count indicator */}
                          {itemAllergens.length > 0 && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: isDarkTheme ? "#374151" : "#fef2f2",
                                color: isDarkTheme ? "#fca5a5" : "#991b1b"
                              }}
                            >
                              {itemAllergens.length} allergène{itemAllergens.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="mt-3 flex justify-end" onClick={(e) => e.stopPropagation()}>
                      {quantity === 0 ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddItem(item); }}
                          disabled={!orderingEnabled}
                          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                          style={{
                            backgroundColor: isAdding
                              ? theme.accent
                              : orderingEnabled
                                ? theme.primary
                                : "#e5e7eb",
                            color: orderingEnabled ? "#ffffff" : "#9ca3af",
                            transform: isAdding ? "scale(0.95)" : "scale(1)",
                            cursor: orderingEnabled ? "pointer" : "not-allowed",
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter
                        </button>
                      ) : (
                        <div
                          className="flex items-center gap-3 rounded-full p-1"
                          style={{ backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6" }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, quantity - 1);
                            }}
                            className="w-8 h-8 rounded-full shadow flex items-center justify-center"
                            style={{
                              backgroundColor: isDarkTheme ? "#1f2937" : "#ffffff",
                              color: isDarkTheme ? "#d1d5db" : "#374151"
                            }}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span
                            className="font-semibold w-6 text-center"
                            style={{ color: isDarkTheme ? "#f9fafb" : theme.text }}
                          >
                            {quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, quantity + 1);
                            }}
                            className="w-8 h-8 rounded-full text-white flex items-center justify-center"
                            style={{ backgroundColor: theme.primary }}
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
                <p
                  className="text-center py-8"
                  style={{ color: isDarkTheme ? "#9ca3af" : "#6b7280" }}
                >
                  Aucun plat disponible dans cette categorie
                </p>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Floating cart button */}
      {isLoaded && totalItems > 0 && orderingEnabled && (
        <div
          className="fixed bottom-0 left-0 right-0 p-4"
          style={{
            background: `linear-gradient(to top, ${theme.bg}, ${theme.bg}ee, transparent)`
          }}
        >
          <div className="max-w-lg mx-auto">
            <Link
              href={`/m/${slug}/checkout${tableId ? `?tableId=${tableId}` : ""}`}
              className="flex items-center justify-between w-full rounded-full px-6 py-4 shadow-lg transition-colors"
              style={{
                backgroundColor: theme.primary,
                color: "#ffffff"
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  <span
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{
                      backgroundColor: "#ffffff",
                      color: theme.primary
                    }}
                  >
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

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] overflow-hidden rounded-t-2xl sm:rounded-2xl"
            style={{
              backgroundColor: isDarkTheme ? "#1f2937" : "#ffffff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            {selectedItem.imageUrl && (
              <div className="relative h-48 sm:h-56">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="p-5 overflow-y-auto" style={{ maxHeight: selectedItem.imageUrl ? "calc(85vh - 14rem)" : "85vh" }}>
              {/* Close button if no image */}
              {!selectedItem.imageUrl && (
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6" }}
                  >
                    <X className="w-5 h-5" style={{ color: isDarkTheme ? "#d1d5db" : "#374151" }} />
                  </button>
                </div>
              )}

              {/* Title & Price */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2
                  className="text-xl font-bold"
                  style={{ color: isDarkTheme ? "#f9fafb" : theme.text }}
                >
                  {selectedItem.name}
                </h2>
                <p
                  className="text-xl font-bold flex-shrink-0"
                  style={{ color: theme.primary }}
                >
                  {formatPrice(selectedItem.priceInCents, restaurant.currency)}
                </p>
              </div>

              {/* Description */}
              {selectedItem.description && (
                <p
                  className="mb-4"
                  style={{ color: isDarkTheme ? "#d1d5db" : "#4b5563" }}
                >
                  {selectedItem.description}
                </p>
              )}

              {/* Diets */}
              {(() => {
                const diets = selectedItem.allergens?.filter(id => DIETS.some(d => d.id === id)) || [];
                if (diets.length === 0) return null;
                return (
                  <div className="mb-4">
                    <p
                      className="text-sm font-medium mb-2"
                      style={{ color: isDarkTheme ? "#9ca3af" : "#6b7280" }}
                    >
                      Régimes & Labels
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {diets.map(id => {
                        const diet = DIETS.find(d => d.id === id);
                        return diet ? (
                          <span
                            key={id}
                            className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5"
                            style={{
                              backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6",
                              color: isDarkTheme ? "#d1d5db" : "#374151"
                            }}
                          >
                            <span>{diet.icon}</span>
                            <span>{diet.label}</span>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Allergens */}
              {(() => {
                const allergens = selectedItem.allergens?.filter(id => ALLERGENS.some(a => a.id === id)) || [];
                if (allergens.length === 0) return null;
                return (
                  <div className="mb-4">
                    <p
                      className="text-sm font-medium mb-2"
                      style={{ color: isDarkTheme ? "#9ca3af" : "#6b7280" }}
                    >
                      Allergènes présents
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {allergens.map(id => {
                        const allergen = ALLERGENS.find(a => a.id === id);
                        return allergen ? (
                          <span
                            key={id}
                            className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5"
                            style={{
                              backgroundColor: isDarkTheme ? "#7f1d1d" : "#fef2f2",
                              color: isDarkTheme ? "#fca5a5" : "#991b1b"
                            }}
                          >
                            <span>{allergen.icon}</span>
                            <span>{allergen.label}</span>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Add to cart button */}
              {orderingEnabled && (
                <div className="mt-6">
                  {getItemQuantity(selectedItem.id) === 0 ? (
                    <button
                      onClick={() => {
                        handleAddItem(selectedItem);
                        setSelectedItem(null);
                      }}
                      className="w-full py-3 rounded-full font-semibold text-white flex items-center justify-center gap-2"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <Plus className="w-5 h-5" />
                      Ajouter au panier
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => updateQuantity(selectedItem.id, getItemQuantity(selectedItem.id) - 1)}
                        className="w-12 h-12 rounded-full shadow flex items-center justify-center"
                        style={{
                          backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6",
                          color: isDarkTheme ? "#d1d5db" : "#374151"
                        }}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span
                        className="text-xl font-bold w-8 text-center"
                        style={{ color: isDarkTheme ? "#f9fafb" : theme.text }}
                      >
                        {getItemQuantity(selectedItem.id)}
                      </span>
                      <button
                        onClick={() => updateQuantity(selectedItem.id, getItemQuantity(selectedItem.id) + 1)}
                        className="w-12 h-12 rounded-full text-white flex items-center justify-center"
                        style={{ backgroundColor: theme.primary }}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
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
