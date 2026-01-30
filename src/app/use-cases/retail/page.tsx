import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Magasin & Retail - Fiches Produit, Click & Collect | QR Generator",
  description:
    "Boostez vos ventes en magasin avec des QR codes produit. Fiches techniques, avis clients, promotions, click & collect. Solution complète pour le retail et e-commerce.",
  keywords: [
    "qr code magasin",
    "qr code produit",
    "click and collect qr code",
    "fiche produit qr",
    "qr code retail",
    "qr code e-commerce",
    "qr code promotions",
    "qr code fidélité",
    "qr code inventaire",
    "qr code boutique",
  ],
  openGraph: {
    title: "QR Code Retail & E-commerce - Transformez l'expérience client",
    description: "Fiches produit, avis clients, promotions et click & collect via QR code. Boostez vos ventes en magasin.",
  },
};

const features = [
  {
    title: "Fiches produit enrichies",
    description: "Donnez accès instantané aux caractéristiques détaillées, compositions, guides de tailles et tutoriels vidéo.",
    icon: "📋",
  },
  {
    title: "Promotions personnalisées",
    description: "Déclenchez des offres exclusives en magasin. Codes promo, ventes flash et réductions ciblées.",
    icon: "🏷️",
  },
  {
    title: "Click & Collect simplifié",
    description: "Le client scanne, commande et récupère en magasin. Réduisez les abandons de panier.",
    icon: "🛒",
  },
  {
    title: "Avis clients accessibles",
    description: "Affichez les notes et commentaires directement sur le produit. Rassurez et convertissez.",
    icon: "⭐",
  },
  {
    title: "Programme de fidélité",
    description: "Inscriptions instantanées, cumul de points et récompenses. Fidélisez sans carte physique.",
    icon: "💎",
  },
  {
    title: "Gestion d'inventaire",
    description: "Vérifiez la disponibilité en temps réel, les tailles et couleurs disponibles dans tous vos points de vente.",
    icon: "📦",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Créez vos QR codes",
    description: "Générez des QR codes pour chaque produit, rayon ou usage en quelques clics.",
  },
  {
    step: "2",
    title: "Placez-les en magasin",
    description: "Étiquettes produits, affiches en rayon, vitrines ou caisses enregistreuses.",
  },
  {
    step: "3",
    title: "Le client scanne",
    description: "Avec son smartphone, il accède instantanément au contenu enrichi.",
  },
  {
    step: "4",
    title: "Analysez et optimisez",
    description: "Suivez les scans, identifiez les produits populaires et ajustez votre stratégie.",
  },
];

const useCases = [
  {
    sector: "Mode & Habillement",
    description: "Guides de tailles, compositions textiles, conseils d'entretien et looks associés.",
    examples: ["Guide de tailles interactif", "Composition et origine des matières", "Suggestions de looks complets"],
    icon: "👗",
  },
  {
    sector: "Électronique",
    description: "Caractéristiques techniques détaillées, comparatifs et tutoriels de prise en main.",
    examples: ["Fiches techniques complètes", "Vidéos de démonstration", "Comparatif avec produits similaires"],
    icon: "📱",
  },
  {
    sector: "Grande distribution",
    description: "Informations nutritionnelles, allergènes, recettes et promotions du moment.",
    examples: ["Valeurs nutritionnelles détaillées", "Recettes avec le produit", "Alertes allergènes"],
    icon: "🛒",
  },
  {
    sector: "Cosmétique & Beauté",
    description: "Compositions INCI, tutoriels maquillage, avis clients et diagnostics personnalisés.",
    examples: ["Liste INCI complète", "Tutoriels vidéo", "Diagnostic de peau personnalisé"],
    icon: "💄",
  },
];

const testimonials = [
  {
    quote: "Nos clients adorent scanner les QR codes pour voir les avis et les tailles disponibles. Le taux de retour a baissé de 30% !",
    author: "Marie D.",
    company: "Directrice de boutique, Enseigne Mode",
  },
  {
    quote: "Le click & collect via QR code a transformé notre business. 40% de nos commandes en ligne sont maintenant retirées en magasin.",
    author: "Pierre M.",
    company: "Responsable E-commerce, Chaîne Électronique",
  },
  {
    quote: "Les fiches produit enrichies ont augmenté notre panier moyen de 25%. Les clients sont mieux informés et achètent plus.",
    author: "Sophie L.",
    company: "Manager, Grande Surface Alimentaire",
  },
];

const stats = [
  { value: "40%", label: "d'engagement en plus" },
  { value: "+25%", label: "panier moyen" },
  { value: "-30%", label: "taux de retour" },
  { value: "2 min", label: "pour créer un QR code" },
];

const faqs = [
  {
    question: "Comment créer des QR codes pour tous mes produits ?",
    answer: "Vous pouvez générer des QR codes individuellement ou en masse via notre API. Chaque QR code peut pointer vers une fiche produit dynamique que vous mettez à jour sans changer le code imprimé.",
  },
  {
    question: "Les QR codes fonctionnent-ils avec mon système de caisse ?",
    answer: "Nos QR codes sont universels et compatibles avec tous les systèmes. Ils ne remplacent pas les codes-barres existants mais les complètent pour enrichir l'expérience client.",
  },
  {
    question: "Comment suivre les statistiques de scan ?",
    answer: "Avec le plan Pro, accédez à un tableau de bord complet : nombre de scans par produit, horaires de pic, localisation des scans et taux de conversion.",
  },
  {
    question: "Puis-je personnaliser le design des QR codes ?",
    answer: "Oui, vous pouvez intégrer votre logo, choisir les couleurs de votre marque et ajuster la forme des modules tout en conservant la lisibilité.",
  },
  {
    question: "Le contenu peut-il être mis à jour après impression ?",
    answer: "Absolument ! Avec les QR codes dynamiques, le contenu peut être modifié à tout moment sans réimprimer les étiquettes. Idéal pour les promotions temporaires.",
  },
];

export default function RetailUseCasePage() {
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
      <section className="border-b bg-gradient-to-b from-purple-50 to-background dark:from-purple-950/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-sm font-medium mb-4">
                Retail & E-commerce
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                QR Codes pour le Retail : Transformez l&apos;Expérience en Magasin
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Fiches produit enrichies, click & collect, avis clients et promotions personnalisées.
                Connectez le physique au digital et boostez vos ventes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/create?type=url&template=retail"
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700"
                >
                  Créer mon QR code produit
                </Link>
                <Link
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
                >
                  Voir la démo
                </Link>
              </div>
            </div>
            <div className="relative" id="demo">
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-950/10 rounded-2xl flex items-center justify-center p-8">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-xs w-full">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🛍️</div>
                    <h3 className="font-semibold">Fiche Produit</h3>
                    <p className="text-xs text-muted-foreground">Scannez pour plus d&apos;infos</p>
                  </div>
                  <div className="w-40 h-40 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-6xl">📱</div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tailles disponibles</span>
                      <span className="font-medium">S, M, L, XL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Note clients</span>
                      <span className="font-medium">⭐ 4.8/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Click & Collect</span>
                      <span className="text-green-600 font-medium">Disponible</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-purple-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-purple-100 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              6 Fonctionnalités Clés pour le Retail
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enrichissez l&apos;expérience d&apos;achat et augmentez vos conversions avec des QR codes intelligents
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-background border rounded-xl p-6 hover:border-purple-500/50 transition-colors"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-muted-foreground">
              4 étapes pour digitaliser votre point de vente
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-purple-200 dark:bg-purple-800"></div>
                )}
                <div className="relative text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 relative z-10">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases by Sector */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Solutions par Secteur
            </h2>
            <p className="text-muted-foreground">
              Des QR codes adaptés à chaque type de commerce
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase) => (
              <div key={useCase.sector} className="bg-background border rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{useCase.icon}</div>
                  <h3 className="font-semibold text-xl">{useCase.sector}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.examples.map((example, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Exemple de Fiche Produit Interactive
            </h2>
            <p className="text-muted-foreground">
              Voici ce que vos clients verront en scannant le QR code
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="border rounded-xl overflow-hidden shadow-lg">
              <div className="bg-purple-600 text-white px-4 py-3">
                <div className="text-sm font-medium">Fiche Produit - T-Shirt Premium</div>
              </div>
              <div className="p-6 bg-background space-y-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center text-4xl">
                    👕
                  </div>
                  <div>
                    <h3 className="font-semibold">T-Shirt Coton Bio</h3>
                    <p className="text-sm text-muted-foreground">Ref: TSH-001</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500">★★★★★</span>
                      <span className="text-xs text-muted-foreground">(127 avis)</span>
                    </div>
                    <p className="font-semibold text-lg mt-2">29,90 €</p>
                  </div>
                </div>
                <hr />
                <div>
                  <h4 className="font-medium text-sm mb-2">Tailles disponibles</h4>
                  <div className="flex gap-2">
                    {["XS", "S", "M", "L", "XL"].map((size) => (
                      <span
                        key={size}
                        className={`px-3 py-1 text-xs rounded-md border ${
                          size === "M" || size === "L"
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Composition</h4>
                  <p className="text-sm text-muted-foreground">100% Coton biologique certifié GOTS</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-600 text-white py-2 rounded-md text-sm font-medium">
                    Click & Collect
                  </button>
                  <button className="flex-1 border py-2 rounded-md text-sm font-medium">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ils ont Digitalisé leur Point de Vente
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-background border rounded-xl p-6">
                <p className="text-muted-foreground mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions Fréquentes</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="border rounded-lg p-4 bg-background">
                <summary className="font-medium cursor-pointer">
                  {faq.question}
                </summary>
                <p className="mt-4 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="text-5xl mb-6">🛍️</div>
          <h2 className="text-3xl font-bold mb-4">
            Prêt à Transformer Votre Expérience Client ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez les milliers de commerçants qui utilisent les QR codes pour connecter
            le physique au digital. Commencez gratuitement en 2 minutes.
          </p>
          <Link
            href="/create?type=url&template=retail"
            className="inline-flex items-center justify-center rounded-md bg-purple-600 px-8 py-4 text-base font-medium text-white hover:bg-purple-700"
          >
            Créer mes QR codes retail gratuitement
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Aucune carte bancaire requise • QR codes dynamiques inclus
          </p>
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
                <li><Link href="/use-cases/retail" className="hover:text-foreground">Retail & E-commerce</Link></li>
                <li><Link href="/use-cases/pharmacie" className="hover:text-foreground">Pharmacie</Link></li>
                <li><Link href="/use-cases/restaurant" className="hover:text-foreground">Restaurant</Link></li>
                <li><Link href="/use-cases/marketing" className="hover:text-foreground">Marketing</Link></li>
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
