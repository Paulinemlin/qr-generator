import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Artisan - Devis, Avis & Contact Direct | QR Generator",
  description:
    "Boostez votre activite d'artisan avec un QR code sur votre vehicule ou carte de visite. Recevez des demandes de devis, avis clients et contacts en 1 scan.",
  keywords: [
    "qr code artisan",
    "qr code vehicule",
    "demande devis qr code",
    "avis artisan qr",
    "qr code plombier",
    "qr code electricien",
    "qr code coiffeur",
    "carte visite artisan qr code",
    "qr code services",
  ],
  openGraph: {
    title: "QR Code Artisan - Devis & Contact Direct en 1 Scan",
    description:
      "Transformez chaque deplacement en opportunite commerciale. QR code sur vehicule, carte de visite et chantier.",
  },
};

const features = [
  {
    title: "Devis en ligne instantane",
    description:
      "Vos prospects scannent et remplissent une demande de devis directement. Recevez toutes les informations par email.",
    icon: "📝",
  },
  {
    title: "Prise de rendez-vous simplifiee",
    description:
      "Integrez votre agenda en ligne. Les clients reservent un creneau sans vous appeler pendant un chantier.",
    icon: "📅",
  },
  {
    title: "Avis clients visibles",
    description:
      "Redirigez vers votre page Google ou collectez des avis directement. Boostez votre reputation locale.",
    icon: "⭐",
  },
  {
    title: "Portfolio de realisations",
    description:
      "Montrez vos plus beaux chantiers en un scan. Photos avant/apres qui convainquent vos prospects.",
    icon: "📸",
  },
  {
    title: "Contact direct multicanal",
    description:
      "Telephone, WhatsApp, email... Le client choisit son mode de contact prefere en un clic.",
    icon: "📞",
  },
  {
    title: "Reseaux sociaux integres",
    description:
      "Gagnez des abonnes sur Instagram, Facebook ou TikTok. Montrez votre savoir-faire au quotidien.",
    icon: "🔗",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Creez votre QR code",
    description:
      "En 2 minutes, configurez votre page avec vos services, coordonnees et liens utiles.",
  },
  {
    step: "2",
    title: "Imprimez et affichez",
    description:
      "Sur votre vehicule, cartes de visite, devis papier ou directement sur le chantier.",
  },
  {
    step: "3",
    title: "Les clients scannent",
    description:
      "Passants, voisins, prospects... Ils decouvrent vos services en un scan.",
  },
  {
    step: "4",
    title: "Recevez les demandes",
    description:
      "Devis, appels, avis... Transformez chaque scan en opportunite commerciale.",
  },
];

const useCases = [
  {
    profession: "Plombier",
    icon: "🔧",
    description:
      "QR code sur la camionnette. Les voisins du chantier scannent et demandent un devis pour leurs travaux.",
    tip: "Ajoutez 'Urgences 24h/24' sur votre page",
  },
  {
    profession: "Electricien",
    icon: "⚡",
    description:
      "QR code sur le tableau electrique apres intervention. Le client retrouve votre contact pour les futurs travaux.",
    tip: "Incluez vos certifications (Qualifelec, etc.)",
  },
  {
    profession: "Coiffeur / Barbier",
    icon: "✂️",
    description:
      "QR code sur le miroir ou la carte de visite. Reservation du prochain RDV avant de partir.",
    tip: "Liez votre Instagram pour montrer vos coupes",
  },
  {
    profession: "Peintre",
    icon: "🎨",
    description:
      "QR code sur les pots de peinture vides laisses au client. Portfolio et demande de devis pour la prochaine piece.",
    tip: "Montrez des photos avant/apres",
  },
  {
    profession: "Menuisier",
    icon: "🪚",
    description:
      "QR code grave sur vos creations. Le client montre a ses amis et ils vous contactent directement.",
    tip: "Ajoutez un lien vers votre catalogue",
  },
];

const testimonials = [
  {
    quote:
      "J'ai colle le QR code sur ma camionnette. En 1 mois, j'ai recu 23 demandes de devis de voisins de mes chantiers. Investissement zero, retour enorme !",
    author: "Laurent D.",
    profession: "Plombier-chauffagiste, Toulouse",
  },
  {
    quote:
      "Mes clients laissent des avis Google en scannant le QR code sur ma carte. Je suis passe de 12 a 87 avis en 6 mois. Ma visibilite a explose.",
    author: "Marie P.",
    profession: "Coiffeuse a domicile, Bordeaux",
  },
  {
    quote:
      "Le QR code sur mon devis papier renvoie vers mon portfolio. Les clients voient mes realisations et signent plus facilement.",
    author: "Thomas R.",
    profession: "Peintre en batiment, Lyon",
  },
];

const stats = [
  { value: "3x", label: "plus de demandes de devis" },
  { value: "87%", label: "des scans convertis en contact" },
  { value: "2 min", label: "pour creer votre QR code" },
  { value: "0€", label: "gratuit a vie" },
];

const faqs = [
  {
    question: "Ou placer mon QR code pour avoir le plus de scans ?",
    answer:
      "Les meilleurs emplacements sont : votre vehicule utilitaire (flanc et arriere), vos cartes de visite, vos devis papier, les panneaux de chantier, et meme sur vos creations (pour les menuisiers, serruriers...). Plus votre QR code est visible dans des zones de passage, plus vous aurez de scans.",
  },
  {
    question: "Est-ce que ca marche vraiment pour trouver des clients ?",
    answer:
      "Oui ! Nos artisans constatent en moyenne 3x plus de demandes de devis apres avoir installe un QR code sur leur vehicule. Les voisins de vos chantiers sont vos meilleurs prospects : ils voient votre travail et peuvent vous contacter immediatement.",
  },
  {
    question: "Je peux changer les informations apres avoir imprime le QR code ?",
    answer:
      "Absolument. Avec un QR code dynamique, vous pouvez modifier a tout moment la page de destination : nouveau numero, nouveaux services, nouvelles photos... sans reimprimer le QR code.",
  },
  {
    question: "Comment recevoir les demandes de devis ?",
    answer:
      "Les demandes arrivent directement par email sur l'adresse de votre choix. Vous pouvez aussi integrer un formulaire personnalise avec les informations dont vous avez besoin (type de travaux, surface, urgence...).",
  },
  {
    question: "C'est vraiment gratuit ?",
    answer:
      "Oui, la creation d'un QR code basique est gratuite et le restera. Pour des fonctionnalites avancees comme les statistiques de scans, la personnalisation poussee ou plusieurs QR codes, des plans Pro sont disponibles.",
  },
  {
    question: "Le QR code resiste aux intemperies sur un vehicule ?",
    answer:
      "Le QR code lui-meme est juste une image. La resistance depend du support d'impression. Nous recommandons des stickers vinyle lamines pour vehicules, resistants aux UV et a la pluie. Disponibles chez tout imprimeur ou en ligne.",
  },
];

export default function ArtisanUseCasePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            QR Generator
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Blog
            </Link>
            <Link
              href="/use-cases"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cas d&apos;usage
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
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
      <section className="border-b bg-gradient-to-b from-orange-50 to-background dark:from-orange-950/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-sm font-medium mb-4">
                🔧 Solution pour Artisans & Services
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                QR Code Artisan : Devis, Avis & Contact en 1 Scan
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Transformez chaque deplacement en opportunite commerciale.
                QR code sur votre vehicule, vos cartes et chantiers.
                Vos prospects scannent et vous contactent instantanement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/create?type=link&template=artisan"
                  className="inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Creer mon QR code artisan
                </Link>
                <Link
                  href="#usecases"
                  className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
                >
                  Voir les exemples
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-950/10 rounded-2xl flex items-center justify-center p-8">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-xs w-full">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🔧</div>
                    <h3 className="font-semibold">Martin Plomberie</h3>
                    <p className="text-xs text-muted-foreground">
                      Depannage & Installation
                    </p>
                  </div>
                  <div className="w-40 h-40 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-6xl">📱</div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 text-center text-sm">
                      📝 Demander un devis
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center text-sm">
                      📞 Appeler directement
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center text-sm">
                      ⭐ Voir les avis
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-orange-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-orange-100 mt-1">{stat.label}</div>
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
              Tout ce dont un artisan a besoin
            </h2>
            <p className="text-muted-foreground">
              Un QR code, plusieurs fonctionnalites pour developper votre activite
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-background border rounded-xl p-6 hover:border-orange-500/50 transition-colors"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment ca marche ?</h2>
            <p className="text-muted-foreground">
              4 etapes simples pour transformer votre vehicule en outil marketing
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-orange-200 dark:bg-orange-800"></div>
                )}
                <div className="relative text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 relative z-10">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases by Profession */}
      <section className="py-20 bg-muted/30" id="usecases">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Pour tous les metiers du batiment et des services
            </h2>
            <p className="text-muted-foreground">
              Decouvrez comment chaque profession utilise le QR code
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase) => (
              <div key={useCase.profession} className="border rounded-xl p-6 bg-background">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{useCase.icon}</div>
                  <h3 className="font-semibold text-lg">{useCase.profession}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {useCase.description}
                </p>
                <div className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-3 py-2 rounded-md">
                  💡 {useCase.tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Placement Visual */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ou placer votre QR code ?
            </h2>
            <p className="text-muted-foreground">
              Maximisez votre visibilite avec des emplacements strategiques
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🚐</div>
              <h3 className="font-semibold mb-2">Vehicule utilitaire</h3>
              <p className="text-sm text-muted-foreground">
                Flancs et arriere. Visible au feu rouge et en stationnement sur chantier.
              </p>
            </div>
            <div className="border rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="font-semibold mb-2">Carte de visite</h3>
              <p className="text-sm text-muted-foreground">
                Au verso de votre carte. Le client garde votre contact et peut scanner plus tard.
              </p>
            </div>
            <div className="border rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="font-semibold mb-2">Devis et factures</h3>
              <p className="text-sm text-muted-foreground">
                Le client scanne pour laisser un avis ou recommander vos services.
              </p>
            </div>
            <div className="border rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="font-semibold mb-2">Panneau de chantier</h3>
              <p className="text-sm text-muted-foreground">
                Les voisins et passants decouvrent vos services pendant les travaux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ils ont adopte le QR code</h2>
            <p className="text-muted-foreground">
              Temoignages d&apos;artisans qui ont booste leur activite
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-background border rounded-xl p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-500">⭐</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.profession}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Card */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Exemple de page artisan
            </h2>
            <p className="text-muted-foreground">
              Ce que vos clients voient quand ils scannent votre QR code
            </p>
          </div>
          <div className="border rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto">
            <div className="bg-orange-600 text-white p-6 text-center">
              <div className="text-5xl mb-3">🔧</div>
              <h3 className="text-xl font-bold">Martin Plomberie</h3>
              <p className="text-orange-100 text-sm">
                Depannage & Installation - Toulouse et environs
              </p>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full bg-orange-600 text-white rounded-lg py-3 font-medium hover:bg-orange-700">
                📝 Demander un devis gratuit
              </button>
              <button className="w-full border rounded-lg py-3 font-medium hover:bg-muted">
                📞 Appeler maintenant
              </button>
              <button className="w-full border rounded-lg py-3 font-medium hover:bg-muted">
                💬 Contacter sur WhatsApp
              </button>
              <button className="w-full border rounded-lg py-3 font-medium hover:bg-muted">
                ⭐ Voir les 47 avis (4.8/5)
              </button>
              <button className="w-full border rounded-lg py-3 font-medium hover:bg-muted">
                📸 Portfolio realisations
              </button>
            </div>
            <div className="border-t p-4 flex justify-center gap-4">
              <span className="text-2xl">📘</span>
              <span className="text-2xl">📸</span>
              <span className="text-2xl">🎵</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions frequentes</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="border rounded-lg p-4 bg-background">
                <summary className="font-medium cursor-pointer">
                  {faq.question}
                </summary>
                <p className="mt-4 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pret a developper votre activite ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Creez votre QR code artisan en 2 minutes. Gratuit, sans engagement.
            Commencez a recevoir des demandes de devis des aujourd&apos;hui.
          </p>
          <Link
            href="/create?type=link&template=artisan"
            className="inline-flex items-center justify-center rounded-md bg-orange-600 px-8 py-4 text-base font-medium text-white hover:bg-orange-700"
          >
            Creer mon QR code artisan gratuitement
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Aucune carte bancaire requise
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
                <li>
                  <Link href="/create" className="hover:text-foreground">
                    Creer un QR code
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="/docs/api" className="hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Cas d&apos;usage</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/use-cases/artisan" className="hover:text-foreground">
                    Artisan
                  </Link>
                </li>
                <li>
                  <Link href="/use-cases/pharmacie" className="hover:text-foreground">
                    Pharmacie
                  </Link>
                </li>
                <li>
                  <Link href="/use-cases/restaurant" className="hover:text-foreground">
                    Restaurant
                  </Link>
                </li>
                <li>
                  <Link href="/use-cases/marketing" className="hover:text-foreground">
                    Marketing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/blog" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="hover:text-foreground">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    A propos
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/legal" className="hover:text-foreground">
                    Mentions legales
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 QR Generator. Tous droits reserves.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
