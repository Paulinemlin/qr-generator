"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Loader2,
  Plus,
  Trash2,
  Download,
  QrCode,
  ExternalLink,
  CheckSquare,
  Square,
  X,
} from "lucide-react";

interface Table {
  id: string;
  tableNumber: string;
  qrcode: {
    id: string;
    qrImageUrl: string;
  } | null;
  _count: {
    orders: number;
  };
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [bulkCount, setBulkCount] = useState("10");
  const [bulkPrefix, setBulkPrefix] = useState("");
  const [creating, setCreating] = useState(false);
  const [restaurantSlug, setRestaurantSlug] = useState("");
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTables();
    fetchRestaurant();
  }, []);

  async function fetchTables() {
    try {
      const response = await fetch("/api/restaurant/tables", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.tables) {
        setTables(data.tables);
      } else if (data.error) {
        console.error("API error:", data.error);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRestaurant() {
    try {
      const response = await fetch("/api/restaurant", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.restaurant) {
        setRestaurantSlug(data.restaurant.slug);
      }
    } catch (error) {
      console.error("Error fetching restaurant:", error);
    }
  }

  async function handleCreateTable(e: React.FormEvent) {
    e.preventDefault();
    if (!tableNumber.trim()) return;

    setCreating(true);
    try {
      const response = await fetch("/api/restaurant/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tableNumber: tableNumber.trim() }),
      });

      if (response.ok) {
        setShowModal(false);
        setTableNumber("");
        fetchTables();
      } else {
        const data = await response.json();
        alert(`${data.error || "Erreur"}${data.details ? `: ${data.details}` : ""}`);
      }
    } catch (error) {
      console.error("Error creating table:", error);
      alert(`Erreur reseau: ${error instanceof Error ? error.message : "Inconnue"}`);
    } finally {
      setCreating(false);
    }
  }

  async function handleBulkCreate(e: React.FormEvent) {
    e.preventDefault();
    const count = parseInt(bulkCount, 10);
    if (count < 1 || count > 50) return;

    setCreating(true);
    try {
      const response = await fetch("/api/restaurant/tables", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ count, prefix: bulkPrefix }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${data.created} tables creees`);
        setShowBulkModal(false);
        setBulkCount("10");
        setBulkPrefix("");
        fetchTables();
      } else {
        const data = await response.json();
        alert(`${data.error || "Erreur"}${data.details ? `: ${data.details}` : ""}`);
      }
    } catch (error) {
      console.error("Error creating tables:", error);
      alert(`Erreur reseau: ${error instanceof Error ? error.message : "Inconnue"}`);
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteTable(id: string, tableNumber: string) {
    if (!confirm(`Supprimer la table ${tableNumber} ?`)) return;

    try {
      await fetch(`/api/restaurant/tables/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchTables();
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  }

  async function handleDeleteSelected() {
    if (selectedTables.size === 0) return;

    const count = selectedTables.size;
    if (!confirm(`Supprimer ${count} table${count > 1 ? "s" : ""} ?`)) return;

    setDeleting(true);
    try {
      await Promise.all(
        Array.from(selectedTables).map((id) =>
          fetch(`/api/restaurant/tables/${id}`, {
            method: "DELETE",
            credentials: "include",
          })
        )
      );
      setSelectedTables(new Set());
      fetchTables();
    } catch (error) {
      console.error("Error deleting tables:", error);
    } finally {
      setDeleting(false);
    }
  }

  function downloadQR(table: Table) {
    if (!table.qrcode?.qrImageUrl) return;

    const link = document.createElement("a");
    link.href = table.qrcode.qrImageUrl;
    link.download = `table-${table.tableNumber}-qr.png`;
    link.click();
  }

  function downloadSelectedQRs() {
    const selectedTablesList = tables.filter((t) => selectedTables.has(t.id));
    selectedTablesList.forEach((table, index) => {
      if (table.qrcode?.qrImageUrl) {
        setTimeout(() => {
          const link = document.createElement("a");
          link.href = table.qrcode!.qrImageUrl;
          link.download = `table-${table.tableNumber}-qr.png`;
          link.click();
        }, index * 200); // Stagger downloads to avoid browser blocking
      }
    });
  }

  function openMenuPreview(table: Table) {
    if (!restaurantSlug) return;
    window.open(`/m/${restaurantSlug}/table/${table.id}`, "_blank");
  }

  function toggleTableSelection(id: string) {
    setSelectedTables((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedTables.size === tables.length) {
      setSelectedTables(new Set());
    } else {
      setSelectedTables(new Set(tables.map((t) => t.id)));
    }
  }

  function clearSelection() {
    setSelectedTables(new Set());
  }

  const allSelected = tables.length > 0 && selectedTables.size === tables.length;
  const someSelected = selectedTables.size > 0;

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
          <h1 className="text-2xl font-bold text-gray-900">Tables</h1>
          <p className="text-gray-500">Gerez vos tables et QR codes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-violet-600 text-violet-600 rounded-lg hover:bg-violet-50"
          >
            <Plus className="w-4 h-4" />
            Creer en lot
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            <Plus className="w-4 h-4" />
            Table
          </button>
        </div>
      </div>

      {/* Selection toolbar */}
      {someSelected && (
        <div className="mb-4 p-3 bg-violet-50 border border-violet-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-violet-100 rounded"
            >
              <X className="w-5 h-5 text-violet-600" />
            </button>
            <span className="text-sm font-medium text-violet-700">
              {selectedTables.size} table{selectedTables.size > 1 ? "s" : ""} selectionnee{selectedTables.size > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadSelectedQRs}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-violet-300 text-violet-700 rounded-lg hover:bg-violet-50"
            >
              <Download className="w-4 h-4" />
              Telecharger QR
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={deleting}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </div>
      )}

      {tables.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <QrCode className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            Aucune table configuree. Creez vos tables pour generer les QR codes.
          </p>
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Creer des tables
          </button>
        </div>
      ) : (
        <>
          {/* Select all header */}
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
            >
              {allSelected ? (
                <CheckSquare className="w-5 h-5 text-violet-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
              {allSelected ? "Tout desectionner" : "Tout selectionner"}
            </button>
            <span className="text-sm text-gray-400">
              ({tables.length} table{tables.length > 1 ? "s" : ""})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tables.map((table) => {
              const isSelected = selectedTables.has(table.id);
              return (
                <div
                  key={table.id}
                  className={`bg-white rounded-xl border p-4 transition-all ${
                    isSelected
                      ? "border-violet-500 ring-2 ring-violet-200"
                      : "hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTableSelection(table.id)}
                        className="mt-0.5 text-gray-400 hover:text-violet-600"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-violet-600" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                      <div>
                        <h3 className="font-semibold">Table {table.tableNumber}</h3>
                        <p className="text-sm text-gray-500">
                          {table._count.orders} commandes
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTable(table.id, table.tableNumber)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {table.qrcode?.qrImageUrl && (
                    <div
                      className="bg-gray-50 rounded-lg p-3 mb-3 cursor-pointer"
                      onClick={() => toggleTableSelection(table.id)}
                    >
                      <Image
                        src={table.qrcode.qrImageUrl}
                        alt={`QR Table ${table.tableNumber}`}
                        width={200}
                        height={200}
                        className="w-full aspect-square object-contain"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadQR(table)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
                    >
                      <Download className="w-4 h-4" />
                      QR
                    </button>
                    <button
                      onClick={() => openMenuPreview(table)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Tester
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Single table modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouvelle table</h2>
            <form onSubmit={handleCreateTable}>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Numero / Nom de table
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Ex: 1, A1, Terrasse 3..."
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                >
                  {creating ? "Creation..." : "Creer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk create modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Creer des tables en lot</h2>
            <form onSubmit={handleBulkCreate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre de tables
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={bulkCount}
                    onChange={(e) => setBulkCount(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum 50 tables</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Prefixe (optionnel)
                  </label>
                  <input
                    type="text"
                    value={bulkPrefix}
                    onChange={(e) => setBulkPrefix(e.target.value)}
                    placeholder="Ex: A, Terrasse-"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Resultat: {bulkPrefix || ""}1, {bulkPrefix || ""}2, etc.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating}
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
