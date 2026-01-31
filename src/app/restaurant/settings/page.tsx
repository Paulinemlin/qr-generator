"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Save,
  Palette,
  Image as ImageIcon,
  ShoppingBag,
} from "lucide-react";

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
  },
  PAY_LATER: {
    label: "Payer plus tard",
    description: "Les clients commandent et paient a la fin du repas",
  },
  PAYMENT_REQUIRED: {
    label: "Paiement en ligne",
    description: "Les clients paient directement via Stripe (Apple Pay, CB...)",
  },
};

type ThemeKey = keyof typeof THEME_PRESETS;
type OrderingMode = keyof typeof ORDERING_MODES;

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  currency: string;
  stripeAccountId: string | null;
  stripeOnboarded: boolean;
  menuTheme: ThemeKey;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  showItemImages: boolean;
  orderingMode: OrderingMode;
}

interface StripeStatus {
  connected: boolean;
  onboarded: boolean;
  canReceivePayments: boolean;
  canReceivePayouts: boolean;
  detailsSubmitted: boolean;
}

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const stripeParam = searchParams.get("stripe");

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("EUR");

  // Theme state
  const [menuTheme, setMenuTheme] = useState<ThemeKey>("DEFAULT");
  const [primaryColor, setPrimaryColor] = useState("#7c3aed");
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [backgroundColor, setBackgroundColor] = useState("#f9fafb");
  const [textColor, setTextColor] = useState("#111827");
  const [showItemImages, setShowItemImages] = useState(true);
  const [orderingMode, setOrderingMode] = useState<OrderingMode>("CALL_WAITER");

  useEffect(() => {
    fetchData();
  }, [stripeParam]);

  async function fetchData() {
    try {
      const [restaurantRes, stripeRes] = await Promise.all([
        fetch("/api/restaurant"),
        fetch("/api/restaurant/stripe/status"),
      ]);

      const restaurantData = await restaurantRes.json();
      const stripeData = await stripeRes.json();

      if (restaurantData.restaurant) {
        const r = restaurantData.restaurant;
        setRestaurant(r);
        setName(r.name);
        setDescription(r.description || "");
        setCurrency(r.currency);
        setMenuTheme(r.menuTheme || "DEFAULT");
        setPrimaryColor(r.primaryColor || "#7c3aed");
        setAccentColor(r.accentColor || "#8b5cf6");
        setBackgroundColor(r.backgroundColor || "#f9fafb");
        setTextColor(r.textColor || "#111827");
        setShowItemImages(r.showItemImages !== false);
        setOrderingMode(r.orderingMode || "CALL_WAITER");
      }

      setStripeStatus(stripeData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await fetch("/api/restaurant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          currency,
          menuTheme,
          primaryColor,
          accentColor,
          backgroundColor,
          textColor,
          showItemImages,
          orderingMode,
        }),
      });

      fetchData();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleConnectStripe() {
    setConnecting(true);

    try {
      const response = await fetch("/api/restaurant/stripe/connect", {
        method: "POST",
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur lors de la connexion Stripe");
        setConnecting(false);
      }
    } catch (error) {
      console.error("Error connecting Stripe:", error);
      setConnecting(false);
    }
  }

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
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Parametres</h1>

      {/* Stripe connection status message */}
      {stripeParam === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700">Compte Stripe connecte avec succes !</p>
        </div>
      )}

      {stripeParam === "refresh" && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-700">
            Session expiree. Veuillez reconnecter votre compte Stripe.
          </p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Restaurant settings */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Informations du restaurant</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du restaurant
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optionnel)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Devise
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dollar (USD)</option>
                <option value="GBP">Livre (GBP)</option>
                <option value="CHF">Franc suisse (CHF)</option>
              </select>
            </div>

            {/* Menu URL */}
            <div className="pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL du menu
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 overflow-x-auto">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/m/${restaurant.slug}`
                    : `/m/${restaurant.slug}`}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/m/${restaurant.slug}`
                    );
                  }}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                >
                  Copier
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ordering mode */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Mode de commande</h2>
              <p className="text-sm text-gray-500">
                Choisissez comment les clients passent leurs commandes
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {(Object.keys(ORDERING_MODES) as OrderingMode[]).map((mode) => {
              const info = ORDERING_MODES[mode];
              const isDisabled = mode === "PAYMENT_REQUIRED" && !stripeStatus?.onboarded;

              return (
                <label
                  key={mode}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
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
                  <div>
                    <span className="font-medium">{info.label}</span>
                    <p className="text-sm text-gray-500">{info.description}</p>
                    {isDisabled && (
                      <p className="text-xs text-orange-600 mt-1">
                        Connectez Stripe pour activer ce mode
                      </p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Theme settings */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Palette className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Theme du menu</h2>
              <p className="text-sm text-gray-500">
                Personnalisez l&apos;apparence de votre carte
              </p>
            </div>
          </div>

          {/* Theme presets */}
          <div className="grid grid-cols-3 gap-2 mb-6">
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

          {/* Custom colors (only show if CUSTOM is selected) */}
          {menuTheme === "CUSTOM" && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
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

          {/* Preview */}
          <div className="mt-4 p-4 rounded-lg border" style={{ backgroundColor }}>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
              <span className="font-semibold" style={{ color: textColor }}>
                Apercu du menu
              </span>
            </div>
            <p className="text-sm" style={{ color: textColor, opacity: 0.7 }}>
              Voici a quoi ressemblera votre carte
            </p>
            <button
              type="button"
              className="mt-3 px-4 py-2 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Ajouter au panier
            </button>
          </div>
        </div>

        {/* Image settings */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">Affichage des images</h2>
              <p className="text-sm text-gray-500 mb-4">
                Affichez ou masquez les photos de vos plats
              </p>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`relative w-12 h-6 rounded-full transition-colors ${
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
                <span className="text-sm font-medium">
                  {showItemImages ? "Images activees" : "Images desactivees"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Stripe Connect */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-violet-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">Paiements Stripe</h2>
              <p className="text-gray-500 text-sm mb-4">
                Connectez Stripe pour accepter les paiements en ligne (optionnel)
              </p>

              {stripeStatus?.onboarded ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Compte connecte et actif</span>
                </div>
              ) : stripeStatus?.connected ? (
                <div>
                  <div className="flex items-center gap-2 text-yellow-600 mb-3">
                    <AlertCircle className="w-5 h-5" />
                    <span>Configuration incomplete</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleConnectStripe}
                    disabled={connecting}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                  >
                    {connecting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                    Completer la configuration
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleConnectStripe}
                  disabled={connecting}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                >
                  {connecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                  Connecter Stripe
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 font-medium"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}
