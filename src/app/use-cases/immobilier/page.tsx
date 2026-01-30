import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Immobilier - Panneau A Vendre & Visite Virtuelle | QR Generator",
  description:
    "Transformez vos panneaux immobiliers avec un QR code. Visite virtuelle, fiche technique, contact agent en un scan. Solution pour agences immobilieres.",
  keywords: [
    "qr code immobilier",
    "qr code panneau a vendre",
    "visite virtuelle qr code",
    "agence immobiliere qr",
    "qr code annonce immobiliere",
    "panneau immobilier connecte",
    "qr code maison a vendre",
    "immobilier digital",
  ],
  openGraph: {
    title: "QR Code Immobilier - Boostez vos ventes avec le digital",
    description: "Vos prospects scannent le panneau et accedent instantanement a la visite virtuelle et aux details du bien.",
  },
};

const features = [
  {
    title: "Visite virtuelle 360°",
    description: "Offrez une immersion totale dans le bien. Les prospects visitent a distance, 24h/24, avant meme de vous contacter.",
    icon: "🏠",
  },
  {
    title: "Fiche technique complete",
    description: "Surface, nombre de pieces, DPE, charges, proximite commerces... Toutes les infos essentielles en un scan.",
    icon: "📋",
  },
  {
    title: "Contact agent direct",
    description: "Un bouton d&apos;appel ou de message direct vers l&apos;agent responsable du bien. Plus de prospects qualifies.",
    icon: "📞",
  },
  {
    title: "Estimation en ligne",
    description: "Proposez aux vendeurs potentiels d&apos;estimer leur bien. Generez des mandats depuis vos panneaux.",
    icon: "💰",
  },
  {
    title: "Documents telechargeables",
    description: "Plans, diagnostics, reglement de copropriete... Les documents importants accessibles instantanement.",
    icon: "📄",
  },
  {
    title: "Statistiques de visite",
    description: "Suivez le nombre de scans par bien, les horaires de consultation, et optimisez vos annonces.",
    icon: "📊",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Creez votre QR code",
    description: "Renseignez les informations du bien et uploadez vos medias (photos, visite 360, documents).",
  },
  {
    step: "2",
    title: "Imprimez et affichez",
    description: "Integrez le QR code sur votre panneau A Vendre, vitrine, flyers ou annonces print.",
  },
  {
    step: "3",
    title: "Les prospects scannent",
    description: "Les passants et acheteurs potentiels scannent pour decouvrir le bien en detail.",
  },
  {
    step: "4",
    title: "Recevez des contacts",
    description: "Les prospects qualifies vous contactent directement. Suivez vos stats en temps reel.",
  },
];

const useCases = [
  {
    type: "Vente residentielle",
    description: "Maisons et appartements a vendre. Maximisez l&apos;impact de vos panneaux en facade.",
    examples: ["Panneau A Vendre", "Vitrine agence", "Flyers boite aux lettres"],
    icon: "🏡",
  },
  {
    type: "Location",
    description: "Appartements et maisons a louer. Facilitez les visites virtuelles pour filtrer les candidats.",
    examples: ["Panneau A Louer", "Annonces en ligne", "Affichage residence"],
    icon: "🔑",
  },
  {
    type: "Programmes neufs",
    description: "Promoteurs immobiliers. Presentez vos programmes avec maquettes 3D et plans interactifs.",
    examples: ["Palissade chantier", "Bureau de vente", "Plaquette commerciale"],
    icon: "🏗️",
  },
  {
    type: "Immobilier commercial",
    description: "Bureaux, locaux commerciaux, entrepots. Touchez les professionnels en deplacement.",
    examples: ["Panneau Local commercial", "Salon professionnel", "Mailing B2B"],
    icon: "🏢",
  },
];

const testimonials = [
  {
    quote: "Depuis qu&apos;on a ajoute les QR codes sur nos panneaux, on recoit 3 fois plus de demandes qualifiees. Les gens ont deja visite virtuellement avant d&apos;appeler.",
    author: "Marie D.",
    agency: "Century 21 Lyon 6eme",
  },
  {
    quote: "Nos vendeurs adorent voir les statistiques de scans. Ca prouve qu&apos;on travaille et ca justifie nos honoraires.",
    author: "Thomas R.",
    agency: "Laforet Paris 15",
  },
  {
    quote: "On a reduit nos visites inutiles de 40%. Les acheteurs qui se deplacent sont vraiment interesses car ils ont deja tout vu.",
    author: "Sophie M.",
    agency: "Orpi Bordeaux Centre",
  },
];

const stats = [
  { value: "3x", label: "plus de contacts qualifies" },
  { value: "40%", label: "moins de visites inutiles" },
  { value: "24/7", label: "visites virtuelles disponibles" },
  { value: "5 min", label: "pour creer votre QR code" },
];

const faqs = [
  {
    question: "Que voit le prospect quand il scanne le QR code ?",
    answer: "Le prospect accede a une page dediee au bien avec photos HD, visite virtuelle 360°, caracteristiques detaillees, localisation, et un bouton de contact direct. Vous personnalisez entierement le contenu.",
  },
  {
    question: "Je peux modifier les informations apres impression du QR code ?",
    answer: "Oui ! C&apos;est l&apos;avantage majeur. Le QR code reste le meme, mais vous pouvez mettre a jour le contenu (prix, photos, statut) a tout moment depuis votre tableau de bord.",
  },
  {
    question: "Ca fonctionne sur tous les smartphones ?",
    answer: "Oui. Tous les smartphones recents (iPhone et Android) peuvent scanner les QR codes nativement avec l&apos;appareil photo. Aucune application a telecharger pour vos prospects.",
  },
  {
    question: "Comment integrer la visite virtuelle 360° ?",
    answer: "Vous pouvez integrer un lien vers votre visite virtuelle existante (Matterport, Nodalview, etc.) ou uploader directement vos photos 360° sur notre plateforme.",
  },
  {
    question: "Puis-je suivre les performances de chaque bien ?",
    answer: "Oui, avec le plan Pro vous avez acces aux statistiques detaillees : nombre de scans, horaires, appareils utilises, et taux de contact. Ideal pour vos reportings vendeurs.",
  },
  {
    question: "Le QR code reste-t-il valide quand le bien est vendu ?",
    answer: "Vous pouvez desactiver le QR code ou le rediriger vers votre site pour capter d&apos;autres prospects. Rien n&apos;est perdu !",
  },
];

const placements = [
  {
    location: "Panneau A Vendre / A Louer",
    description: "L&apos;emplacement strategique par excellence. Les passants curieux scannent pour en savoir plus.",
    tip: "QR code visible de la rue, minimum 10x10 cm",
  },
  {
    location: "Vitrine d&apos;agence",
    description: "Vos annonces vitrine deviennent interactives. Attirez les chalands meme agence fermee.",
    tip: "Un QR code par bien affiche",
  },
  {
    location: "Flyers et prospectus",
    description: "Vos supports papier renvoient vers le digital. Plus d&apos;infos sans surcharger le flyer.",
    tip: "QR code en bas de page avec call-to-action",
  },
  {
    location: "Annonces print",
    description: "Journaux, magazines immobiliers. Le print devient un pont vers le digital.",
    tip: "Mentionnez &apos;Scannez pour la visite virtuelle&apos;",
  },
  {
    location: "Signature email",
    description: "Chaque email envoye devient une opportunite. Partagez vos biens phares facilement.",
    tip: "QR code avec lien vers votre selection",
  },
];

export default function ImmobilierUseCasePage() {
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
                🏠 Solution pour l&apos;Immobilier
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                QR Code Immobilier : Transformez vos panneaux en vitrines digitales
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Vos prospects scannent le panneau &quot;A Vendre&quot; et accedent instantanement a la visite virtuelle,
                aux photos HD et aux caracteristiques du bien. Generez plus de contacts qualifies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/create?type=url&template=immobilier"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Creer mon QR code immobilier
                </Link>
                <Link
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
                >
                  Voir la demo
                </Link>
              </div>
            </div>
            <div className="relative" id="demo">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-950/10 rounded-2xl flex items-center justify-center p-8">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-xs w-full">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🏠</div>
                    <h3 className="font-semibold">Appartement T3 - Lyon 6e</h3>
                    <p className="text-xs text-muted-foreground">285 000 EUR - 75 m2</p>
                  </div>
                  <div className="w-40 h-40 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-6xl">📱</div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Scannez pour decouvrir la visite virtuelle et contacter l&apos;agent
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
              Tout ce dont vous avez besoin pour vendre plus vite
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Un QR code immobilier, c&apos;est bien plus qu&apos;un simple lien. C&apos;est une experience complete pour vos prospects.
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
              4 etapes simples pour digitaliser vos annonces immobilieres
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

      {/* Use Cases */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Adapte a tous les types de biens
            </h2>
            <p className="text-muted-foreground">
              Que vous vendiez des maisons, louiez des appartements ou commercialisiez des programmes neufs
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase) => (
              <div
                key={useCase.type}
                className="bg-background border rounded-xl p-6 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{useCase.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{useCase.type}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{useCase.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {useCase.examples.map((example) => (
                        <span
                          key={example}
                          className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where to place */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ou placer votre QR code ?
            </h2>
            <p className="text-muted-foreground">
              Maximisez la visibilite pour generer plus de contacts
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placements.map((placement) => (
              <div key={placement.location} className="border rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">{placement.location}</h3>
                <p className="text-sm text-muted-foreground mb-3">{placement.description}</p>
                <div className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-md">
                  💡 {placement.tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ils ont booste leurs ventes
            </h2>
            <p className="text-muted-foreground">
              Des agences immobilieres qui ont adopte le QR code
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-background border rounded-xl p-6">
                <div className="text-blue-600 text-4xl mb-4">&ldquo;</div>
                <p className="text-muted-foreground mb-4">{testimonial.quote}</p>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.agency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Page Preview */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ce que voient vos prospects
            </h2>
            <p className="text-muted-foreground">
              Une page optimisee pour convertir les visiteurs en contacts
            </p>
          </div>
          <div className="border rounded-xl overflow-hidden shadow-lg">
            <div className="bg-muted px-4 py-3 border-b flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-sm font-medium">votre-agence.qr-generator.fr/bien-123</span>
            </div>
            <div className="p-6 bg-background">
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-950/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🏠</div>
                    <p className="text-sm text-muted-foreground">Visite virtuelle 360°</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">285 000 EUR</div>
                    <div className="text-sm text-muted-foreground">Prix de vente</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">75 m2</div>
                    <div className="text-sm text-muted-foreground">Surface habitable</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">3 pieces</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">2 chambres</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">Balcon</span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">DPE C</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
                  📞 Contacter l&apos;agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions frequentes</h2>
            <p className="text-muted-foreground">
              Tout ce que vous devez savoir sur les QR codes immobiliers
            </p>
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
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="text-6xl mb-6">🏠</div>
          <h2 className="text-3xl font-bold mb-4">
            Pret a digitaliser vos annonces immobilieres ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Creez votre premier QR code immobilier en 5 minutes.
            Visite virtuelle, fiche technique, contact agent... tout en un scan.
          </p>
          <Link
            href="/create?type=url&template=immobilier"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-4 text-base font-medium text-white hover:bg-blue-700"
          >
            Creer mon QR code immobilier gratuitement
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Gratuit jusqu&apos;a 3 QR codes - Aucune carte bancaire requise
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
                <li><Link href="/use-cases/immobilier" className="hover:text-foreground">Immobilier</Link></li>
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
