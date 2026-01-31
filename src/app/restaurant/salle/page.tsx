"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  RefreshCw,
  Users,
  Clock,
  ShoppingBag,
  CheckCircle,
  Circle,
} from "lucide-react";

type TableStatus = "LIBRE" | "COMMANDE_EN_COURS" | "PAYE";

interface TableData {
  id: string;
  tableNumber: string;
  status: TableStatus;
  totalItems: number;
  recentItems: { name: string; quantity: number }[];
  lastOrderTime: string | null;
  activeOrderId: string | null;
}

interface SalleData {
  tables: TableData[];
  stats: {
    total: number;
    libre: number;
    enCours: number;
    paye: number;
  };
  timestamp: string;
}

// Status configuration
const STATUS_CONFIG: Record<
  TableStatus,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  LIBRE: {
    label: "Libre",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    icon: <Circle className="w-3 h-3" />,
  },
  COMMANDE_EN_COURS: {
    label: "En cours",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: <ShoppingBag className="w-3 h-3" />,
  },
  PAYE: {
    label: "Paye",
    color: "text-green-600",
    bgColor: "bg-green-100",
    icon: <CheckCircle className="w-3 h-3" />,
  },
};

// Format elapsed time
function formatElapsedTime(isoDate: string): string {
  const now = new Date();
  const then = new Date(isoDate);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "A l'instant";
  if (diffMins < 60) return `${diffMins} min`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h${diffMins % 60 > 0 ? diffMins % 60 : ""}`;

  return `${Math.floor(diffHours / 24)}j`;
}

// Table Card Component
function TableCard({ table }: { table: TableData }) {
  const config = STATUS_CONFIG[table.status];
  const hasActivity = table.status !== "LIBRE";

  return (
    <div
      className={`rounded-xl border-2 p-4 transition-all ${
        table.status === "COMMANDE_EN_COURS"
          ? "border-blue-300 bg-blue-50/50 shadow-sm"
          : table.status === "PAYE"
            ? "border-green-300 bg-green-50/50"
            : "border-gray-200 bg-white"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">
            Table {table.tableNumber}
          </h3>
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
          >
            {config.icon}
            {config.label}
          </div>
        </div>

        {hasActivity && (
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {table.totalItems}
            </div>
            <div className="text-xs text-gray-500">articles</div>
          </div>
        )}
      </div>

      {/* Recent items */}
      {hasActivity && table.recentItems.length > 0 && (
        <div className="space-y-1 mb-3">
          {table.recentItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700 truncate flex-1 mr-2">
                {item.name}
              </span>
              <span className="text-gray-400 font-medium">x{item.quantity}</span>
            </div>
          ))}
          {table.totalItems > table.recentItems.reduce((sum, i) => sum + i.quantity, 0) && (
            <div className="text-xs text-gray-400 italic">
              + {table.totalItems - table.recentItems.reduce((sum, i) => sum + i.quantity, 0)} autres
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!hasActivity && (
        <div className="py-4 text-center text-gray-400 text-sm">
          Aucune commande
        </div>
      )}

      {/* Time elapsed */}
      {table.lastOrderTime && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <Clock className="w-3 h-3" />
          <span>{formatElapsedTime(table.lastOrderTime)}</span>
        </div>
      )}
    </div>
  );
}

// Stats Bar Component
function StatsBar({ stats }: { stats: SalleData["stats"] }) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      <div className="bg-white rounded-lg border p-3 text-center">
        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        <div className="text-xs text-gray-500">Total</div>
      </div>
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 text-center">
        <div className="text-2xl font-bold text-gray-600">{stats.libre}</div>
        <div className="text-xs text-gray-500">Libres</div>
      </div>
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-3 text-center">
        <div className="text-2xl font-bold text-blue-600">{stats.enCours}</div>
        <div className="text-xs text-blue-600">En cours</div>
      </div>
      <div className="bg-green-50 rounded-lg border border-green-200 p-3 text-center">
        <div className="text-2xl font-bold text-green-600">{stats.paye}</div>
        <div className="text-xs text-green-600">Payees</div>
      </div>
    </div>
  );
}

export default function SallePage() {
  const [data, setData] = useState<SalleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);

    try {
      const response = await fetch("/api/restaurant/salle");
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Erreur lors du chargement");
        return;
      }

      setData(result);
      setLastRefresh(new Date());
      setError("");
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || "Erreur inconnue"}</p>
        <button
          onClick={() => fetchData()}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
        >
          Reessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-violet-600" />
            Vue Salle
          </h1>
          <p className="text-gray-500 text-sm">
            Apercu en temps reel de vos tables
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-xs text-gray-400">
              Mis a jour {formatElapsedTime(lastRefresh.toISOString())}
            </span>
          )}
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Actualiser
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsBar stats={data.stats} />

      {/* Tables grid */}
      {data.tables.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Aucune table</h3>
          <p className="text-gray-500 text-sm mb-4">
            Commencez par creer des tables pour votre restaurant
          </p>
          <a
            href="/restaurant/tables"
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-sm font-medium"
          >
            Gerer les tables
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data.tables.map((table) => (
            <TableCard key={table.id} table={table} />
          ))}
        </div>
      )}

      {/* Auto-refresh indicator */}
      <div className="mt-6 text-center text-xs text-gray-400">
        Actualisation automatique toutes les 15 secondes
      </div>
    </div>
  );
}
