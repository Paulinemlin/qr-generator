import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Marketing - Boostez vos campagnes publicitaires | QR Generator",
  description:
    "Intégrez les QR codes dans vos campagnes marketing. Analytics avancés, A/B testing, tracking UTM. Connectez le print au digital.",
  keywords: [
    "qr code marketing",
    "qr code publicite",
    "qr code campagne",
    "marketing digital qr code",
    "print to digital",
  ],
};

const features = [
  {
    title: "Analytics en temps réel",
    description: "Suivez les scans en direct : nombre, localisation, appareils, heures de pointe.",
    icon: "📊",
  },
  {
    title: "A/B Testing",
    description: "Testez différentes landing pages et optimisez vos conversions automatiquement.",
    icon: "🔬",
  },
  {
    title: "UTM Tracking",
    description: "Ajoutez automatiquement des paramètres UTM pour le suivi dans Google Analytics.",
    icon: "🏷️",
  },
  {
    title: "QR codes dynamiques",
    description: "Modifiez la destination sans réimprimer. Idéal pour les campagnes évolutives.",
    icon: "🔄",
  },
  {
    title: "Personnalisation avancée",
    description: "Couleurs, logo, formes : créez des QR codes qui respectent votre charte graphique.",
    icon: "🎨",
  },
  {
    title: "Export haute qualité",
    description: "PNG, SVG, PDF : exportez en haute résolution pour tous vos supports print.",
    icon: "📤",
  },
];

const useCases = [
  {
    title: "Affiches & Flyers",
    description: "Connectez vos supports print à des landing pages, vidéos ou formulaires.",
    examples: ["Affiche événement → Billetterie", "Flyer promo → Code réduction", "Catalogue → E-shop"],
  },
  {
    title: "Packaging produit",
    description: "Enrichissez l'expérience client avec du contenu interactif sur vos emballages.",
    examples: ["Produit → Tutoriel vidéo", "Aliment → Recettes", "Cosmétique → Conseils d'utilisation"],
  },
  {
    title: "Publicité TV & Radio",
    description: "Convertissez l'audience broadcast en leads qualifiés.",
    examples: ["Spot TV → Téléchargement app", "Pub radio → Offre exclusive", "Sponsoring → Inscription"],
  },
  {
    title: "Street Marketing",
    description: "Créez des expériences interactives dans l'espace public.",
    examples: ["Guerilla → Landing page", "Activation → Jeu concours", "Pop-up → Réseaux sociaux"],
  },
];

export default function MarketingUseCasePage() {
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
            <Link href="/use-cases" className="text-sm text-muted-foreground hover:text-foreground">
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
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Marketing & Publicité
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                QR Codes Marketing
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Connectez vos campagnes print au digital. Mesurez chaque interaction,
                optimisez vos conversions et maximisez votre ROI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Lancer ma campagne
                </Link>
                <Link
                  href="/blog/qr-code-marketing-campagne"
                  className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
                >
                  10 stratégies marketing
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📈</div>
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="bg-background rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold">12,847</div>
                      <div className="text-xs text-muted-foreground">Scans ce mois</div>
                    </div>
                    <div className="bg-background rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold text-green-600">+23%</div>
                      <div className="text-xs text-muted-foreground">vs mois dernier</div>
                    </div>
                    <div className="bg-background rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold">4.2%</div>
                      <div className="text-xs text-muted-foreground">Taux conversion</div>
                    </div>
                    <div className="bg-background rounded-lg p-4 shadow-sm">
                      <div className="text-2xl font-bold">Paris</div>
                      <div className="text-xs text-muted-foreground">Top ville</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Des outils marketing puissants
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour créer, déployer et mesurer
              vos campagnes QR code.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Cas d&apos;usage marketing
            </h2>
            <p className="text-muted-foreground">
              Découvrez comment intégrer les QR codes dans vos campagnes
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="bg-background border rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.examples.map((example, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Preview */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="border rounded-2xl p-8 bg-gradient-to-br from-primary/5 to-background">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Mesurez votre ROI
              </h2>
              <p className="text-muted-foreground">
                Exemple de campagne avec QR Generator
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-primary">10 000</div>
                <div className="text-sm text-muted-foreground">Flyers distribués</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">850</div>
                <div className="text-sm text-muted-foreground">Scans (8.5% taux)</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">127</div>
                <div className="text-sm text-muted-foreground">Conversions (15%)</div>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground mb-4">
                Coût par acquisition : <span className="font-semibold text-foreground">3.15€</span> vs 12€ en digital classique
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Calculer mon ROI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à booster vos campagnes ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Créez des QR codes marketing avec analytics avancés.
            Gratuit pour commencer, évolutif selon vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md border px-8 py-4 text-base font-medium hover:bg-muted"
            >
              Voir les tarifs Pro
            </Link>
          </div>
        </div>
      </section>

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
                <li><Link href="/use-cases/restaurant" className="hover:text-foreground">Restaurant</Link></li>
                <li><Link href="/use-cases/marketing" className="hover:text-foreground">Marketing</Link></li>
                <li><Link href="/use-cases/evenement" className="hover:text-foreground">Événement</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/blog/qr-code-marketing-campagne" className="hover:text-foreground">Guide marketing</Link></li>
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
