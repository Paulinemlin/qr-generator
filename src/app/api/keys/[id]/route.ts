import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkCanUseAPI } from "@/lib/plan-limits";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/keys/[id] - Delete an API key
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Check if user has API access
  const canUseApi = await checkCanUseAPI(session.user.id);
  if (!canUseApi.allowed) {
    return NextResponse.json({ error: canUseApi.error }, { status: 403 });
  }

  const { id } = await params;

  // Find the API key and verify ownership
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!apiKey) {
    return NextResponse.json(
      { error: "Clé API non trouvée" },
      { status: 404 }
    );
  }

  await prisma.apiKey.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
