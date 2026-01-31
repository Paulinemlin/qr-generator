"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/cart";

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  notes: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalInCents: number;
  tableNumber: string;
  notes: string | null;
  paidAt: string | null;
  createdAt: string;
  items: OrderItem[];
}

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payee",
  PREPARING: "En preparation",
  READY: "Prete",
  COMPLETED: "Terminee",
  CANCELLED: "Annulee",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  PREPARING: "bg-blue-100 text-blue-700",
  READY: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const nextStatus: Record<string, string | null> = {
  PAID: "PREPARING",
  PREPARING: "READY",
  READY: "COMPLETED",
  COMPLETED: null,
  CANCELLED: null,
  PENDING: null,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("active");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    // Poll every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  async function fetchOrders() {
    try {
      let url = "/api/restaurant/orders?limit=100";
      if (filter === "active") {
        // Get PAID, PREPARING, READY
      } else if (filter !== "all") {
        url += `&status=${filter}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.orders) {
        let filtered = data.orders;
        if (filter === "active") {
          filtered = data.orders.filter((o: Order) =>
            ["PAID", "PREPARING", "READY"].includes(o.status)
          );
        }
        setOrders(filtered);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdating(orderId);
    try {
      await fetch(`/api/restaurant/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setUpdating(null);
    }
  }

  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-500">
            {orders.length} commande{orders.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="active">En cours</option>
            <option value="PAID">Payees</option>
            <option value="PREPARING">En preparation</option>
            <option value="READY">Pretes</option>
            <option value="COMPLETED">Terminees</option>
            <option value="all">Toutes</option>
          </select>
          <button
            onClick={fetchOrders}
            className="p-2 border rounded-lg hover:bg-gray-50"
            title="Rafraichir"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <p className="text-gray-500">Aucune commande</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const next = nextStatus[order.status];

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border overflow-hidden"
              >
                {/* Order header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    setExpandedOrder(isExpanded ? null : order.id)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-bold">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        Table {order.tableNumber} • {formatTime(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {formatPrice(order.totalInCents)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {/* Order details */}
                {isExpanded && (
                  <div className="border-t">
                    <div className="p-4 bg-gray-50">
                      <h4 className="font-medium mb-2">Articles</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <div>
                              <span className="font-medium">
                                {item.quantity}x
                              </span>{" "}
                              {item.name}
                              {item.notes && (
                                <p className="text-gray-500 text-xs">
                                  {item.notes}
                                </p>
                              )}
                            </div>
                            <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Note:</span>{" "}
                            {order.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {next && (
                      <div className="p-4 border-t flex justify-end gap-3">
                        {order.status !== "COMPLETED" && (
                          <button
                            onClick={() => updateStatus(order.id, "CANCELLED")}
                            disabled={updating === order.id}
                            className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                          >
                            Annuler
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus(order.id, next)}
                          disabled={updating === order.id}
                          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          {updating === order.id && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                          {next === "PREPARING" && "En preparation"}
                          {next === "READY" && "Prete"}
                          {next === "COMPLETED" && "Terminee"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
