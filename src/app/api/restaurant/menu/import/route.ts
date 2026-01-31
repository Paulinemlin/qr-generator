import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

async function getRestaurant(userId: string) {
  return prisma.restaurant.findFirst({
    where: { ownerId: userId },
  });
}

interface MenuRow {
  category: string;
  name: string;
  description?: string;
  price: string | number;
  tags?: string;
  available?: string;
}

// Colors for auto-created tags
const TAG_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#8b5cf6", "#ec4899", "#6366f1", "#64748b",
];

function parsePrice(value: string | number): number {
  if (typeof value === "number") return Math.round(value * 100);
  const cleaned = value.replace(/[^0-9.,]/g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.round(parsed * 100);
}

function parseTags(value: string | undefined): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(/[,;]/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);
}

function parseAvailable(value: string | undefined): boolean {
  if (!value) return true;
  const lower = value.toString().toLowerCase().trim();
  return !["non", "no", "false", "0", "indisponible"].includes(lower);
}

// POST /api/restaurant/menu/import - Import menu from CSV/Excel
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const restaurant = await getRestaurant(session.user.id);
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant non trouve" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
    }

    // Parse file
    let rows: MenuRow[] = [];
    const errors: { row: number; error: string }[] = [];

    const filename = file.name.toLowerCase();
    const buffer = await file.arrayBuffer();

    if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
      // Parse Excel
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        return NextResponse.json({ error: "Fichier Excel vide" }, { status: 400 });
      }
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

      rows = data.map((row) => ({
        category: String(row.category || row.categorie || "Sans categorie").trim(),
        name: String(row.name || row.nom || "").trim(),
        description: String(row.description || "").trim(),
        price: (row.price ?? row.prix ?? "0") as string | number,
        tags: String(row.tags || "").trim(),
        available: String(row.available || row.disponible || "oui").trim(),
      }));
    } else if (filename.endsWith(".csv") || file.type === "text/csv") {
      // Parse CSV
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim());

      if (lines.length < 2) {
        return NextResponse.json(
          { error: "Le fichier doit contenir au moins une ligne de donnees" },
          { status: 400 }
        );
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx] || "";
        });

        rows.push({
          category: (row.category || row.categorie || "Sans categorie").trim(),
          name: (row.name || row.nom || "").trim(),
          description: (row.description || "").trim(),
          price: row.price || row.prix || "0",
          tags: (row.tags || "").trim(),
          available: (row.available || row.disponible || "oui").trim(),
        });
      }
    } else {
      return NextResponse.json(
        { error: "Format de fichier non supporte. Utilisez CSV ou Excel (.xlsx)" },
        { status: 400 }
      );
    }

    // Validate and collect unique categories and tags
    const validRows: MenuRow[] = [];
    const categoryNames = new Set<string>();
    const tagNames = new Set<string>();

    rows.forEach((row, idx) => {
      const rowNum = idx + 2; // +2 for header and 0-index

      if (!row.name) {
        errors.push({ row: rowNum, error: "Nom du plat manquant" });
        return;
      }

      categoryNames.add(row.category);
      parseTags(row.tags).forEach((t) => tagNames.add(t));
      validRows.push(row);
    });

    if (validRows.length === 0) {
      return NextResponse.json(
        { error: "Aucune donnee valide trouvee", errors },
        { status: 400 }
      );
    }

    // Get or create categories
    const existingCategories = await prisma.menuCategory.findMany({
      where: { restaurantId: restaurant.id },
    });
    const categoryMap = new Map(existingCategories.map((c) => [c.name.toLowerCase(), c.id]));

    let maxSortOrder = Math.max(0, ...existingCategories.map((c) => c.sortOrder));
    const newCategories: { name: string; sortOrder: number }[] = [];

    for (const name of categoryNames) {
      if (!categoryMap.has(name.toLowerCase())) {
        maxSortOrder++;
        newCategories.push({ name, sortOrder: maxSortOrder });
      }
    }

    if (newCategories.length > 0) {
      await prisma.menuCategory.createMany({
        data: newCategories.map((c) => ({
          ...c,
          restaurantId: restaurant.id,
        })),
      });

      const created = await prisma.menuCategory.findMany({
        where: {
          restaurantId: restaurant.id,
          name: { in: newCategories.map((c) => c.name) },
        },
      });
      created.forEach((c) => categoryMap.set(c.name.toLowerCase(), c.id));
    }

    // Get or create tags
    const existingTags = await prisma.menuTag.findMany({
      where: { restaurantId: restaurant.id },
    });
    const tagMap = new Map(existingTags.map((t) => [t.name.toLowerCase(), t.id]));

    const newTagNames = [...tagNames].filter((t) => !tagMap.has(t));
    if (newTagNames.length > 0) {
      await prisma.menuTag.createMany({
        data: newTagNames.map((name, i) => ({
          name,
          color: TAG_COLORS[i % TAG_COLORS.length],
          restaurantId: restaurant.id,
        })),
        skipDuplicates: true,
      });

      const createdTags = await prisma.menuTag.findMany({
        where: {
          restaurantId: restaurant.id,
          name: { in: newTagNames },
        },
      });
      createdTags.forEach((t) => tagMap.set(t.name.toLowerCase(), t.id));
    }

    // Create menu items
    let createdCount = 0;
    const itemSortOrders = new Map<string, number>();

    for (const row of validRows) {
      const categoryId = categoryMap.get(row.category.toLowerCase());
      if (!categoryId) {
        errors.push({ row: validRows.indexOf(row) + 2, error: "Categorie non trouvee" });
        continue;
      }

      // Get sort order for this category
      if (!itemSortOrders.has(categoryId)) {
        const lastItem = await prisma.menuItem.findFirst({
          where: { categoryId },
          orderBy: { sortOrder: "desc" },
        });
        itemSortOrders.set(categoryId, (lastItem?.sortOrder ?? -1) + 1);
      }
      const sortOrder = itemSortOrders.get(categoryId)!;
      itemSortOrders.set(categoryId, sortOrder + 1);

      // Get tag IDs
      const itemTagIds = parseTags(row.tags)
        .map((t) => tagMap.get(t))
        .filter((id): id is string => !!id);

      try {
        await prisma.menuItem.create({
          data: {
            name: row.name,
            description: row.description || null,
            priceInCents: parsePrice(row.price),
            isAvailable: parseAvailable(row.available),
            sortOrder,
            categoryId,
            ...(itemTagIds.length > 0
              ? { tags: { connect: itemTagIds.map((id) => ({ id })) } }
              : {}),
          },
        });
        createdCount++;
      } catch (err) {
        errors.push({
          row: validRows.indexOf(row) + 2,
          error: err instanceof Error ? err.message : "Erreur lors de la creation",
        });
      }
    }

    return NextResponse.json({
      success: true,
      created: createdCount,
      categoriesCreated: newCategories.length,
      tagsCreated: newTagNames.length,
      errors,
    });
  } catch (error) {
    console.error("Menu import error:", error);
    return NextResponse.json({ error: "Erreur lors de l'import" }, { status: 500 });
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}
