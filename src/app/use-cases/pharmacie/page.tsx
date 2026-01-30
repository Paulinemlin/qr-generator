import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Pharmacie - Transfert d'ordonnance par email | QR Generator",
  description:
    "Simplifiez le transfert d'ordonnances dans votre pharmacie avec un QR code. Vos patients scannent et envoient leur ordonnance par email en 1 clic.",
  keywords: [
    "qr code pharmacie",
    "transfert ordonnance email",
    "pharmacie qr code",
    "envoi ordonnance",
    "pharmacie digitale",
    "qr code officine",
  ],
  openGraph: {
    title: "QR Code Pharmacie - Transfert d'ordonnance simplifié",
    description: "Vos patients envoient leur ordonnance par email en scannant un QR code.",
  },
};

const benefits = [
  {
    title: "Gain de temps en officine",
    description: "Les ordonnances arrivent préparées. Réduisez l'attente au comptoir de 50%.",
    icon: "⏱️",
  },
  {
    title: "Moins d'erreurs",
    description: "Photo de l'ordonnance originale, pas de ressaisie. Traçabilité complète.",
    icon: "✅",
  },
  {
    title: "Expérience patient améliorée",
    description: "Vos patients apprécient la modernité et la simplicité du service.",
    icon: "😊",
  },
  {
    title: "Zéro investissement technique",
    description: "Aucune app à installer, aucun matériel. Juste un QR code à imprimer.",
    icon: "💰",
  },
  {
    title: "RGPD compliant",
    description: "Les données transitent directement par email, vous gardez le contrôle.",
    icon: "🔒",
  },
  {
    title: "Multi-canal",
    description: "Affichez le QR code en vitrine, sur vos sacs, ordonnanciers, cartes de visite.",
    icon: "📱",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Le patient scanne",
    description: "Avec l'appareil photo de son smartphone, le patient scanne votre QR code.",
  },
  {
    step: "2",
    title: "L'email s'ouvre",
    description: "Un email pré-rempli s'ouvre avec votre adresse et un objet standardisé.",
  },
  {
    step: "3",
    title: "Il joint l'ordonnance",
    description: "Le patient prend en photo ou joint son ordonnance et envoie.",
  },
  {
    step: "4",
    title: "Vous préparez",
    description: "Vous recevez l'ordonnance et préparez la commande avant son arrivée.",
  },
];

const placements = [
  {
    location: "Vitrine",
    description: "Les passants peuvent envoyer leur ordonnance même officine fermée.",
    tip: "Format A4 ou A3 avec instructions claires",
  },
  {
    location: "Comptoir",
    description: "Pour les patients pressés qui reviendront chercher leur commande.",
    tip: "Chevalet ou sticker visible",
  },
  {
    location: "Sacs et emballages",
    description: "Rappel pour les prochaines ordonnances à renouveler.",
    tip: "Sticker ou impression directe",
  },
  {
    location: "Carte de visite",
    description: "Le patient garde votre contact et peut envoyer ses ordonnances facilement.",
    tip: "QR code au verso de la carte",
  },
  {
    location: "Site web / Réseaux sociaux",
    description: "Partagez le QR code sur vos supports digitaux.",
    tip: "Image à télécharger ou page dédiée",
  },
];

const testimonials = [
  {
    quote: "Depuis qu'on a mis le QR code en vitrine, on reçoit 15 ordonnances par jour avant même l'ouverture. Un vrai gain de temps !",
    author: "Dr. Pharmacien M.",
    pharmacy: "Pharmacie du Centre, Lille",
  },
  {
    quote: "Mes patients adorent. Surtout les actifs qui n'ont pas le temps d'attendre. Ils passent juste récupérer leur commande prête.",
    author: "Sophie L.",
    pharmacy: "Pharmacie des Halles, Lyon",
  },
  {
    quote: "Installation en 5 minutes. J'ai juste imprimé le QR code et collé en vitrine. Simple et efficace.",
    author: "Thomas B.",
    pharmacy: "Pharmacie Saint-Michel, Paris",
  },
];

const stats = [
  { value: "50%", label: "de temps d'attente en moins" },
  { value: "15+", label: "ordonnances/jour en moyenne" },
  { value: "2 min", label: "pour créer votre QR code" },
  { value: "0€", label: "gratuit à vie" },
];

export default function PharmacieUseCasePage() {
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
      <section className="border-b bg-gradient-to-b from-green-50 to-background dark:from-green-950/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-medium mb-4">
                💊 Solution pour Pharmacies
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                QR Code Transfert d&apos;Ordonnance
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Vos patients scannent, photographient leur ordonnance et vous l&apos;envoient
                par email. Vous préparez avant leur arrivée. Simple, rapide, gratuit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/create?type=email&template=pharmacie"
                  className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700"
                >
                  Créer mon QR code pharmacie
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
              <div className="aspect-square bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-950/10 rounded-2xl flex items-center justify-center p-8">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-xs w-full">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">💊</div>
                    <h3 className="font-semibold">Pharmacie du Centre</h3>
                    <p className="text-xs text-muted-foreground">Envoyez votre ordonnance</p>
                  </div>
                  <div className="w-40 h-40 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-6xl">📱</div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Scannez ce QR code pour envoyer votre ordonnance par email
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-green-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-green-100 mt-1">{stat.label}</div>
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
              4 étapes simples pour digitaliser le transfert d&apos;ordonnances
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-green-200 dark:bg-green-800"></div>
                )}
                <div className="relative text-center">
                  <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 relative z-10">
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

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Pourquoi adopter le QR code ordonnance ?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-background border rounded-xl p-6 hover:border-green-500/50 transition-colors"
              >
                <div className="text-3xl mb-4">{benefit.icon}</div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
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
              Où placer votre QR code ?
            </h2>
            <p className="text-muted-foreground">
              Maximisez la visibilité pour plus d&apos;ordonnances reçues
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placements.map((placement) => (
              <div key={placement.location} className="border rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">{placement.location}</h3>
                <p className="text-sm text-muted-foreground mb-3">{placement.description}</p>
                <div className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-2 rounded-md">
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
              Ils l&apos;ont adopté
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-background border rounded-xl p-6">
                <p className="text-muted-foreground mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.pharmacy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Preview */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              L&apos;email que vous recevrez
            </h2>
            <p className="text-muted-foreground">
              Format standardisé pour un traitement efficace
            </p>
          </div>
          <div className="border rounded-xl overflow-hidden shadow-lg">
            <div className="bg-muted px-4 py-3 border-b flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-sm font-medium">Nouvel email</span>
            </div>
            <div className="p-6 bg-background">
              <div className="space-y-3 text-sm">
                <div className="flex">
                  <span className="w-16 text-muted-foreground">De :</span>
                  <span>patient@email.com</span>
                </div>
                <div className="flex">
                  <span className="w-16 text-muted-foreground">À :</span>
                  <span className="text-green-600">votre-pharmacie@email.com</span>
                </div>
                <div className="flex">
                  <span className="w-16 text-muted-foreground">Objet :</span>
                  <span className="font-medium">Ordonnance à préparer - [Nom du patient]</span>
                </div>
                <hr className="my-4" />
                <div className="text-muted-foreground">
                  <p className="mb-4">Bonjour,</p>
                  <p className="mb-4">
                    Veuillez trouver ci-joint mon ordonnance à préparer.
                  </p>
                  <p className="mb-4">
                    Je passerai récupérer ma commande vers [heure souhaitée].
                  </p>
                  <p>Merci,<br />[Nom du patient]<br />[Téléphone]</p>
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg flex items-center gap-4">
                  <div className="text-3xl">📎</div>
                  <div>
                    <div className="font-medium">ordonnance.jpg</div>
                    <div className="text-xs text-muted-foreground">Photo de l&apos;ordonnance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            <details className="border rounded-lg p-4 bg-background">
              <summary className="font-medium cursor-pointer">
                Est-ce que c&apos;est conforme RGPD ?
              </summary>
              <p className="mt-4 text-muted-foreground">
                Oui. Les données transitent directement par email entre le patient et vous.
                Aucune donnée n&apos;est stockée sur nos serveurs. Vous gardez le contrôle total.
              </p>
            </details>
            <details className="border rounded-lg p-4 bg-background">
              <summary className="font-medium cursor-pointer">
                Ça fonctionne avec tous les smartphones ?
              </summary>
              <p className="mt-4 text-muted-foreground">
                Oui. Tous les smartphones récents (iPhone et Android) peuvent scanner les QR codes
                nativement avec l&apos;appareil photo. Aucune application à télécharger.
              </p>
            </details>
            <details className="border rounded-lg p-4 bg-background">
              <summary className="font-medium cursor-pointer">
                C&apos;est vraiment gratuit ?
              </summary>
              <p className="mt-4 text-muted-foreground">
                Oui, la création du QR code email est gratuite et le restera. Vous pouvez créer
                jusqu&apos;à 3 QR codes avec le plan gratuit. Pour des fonctionnalités avancées
                (analytics, personnalisation poussée), des plans payants sont disponibles.
              </p>
            </details>
            <details className="border rounded-lg p-4 bg-background">
              <summary className="font-medium cursor-pointer">
                Je peux personnaliser le message de l&apos;email ?
              </summary>
              <p className="mt-4 text-muted-foreground">
                Oui, lors de la création du QR code, vous pouvez définir l&apos;objet et le corps
                du message pré-rempli. Le patient peut ensuite le modifier avant envoi.
              </p>
            </details>
            <details className="border rounded-lg p-4 bg-background">
              <summary className="font-medium cursor-pointer">
                Comment je sais si les ordonnances arrivent bien ?
              </summary>
              <p className="mt-4 text-muted-foreground">
                Les emails arrivent directement dans votre boîte mail habituelle.
                Avec le plan Pro, vous pouvez aussi suivre le nombre de scans de votre QR code.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à simplifier vos transferts d&apos;ordonnances ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Créez votre QR code pharmacie en 2 minutes. Gratuit, sans engagement.
          </p>
          <Link
            href="/create?type=email&template=pharmacie"
            className="inline-flex items-center justify-center rounded-md bg-green-600 px-8 py-4 text-base font-medium text-white hover:bg-green-700"
          >
            Créer mon QR code pharmacie gratuitement
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
                <li><Link href="/create" className="hover:text-foreground">Créer un QR code</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Tarifs</Link></li>
                <li><Link href="/docs/api" className="hover:text-foreground">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Cas d&apos;usage</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
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
