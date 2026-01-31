"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Save,
  Palette,
} from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  currency: string;
  stripeAccountId: string | null;
  stripeOnboarded: boolean;
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
      }

      setStripeStatus(stripeData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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

        {/* Theme link */}
        <Link
          href="/restaurant/menu/apparence"
          className="block bg-white rounded-xl border p-6 hover:border-violet-300 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Palette className="w-5 h-5 text-violet-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">Apparence du menu</h2>
              <p className="text-gray-500 text-sm">
                Theme, couleurs, typographie et mode de commande
              </p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </div>
        </Link>

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
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
