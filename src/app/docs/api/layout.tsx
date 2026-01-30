import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation API - QR Generator | Reference complete de l'API REST",
  description:
    "Documentation complete de l'API QR Generator. Apprenez a creer, gerer et suivre vos QR codes de maniere programmatique avec notre API REST. Exemples de code en cURL, JavaScript et Python.",
  keywords: [
    "API QR code",
    "documentation API",
    "QR code REST API",
    "generer QR code API",
    "API generation QR code",
    "QR code programmatique",
    "integration QR code",
    "SDK QR code",
  ],
  openGraph: {
    title: "Documentation API - QR Generator",
    description:
      "Integrez la generation de QR codes dans vos applications avec notre API REST. Documentation complete avec exemples de code.",
    type: "website",
    locale: "fr_FR",
    url: "https://qr-generator.fr/docs/api",
    siteName: "QR Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation API - QR Generator",
    description:
      "Integrez la generation de QR codes dans vos applications avec notre API REST.",
  },
  alternates: {
    canonical: "https://qr-generator.fr/docs/api",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
