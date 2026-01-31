import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBadgeExcelTemplate } from "@/lib/badge-generator";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  // Check plan
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  if (!user || user.plan === "FREE") {
    return NextResponse.json(
      { error: "L'import de badges est reserve aux plans Pro et Business." },
      { status: 403 }
    );
  }

  // Check format parameter
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "xlsx";

  if (format === "xlsx" || format === "excel") {
    // Generate Excel template
    const excelBuffer = generateBadgeExcelTemplate();

    return new Response(new Uint8Array(excelBuffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="template_badges_evenement.xlsx"',
      },
    });
  } else {
    // CSV template
    const csvContent = `firstName,lastName,company,website,linkedin
"Jean","Dupont","Acme Corp","https://acme.com","https://linkedin.com/in/jeandupont"
"Marie","Martin","Tech Solutions","https://techsolutions.fr",""
"Pierre","Bernard","StartupXYZ","","https://linkedin.com/in/pierrebernard"
"Sophie","Durand","Innovation Lab","https://innovationlab.io","https://linkedin.com/in/sophiedurand"`;

    const response = new NextResponse(csvContent);
    response.headers.set("Content-Type", "text/csv; charset=utf-8");
    response.headers.set(
      "Content-Disposition",
      'attachment; filename="template_badges_evenement.csv"'
    );

    return response;
  }
}
