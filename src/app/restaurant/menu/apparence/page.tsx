"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Loader2,
  Save,
  Palette,
  Type,
  Image as ImageIcon,
  ShoppingBag,
  ChefHat,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { formatPrice } from "@/lib/cart";

// Font options with Google Fonts URLs
const FONT_OPTIONS = {
  SYSTEM: { label: "Systeme", family: "system-ui, sans-serif", googleUrl: null },
  INTER: { label: "Inter", family: "'Inter', sans-serif", googleUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
  PLAYFAIR: { label: "Playfair Display", family: "'Playfair Display', serif", googleUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" },
  POPPINS: { label: "Poppins", family: "'Poppins', sans-serif", googleUrl: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" },
  LORA: { label: "Lora", family: "'Lora', serif", googleUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap" },
  ROBOTO: { label: "Roboto", family: "'Roboto', sans-serif", googleUrl: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" },
  MERRIWEATHER: { label: "Merriweather", family: "'Merriweather', serif", googleUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" },
};

// Theme presets
const THEME_PRESETS = {
  DEFAULT: {
    label: "Par defaut",
    primaryColor: "#7c3aed",
    accentColor: "#8b5cf6",
    backgroundColor: "#f9fafb",
    textColor: "#111827",
  },
  DARK: {
    label: "Sombre",
    primaryColor: "#a78bfa",
    accentColor: "#c4b5fd",
    backgroundColor: "#1f2937",
    textColor: "#f9fafb",
  },
  ELEGANT: {
    label: "Elegant",
    primaryColor: "#b45309",
    accentColor: "#d97706",
    backgroundColor: "#fffbeb",
    textColor: "#78350f",
  },
  VIBRANT: {
    label: "Vibrant",
    primaryColor: "#dc2626",
    accentColor: "#f97316",
    backgroundColor: "#fff7ed",
    textColor: "#1c1917",
  },
  MINIMAL: {
    label: "Minimal",
    primaryColor: "#18181b",
    accentColor: "#3f3f46",
    backgroundColor: "#ffffff",
    textColor: "#18181b",
  },
  CUSTOM: {
    label: "Personnalise",
    primaryColor: "#7c3aed",
    accentColor: "#8b5cf6",
    backgroundColor: "#f9fafb",
    textColor: "#111827",
  },
};

const ORDERING_MODES = {
  CALL_WAITER: {
    label: "Appeler le serveur",
    description: "Les clients commandent et appellent un serveur pour confirmer",
    icon: "📞",
  },
  PAY_LATER: {
    label: "Payer plus tard",
    description: "Les clients commandent et paient a la fin du repas",
    icon: "💳",
  },
  PAYMENT_REQUIRED: {
    label: "Paiement en ligne",
    description: "Les clients paient directement via Stripe",
    icon: "🔒",
  },
};

type ThemeKey = keyof typeof THEME_PRESETS;
type FontKey = keyof typeof FONT_OPTIONS;
type OrderingMode = keyof typeof ORDERING_MODES;

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
  items: MenuItem[];
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  currency: string;
  menuTheme: ThemeKey;
  menuFont: FontKey;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  showItemImages: boolean;
  orderingMode: OrderingMode;
  stripeOnboarded: boolean;
}

// Sample menu items for preview
const SAMPLE_ITEMS: MenuItem[] = [
  { id: "1", name: "Salade Cesar", description: "Laitue romaine, parmesan, croûtons, sauce cesar", priceInCents: 1200, imageUrl: null },
  { id: "2", name: "Burger Gourmet", description: "Boeuf Angus, cheddar affiné, bacon crispy", priceInCents: 1850, imageUrl: null },
  { id: "3", name: "Tiramisu Maison", description: "Recette traditionnelle au mascarpone", priceInCents: 890, imageUrl: null },
];

export default function AppearancePage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stripeOnboarded, setStripeOnboarded] = useState(false);

  // Theme state
  const [menuTheme, setMenuTheme] = useState<ThemeKey>("DEFAULT");
  const [menuFont, setMenuFont] = useState<FontKey>("SYSTEM");
  const [primaryColor, setPrimaryColor] = useState("#7c3aed");
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [backgroundColor, setBackgroundColor] = useState("#f9fafb");
  const [textColor, setTextColor] = useState("#111827");
  const [showItemImages, setShowItemImages] = useState(true);
  const [orderingMode, setOrderingMode] = useState<OrderingMode>("CALL_WAITER");

  const fetchData = useCallback(async () => {
    try {
      const [restaurantRes, categoriesRes, stripeRes] = await Promise.all([
        fetch("/api/restaurant"),
        fetch("/api/restaurant/categories"),
        fetch("/api/restaurant/stripe/status"),
      ]);

      const restaurantData = await restaurantRes.json();
      const categoriesData = await categoriesRes.json();
      const stripeData = await stripeRes.json();

      if (restaurantData.restaurant) {
        const r = restaurantData.restaurant;
        setRestaurant(r);
        setMenuTheme(r.menuTheme || "DEFAULT");
        setMenuFont(r.menuFont || "SYSTEM");
        setPrimaryColor(r.primaryColor || "#7c3aed");
        setAccentColor(r.accentColor || "#8b5cf6");
        setBackgroundColor(r.backgroundColor || "#f9fafb");
        setTextColor(r.textColor || "#111827");
        setShowItemImages(r.showItemImages !== false);
        setOrderingMode(r.orderingMode || "CALL_WAITER");
      }

      if (categoriesData.categories) {
        setCategories(categoriesData.categories);
      }

      setStripeOnboarded(stripeData?.onboarded || false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load Google Fonts
  useEffect(() => {
    const fontOption = FONT_OPTIONS[menuFont];
    if (fontOption.googleUrl) {
      const link = document.createElement("link");
      link.href = fontOption.googleUrl;
      link.rel = "stylesheet";
      link.id = `font-${menuFont}`;

      // Remove existing font links
      document.querySelectorAll('link[id^="font-"]').forEach(el => el.remove());
      document.head.appendChild(link);
    }
  }, [menuFont]);

  function handleThemeChange(theme: ThemeKey) {
    setMenuTheme(theme);
    if (theme !== "CUSTOM") {
      const preset = THEME_PRESETS[theme];
      setPrimaryColor(preset.primaryColor);
      setAccentColor(preset.accentColor);
      setBackgroundColor(preset.backgroundColor);
      setTextColor(preset.textColor);
    }
  }

  async function handleSave() {
    setSaving(true);

    try {
      await fetch("/api/restaurant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuTheme,
          menuFont,
          primaryColor,
          accentColor,
          backgroundColor,
          textColor,
          showItemImages,
          orderingMode,
        }),
      });
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  }

  // Get preview items - use real menu or samples
  const previewItems = categories.length > 0 && categories[0].items.length > 0
    ? categories[0].items.slice(0, 3)
    : SAMPLE_ITEMS;

  const previewCategory = categories.length > 0 ? categories[0].name : "Nos plats";
  const isDark = menuTheme === "DARK";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Restaurant non trouve</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)]">
      {/* Left side - Editor */}
      <div className="w-1/2 overflow-y-auto pr-4">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/restaurant/menu"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Apparence du menu</h1>
            <p className="text-gray-500">Personnalisez le style de votre carte</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Theme presets */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
                <Palette className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="font-semibold">Theme</h2>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(THEME_PRESETS) as ThemeKey[]).map((theme) => {
                const preset = THEME_PRESETS[theme];
                return (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => handleThemeChange(theme)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      menuTheme === theme
                        ? "border-violet-500 ring-2 ring-violet-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className="h-8 rounded mb-2 flex items-center justify-center"
                      style={{ backgroundColor: preset.backgroundColor }}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                    </div>
                    <span className="text-xs font-medium">{preset.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom colors */}
            {menuTheme === "CUSTOM" && (
              <div className="grid grid-cols-2 gap-3 mt-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Couleur principale
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Couleur d&apos;accent
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Fond
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Texte
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Typography */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <Type className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="font-semibold">Typographie</h2>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(FONT_OPTIONS) as FontKey[]).map((font) => {
                const option = FONT_OPTIONS[font];
                return (
                  <button
                    key={font}
                    type="button"
                    onClick={() => setMenuFont(font)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      menuFont === font
                        ? "border-violet-500 ring-2 ring-violet-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span
                      className="block text-lg font-semibold mb-1"
                      style={{ fontFamily: option.family }}
                    >
                      {option.label}
                    </span>
                    <span
                      className="text-xs text-gray-500"
                      style={{ fontFamily: option.family }}
                    >
                      Apercu du texte
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image display */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold">Images des plats</h2>
                <p className="text-sm text-gray-500">Affichez ou masquez les photos</p>
              </div>
              <div
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                  showItemImages ? "bg-violet-600" : "bg-gray-300"
                }`}
                onClick={() => setShowItemImages(!showItemImages)}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    showItemImages ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Ordering mode */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="font-semibold">Mode de commande</h2>
            </div>

            <div className="space-y-2">
              {(Object.keys(ORDERING_MODES) as OrderingMode[]).map((mode) => {
                const info = ORDERING_MODES[mode];
                const isDisabled = mode === "PAYMENT_REQUIRED" && !stripeOnboarded;

                return (
                  <label
                    key={mode}
                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      orderingMode === mode
                        ? "border-violet-500 bg-violet-50"
                        : isDisabled
                          ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                          : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderingMode"
                      value={mode}
                      checked={orderingMode === mode}
                      onChange={() => !isDisabled && setOrderingMode(mode)}
                      disabled={isDisabled}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{info.icon}</span>
                        <span className="font-medium">{info.label}</span>
                      </div>
                      <p className="text-xs text-gray-500">{info.description}</p>
                      {isDisabled && (
                        <p className="text-xs text-orange-600 mt-1">
                          Connectez Stripe dans les parametres
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 font-medium"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer
          </button>
        </div>
      </div>

      {/* Right side - Live Preview */}
      <div className="w-1/2 border rounded-xl overflow-hidden bg-gray-100">
        <div className="h-full overflow-hidden">
          {/* Phone frame */}
          <div className="h-full flex items-start justify-center pt-4 pb-4">
            <div
              className="w-[320px] h-[580px] rounded-[2rem] border-8 border-gray-800 overflow-hidden shadow-2xl"
              style={{ backgroundColor }}
            >
              <div
                className="h-full overflow-y-auto"
                style={{ fontFamily: FONT_OPTIONS[menuFont].family }}
              >
                {/* Header */}
                <header
                  className="sticky top-0 z-10 border-b px-4 py-4"
                  style={{
                    backgroundColor: isDark ? "#111827" : "#ffffff",
                    borderColor: isDark ? "#374151" : "#e5e7eb",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      <ChefHat className="w-5 h-5" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <h1
                        className="font-bold text-base"
                        style={{ color: isDark ? "#f9fafb" : textColor }}
                      >
                        {restaurant.name}
                      </h1>
                      <p
                        className="text-xs"
                        style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                      >
                        Table 5
                      </p>
                    </div>
                  </div>
                </header>

                {/* Ordering mode banner */}
                {orderingMode !== "PAYMENT_REQUIRED" && (
                  <div
                    className="mx-4 mt-4 p-3 rounded-lg border text-xs"
                    style={{
                      backgroundColor: `${primaryColor}10`,
                      borderColor: `${primaryColor}30`,
                      color: textColor,
                    }}
                  >
                    {ORDERING_MODES[orderingMode].icon} {orderingMode === "CALL_WAITER"
                      ? "Commandez et appelez un serveur"
                      : "Commandez, payez a la fin"}
                  </div>
                )}

                {/* Category */}
                <div className="px-4 pt-4">
                  <h2
                    className="font-semibold text-sm mb-3"
                    style={{ color: isDark ? "#f9fafb" : textColor }}
                  >
                    {previewCategory}
                  </h2>
                </div>

                {/* Menu items */}
                <div className="px-4 space-y-3 pb-24">
                  {previewItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl p-3 border"
                      style={{
                        backgroundColor: isDark ? "#1f2937" : "#ffffff",
                        borderColor: isDark ? "#374151" : "#e5e7eb",
                      }}
                    >
                      <div className="flex gap-3">
                        {showItemImages && (
                          <div
                            className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: `${primaryColor}15` }}
                          >
                            <span className="text-2xl">🍽️</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold text-sm"
                            style={{ color: isDark ? "#f9fafb" : textColor }}
                          >
                            {item.name}
                          </h3>
                          {item.description && (
                            <p
                              className="text-xs mt-0.5 line-clamp-2"
                              style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
                            >
                              {item.description}
                            </p>
                          )}
                          <p
                            className="font-bold text-sm mt-1"
                            style={{ color: primaryColor }}
                          >
                            {formatPrice(item.priceInCents, restaurant.currency)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Plus className="w-3 h-3" />
                          Ajouter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart button */}
                <div
                  className="fixed bottom-4 left-4 right-4 mx-auto"
                  style={{
                    width: "calc(320px - 32px - 16px)",
                    marginLeft: "8px",
                  }}
                >
                  <div
                    className="flex items-center justify-between rounded-full px-4 py-3 text-white text-sm font-medium shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span>Voir le panier (2)</span>
                    <span className="font-bold">25,50 €</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
