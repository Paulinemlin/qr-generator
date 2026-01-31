"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Palette,
  ImageIcon,
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
  allergens?: string[];
  tags?: MenuTag[];
}

// Liste des allergènes réglementaires (14 allergènes majeurs EU)
const ALLERGENS = [
  { id: "gluten", label: "Gluten", icon: "🌾" },
  { id: "crustaces", label: "Crustacés", icon: "🦐" },
  { id: "oeufs", label: "Œufs", icon: "🥚" },
  { id: "poisson", label: "Poisson", icon: "🐟" },
  { id: "arachides", label: "Arachides", icon: "🥜" },
  { id: "soja", label: "Soja", icon: "🫘" },
  { id: "lait", label: "Lait", icon: "🥛" },
  { id: "fruits-coques", label: "Fruits à coque", icon: "🌰" },
  { id: "celeri", label: "Céleri", icon: "🥬" },
  { id: "moutarde", label: "Moutarde", icon: "🟡" },
  { id: "sesame", label: "Sésame", icon: "⚪" },
  { id: "sulfites", label: "Sulfites", icon: "🍷" },
  { id: "lupin", label: "Lupin", icon: "🌸" },
  { id: "mollusques", label: "Mollusques", icon: "🦪" },
];

// Régimes alimentaires
const DIETS = [
  { id: "vegetarien", label: "Végétarien", icon: "🥬", color: "bg-green-100 text-green-700" },
  { id: "vegan", label: "Végan", icon: "🌱", color: "bg-emerald-100 text-emerald-700" },
  { id: "sans-gluten", label: "Sans gluten", icon: "🌾", color: "bg-amber-100 text-amber-700" },
  { id: "halal", label: "Halal", icon: "☪️", color: "bg-blue-100 text-blue-700" },
  { id: "casher", label: "Casher", icon: "✡️", color: "bg-indigo-100 text-indigo-700" },
  { id: "bio", label: "Bio", icon: "🌿", color: "bg-lime-100 text-lime-700" },
  { id: "fait-maison", label: "Fait maison", icon: "👨‍🍳", color: "bg-orange-100 text-orange-700" },
  { id: "epice", label: "Épicé", icon: "🌶️", color: "bg-red-100 text-red-700" },
];

interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  items: MenuItem[];
  _count: { items: number };
}

// Suggestions de catégories pour la restauration
const CATEGORY_SUGGESTIONS = [
  "Entrées",
  "Plats",
  "Viandes",
  "Poissons",
  "Accompagnements",
  "Desserts",
  "Boissons",
  "Vins",
  "Cocktails",
  "Formules",
  "Petit-déjeuner",
  "Spécialités",
];

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<MenuTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // Drag state
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<{
    id: string;
    categoryId: string;
  } | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

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
  const [itemImageUrl, setItemImageUrl] = useState<string | null>(null);
  const [itemTagIds, setItemTagIds] = useState<string[]>([]);
  const [itemAllergens, setItemAllergens] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  // === DRAG & DROP HANDLERS ===

  // Category drag handlers
  function handleCategoryDragStart(e: React.DragEvent, categoryId: string) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("type", "category");
    e.dataTransfer.setData("categoryId", categoryId);
    setDraggedCategory(categoryId);
  }

  function handleCategoryDragOver(e: React.DragEvent, categoryId: string) {
    e.preventDefault();
    if (draggedCategory && draggedCategory !== categoryId) {
      setDragOverCategory(categoryId);
    }
  }

  function handleCategoryDragLeave() {
    setDragOverCategory(null);
  }

  async function handleCategoryDrop(e: React.DragEvent, targetCategoryId: string) {
    e.preventDefault();
    setDragOverCategory(null);

    if (!draggedCategory || draggedCategory === targetCategoryId) {
      setDraggedCategory(null);
      return;
    }

    // Reorder categories
    const newCategories = [...categories];
    const draggedIndex = newCategories.findIndex((c) => c.id === draggedCategory);
    const targetIndex = newCategories.findIndex((c) => c.id === targetCategoryId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [removed] = newCategories.splice(draggedIndex, 1);
      newCategories.splice(targetIndex, 0, removed);
      setCategories(newCategories);

      // Update server
      try {
        await fetch("/api/restaurant/categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryIds: newCategories.map((c) => c.id),
          }),
        });
      } catch (error) {
        console.error("Error reordering categories:", error);
        fetchCategories();
      }
    }

    setDraggedCategory(null);
  }

  function handleCategoryDragEnd() {
    setDraggedCategory(null);
    setDragOverCategory(null);
  }

  // Item drag handlers
  function handleItemDragStart(
    e: React.DragEvent,
    itemId: string,
    categoryId: string
  ) {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("type", "item");
    e.dataTransfer.setData("itemId", itemId);
    e.dataTransfer.setData("sourceCategoryId", categoryId);
    setDraggedItem({ id: itemId, categoryId });
  }

  function handleItemDragOver(e: React.DragEvent, itemId: string) {
    e.preventDefault();
    e.stopPropagation();
    if (draggedItem && draggedItem.id !== itemId) {
      setDragOverItem(itemId);
    }
  }

  function handleItemDragLeave(e: React.DragEvent) {
    e.stopPropagation();
    setDragOverItem(null);
  }

  async function handleItemDrop(
    e: React.DragEvent,
    targetItemId: string,
    targetCategoryId: string
  ) {
    e.preventDefault();
    e.stopPropagation();
    setDragOverItem(null);

    if (!draggedItem || draggedItem.id === targetItemId) {
      setDraggedItem(null);
      return;
    }

    const sourceCategory = categories.find((c) => c.id === draggedItem.categoryId);
    const targetCategory = categories.find((c) => c.id === targetCategoryId);

    if (!sourceCategory || !targetCategory) {
      setDraggedItem(null);
      return;
    }

    // Create new categories array
    const newCategories = categories.map((cat) => ({ ...cat, items: [...cat.items] }));
    const sourceCatIndex = newCategories.findIndex((c) => c.id === draggedItem.categoryId);
    const targetCatIndex = newCategories.findIndex((c) => c.id === targetCategoryId);

    // Find and remove item from source
    const itemIndex = newCategories[sourceCatIndex].items.findIndex(
      (item) => item.id === draggedItem.id
    );
    const [movedItem] = newCategories[sourceCatIndex].items.splice(itemIndex, 1);

    // Find target position and insert
    const targetItemIndex = newCategories[targetCatIndex].items.findIndex(
      (item) => item.id === targetItemId
    );
    newCategories[targetCatIndex].items.splice(targetItemIndex, 0, movedItem);

    setCategories(newCategories);

    // Update server
    try {
      await fetch("/api/restaurant/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemIds: newCategories[targetCatIndex].items.map((item) => item.id),
          categoryId: targetCategoryId,
        }),
      });
    } catch (error) {
      console.error("Error reordering items:", error);
      fetchCategories();
    }

    setDraggedItem(null);
  }

  function handleItemDragEnd() {
    setDraggedItem(null);
    setDragOverItem(null);
  }

  // === MODAL HANDLERS ===

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
      setItemImageUrl(item.imageUrl);
      setItemTagIds(item.tags?.map((t) => t.id) || []);
      setItemAllergens(item.allergens || []);
    } else {
      setEditingItem(null);
      setItemName("");
      setItemDescription("");
      setItemPrice("");
      setItemCategoryId(categoryId);
      setItemImageUrl(null);
      setItemTagIds([]);
      setItemAllergens([]);
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

  async function handleUploadImage(file: File) {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setItemImageUrl(data.url);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploadingImage(false);
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
          imageUrl: itemImageUrl,
          tagIds: itemTagIds,
          allergens: itemAllergens,
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

  function toggleAllergen(allergenId: string) {
    setItemAllergens((prev) =>
      prev.includes(allergenId)
        ? prev.filter((id) => id !== allergenId)
        : [...prev, allergenId]
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
          <Link
            href="/restaurant/menu/apparence"
            className="flex items-center gap-2 px-4 py-2 border border-violet-300 text-violet-700 rounded-lg hover:bg-violet-50"
          >
            <Palette className="w-4 h-4" />
            Apparence
          </Link>
          <a
            href="/api/restaurant/menu/template?format=xlsx"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Template
          </a>
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
            Aucune categorie. Commencez par creer une categorie ou importez votre menu.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="/api/restaurant/menu/template?format=xlsx"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Template Excel
            </a>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-violet-300 text-violet-700 rounded-lg hover:bg-violet-50"
            >
              <Upload className="w-4 h-4" />
              Importer
            </button>
            <button
              onClick={() => openCategoryModal()}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              <Plus className="w-4 h-4" />
              Nouvelle categorie
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`bg-white rounded-xl border overflow-hidden transition-all ${
                dragOverCategory === category.id
                  ? "border-violet-500 ring-2 ring-violet-200"
                  : ""
              } ${draggedCategory === category.id ? "opacity-50" : ""}`}
              draggable
              onDragStart={(e) => handleCategoryDragStart(e, category.id)}
              onDragOver={(e) => handleCategoryDragOver(e, category.id)}
              onDragLeave={handleCategoryDragLeave}
              onDrop={(e) => handleCategoryDrop(e, category.id)}
              onDragEnd={handleCategoryDragEnd}
            >
              {/* Category header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 select-none"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="cursor-grab active:cursor-grabbing p-1 -m-1 hover:bg-gray-100 rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </div>
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
                        draggable
                        onDragStart={(e) =>
                          handleItemDragStart(e, item.id, category.id)
                        }
                        onDragOver={(e) => handleItemDragOver(e, item.id)}
                        onDragLeave={handleItemDragLeave}
                        onDrop={(e) => handleItemDrop(e, item.id, category.id)}
                        onDragEnd={handleItemDragEnd}
                        className={`p-4 flex items-center justify-between transition-all ${
                          !item.isAvailable ? "bg-gray-50" : ""
                        } ${
                          dragOverItem === item.id
                            ? "border-t-2 border-violet-500"
                            : ""
                        } ${
                          draggedItem?.id === item.id ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="cursor-grab active:cursor-grabbing p-1 -m-1 hover:bg-gray-100 rounded"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GripVertical className="w-4 h-4 text-gray-300" />
                          </div>
                          {item.imageUrl && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p
                                className={`font-medium ${!item.isAvailable ? "text-gray-400" : ""}`}
                              >
                                {item.name}
                              </p>
                              {/* Diets & Allergens icons */}
                              {item.allergens && item.allergens.length > 0 && (
                                <div className="flex gap-0.5">
                                  {item.allergens.slice(0, 5).map((id) => {
                                    const diet = DIETS.find(d => d.id === id);
                                    const allergen = ALLERGENS.find(a => a.id === id);
                                    const icon = diet?.icon || allergen?.icon;
                                    return icon ? (
                                      <span key={id} className="text-sm" title={diet?.label || allergen?.label}>
                                        {icon}
                                      </span>
                                    ) : null;
                                  })}
                                  {item.allergens.length > 5 && (
                                    <span className="text-xs text-gray-400">+{item.allergens.length - 5}</span>
                                  )}
                                </div>
                              )}
                              {/* Tags */}
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
                {!editingCategory && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Suggestions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_SUGGESTIONS.filter(
                        (s) => !categories.some((c) => c.name.toLowerCase() === s.toLowerCase())
                      ).map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setCategoryName(suggestion)}
                          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                            categoryName === suggestion
                              ? "bg-violet-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-violet-100 hover:text-violet-700"
                          }`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="ou saisissez un nom personnalisé"
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
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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

      {/* Item Modal - Improved */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingItem ? "Modifier le plat" : "Nouveau plat"}
              </h2>
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveItem} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Row 1: Photo + Basic info */}
                <div className="grid md:grid-cols-[200px,1fr] gap-6">
                  {/* Photo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo
                    </label>
                    {itemImageUrl ? (
                      <div className="space-y-2">
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                          <Image
                            src={itemImageUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex gap-2">
                          <label className="flex-1 cursor-pointer px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                            <Upload className="w-4 h-4" />
                            Changer
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadImage(file);
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setItemImageUrl(null)}
                            className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-xl hover:border-violet-400 hover:bg-violet-50/50 transition-colors">
                        {uploadingImage ? (
                          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                        ) : (
                          <>
                            <ImageIcon className="w-10 h-10 text-gray-300 mb-2" />
                            <span className="text-sm text-gray-500">Ajouter une photo</span>
                            <span className="text-xs text-gray-400 mt-1">PNG, JPG, WebP</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadImage(file);
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Basic info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du plat *
                      </label>
                      <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="Ex: Salade César, Burger Classique..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                        rows={3}
                        placeholder="Décrivez les ingrédients et la préparation..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prix *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={itemPrice}
                            onChange={(e) => setItemPrice(e.target.value)}
                            className="w-full px-4 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            placeholder="0.00"
                            required
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                            EUR
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Catégorie *
                        </label>
                        <select
                          value={itemCategoryId}
                          onChange={(e) => setItemCategoryId(e.target.value)}
                          className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                          required
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-200" />

                {/* Régimes & Labels */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Régimes & Labels
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DIETS.map((diet) => (
                      <button
                        key={diet.id}
                        type="button"
                        onClick={() => toggleAllergen(diet.id)}
                        className={`px-3 py-1.5 text-sm rounded-full transition-all flex items-center gap-1.5 ${
                          itemAllergens.includes(diet.id)
                            ? `${diet.color} ring-2 ring-offset-1 ring-current`
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <span>{diet.icon}</span>
                        <span>{diet.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Allergènes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allergènes présents
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Sélectionnez les allergènes contenus dans ce plat (obligatoire selon la réglementation)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ALLERGENS.map((allergen) => (
                      <button
                        key={allergen.id}
                        type="button"
                        onClick={() => toggleAllergen(allergen.id)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all flex items-center gap-2 ${
                          itemAllergens.includes(allergen.id)
                            ? "bg-red-50 border-red-300 text-red-700"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-base">{allergen.icon}</span>
                        <span className="truncate">{allergen.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags personnalisés */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tags personnalisés
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1.5 text-sm rounded-full transition-all ${
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
                    {tags.length === 0 && (
                      <span className="text-sm text-gray-400">Aucun tag créé</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Créer un nouveau tag..."
                      className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                      className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4" />
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="flex-1 px-4 py-2.5 border rounded-lg hover:bg-white transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer"
                  )}
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
