import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs - QR Generator | Plans Gratuit, Pro et Business",
  description:
    "Decouvrez nos plans tarifaires pour QR Generator. Gratuit pour commencer, Pro a 9/mois pour les professionnels, Business a 29/mois pour les entreprises. Sans engagement, paiement securise.",
  keywords: [
    "tarif QR code",
    "prix QR code",
    "QR code gratuit",
    "QR code professionnel",
    "QR code entreprise",
    "generateur QR code premium",
    "QR code illimite",
    "QR code dynamique prix",
  ],
  openGraph: {
    title: "Tarifs QR Generator - Plans adaptes a vos besoins",
    description:
      "Creez des QR codes professionnels. Plan Gratuit (3 QR codes), Pro a 9/mois (illimites), Business a 29/mois (API, equipes). Sans engagement.",
    type: "website",
    locale: "fr_FR",
    url: "/pricing",
    images: [
      {
        url: "/og-pricing.png",
        width: 1200,
        height: 630,
        alt: "QR Generator - Tarifs et plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarifs QR Generator - Gratuit, Pro et Business",
    description:
      "QR codes professionnels pour tous. Commencez gratuitement, evoluez selon vos besoins. Sans engagement.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
