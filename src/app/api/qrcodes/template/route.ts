import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PlanType } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * Telecharge un template CSV vide avec documentation
 * Fonctionnalite reservee aux plans PRO et BUSINESS
 */
export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Verifier le plan de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur non trouve" }, { status: 404 });
  }

  const plan = user.plan as PlanType;
  if (plan === "FREE") {
    return NextResponse.json(
      { error: "L'import/export CSV est reserve aux plans Pro et Business." },
      { status: 403 }
    );
  }

  // Template CSV avec en-tetes et exemples
  const csvContent = `name,type,targetUrl,foregroundColor,backgroundColor,size
"Mon site web",url,https://example.com,#000000,#ffffff,400
"Page produit",url,https://example.com/product,#1e40af,#ffffff,400
"Contact",url,https://example.com/contact,#166534,#ffffff,300`;

  // Retourner le fichier CSV
  const response = new NextResponse(csvContent);
  response.headers.set("Content-Type", "text/csv; charset=utf-8");
  response.headers.set(
    "Content-Disposition",
    'attachment; filename="template_import_qrcodes.csv"'
  );

  return response;
}
