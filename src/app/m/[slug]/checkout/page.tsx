"use client";

import { useEffect, useState, use, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Bell,
  CreditCard,
  Check,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart, formatPrice } from "@/lib/cart";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type OrderingMode = "PAYMENT_REQUIRED" | "CALL_WAITER" | "PAY_LATER";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  currency: string;
  canAcceptPayments: boolean;
  orderingMode: OrderingMode;
  primaryColor: string;
}

interface OrderResponse {
  orderId: string;
  orderNumber: string;
  totalInCents: number;
  clientSecret?: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
}

function CheckoutForm({
  clientSecret,
  orderId,
  slug,
  primaryColor,
}: {
  clientSecret: string;
  orderId: string;
  slug: string;
  primaryColor: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { clear } = useCart(slug);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order/${orderId}/confirmation`,
        },
        redirect: "if_required",
      });

      if (submitError) {
        setError(submitError.message || "Erreur lors du paiement");
        setLoading(false);
        return;
      }

      // Payment succeeded without redirect
      clear();
      router.push(`/order/${orderId}/confirmation`);
    } catch {
      setError("Erreur lors du paiement");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ backgroundColor: primaryColor }}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Paiement en cours...
          </>
        ) : (
          "Payer maintenant"
        )}
      </button>
    </form>
  );
}

function CheckoutContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId") || undefined;
  const router = useRouter();

  const {
    items,
    updateQuantity,
    removeItem,
    totalItems,
    totalInCents,
    isLoaded,
    clear,
  } = useCart(slug, tableId);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Fetch restaurant info
  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const response = await fetch(`/api/menu/${slug}`);
        const data = await response.json();
        if (response.ok) {
          setRestaurant(data.restaurant);
        }
      } catch {
        // Ignore
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurant();
  }, [slug]);

  // Redirect if cart is empty
  useEffect(() => {
    if (isLoaded && items.length === 0 && !order && !orderSuccess) {
      router.push(`/m/${slug}${tableId ? `?tableId=${tableId}` : ""}`);
    }
  }, [isLoaded, items.length, order, orderSuccess, router, slug, tableId]);

  const handleCreateOrder = async (withPayment: boolean) => {
    if (!tableId) {
      setError("Table non specifiee");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId,
          items: items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            notes: item.notes,
          })),
          withPayment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erreur lors de la creation de la commande");
        return;
      }

      if (withPayment && data.clientSecret) {
        setOrder(data);
      } else {
        // Order placed without payment - show success
        clear();
        setOrderSuccess(true);
        setOrder(data);
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setSubmitting(false);
    }
  };

  const primaryColor = restaurant?.primaryColor || "#7c3aed";

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: primaryColor }} />
      </div>
    );
  }

  // Order success screen (for non-payment orders)
  if (orderSuccess && order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-lg mx-auto px-4 py-4">
            <h1 className="font-bold text-lg text-center">Commande envoyee</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Check className="w-8 h-8" style={{ color: primaryColor }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Commande #{order.orderNumber}
            </h2>
            <p className="text-gray-600 mb-6">
              {restaurant?.orderingMode === "CALL_WAITER"
                ? "Votre commande a ete envoyee. Un serveur viendra prendre votre paiement."
                : "Votre commande a ete envoyee. Vous pourrez payer a la fin du repas."}
            </p>

            <div className="border-t pt-4 mt-4">
              <div className="divide-y text-left">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.subtotal, restaurant?.currency)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 mt-2 border-t flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold" style={{ color: primaryColor }}>
                  {formatPrice(order.totalInCents, restaurant?.currency)}
                </span>
              </div>
            </div>

            <Link
              href={`/m/${slug}${tableId ? `?tableId=${tableId}` : ""}`}
              className="mt-6 inline-block text-sm hover:underline"
              style={{ color: primaryColor }}
            >
              Retour au menu
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/m/${slug}${tableId ? `?tableId=${tableId}` : ""}`}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg">
              {order ? "Paiement" : "Votre commande"}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {!order ? (
          <>
            {/* Cart items */}
            <div className="bg-white rounded-xl shadow-sm border divide-y">
              {items.map((item) => (
                <div key={item.menuItemId} className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatPrice(item.priceInCents, restaurant?.currency)} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold" style={{ color: primaryColor }}>
                      {formatPrice(item.priceInCents * item.quantity, restaurant?.currency)}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="text-red-500 text-sm flex items-center gap-1 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>

                    <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-medium w-5 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full text-white flex items-center justify-center"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total</span>
                <span className="text-xl font-bold" style={{ color: primaryColor }}>
                  {formatPrice(totalInCents, restaurant?.currency)}
                </span>
              </div>
            </div>

            {/* Action buttons based on ordering mode */}
            <div className="mt-6 space-y-3">
              {restaurant?.orderingMode === "PAYMENT_REQUIRED" && restaurant.canAcceptPayments && (
                <button
                  onClick={() => handleCreateOrder(true)}
                  disabled={submitting || totalItems === 0 || !tableId}
                  className="w-full text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creation de la commande...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Proceder au paiement
                    </>
                  )}
                </button>
              )}

              {restaurant?.orderingMode === "CALL_WAITER" && (
                <button
                  onClick={() => handleCreateOrder(false)}
                  disabled={submitting || totalItems === 0 || !tableId}
                  className="w-full text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi de la commande...
                    </>
                  ) : (
                    <>
                      <Bell className="w-5 h-5" />
                      Commander et appeler un serveur
                    </>
                  )}
                </button>
              )}

              {restaurant?.orderingMode === "PAY_LATER" && (
                <button
                  onClick={() => handleCreateOrder(false)}
                  disabled={submitting || totalItems === 0 || !tableId}
                  className="w-full text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi de la commande...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Commander (payer plus tard)
                    </>
                  )}
                </button>
              )}
            </div>

            {!tableId && (
              <p className="mt-4 text-center text-sm text-red-500">
                Veuillez scanner le QR code de votre table pour commander.
              </p>
            )}
          </>
        ) : (
          <>
            {/* Order summary */}
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
              <p className="text-sm text-gray-500 mb-2">
                Commande #{order.orderNumber}
              </p>
              <div className="divide-y">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.subtotal, restaurant?.currency)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 mt-2 border-t flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold" style={{ color: primaryColor }}>
                  {formatPrice(order.totalInCents, restaurant?.currency)}
                </span>
              </div>
            </div>

            {/* Stripe Payment Element */}
            {order.clientSecret && (
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret: order.clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: primaryColor,
                        borderRadius: "8px",
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    clientSecret={order.clientSecret}
                    orderId={order.orderId}
                    slug={slug}
                    primaryColor={primaryColor}
                  />
                </Elements>
              </div>
            )}
          </>
        )}
      </main>
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

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutContent slug={slug} />
    </Suspense>
  );
}
