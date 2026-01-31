"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { CheckCircle, Loader2, AlertCircle, Clock, ChefHat } from "lucide-react";
import { formatPrice } from "@/lib/cart";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalInCents: number;
  notes: string | null;
  paidAt: string | null;
  createdAt: string;
  restaurant: {
    name: string;
    slug: string;
  };
  table: {
    tableNumber: string;
  };
  items: Array<{
    name: string;
    imageUrl: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    notes: string | null;
  }>;
}

const statusLabels: Record<string, string> = {
  PENDING: "En attente de paiement",
  PAID: "Payee",
  PREPARING: "En preparation",
  READY: "Prete",
  COMPLETED: "Terminee",
  CANCELLED: "Annulee",
};

const statusIcons: Record<string, typeof CheckCircle> = {
  PENDING: Clock,
  PAID: CheckCircle,
  PREPARING: ChefHat,
  READY: CheckCircle,
  COMPLETED: CheckCircle,
  CANCELLED: AlertCircle,
};

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Commande introuvable");
          return;
        }

        setOrder(data.order);
      } catch {
        setError("Erreur de connexion");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();

    // Poll for status updates every 10 seconds
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Commande introuvable"}
          </h1>
          <Link href="/" className="text-violet-600 hover:underline">
            Retour a l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[order.status] || Clock;
  const isPaid = ["PAID", "PREPARING", "READY", "COMPLETED"].includes(
    order.status
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success header */}
      <div
        className={`py-8 ${isPaid ? "bg-green-50" : order.status === "CANCELLED" ? "bg-red-50" : "bg-yellow-50"}`}
      >
        <div className="max-w-lg mx-auto px-4 text-center">
          <div
            className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isPaid
                ? "bg-green-100"
                : order.status === "CANCELLED"
                  ? "bg-red-100"
                  : "bg-yellow-100"
            }`}
          >
            <StatusIcon
              className={`w-8 h-8 ${
                isPaid
                  ? "text-green-600"
                  : order.status === "CANCELLED"
                    ? "text-red-600"
                    : "text-yellow-600"
              }`}
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isPaid
              ? "Commande confirmee !"
              : order.status === "CANCELLED"
                ? "Commande annulee"
                : "En attente de paiement"}
          </h1>

          <p className="text-gray-600">
            {isPaid
              ? "Votre commande a ete transmise a la cuisine."
              : order.status === "CANCELLED"
                ? "Cette commande a ete annulee."
                : "Le paiement est en cours de verification."}
          </p>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Order info */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">Numero de commande</p>
              <p className="font-bold text-lg">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Table</p>
              <p className="font-semibold">{order.table.tableNumber}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isPaid
                    ? "bg-green-500"
                    : order.status === "CANCELLED"
                      ? "bg-red-500"
                      : "bg-yellow-500 animate-pulse"
                }`}
              />
              <span className="font-medium">{statusLabels[order.status]}</span>
            </div>
            <p className="text-sm text-gray-500">{order.restaurant.name}</p>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-xl shadow-sm border divide-y">
          {order.items.map((item, idx) => (
            <div key={idx} className="p-4 flex justify-between">
              <div>
                <p className="font-medium">
                  {item.quantity}x {item.name}
                </p>
                {item.notes && (
                  <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                )}
              </div>
              <p className="font-medium">{formatPrice(item.subtotal)}</p>
            </div>
          ))}

          <div className="p-4 flex justify-between bg-gray-50">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-violet-600">
              {formatPrice(order.totalInCents)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <Link
            href={`/m/${order.restaurant.slug}`}
            className="block w-full text-center bg-violet-600 text-white font-semibold py-3 rounded-xl hover:bg-violet-700 transition-colors"
          >
            Nouvelle commande
          </Link>
        </div>

        {/* Refresh notice */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Le statut se met a jour automatiquement
        </p>
      </main>
    </div>
  );
}
