"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Upload,
  Download,
  Tag,
  X,
} from "lucide-react";
import { formatPrice } from "@/lib/cart";

interface MenuTag {
  id: string;
  name: string;
  color: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  priceInCents: number;
  imageUrl: string | null;
  isAvailable: boolean;
  sortOrder: number;
  tags?: MenuTag[];
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  items: MenuItem[];
  _count: { items: number };
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<MenuTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  // Form states
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategoryId, setItemCategoryId] = useState("");
  const [itemTagIds, setItemTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [saving, setSaving] = useState(false);

  // Import states
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    created: number;
    categoriesCreated: number;
    tagsCreated: number;
    errors: { row: number; error: string }[];
  } | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/restaurant/categories");
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
        // Expand first category by default
        if (data.categories.length > 0 && expandedCategories.size === 0) {
          setExpandedCategories(new Set([data.categories[0].id]));
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [expandedCategories.size]);

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch("/api/restaurant/tags");
      const data = await response.json();
      if (data.tags) {
        setTags(data.tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, [fetchCategories, fetchTags]);

  function toggleCategory(id: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function openCategoryModal(category?: Category) {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setCategoryDescription(category.description || "");
    } else {
      setEditingCategory(null);
      setCategoryName("");
      setCategoryDescription("");
    }
    setShowCategoryModal(true);
  }

  function openItemModal(categoryId: string, item?: MenuItem) {
    setSelectedCategoryId(categoryId);
    if (item) {
      setEditingItem(item);
      setItemName(item.name);
      setItemDescription(item.description || "");
      setItemPrice((item.priceInCents / 100).toFixed(2));
      setItemCategoryId(categoryId);
      setItemTagIds(item.tags?.map((t) => t.id) || []);
    } else {
      setEditingItem(null);
      setItemName("");
      setItemDescription("");
      setItemPrice("");
      setItemCategoryId(categoryId);
      setItemTagIds([]);
    }
    setNewTagName("");
    setShowItemModal(true);
  }

  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingCategory ? "PUT" : "POST";
      const url = editingCategory
        ? `/api/restaurant/categories/${editingCategory.id}`
        : "/api/restaurant/categories";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription || null,
        }),
      });

      setShowCategoryModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Supprimer cette categorie et tous ses plats ?")) return;

    try {
      await fetch(`/api/restaurant/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingItem ? "PUT" : "POST";
      const url = editingItem
        ? `/api/restaurant/items/${editingItem.id}`
        : "/api/restaurant/items";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: itemName,
          description: itemDescription || null,
          priceInCents: Math.round(parseFloat(itemPrice) * 100),
          categoryId: itemCategoryId,
          tagIds: itemTagIds,
        }),
      });

      setShowItemModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateTag() {
    if (!newTagName.trim()) return;

    try {
      const response = await fetch("/api/restaurant/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName.trim() }),
      });
      const data = await response.json();

      if (data.tag) {
        setTags((prev) => [...prev, data.tag]);
        setItemTagIds((prev) => [...prev, data.tag.id]);
        setNewTagName("");
      } else if (response.status === 409 && data.tag) {
        // Tag already exists, just add it
        setItemTagIds((prev) => [...prev, data.tag.id]);
        setNewTagName("");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  }

  function toggleTag(tagId: string) {
    setItemTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  async function handleImport() {
    if (!importFile) return;

    setImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", importFile);

      const response = await fetch("/api/restaurant/menu/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setImportResult(data);
        fetchCategories();
        fetchTags();
      } else {
        setImportResult({
          success: false,
          created: 0,
          categoriesCreated: 0,
          tagsCreated: 0,
          errors: [{ row: 0, error: data.error }],
        });
      }
    } catch (error) {
      console.error("Error importing menu:", error);
      setImportResult({
        success: false,
        created: 0,
        categoriesCreated: 0,
        tagsCreated: 0,
        errors: [{ row: 0, error: "Erreur lors de l'import" }],
      });
    } finally {
      setImporting(false);
    }
  }

  async function handleToggleItemAvailability(item: MenuItem) {
    try {
      await fetch(`/api/restaurant/items/${item.id}`, { method: "PATCH" });
      fetchCategories();
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm("Supprimer ce plat ?")) return;

    try {
      await fetch(`/api/restaurant/items/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
          <p className="text-gray-500">Gerez vos categories et plats</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Importer
          </button>
          <button
            onClick={() => openCategoryModal()}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            <Plus className="w-4 h-4" />
            Categorie
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <p className="text-gray-500 mb-4">
            Aucune categorie. Commencez par creer une categorie.
          </p>
          <button
            onClick={() => openCategoryModal()}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Creer une categorie
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl border overflow-hidden"
            >
              {/* Category header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      {category._count.items} plats
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openItemModal(category.id);
                    }}
                    className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg"
                    title="Ajouter un plat"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCategoryModal(category);
                    }}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedCategories.has(category.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Items list */}
              {expandedCategories.has(category.id) && (
                <div className="border-t divide-y">
                  {category.items.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Aucun plat dans cette categorie
                    </div>
                  ) : (
                    category.items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 flex items-center justify-between ${!item.isAvailable ? "bg-gray-50" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-gray-300" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p
                                className={`font-medium ${!item.isAvailable ? "text-gray-400" : ""}`}
                              >
                                {item.name}
                              </p>
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex gap-1">
                                  {item.tags.map((tag) => (
                                    <span
                                      key={tag.id}
                                      className="px-1.5 py-0.5 text-xs rounded-full text-white"
                                      style={{ backgroundColor: tag.color }}
                                    >
                                      {tag.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-violet-600">
                            {formatPrice(item.priceInCents)}
                          </span>
                          <button
                            onClick={() => handleToggleItemAvailability(item)}
                            className={`p-2 rounded-lg ${item.isAvailable ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                            title={
                              item.isAvailable
                                ? "Marquer indisponible"
                                : "Marquer disponible"
                            }
                          >
                            {item.isAvailable ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => openItemModal(category.id, item)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Modifier la categorie" : "Nouvelle categorie"}
            </h2>
            <form onSubmit={handleSaveCategory}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? "Modifier le plat" : "Nouveau plat"}
            </h2>
            <form onSubmit={handleSaveItem}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Prix (EUR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Categorie
                  </label>
                  <select
                    value={itemCategoryId}
                    onChange={(e) => setItemCategoryId(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-2 py-1 text-xs rounded-full transition-all ${
                          itemTagIds.includes(tag.id)
                            ? "text-white ring-2 ring-offset-1"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        style={
                          itemTagIds.includes(tag.id)
                            ? { backgroundColor: tag.color, "--tw-ring-color": tag.color } as React.CSSProperties
                            : {}
                        }
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Nouveau tag..."
                      className="flex-1 px-3 py-1.5 text-sm border rounded-lg"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleCreateTag}
                      disabled={!newTagName.trim()}
                      className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                      <Tag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Importer un menu</h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportResult(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!importResult ? (
              <>
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-3">
                    Importez votre menu depuis un fichier Excel ou CSV.
                    Les categories et tags seront crees automatiquement.
                  </p>
                  <a
                    href="/api/restaurant/menu/template?format=xlsx"
                    className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Telecharger le modele Excel
                  </a>
                </div>

                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    importFile
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-violet-400"
                  }`}
                >
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="import-file"
                  />
                  <label htmlFor="import-file" className="cursor-pointer">
                    {importFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-green-600 font-medium">
                          {importFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setImportFile(null);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          Cliquez ou deposez votre fichier
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Excel (.xlsx) ou CSV
                        </p>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImportModal(false);
                      setImportFile(null);
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!importFile || importing}
                    className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Import en cours...
                      </>
                    ) : (
                      "Importer"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div>
                {importResult.created > 0 || importResult.success ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-800 font-medium">
                      Import reussi !
                    </p>
                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                      <li>{importResult.created} plat(s) cree(s)</li>
                      {importResult.categoriesCreated > 0 && (
                        <li>
                          {importResult.categoriesCreated} categorie(s) creee(s)
                        </li>
                      )}
                      {importResult.tagsCreated > 0 && (
                        <li>{importResult.tagsCreated} tag(s) cree(s)</li>
                      )}
                    </ul>
                  </div>
                ) : null}

                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 font-medium mb-2">
                      {importResult.errors.length} erreur(s)
                    </p>
                    <ul className="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
                      {importResult.errors.map((err, i) => (
                        <li key={i}>
                          {err.row > 0 ? `Ligne ${err.row}: ` : ""}
                          {err.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                    setImportResult(null);
                  }}
                  className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
