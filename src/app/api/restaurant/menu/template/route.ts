import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

// GET /api/restaurant/menu/template - Download menu template
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "xlsx";

  // Template data with examples
  const data = [
    {
      category: "Entrees",
      name: "Salade Cesar",
      description: "Laitue romaine, parmesan, croutons, sauce cesar maison",
      price: "12.50",
      tags: "vegetarien, populaire",
      available: "oui",
    },
    {
      category: "Entrees",
      name: "Soupe du jour",
      description: "Demandez a votre serveur",
      price: "8.00",
      tags: "vegetarien",
      available: "oui",
    },
    {
      category: "Plats",
      name: "Burger Classic",
      description: "Boeuf 180g, cheddar, salade, tomate, oignons, frites maison",
      price: "18.50",
      tags: "populaire, viande",
      available: "oui",
    },
    {
      category: "Plats",
      name: "Pave de saumon",
      description: "Saumon grille, legumes de saison, sauce citronnee",
      price: "22.00",
      tags: "poisson, sante",
      available: "oui",
    },
    {
      category: "Plats",
      name: "Risotto aux champignons",
      description: "Riz arborio, champignons de Paris et porcini, parmesan",
      price: "16.00",
      tags: "vegetarien, sans gluten",
      available: "oui",
    },
    {
      category: "Desserts",
      name: "Tiramisu",
      description: "Mascarpone, cafe, biscuits, cacao",
      price: "9.00",
      tags: "populaire",
      available: "oui",
    },
    {
      category: "Desserts",
      name: "Tarte aux fruits",
      description: "Fruits de saison, creme patissiere",
      price: "8.50",
      tags: "vegetarien",
      available: "oui",
    },
    {
      category: "Boissons",
      name: "Coca-Cola",
      description: "33cl",
      price: "3.50",
      tags: "",
      available: "oui",
    },
    {
      category: "Boissons",
      name: "Eau minerale",
      description: "50cl",
      price: "2.50",
      tags: "",
      available: "oui",
    },
  ];

  if (format === "csv") {
    // Generate CSV
    const headers = ["category", "name", "description", "price", "tags", "available"];
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((h) => {
            const value = row[h as keyof typeof row] || "";
            // Escape quotes and wrap in quotes if contains comma
            if (value.includes(",") || value.includes('"') || value.includes("\n")) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      ),
    ];

    const csv = csvRows.join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="menu_template.csv"',
      },
    });
  }

  // Generate Excel
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 15 }, // category
    { wch: 25 }, // name
    { wch: 50 }, // description
    { wch: 10 }, // price
    { wch: 30 }, // tags
    { wch: 10 }, // available
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Menu");

  // Add instructions sheet
  const instructions = [
    { Instructions: "Comment remplir ce fichier:" },
    { Instructions: "" },
    { Instructions: "category: Nom de la categorie (sera creee automatiquement si elle n'existe pas)" },
    { Instructions: "name: Nom du plat (obligatoire)" },
    { Instructions: "description: Description du plat (optionnel)" },
    { Instructions: "price: Prix en euros (ex: 12.50)" },
    { Instructions: "tags: Tags separes par des virgules (ex: vegetarien, populaire)" },
    { Instructions: "available: 'oui' ou 'non' (optionnel, 'oui' par defaut)" },
    { Instructions: "" },
    { Instructions: "Notes:" },
    { Instructions: "- Les categories seront creees dans l'ordre d'apparition" },
    { Instructions: "- Les tags seront crees automatiquement s'ils n'existent pas" },
    { Instructions: "- Le prix doit etre un nombre (pas de symbole euro)" },
  ];
  const instructionsSheet = XLSX.utils.json_to_sheet(instructions);
  instructionsSheet["!cols"] = [{ wch: 70 }];
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instructions");

  const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new Response(Buffer.from(excelBuffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="menu_template.xlsx"',
    },
  });
}
