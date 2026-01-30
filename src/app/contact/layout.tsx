import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - QR Generator | Contactez notre equipe",
  description:
    "Contactez l'equipe QR Generator pour toute question, support technique ou demande de partenariat. Reponse garantie sous 24-48h ouvrables.",
  keywords: [
    "contact QR Generator",
    "support technique QR code",
    "aide QR code",
    "service client",
    "assistance",
  ],
  openGraph: {
    title: "Contactez-nous - QR Generator",
    description:
      "Une question sur QR Generator ? Notre equipe est la pour vous aider. Support technique, facturation, partenariats - nous repondons a toutes vos demandes.",
    type: "website",
    locale: "fr_FR",
    url: "/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact - QR Generator",
    description:
      "Contactez l'equipe QR Generator pour toute question ou demande d'assistance.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
