import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import dns from "dns";
import { promisify } from "util";

export const dynamic = "force-dynamic";

const resolveTxt = promisify(dns.resolveTxt);
const resolveCname = promisify(dns.resolveCname);

/**
 * POST /api/domains/verify/[id]
 * Verifie la configuration DNS d'un domaine personnalise
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Recuperer le domaine
    const domain = await prisma.customDomain.findUnique({
      where: { id },
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domaine non trouve" },
        { status: 404 }
      );
    }

    if (domain.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Non autorise a verifier ce domaine" },
        { status: 403 }
      );
    }

    // Si deja verifie, retourner le statut
    if (domain.verified) {
      return NextResponse.json({
        verified: true,
        message: "Le domaine est deja verifie",
      });
    }

    // Obtenir l'URL de l'application pour la verification CNAME
    const appHost = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000").host;

    let txtVerified = false;
    let cnameVerified = false;
    const verificationResults: {
      txt: { checked: boolean; found: boolean; expected: string; actual?: string[] };
      cname: { checked: boolean; found: boolean; expected: string; actual?: string };
    } = {
      txt: { checked: false, found: false, expected: `qr-verify=${domain.verificationToken}` },
      cname: { checked: false, found: false, expected: appHost },
    };

    // Verifier l'enregistrement TXT
    try {
      const txtRecords = await resolveTxt(domain.domain);
      verificationResults.txt.checked = true;

      // Aplatir les enregistrements TXT (ils peuvent etre fragmentes)
      const flattenedRecords = txtRecords.map((record) => record.join(""));
      verificationResults.txt.actual = flattenedRecords;

      // Chercher notre token de verification
      const expectedTxt = `qr-verify=${domain.verificationToken}`;
      txtVerified = flattenedRecords.some((record) => record === expectedTxt);
      verificationResults.txt.found = txtVerified;
    } catch (error) {
      // Pas d'enregistrement TXT trouve ou erreur DNS
      verificationResults.txt.checked = true;
      verificationResults.txt.found = false;
    }

    // Verifier l'enregistrement CNAME
    try {
      const cnameRecords = await resolveCname(domain.domain);
      verificationResults.cname.checked = true;

      if (cnameRecords.length > 0) {
        verificationResults.cname.actual = cnameRecords[0];
        // Verifier que le CNAME pointe vers notre application
        cnameVerified = cnameRecords.some((record) =>
          record === appHost || record === `${appHost}.`
        );
        verificationResults.cname.found = cnameVerified;
      }
    } catch (error) {
      // Pas d'enregistrement CNAME trouve ou erreur DNS
      verificationResults.cname.checked = true;
      verificationResults.cname.found = false;
    }

    // Le domaine est verifie si l'enregistrement TXT est correct
    // (le CNAME est necessaire pour les redirections mais pas pour la verification)
    const isVerified = txtVerified;

    if (isVerified) {
      // Mettre a jour le domaine comme verifie
      await prisma.customDomain.update({
        where: { id },
        data: {
          verified: true,
          verifiedAt: new Date(),
        },
      });

      return NextResponse.json({
        verified: true,
        cnameConfigured: cnameVerified,
        message: cnameVerified
          ? "Domaine verifie avec succes ! Les redirections sont actives."
          : "Domaine verifie ! Configurez maintenant l'enregistrement CNAME pour activer les redirections.",
        results: verificationResults,
      });
    }

    return NextResponse.json({
      verified: false,
      cnameConfigured: cnameVerified,
      message: "Verification echouee. Assurez-vous d'avoir configure l'enregistrement TXT correctement.",
      results: verificationResults,
      instructions: {
        txt: {
          type: "TXT",
          host: domain.domain,
          value: `qr-verify=${domain.verificationToken}`,
          description: "Ajoutez cet enregistrement TXT pour verifier la propriete du domaine",
        },
        cname: {
          type: "CNAME",
          host: domain.domain,
          value: appHost,
          description: "Ajoutez cet enregistrement CNAME pour activer les redirections",
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la verification du domaine:", error);
    return NextResponse.json(
      { error: "Erreur lors de la verification du domaine" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/domains/verify/[id]
 * Retourne les instructions de verification pour un domaine
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const domain = await prisma.customDomain.findUnique({
      where: { id },
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domaine non trouve" },
        { status: 404 }
      );
    }

    if (domain.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Non autorise" },
        { status: 403 }
      );
    }

    const appHost = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000").host;

    return NextResponse.json({
      domain: domain.domain,
      verified: domain.verified,
      verifiedAt: domain.verifiedAt,
      instructions: {
        txt: {
          type: "TXT",
          host: domain.domain,
          value: `qr-verify=${domain.verificationToken}`,
          description: "Ajoutez cet enregistrement TXT pour verifier la propriete du domaine",
        },
        cname: {
          type: "CNAME",
          host: domain.domain,
          value: appHost,
          description: "Ajoutez cet enregistrement CNAME pour activer les redirections",
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la recuperation des instructions:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des instructions" },
      { status: 500 }
    );
  }
}
