import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cas d'usage QR Code - Restaurant, Marketing, Événement | QR Generator",
  description:
    "Découvrez comment utiliser les QR codes pour votre business : restaurants, marketing, événements, retail, et plus encore.",
  keywords: [
    "qr code restaurant",
    "qr code marketing",
    "qr code evenement",
    "qr code entreprise",
    "qr code retail",
  ],
};

const useCases = [
  {
    slug: "pharmacie",
    title: "Pharmacie & Officine",
    description:
      "Transfert d'ordonnances par email, informations médicaments et click & collect pour les pharmacies.",
    icon: "💊",
    features: ["Envoi ordonnance", "Email automatique", "Click & Collect", "Info médicaments"],
    highlighted: true,
  },
  {
    slug: "restaurant",
    title: "Restaurant & Hôtellerie",
    description:
      "Menus digitaux, réservations, avis clients et programme de fidélité pour les restaurants, hôtels et cafés.",
    icon: "🍽️",
    features: ["Menu sans contact", "Commande en ligne", "Avis Google", "Fidélité"],
  },
  {
    slug: "marketing",
    title: "Marketing & Publicité",
    description:
      "Connectez vos campagnes print au digital. Mesurez l'engagement et optimisez vos conversions.",
    icon: "📈",
    features: ["Print-to-digital", "Analytics avancés", "A/B testing", "UTM tracking"],
  },
  {
    slug: "evenement",
    title: "Événements & Salons",
    description:
      "Check-in digital, badges, programmes et networking pour vos conférences et événements.",
    icon: "🎫",
    features: ["Check-in rapide", "Programme digital", "Networking", "Feedback"],
  },
  {
    slug: "retail",
    title: "Retail & E-commerce",
    description:
      "Informations produit, promotions et click & collect pour les magasins physiques.",
    icon: "🛍️",
    features: ["Fiche produit", "Promotions", "Click & Collect", "Avis clients"],
  },
  {
    slug: "immobilier",
    title: "Immobilier",
    description:
      "Visites virtuelles, informations sur les biens et contact direct pour les agences immobilières.",
    icon: "🏠",
    features: ["Visite virtuelle", "Plans et photos", "Contact agent", "Estimation"],
  },
  {
    slug: "artisan",
    title: "Artisans & Services",
    description:
      "Devis en ligne, prise de rendez-vous et avis clients pour plombiers, électriciens, coiffeurs...",
    icon: "🔧",
    features: ["Demande devis", "Prise RDV", "Avis clients", "Portfolio"],
  },
  {
    slug: "sante",
    title: "Santé & Médical",
    description:
      "Prise de rendez-vous, informations patients et traçabilité pour le secteur médical.",
    icon: "🏥",
    features: ["Prise de RDV", "Dossier patient", "Ordonnances", "Traçabilité"],
  },
  {
    slug: "education",
    title: "Éducation & Formation",
    description:
      "Ressources pédagogiques, présences et évaluations pour les établissements scolaires.",
    icon: "📚",
    features: ["Cours en ligne", "Émargement", "Quiz", "Bibliothèque"],
  },
  {
    slug: "transport",
    title: "Transport & Logistique",
    description:
      "Billets, suivi de colis et informations voyageurs pour le secteur du transport.",
    icon: "🚆",
    features: ["E-billets", "Suivi colis", "Horaires", "Itinéraires"],
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            QR Generator
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <Link href="/use-cases" className="text-sm font-medium">
              Cas d&apos;usage
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Tarifs
            </Link>
            <Link href="/login">
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Connexion
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            QR Codes par secteur d&apos;activité
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Découvrez comment les QR codes transforment chaque industrie.
            Solutions adaptées à vos besoins spécifiques.
          </p>
        </div>
      </section>

      {/* Use Cases Grid */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase) => (
            <Link
              key={useCase.slug}
              href={`/use-cases/${useCase.slug}`}
              className="group block border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-4">{useCase.icon}</div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {useCase.title}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                {useCase.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {useCase.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-xs px-2 py-1 rounded-md bg-muted"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center p-12 rounded-xl bg-primary/5 border border-primary/10">
          <h2 className="text-2xl font-semibold mb-2">
            Votre secteur n&apos;est pas listé ?
          </h2>
          <p className="text-muted-foreground mb-6">
            Les QR codes s&apos;adaptent à tous les besoins. Créez le vôtre en quelques clics.
          </p>
          <Link
            href="/register"
            className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Créer mon QR code gratuitement
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/create" className="hover:text-foreground">Créer un QR code</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Tarifs</Link></li>
                <li><Link href="/docs/api" className="hover:text-foreground">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Cas d&apos;usage</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {useCases.slice(0, 4).map((uc) => (
                  <li key={uc.slug}>
                    <Link href={`/use-cases/${uc.slug}`} className="hover:text-foreground">
                      {uc.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/guides" className="hover:text-foreground">Guides</Link></li>
                <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">À propos</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="/legal" className="hover:text-foreground">Mentions légales</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 QR Generator. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
