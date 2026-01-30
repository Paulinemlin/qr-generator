import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Transport & Logistique - Billets, Suivi Colis, E-tickets | QR Generator",
  description:
    "Optimisez votre transport et logistique avec les QR codes. E-billets, suivi de colis en temps reel, horaires, itineraires et information voyageurs. Solution complete pour trains, bus, avions et livraisons.",
  keywords: [
    "qr code transport",
    "qr code billet",
    "suivi colis qr code",
    "e-ticket qr",
    "qr code train",
    "qr code bus",
    "qr code avion",
    "billet electronique qr",
    "qr code logistique",
    "tracking colis qr code",
    "qr code horaires transport",
    "qr code itineraire",
  ],
  openGraph: {
    title: "QR Code Transport & Logistique - Billets et Suivi Colis",
    description: "E-billets, suivi de colis, horaires en temps reel. La solution QR code complete pour le transport.",
  },
};

const features = [
  {
    title: "E-billets instantanes",
    description: "Generez des billets electroniques avec QR code. Validation rapide, sans impression, ecologique.",
    icon: "🎫",
  },
  {
    title: "Suivi de colis en temps reel",
    description: "Vos clients scannent le QR code et suivent leur colis a chaque etape de la livraison.",
    icon: "📦",
  },
  {
    title: "Horaires en direct",
    description: "Affichez les horaires actualises en temps reel. Retards, annulations, changements de quai.",
    icon: "🕐",
  },
  {
    title: "Itineraires interactifs",
    description: "Guidez vos voyageurs avec des plans interactifs et des indications GPS precises.",
    icon: "🗺️",
  },
  {
    title: "Information voyageurs",
    description: "Diffusez alertes, consignes de securite et informations pratiques instantanement.",
    icon: "📢",
  },
  {
    title: "Tickets dematerialises",
    description: "Parking, peages, acces zones: tous vos tickets accessibles depuis le smartphone.",
    icon: "🎟️",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Creez votre QR code",
    description: "Choisissez le type de QR code adapte: billet, suivi, horaires ou information.",
  },
  {
    step: "2",
    title: "Integrez-le partout",
    description: "Sur billets, colis, arrets, gares, aeroports, vehicules ou supports digitaux.",
  },
  {
    step: "3",
    title: "Les voyageurs scannent",
    description: "Un simple scan avec le smartphone pour acceder instantanement a l'information.",
  },
  {
    step: "4",
    title: "Mises a jour en temps reel",
    description: "Modifiez le contenu sans reimprimer. L'information reste toujours a jour.",
  },
];

const useCases = [
  {
    sector: "Train & Metro",
    description: "E-billets, horaires en gare, plans de ligne, info trafic en temps reel.",
    examples: "SNCF, RATP, TER, metros urbains",
    icon: "🚆",
  },
  {
    sector: "Bus & Car",
    description: "Titres de transport, horaires aux arrets, itineraires, correspondances.",
    examples: "Reseaux urbains, cars interurbains, navettes",
    icon: "🚌",
  },
  {
    sector: "Avion & Aeroport",
    description: "Cartes d'embarquement, suivi bagages, informations vol, services aeroport.",
    examples: "Compagnies aeriennes, aeroports, handling",
    icon: "✈️",
  },
  {
    sector: "Livraison & Colis",
    description: "Tracking en temps reel, preuve de livraison, instructions destinataire.",
    examples: "Transporteurs, e-commerce, logisticiens",
    icon: "📦",
  },
  {
    sector: "Logistique & Supply Chain",
    description: "Tracabilite marchandises, inventaire, documentation, conformite.",
    examples: "Entrepots, transitaires, industriels",
    icon: "🏭",
  },
];

const testimonials = [
  {
    quote: "Le QR code sur nos arrets de bus a reduit de 80% les appels pour connaitre les horaires. Les voyageurs scannent et ont l'info en temps reel.",
    author: "Marc D.",
    company: "Reseau de transport urbain, Nantes",
  },
  {
    quote: "Nos clients adorent suivre leur colis en scannant le QR code. Le taux de reclamations 'ou est mon colis' a chute de 60%.",
    author: "Sophie M.",
    company: "Transporteur express, Lyon",
  },
  {
    quote: "L'embarquement est 3 fois plus rapide avec les e-billets QR code. Plus de file d'attente, plus de billets perdus.",
    author: "Jean-Pierre L.",
    company: "Compagnie aerienne regionale",
  },
];

const stats = [
  { value: "3x", label: "plus rapide a l'embarquement" },
  { value: "80%", label: "d'appels en moins" },
  { value: "-60%", label: "de reclamations colis" },
  { value: "0", label: "papier gaspille" },
];

const faqItems = [
  {
    question: "Comment fonctionne un e-billet avec QR code ?",
    answer: "Le voyageur recoit son billet par email ou SMS contenant un QR code unique. A l'embarquement, le controleur scanne le QR code qui valide instantanement le titre de transport. Aucune impression necessaire, le smartphone suffit.",
  },
  {
    question: "Le suivi de colis par QR code est-il en temps reel ?",
    answer: "Oui. Le QR code renvoie vers une page de tracking dynamique mise a jour a chaque scan aux differents points de passage. Le client voit la position exacte et l'heure estimee de livraison.",
  },
  {
    question: "Peut-on modifier les informations sans reimprimer le QR code ?",
    answer: "Absolument. Avec nos QR codes dynamiques, vous pouvez modifier le contenu (horaires, retards, informations) a tout moment sans changer le QR code physique. Ideal pour les mises a jour en temps reel.",
  },
  {
    question: "Comment integrer les QR codes dans notre systeme existant ?",
    answer: "Notre API permet une integration complete avec vos systemes de billetterie, TMS ou WMS. Generation automatique de QR codes, synchronisation des donnees, webhooks pour les mises a jour.",
  },
  {
    question: "Les QR codes fonctionnent-ils hors connexion ?",
    answer: "Le QR code lui-meme est toujours lisible. Pour les e-billets, nous proposons des solutions avec donnees embarquees qui fonctionnent meme sans connexion internet lors du scan.",
  },
  {
    question: "Quelle est la securite des e-billets QR code ?",
    answer: "Chaque QR code est unique et crypte. Impossible de le dupliquer ou de le falsifier. Nos systemes detectent automatiquement les tentatives de fraude et les billets deja utilises.",
  },
];

export default function TransportUseCasePage() {
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
      <section className="border-b bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-medium mb-4">
                🚆 Solution Transport & Logistique
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                QR Code Transport & Logistique
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                E-billets, suivi de colis, horaires en temps reel, information voyageurs.
                Digitalisez votre transport avec les QR codes. Rapide, ecologique, efficace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/create?type=url&template=transport"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Creer mon QR code transport
                </Link>
                <Link
                  href="#use-cases"
                  className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
                >
                  Voir les cas d&apos;usage
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-950/10 rounded-2xl flex items-center justify-center p-8">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-xs w-full">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🚆</div>
                    <h3 className="font-semibold">E-Billet Train</h3>
                    <p className="text-xs text-muted-foreground">Paris → Lyon | 14:35</p>
                  </div>
                  <div className="w-40 h-40 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <div className="grid grid-cols-5 gap-1">
                      {[...Array(25)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 ${Math.random() > 0.5 ? 'bg-blue-600' : 'bg-transparent'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Scannez pour valider votre billet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-blue-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-100 mt-1">{stat.label}</div>
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
              6 solutions QR code pour le transport
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des e-billets au suivi de colis, le QR code revolutionne le transport et la logistique
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-background border rounded-xl p-6 hover:border-blue-500/50 transition-colors"
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
              Comment ca marche ?
            </h2>
            <p className="text-muted-foreground">
              4 etapes pour digitaliser votre transport avec les QR codes
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-blue-200 dark:bg-blue-800"></div>
                )}
                <div className="relative text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 relative z-10">
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

      {/* Use Cases by sector */}
      <section id="use-cases" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Cas d&apos;usage par secteur
            </h2>
            <p className="text-muted-foreground">
              Le QR code s&apos;adapte a tous les modes de transport et metiers logistiques
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase) => (
              <div key={useCase.sector} className="bg-background border rounded-xl p-6">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{useCase.sector}</h3>
                <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>
                <div className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-md">
                  {useCase.examples}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E-ticket Preview */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Exemple d&apos;e-billet QR code
            </h2>
            <p className="text-muted-foreground">
              Un billet electronique moderne et pratique
            </p>
          </div>
          <div className="border rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-bold">TGV Express</div>
                <div className="text-sm opacity-80">Billet electronique</div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-8 mb-6">
                    <div>
                      <div className="text-3xl font-bold">Paris</div>
                      <div className="text-sm opacity-80">Gare de Lyon</div>
                    </div>
                    <div className="flex-1 border-t-2 border-dashed border-white/30 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 px-2">
                        ✈️
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">Lyon</div>
                      <div className="text-sm opacity-80">Part-Dieu</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="opacity-80">Date</div>
                      <div className="font-medium">15 Jan 2025</div>
                    </div>
                    <div>
                      <div className="opacity-80">Depart</div>
                      <div className="font-medium">14:35</div>
                    </div>
                    <div>
                      <div className="opacity-80">Voiture / Place</div>
                      <div className="font-medium">12 / 45</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                      <div className="text-4xl text-blue-600">🎫</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 px-6 py-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Voyageur: Jean DUPONT</span>
                <span>Ref: TGV-2025-XK789</span>
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
              Ils ont digitalise leur transport
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
            <h2 className="text-3xl font-bold mb-4">Questions frequentes</h2>
            <p className="text-muted-foreground">
              Tout savoir sur les QR codes pour le transport et la logistique
            </p>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details key={index} className="border rounded-lg p-4 bg-background">
                <summary className="font-medium cursor-pointer">
                  {item.question}
                </summary>
                <p className="mt-4 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pret a digitaliser votre transport ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Creez vos QR codes transport en quelques minutes. E-billets, suivi colis, horaires temps reel.
            Commencez gratuitement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create?type=url&template=transport"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-4 text-base font-medium text-white hover:bg-blue-700"
            >
              Creer mon QR code transport
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border px-8 py-4 text-base font-medium hover:bg-muted"
            >
              Contacter l&apos;equipe
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Gratuit jusqu&apos;a 3 QR codes • Aucune carte bancaire requise
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
                <li><Link href="/create" className="hover:text-foreground">Creer un QR code</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Tarifs</Link></li>
                <li><Link href="/docs/api" className="hover:text-foreground">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Cas d&apos;usage</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/use-cases/transport" className="hover:text-foreground">Transport</Link></li>
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
                <li><Link href="/about" className="hover:text-foreground">A propos</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="/legal" className="hover:text-foreground">Mentions legales</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 QR Generator. Tous droits reserves.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
