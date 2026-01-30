import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Medical - Cabinet Medical, Clinique, Laboratoire | QR Generator",
  description:
    "Digitalisez votre cabinet medical avec les QR codes : prise de RDV, dossier patient, ordonnances, tracabilite. Solution RGPD pour professionnels de sante.",
  keywords: [
    "qr code medical",
    "qr code cabinet medical",
    "prise rdv qr code",
    "dossier patient qr",
    "qr code clinique",
    "qr code laboratoire",
    "qr code dentiste",
    "qr code kine",
    "ordonnance numerique",
    "tracabilite medicale",
    "consentement patient qr",
    "sante connectee",
  ],
  openGraph: {
    title: "QR Code Medical - Digitalisez votre cabinet de sante",
    description: "Prise de RDV, dossier patient, ordonnances : tout par QR code. Solution RGPD pour professionnels de sante.",
  },
};

const features = [
  {
    title: "Prise de rendez-vous simplifiee",
    description: "Vos patients scannent et reservent directement un creneau. Fini les appels telephoniques incessants.",
    icon: "📅",
  },
  {
    title: "Acces dossier patient",
    description: "QR code personnalise pour acceder au portail patient securise. Resultats, historique, documents.",
    icon: "📁",
  },
  {
    title: "Ordonnances numeriques",
    description: "Generez un QR code sur vos ordonnances pour faciliter le renouvellement et le suivi.",
    icon: "📝",
  },
  {
    title: "Tracabilite des actes",
    description: "Chaque acte medical peut etre trace via QR code. Ideal pour les audits et la conformite.",
    icon: "🔍",
  },
  {
    title: "Informations patient",
    description: "Affichez les consignes pre/post-operatoires, fiches informatives par simple scan.",
    icon: "ℹ️",
  },
  {
    title: "Consentement eclaire",
    description: "Le patient signe son consentement numeriquement via un formulaire accessible par QR code.",
    icon: "✍️",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Creez votre QR code",
    description: "Choisissez le type de QR code adapte a votre usage : lien, formulaire, email, document.",
  },
  {
    step: "2",
    title: "Personnalisez",
    description: "Ajoutez votre logo, vos couleurs, le nom de votre etablissement de sante.",
  },
  {
    step: "3",
    title: "Integrez",
    description: "Imprimez sur vos supports : affiches, cartes, ordonnances, livret d'accueil.",
  },
  {
    step: "4",
    title: "Suivez",
    description: "Analysez les scans, optimisez vos parcours patients, ameliorez l'experience.",
  },
];

const useCases = [
  {
    title: "Cabinet medical",
    description: "Prise de RDV, fiches patient, ordonnances renouvelables, consignes medicales.",
    examples: ["QR code en salle d'attente", "Carte de visite avec QR", "Ordonnance avec QR de renouvellement"],
  },
  {
    title: "Clinique & Hopital",
    description: "Orientation des patients, acces aux services, formulaires d'admission.",
    examples: ["QR code d'orientation", "Bracelet patient avec QR", "Livret d'accueil numerique"],
  },
  {
    title: "Laboratoire d'analyses",
    description: "Prise de RDV, acces aux resultats, preparation aux examens.",
    examples: ["RDV prise de sang", "Resultats en ligne", "Consignes de jeune"],
  },
  {
    title: "Cabinet dentaire",
    description: "Devis numeriques, consentement eclaire, suivi des soins.",
    examples: ["Devis detaille", "Consignes post-extraction", "Rappel de RDV"],
  },
  {
    title: "Kinesitherapeute",
    description: "Programmes d'exercices, suivi de seances, conseils personnalises.",
    examples: ["Videos d'exercices", "Fiche de suivi", "Prise de RDV en ligne"],
  },
];

const testimonials = [
  {
    quote: "Le QR code en salle d'attente a reduit nos appels de 40%. Les patients prennent RDV eux-memes en attendant.",
    author: "Dr. Marie L.",
    role: "Medecin generaliste, Paris",
  },
  {
    quote: "Nos patients apprecient l'acces direct a leurs resultats via QR code. Plus besoin de se deplacer.",
    author: "Jerome T.",
    role: "Directeur de laboratoire, Lyon",
  },
  {
    quote: "Le consentement eclaire par QR code nous fait gagner un temps precieux tout en restant conforme.",
    author: "Dr. Sophie M.",
    role: "Chirurgien-dentiste, Bordeaux",
  },
];

const stats = [
  { value: "40%", label: "d'appels telephoniques en moins" },
  { value: "3 min", label: "pour creer un QR code" },
  { value: "100%", label: "conforme RGPD" },
  { value: "0€", label: "pour demarrer" },
];

const faqItems = [
  {
    question: "Les QR codes sont-ils conformes au RGPD pour les donnees de sante ?",
    answer: "Oui. Notre solution est concue pour la conformite RGPD. Les donnees sensibles ne transitent pas par nos serveurs. Le QR code est un simple lien vers votre propre systeme securise (portail patient, formulaire). Vous gardez le controle total des donnees de sante.",
  },
  {
    question: "Puis-je utiliser les QR codes pour les ordonnances ?",
    answer: "Oui. Vous pouvez generer un QR code sur vos ordonnances qui renvoie vers un formulaire de renouvellement, des informations sur le traitement, ou un lien vers la pharmacie. Le QR code facilite le parcours patient sans remplacer l'ordonnance legale.",
  },
  {
    question: "Comment securiser l'acces aux informations medicales ?",
    answer: "Le QR code peut pointer vers une page necessitant une authentification (portail patient securise). Vous pouvez aussi utiliser des QR codes dynamiques avec expiration automatique pour les documents sensibles.",
  },
  {
    question: "Est-ce compatible avec mon logiciel medical ?",
    answer: "Nos QR codes sont des liens standards compatibles avec tous les systemes. Que vous utilisiez Doctolib, Maiia, ou votre propre solution, le QR code peut pointer vers n'importe quelle URL de votre choix.",
  },
  {
    question: "Puis-je suivre combien de patients scannent mes QR codes ?",
    answer: "Oui, avec les QR codes dynamiques (plan Pro), vous avez acces aux statistiques de scan : nombre, heure, localisation approximative. Ideal pour mesurer l'adoption par vos patients.",
  },
  {
    question: "Comment gerer le consentement eclaire par QR code ?",
    answer: "Le QR code renvoie vers un formulaire en ligne securise ou le patient lit les informations et signe electroniquement. Le document signe est ensuite envoye a votre email ou stocke dans votre systeme.",
  },
];

export default function SanteUseCasePage() {
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
                🏥 Solution pour Professionnels de Sante
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                QR Code pour le Secteur Medical
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Digitalisez votre cabinet, clinique ou laboratoire. Prise de RDV,
                dossier patient, ordonnances, consentement : tout devient plus simple
                avec les QR codes. Solution 100% conforme RGPD.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/create?type=link&template=medical"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Creer mon QR code medical
                </Link>
                <Link
                  href="#usages"
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
                    <div className="text-4xl mb-2">🏥</div>
                    <h3 className="font-semibold">Cabinet Medical</h3>
                    <p className="text-xs text-muted-foreground">Scannez pour prendre RDV</p>
                  </div>
                  <div className="w-40 h-40 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-6xl">📱</div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Acces direct a la prise de rendez-vous en ligne
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
              6 usages du QR code en milieu medical
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              De la prise de rendez-vous au consentement eclaire, les QR codes
              simplifient chaque etape du parcours patient.
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
              4 etapes pour digitaliser votre etablissement de sante
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
      <section id="usages" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              QR codes pour chaque type d&apos;etablissement
            </h2>
            <p className="text-muted-foreground">
              Des solutions adaptees a votre specialite
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="bg-background border rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{useCase.description}</p>
                <div className="space-y-2">
                  {useCase.examples.map((example, i) => (
                    <div
                      key={i}
                      className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-md"
                    >
                      ✓ {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ils utilisent nos QR codes
            </h2>
            <p className="text-muted-foreground">
              Retours de professionnels de sante
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-muted/30 border rounded-xl p-6">
                <p className="text-muted-foreground mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RGPD Section */}
      <section className="py-20 bg-blue-50 dark:bg-blue-950/20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold mb-4">
              Conformite RGPD garantie
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              En tant que professionnel de sante, la protection des donnees de vos patients
              est primordiale. Notre solution a ete concue avec la conformite RGPD comme priorite.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background rounded-xl p-6 text-center">
              <div className="text-2xl mb-3">🚫</div>
              <h3 className="font-semibold mb-2">Pas de stockage</h3>
              <p className="text-sm text-muted-foreground">
                Les donnees sensibles ne transitent pas par nos serveurs.
              </p>
            </div>
            <div className="bg-background rounded-xl p-6 text-center">
              <div className="text-2xl mb-3">🔐</div>
              <h3 className="font-semibold mb-2">Liens securises</h3>
              <p className="text-sm text-muted-foreground">
                HTTPS obligatoire, QR codes avec expiration disponibles.
              </p>
            </div>
            <div className="bg-background rounded-xl p-6 text-center">
              <div className="text-2xl mb-3">🇫🇷</div>
              <h3 className="font-semibold mb-2">Hebergement francais</h3>
              <p className="text-sm text-muted-foreground">
                Serveurs heberges en France, conformite HDS sur demande.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions frequentes</h2>
            <p className="text-muted-foreground">
              Tout savoir sur les QR codes pour le secteur medical
            </p>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="border rounded-lg p-4 bg-background">
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
            Pret a digitaliser votre cabinet ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Creez votre premier QR code medical en 3 minutes. Gratuit, sans engagement,
            conforme RGPD.
          </p>
          <Link
            href="/create?type=link&template=medical"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-4 text-base font-medium text-white hover:bg-blue-700"
          >
            Creer mon QR code medical gratuitement
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Aucune carte bancaire requise - Plan gratuit disponible
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
                <li><Link href="/use-cases/sante" className="hover:text-foreground">Sante & Medical</Link></li>
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
                <li><Link href="/privacy" className="hover:text-foreground">Politique de confidentialite</Link></li>
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
