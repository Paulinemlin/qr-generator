"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  UtensilsCrossed,
  QrCode,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  Plus,
} from "lucide-react";
import { formatPrice } from "@/lib/cart";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  stripeOnboarded: boolean;
  _count: {
    orders: number;
    tables: number;
    categories: number;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalInCents: number;
  tableNumber: string;
  createdAt: string;
}

interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
}

export default function RestaurantDashboard() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRestaurantName, setNewRestaurantName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch("/api/restaurant", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.restaurant) {
        setRestaurant(data.restaurant);

        // Fetch recent orders
        const ordersRes = await fetch("/api/restaurant/orders?limit=5", {
          credentials: "include",
        });
        const ordersData = await ordersRes.json();

        if (ordersData.orders) {
          setRecentOrders(ordersData.orders);

          // Calculate stats
          const today = new Date().toDateString();
          const todayOrders = ordersData.orders.filter(
            (o: Order) => new Date(o.createdAt).toDateString() === today
          );
          const paidOrders = todayOrders.filter((o: Order) =>
            ["PAID", "PREPARING", "READY", "COMPLETED"].includes(o.status)
          );

          setStats({
            todayOrders: paidOrders.length,
            todayRevenue: paidOrders.reduce(
              (sum: number, o: Order) => sum + o.totalInCents,
              0
            ),
            pendingOrders: ordersData.orders.filter(
              (o: Order) => o.status === "PAID" || o.status === "PREPARING"
            ).length,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRestaurant(e: React.FormEvent) {
    e.preventDefault();
    if (!newRestaurantName.trim()) return;

    setCreating(true);
    try {
      const response = await fetch("/api/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newRestaurantName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowCreateModal(false);
        setNewRestaurantName("");
        fetchData();
      } else {
        console.error("API error:", data);
        alert(`Erreur: ${data.error || "Erreur inconnue"}${data.details ? ` - ${data.details}` : ""}`);
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
      alert(`Erreur reseau: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    } finally {
      setCreating(false);
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
      <div className="max-w-lg mx-auto text-center py-12">
        <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenue sur QR Menu
        </h1>
        <p className="text-gray-600 mb-6">
          Creez votre restaurant pour commencer a recevoir des commandes.
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700"
        >
          <Plus className="w-5 h-5" />
          Creer mon restaurant
        </button>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Creer votre restaurant</h2>
              <form onSubmit={handleCreateRestaurant}>
                <input
                  type="text"
                  value={newRestaurantName}
                  onChange={(e) => setNewRestaurantName(e.target.value)}
                  placeholder="Nom du restaurant"
                  className="w-full px-4 py-3 border rounded-lg mb-4"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !newRestaurantName.trim()}
                    className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                  >
                    {creating ? "Creation..." : "Creer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
          <p className="text-gray-500">Dashboard</p>
        </div>
        {!restaurant.stripeOnboarded && (
          <Link
            href="/restaurant/settings"
            className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium"
          >
            <AlertCircle className="w-4 h-4" />
            Configurer Stripe
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">CA du jour</p>
              <p className="text-xl font-bold">
                {formatPrice(stats?.todayRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Commandes du jour</p>
              <p className="text-xl font-bold">{stats?.todayOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">En cours</p>
              <p className="text-xl font-bold">{stats?.pendingOrders || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Link
          href="/restaurant/menu"
          className="bg-white rounded-xl border p-4 hover:border-violet-300 transition-colors"
        >
          <UtensilsCrossed className="w-8 h-8 text-violet-600 mb-2" />
          <h3 className="font-semibold">Menu</h3>
          <p className="text-sm text-gray-500">
            {restaurant._count.categories} categories
          </p>
        </Link>

        <Link
          href="/restaurant/tables"
          className="bg-white rounded-xl border p-4 hover:border-violet-300 transition-colors"
        >
          <QrCode className="w-8 h-8 text-violet-600 mb-2" />
          <h3 className="font-semibold">Tables</h3>
          <p className="text-sm text-gray-500">
            {restaurant._count.tables} tables configurees
          </p>
        </Link>

        <Link
          href="/restaurant/orders"
          className="bg-white rounded-xl border p-4 hover:border-violet-300 transition-colors"
        >
          <ClipboardList className="w-8 h-8 text-violet-600 mb-2" />
          <h3 className="font-semibold">Commandes</h3>
          <p className="text-sm text-gray-500">
            {restaurant._count.orders} commandes
          </p>
        </Link>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Commandes recentes</h2>
          <Link
            href="/restaurant/orders"
            className="text-sm text-violet-600 hover:underline"
          >
            Voir tout
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucune commande pour le moment
          </div>
        ) : (
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/restaurant/orders?id=${order.id}`)}
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    Table {order.tableNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatPrice(order.totalInCents)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : order.status === "PREPARING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
