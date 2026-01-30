import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Education - Ressources pédagogiques & Émargement | QR Generator",
  description:
    "Digitalisez votre établissement scolaire avec les QR codes : émargement automatique, accès aux ressources de cours, quiz interactifs, bibliothèque numérique. Solution pour universités, lycées et centres de formation.",
  keywords: [
    "qr code education",
    "qr code ecole",
    "emargement qr code",
    "ressources pedagogiques qr",
    "qr code universite",
    "qr code formation",
    "qr code lycee",
    "presence qr code",
    "bibliotheque qr code",
    "e-learning qr code",
  ],
  openGraph: {
    title: "QR Code Education - Digitalisez votre établissement",
    description: "Émargement, ressources de cours, quiz et bibliothèque numérique via QR codes.",
  },
};

const features = [
  {
    title: "Ressources de cours",
    description: "Partagez vos supports de cours instantanément. Les étudiants scannent et accèdent aux PDF, vidéos et présentations.",
    icon: "📖",
  },
  {
    title: "Émargement automatique",
    description: "Fini les feuilles de présence papier. Un scan = une présence enregistrée avec horodatage.",
    icon: "✅",
  },
  {
    title: "Quiz interactifs",
    description: "Créez des QR codes vers vos quiz en ligne. Évaluez la compréhension en temps réel.",
    icon: "❓",
  },
  {
    title: "Bibliothèque numérique",
    description: "Accès instantané aux ressources documentaires. Catalogues, réservations, prêts numériques.",
    icon: "📚",
  },
  {
    title: "Visite de campus",
    description: "Guidez les visiteurs avec des QR codes informatifs sur chaque bâtiment et service.",
    icon: "🏫",
  },
  {
    title: "Évaluations & feedback",
    description: "Collectez les retours étudiants sur les cours. Améliorez votre pédagogie en continu.",
    icon: "⭐",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Créez vos QR codes",
    description: "Générez des QR codes pour chaque usage : cours, présence, quiz, ressources.",
  },
  {
    step: "2",
    title: "Affichez ou partagez",
    description: "Imprimez les QR codes ou intégrez-les dans vos supports numériques.",
  },
  {
    step: "3",
    title: "Les étudiants scannent",
    description: "Un simple scan avec leur smartphone pour accéder au contenu ou confirmer leur présence.",
  },
  {
    step: "4",
    title: "Suivez les statistiques",
    description: "Analysez les scans, la participation et l'engagement en temps réel.",
  },
];

const useCases = [
  {
    type: "Université",
    description: "Amphis connectés, bibliothèques numériques, émargement par promotion.",
    examples: "Cours magistraux, TD/TP, examens, inscriptions événements",
    icon: "🎓",
  },
  {
    type: "Lycée & Collège",
    description: "Suivi des présences, communication parents, ressources pédagogiques.",
    examples: "CDI, vie scolaire, orientation, sorties scolaires",
    icon: "🏫",
  },
  {
    type: "Formation professionnelle",
    description: "Traçabilité des présences pour les financeurs, supports de formation dématérialisés.",
    examples: "CPF, alternance, formations continues, certifications",
    icon: "💼",
  },
  {
    type: "E-learning & MOOC",
    description: "Pont entre supports physiques et contenus numériques, engagement apprenant.",
    examples: "Manuels augmentés, webinaires, communautés d'apprenants",
    icon: "💻",
  },
];

const testimonials = [
  {
    quote: "L'émargement par QR code nous a fait gagner 10 minutes par cours. Sur 500 étudiants, c'est énorme. Et plus de feuilles perdues !",
    author: "Prof. Marie D.",
    institution: "Université Paris-Saclay",
  },
  {
    quote: "Les élèves adorent scanner pour accéder aux ressources. C'est ludique et ça les responsabilise dans leur apprentissage.",
    author: "Thomas R.",
    institution: "Lycée Jean Moulin, Lyon",
  },
  {
    quote: "Pour nos formations CPF, la traçabilité des présences est obligatoire. Les QR codes nous ont simplifié la vie et sécurisé nos audits.",
    author: "Sophie M.",
    institution: "Centre de Formation IFAP",
  },
];

const stats = [
  { value: "10 min", label: "gagnées par cours" },
  { value: "98%", label: "taux d'adoption" },
  { value: "100%", label: "traçabilité garantie" },
  { value: "0€", label: "gratuit pour démarrer" },
];

const faqs = [
  {
    question: "Comment fonctionne l'émargement par QR code ?",
    answer: "Vous générez un QR code unique pour chaque séance. Les étudiants le scannent à leur arrivée, ce qui enregistre automatiquement leur présence avec date, heure et localisation. Vous pouvez exporter les données au format Excel ou les intégrer à votre système de gestion.",
  },
  {
    question: "Est-ce compatible avec tous les smartphones ?",
    answer: "Oui. Tous les smartphones récents (iPhone et Android) peuvent scanner les QR codes nativement avec l'appareil photo. Aucune application spécifique n'est requise pour les étudiants.",
  },
  {
    question: "Comment éviter la triche à l'émargement ?",
    answer: "Plusieurs options : QR codes dynamiques qui changent à chaque séance, vérification de géolocalisation, codes temporaires valables quelques minutes seulement, ou combinaison code + validation enseignant.",
  },
  {
    question: "Peut-on intégrer les QR codes aux ENT existants ?",
    answer: "Oui, notre API permet l'intégration avec la plupart des ENT (Moodle, Pronote, etc.). Contactez-nous pour discuter de votre configuration spécifique.",
  },
  {
    question: "Les données des étudiants sont-elles protégées ?",
    answer: "Absolument. Nous sommes conformes RGPD. Les données sont hébergées en France, chiffrées, et vous gardez le contrôle total. Possibilité d'anonymisation pour les statistiques.",
  },
  {
    question: "Quel est le coût pour un établissement ?",
    answer: "Le plan gratuit permet de créer jusqu'à 3 QR codes, idéal pour tester. Pour un usage institutionnel (QR codes illimités, analytics avancés, API), nos plans Éducation commencent à 29€/mois avec tarifs dégressifs selon le nombre d'utilisateurs.",
  },
];

export default function EducationUseCasePage() {
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
                📚 Solution pour l&apos;Éducation
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                QR Codes pour l&apos;Éducation & la Formation
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Émargement automatique, accès instantané aux ressources pédagogiques,
                quiz interactifs. Modernisez votre établissement avec les QR codes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/create?type=url&template=education"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Créer mon QR code éducation
                </Link>
                <Link
                  href="#fonctionnalites"
                  className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
                >
                  Découvrir les fonctionnalités
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-950/10 rounded-2xl flex items-center justify-center p-8">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-xs w-full">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">📚</div>
                    <h3 className="font-semibold">Cours de Marketing L3</h3>
                    <p className="text-xs text-muted-foreground">Scannez pour accéder au support</p>
                  </div>
                  <div className="w-40 h-40 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-6xl">📱</div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Accès instantané aux slides, vidéos et exercices
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
      <section id="fonctionnalites" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              6 usages des QR codes en éducation
            </h2>
            <p className="text-muted-foreground">
              Des solutions adaptées à chaque besoin pédagogique
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
              Comment ça marche ?
            </h2>
            <p className="text-muted-foreground">
              4 étapes pour digitaliser votre établissement
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
              Adapté à tous les types d&apos;établissements
            </h2>
            <p className="text-muted-foreground">
              De l&apos;université à la formation professionnelle
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase) => (
              <div key={useCase.type} className="bg-background border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{useCase.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{useCase.type}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>
                    <div className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-md">
                      Exemples : {useCase.examples}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attendance Feature Spotlight */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-medium mb-4">
                Fonctionnalité phare
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Émargement QR Code : la présence simplifiée
              </h2>
              <p className="text-muted-foreground mb-6">
                Fini les feuilles de présence qui circulent, les signatures illisibles et les
                fichiers Excel à ressaisir. L&apos;émargement par QR code automatise tout.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Présence enregistrée en 2 secondes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Horodatage précis et géolocalisation optionnelle</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Export automatique vers votre ENT ou Excel</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Conforme aux exigences des organismes de formation (Qualiopi, CPF)</span>
                </li>
              </ul>
            </div>
            <div className="border rounded-xl overflow-hidden shadow-lg">
              <div className="bg-muted px-4 py-3 border-b flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm font-medium">Tableau de présences</span>
              </div>
              <div className="p-6 bg-background">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span>Marie Dupont</span>
                    <span className="text-green-600 text-xs">Présent - 08:32</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span>Lucas Martin</span>
                    <span className="text-green-600 text-xs">Présent - 08:34</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span>Emma Bernard</span>
                    <span className="text-green-600 text-xs">Présent - 08:35</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <span>Antoine Petit</span>
                    <span className="text-yellow-600 text-xs">Retard - 08:47</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span>Julie Moreau</span>
                    <span className="text-red-600 text-xs">Absent</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                  <span className="text-muted-foreground">Total : 25 étudiants</span>
                  <span className="font-medium">92% de présence</span>
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
              Ils ont adopté les QR codes
            </h2>
            <p className="text-muted-foreground">
              Retours d&apos;enseignants et formateurs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-background border rounded-xl p-6">
                <p className="text-muted-foreground mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.institution}</div>
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
            <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
            <p className="text-muted-foreground">
              Tout ce que vous devez savoir sur les QR codes en éducation
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
      <section className="py-20 bg-blue-600 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à moderniser votre établissement ?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Créez votre premier QR code éducation en 2 minutes.
            Gratuit pour commencer, tarifs spéciaux pour les établissements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create?type=url&template=education"
              className="inline-flex items-center justify-center rounded-md bg-white text-blue-600 px-8 py-4 text-base font-medium hover:bg-blue-50"
            >
              Créer mon QR code gratuitement
            </Link>
            <Link
              href="/contact?subject=education"
              className="inline-flex items-center justify-center rounded-md border border-white/30 px-8 py-4 text-base font-medium hover:bg-white/10"
            >
              Demander un devis établissement
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-200">
            Aucune carte bancaire requise - Tarifs Éducation disponibles
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
                <li><Link href="/use-cases/education" className="hover:text-foreground">Éducation</Link></li>
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
