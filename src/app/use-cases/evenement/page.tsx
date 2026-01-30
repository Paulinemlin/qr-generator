import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Événement - Badge, Check-in & Inscription digitale | QR Generator",
  description:
    "Digitalisez vos événements avec les QR codes. Check-in rapide, badges numériques, programme interactif, networking facilité. Solution complète pour conférences, salons et concerts.",
  keywords: [
    "qr code evenement",
    "badge qr code",
    "check-in digital",
    "inscription evenement",
    "qr code conference",
    "qr code salon professionnel",
    "billetterie qr code",
    "accreditation evenement",
    "badge visiteur qr code",
    "gestion participants",
  ],
  openGraph: {
    title: "QR Code Événement - Check-in & Badges digitaux",
    description: "Digitalisez vos événements : check-in instantané, badges QR code, programme interactif.",
  },
};

const features = [
  {
    title: "Check-in instantané",
    description: "Accueillez vos participants en quelques secondes. Scannez leur QR code et validez leur entrée sans file d'attente.",
    icon: "✅",
  },
  {
    title: "Badges numériques",
    description: "Générez des badges personnalisés avec QR code unique. Nom, entreprise, accès VIP intégrés.",
    icon: "🎫",
  },
  {
    title: "Programme interactif",
    description: "Vos participants scannent et accèdent au programme complet, plan des salles et horaires en temps réel.",
    icon: "📋",
  },
  {
    title: "Networking facilité",
    description: "Échange de contacts instantané entre participants. Scannez le badge, récupérez les coordonnées.",
    icon: "🤝",
  },
  {
    title: "Collecte de feedback",
    description: "QR codes pour sondages et évaluations. Recueillez les avis à chaud après chaque session.",
    icon: "📝",
  },
  {
    title: "Analytics en temps réel",
    description: "Suivez la fréquentation, les sessions populaires et le taux de participation en direct.",
    icon: "📊",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Créez votre événement",
    description: "Configurez votre événement, sessions et informations pratiques dans notre interface.",
  },
  {
    step: "2",
    title: "Générez les QR codes",
    description: "Badges participants, accès programme, points de check-in. Tout est automatisé.",
  },
  {
    step: "3",
    title: "Distribuez aux participants",
    description: "Envoyez les badges par email ou imprimez-les. Chaque participant a son QR unique.",
  },
  {
    step: "4",
    title: "Gérez le jour J",
    description: "Scannez, validez, suivez. Tout se passe en temps réel sur votre tableau de bord.",
  },
];

const useCases = [
  {
    title: "Conférences & Congrès",
    description: "Gérez des milliers de participants avec un check-in fluide. Badges, accès aux sessions, networking entre speakers et visiteurs.",
    examples: ["Tech conférences", "Congrès médicaux", "Sommets d'entreprise"],
    icon: "🎤",
  },
  {
    title: "Salons professionnels",
    description: "Accréditer exposants et visiteurs. Tracez les visites sur les stands, facilitez la prise de contact B2B.",
    examples: ["Salons B2B", "Foires commerciales", "Expositions"],
    icon: "🏢",
  },
  {
    title: "Concerts & Festivals",
    description: "Billetterie sécurisée avec QR codes uniques. Contrôle d'accès aux zones VIP, bar cashless intégré.",
    examples: ["Concerts", "Festivals", "Spectacles"],
    icon: "🎵",
  },
  {
    title: "Mariages & Événements privés",
    description: "Liste d'invités digitale, plan de table interactif, livre d'or numérique avec QR code.",
    examples: ["Mariages", "Anniversaires", "Galas"],
    icon: "💒",
  },
  {
    title: "Événements d'entreprise",
    description: "Séminaires, team buildings, lancements produits. Gérez les inscriptions et l'engagement des collaborateurs.",
    examples: ["Séminaires", "Formations", "Lancements"],
    icon: "💼",
  },
];

const testimonials = [
  {
    quote: "Notre conférence de 2000 personnes s'est déroulée sans accroc. Le check-in prenait 3 secondes par personne. Incroyable !",
    author: "Marc D.",
    role: "Organisateur Tech Summit Paris",
  },
  {
    quote: "Les exposants adorent le système de networking. Ils scannent les badges visiteurs et récupèrent les leads instantanément.",
    author: "Claire M.",
    role: "Directrice Salon Pro Lyon",
  },
  {
    quote: "Fini les longues files d'attente à l'entrée. Nos festivaliers scannent leur billet et entrent en 2 secondes.",
    author: "Thomas L.",
    role: "Producteur Festival Électro",
  },
];

const stats = [
  { value: "3 sec", label: "temps moyen de check-in" },
  { value: "95%", label: "de réduction des files d'attente" },
  { value: "10k+", label: "événements gérés" },
  { value: "0€", label: "pour commencer" },
];

const faqItems = [
  {
    question: "Combien de participants puis-je gérer ?",
    answer: "Le plan gratuit permet jusqu'à 100 participants. Les plans Pro et Enterprise sont illimités et adaptés aux grands événements (conférences, festivals, salons).",
  },
  {
    question: "Les QR codes fonctionnent-ils hors ligne ?",
    answer: "Oui, notre application de scan fonctionne en mode hors ligne. Les données sont synchronisées dès que la connexion est rétablie. Idéal pour les lieux avec mauvaise couverture réseau.",
  },
  {
    question: "Puis-je personnaliser les badges ?",
    answer: "Absolument. Ajoutez votre logo, choisissez les couleurs, incluez les informations souhaitées (nom, entreprise, type d'accès, photo). Export PDF pour impression ou envoi digital.",
  },
  {
    question: "Comment les participants reçoivent-ils leur badge ?",
    answer: "Par email automatique après inscription, ou téléchargeable depuis leur espace. Ils peuvent l'imprimer ou l'afficher sur smartphone. Le QR code reste le même.",
  },
  {
    question: "Peut-on suivre la fréquentation des sessions ?",
    answer: "Oui, placez des QR codes de check-in à l'entrée de chaque salle. Vous verrez en temps réel combien de personnes assistent à chaque session et pendant combien de temps.",
  },
  {
    question: "Est-ce sécurisé pour la billetterie payante ?",
    answer: "Chaque QR code est unique et crypté. Il ne peut être utilisé qu'une fois pour l'entrée. Notre système détecte et bloque les duplications et tentatives de fraude.",
  },
];

export default function EvenementUseCasePage() {
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
                🎫 Solution Événementielle
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                QR Code pour Événements & Salons
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Check-in en 3 secondes, badges numériques, programme interactif,
                networking facilité. Digitalisez l&apos;expérience de vos participants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register?usecase=evenement"
                  className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700"
                >
                  Créer mon événement
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
                    <div className="text-4xl mb-2">🎫</div>
                    <h3 className="font-semibold">Tech Summit 2024</h3>
                    <p className="text-xs text-muted-foreground">Badge Participant</p>
                  </div>
                  <div className="border-t border-b py-4 my-4">
                    <p className="font-medium text-center">Marie Dupont</p>
                    <p className="text-xs text-center text-muted-foreground">CTO - Startup Innovation</p>
                    <div className="flex justify-center gap-2 mt-2">
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded">VIP</span>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">Speaker</span>
                    </div>
                  </div>
                  <div className="w-32 h-32 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-5xl">📱</div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Scannez pour le check-in
                  </p>
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
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Tout pour gérer votre événement
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              De l&apos;inscription au feedback post-événement,
              nos QR codes couvrent tous vos besoins.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border rounded-xl p-6 hover:border-purple-500/50 transition-colors"
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
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-muted-foreground">
              4 étapes pour digitaliser votre événement
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
          <div className="text-center mt-12">
            <Link
              href="/register?usecase=evenement"
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700"
            >
              Commencer maintenant - C&apos;est gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Pour tous types d&apos;événements
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conférences, salons, concerts, mariages... Notre solution s&apos;adapte à chaque format.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{useCase.description}</p>
                <div className="flex flex-wrap gap-2">
                  {useCase.examples.map((example) => (
                    <span
                      key={example}
                      className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Check-in Demo */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Le check-in réinventé
            </h2>
            <p className="text-muted-foreground">
              Fini les listes papier et les files d&apos;attente interminables
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                  <span className="text-red-600 dark:text-red-400">✗</span>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 dark:text-red-400">Avant</h4>
                  <p className="text-sm text-muted-foreground">
                    Recherche manuelle dans les listes, impression des badges sur place,
                    files d&apos;attente de 15-30 minutes.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>
                <div>
                  <h4 className="font-medium text-green-600 dark:text-green-400">Avec QR Generator</h4>
                  <p className="text-sm text-muted-foreground">
                    Scan du QR code, validation instantanée, badge pré-imprimé ou digital.
                    3 secondes chrono.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-background border rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <div className="font-medium">Scan en cours...</div>
                  <div className="text-sm text-muted-foreground">Badge #4521</div>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                  <span>✓</span>
                  <span className="font-medium">Check-in validé !</span>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Participant</span>
                    <span className="font-medium">Marie Dupont</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Entreprise</span>
                    <span>Startup Innovation</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accès</span>
                    <span className="text-purple-600 dark:text-purple-400">VIP + Workshops</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ils organisent avec QR Generator
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-background border rounded-xl p-6">
                <div className="flex gap-1 mb-4 text-yellow-500">
                  {[...Array(5)].map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
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

      {/* Integrations */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              S&apos;intègre à vos outils
            </h2>
            <p className="text-muted-foreground">
              Connectez QR Generator à votre écosystème existant
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Eventbrite", icon: "🎟️" },
              { name: "Mailchimp", icon: "📧" },
              { name: "Salesforce", icon: "☁️" },
              { name: "HubSpot", icon: "🔶" },
              { name: "Google Sheets", icon: "📊" },
              { name: "Slack", icon: "💬" },
              { name: "Zapier", icon: "⚡" },
              { name: "API REST", icon: "🔌" },
            ].map((integration) => (
              <div
                key={integration.name}
                className="bg-background border rounded-lg p-4 text-center hover:border-purple-500/50 transition-colors"
              >
                <div className="text-2xl mb-2">{integration.icon}</div>
                <div className="text-sm font-medium">{integration.name}</div>
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
      <section className="py-20 bg-gradient-to-b from-purple-50 to-background dark:from-purple-950/20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à digitaliser votre prochain événement ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d&apos;organisateurs qui utilisent QR Generator.
            Créez votre premier événement gratuitement en 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?usecase=evenement"
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-8 py-4 text-base font-medium text-white hover:bg-purple-700"
            >
              Créer mon événement gratuitement
            </Link>
            <Link
              href="/contact?subject=evenement"
              className="inline-flex items-center justify-center rounded-md border px-8 py-4 text-base font-medium hover:bg-muted"
            >
              Contacter l&apos;équipe commerciale
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Aucune carte bancaire requise - Plan gratuit jusqu&apos;à 100 participants
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
                <li><Link href="/use-cases/evenement" className="hover:text-foreground">Événement</Link></li>
                <li><Link href="/use-cases/restaurant" className="hover:text-foreground">Restaurant</Link></li>
                <li><Link href="/use-cases/pharmacie" className="hover:text-foreground">Pharmacie</Link></li>
                <li><Link href="/use-cases/marketing" className="hover:text-foreground">Marketing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/guides/evenement" className="hover:text-foreground">Guide événementiel</Link></li>
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
