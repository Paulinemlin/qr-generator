import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// FAQ Data organized by categories
const faqData = {
  general: {
    title: "General",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
    questions: [
      {
        question: "Qu'est-ce qu'un QR code ?",
        answer: "Un QR code (Quick Response code) est un type de code-barres bidimensionnel qui peut stocker des informations comme des URLs, du texte, des coordonnees ou des informations de contact. Il peut etre scanne rapidement avec un smartphone pour acceder instantanement au contenu encode."
      },
      {
        question: "Comment scanner un QR code ?",
        answer: "La plupart des smartphones modernes peuvent scanner les QR codes directement avec l'application appareil photo. Ouvrez simplement votre camera, pointez-la vers le QR code, et une notification apparaitra pour ouvrir le lien. Vous pouvez egalement utiliser des applications de scan dediees disponibles sur l'App Store ou Google Play."
      },
      {
        question: "Quelle est la difference entre QR code statique et dynamique ?",
        answer: "Un QR code statique contient des donnees fixes qui ne peuvent pas etre modifiees apres creation. Un QR code dynamique, en revanche, pointe vers une URL de redirection que vous pouvez modifier a tout moment sans changer le code lui-meme. Les QR codes dynamiques permettent egalement de suivre les statistiques de scan (nombre, localisation, appareil, etc.)."
      }
    ]
  },
  creation: {
    title: "Creation",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
      </svg>
    ),
    questions: [
      {
        question: "Comment creer un QR code ?",
        answer: "Creer un QR code est simple : 1) Connectez-vous a votre compte ou inscrivez-vous gratuitement. 2) Cliquez sur 'Creer un QR code'. 3) Choisissez le type de contenu (URL, texte, etc.). 4) Entrez votre contenu et personnalisez le design si souhaite. 5) Telechargez votre QR code en PNG, SVG ou PDF. L'ensemble du processus prend moins de 30 secondes."
      },
      {
        question: "Puis-je personnaliser mon QR code ?",
        answer: "Absolument ! Vous pouvez personnaliser entierement vos QR codes : couleurs du code et de l'arriere-plan, style des modules (carres, arrondis, points), ajout de votre logo au centre, et choix du niveau de correction d'erreur. Les plans Pro et Business offrent des options de personnalisation avancees pour creer des QR codes parfaitement alignes avec votre identite de marque."
      },
      {
        question: "Quels types de QR codes puis-je creer ?",
        answer: "QR Generator supporte de nombreux types de QR codes : URLs et liens web, texte libre, cartes de visite (vCard), coordonnees GPS, numeros de telephone, adresses email, evenements calendrier, connexion WiFi, et plus encore. Chaque type est optimise pour offrir la meilleure experience utilisateur lors du scan."
      },
      {
        question: "Quelle taille pour mon QR code ?",
        answer: "La taille ideale depend de la distance de scan. En regle generale : pour un scan a 10 cm (carte de visite), minimum 2 cm x 2 cm. Pour un scan a 1 metre (affiche), minimum 10 cm x 10 cm. Pour un scan a distance (panneau publicitaire), prevoyez au moins 1/10eme de la distance de scan. QR Generator exporte vos codes en haute resolution pour une impression nette a toutes les tailles."
      }
    ]
  },
  pricing: {
    title: "Tarifs & Facturation",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
      </svg>
    ),
    questions: [
      {
        question: "Le plan gratuit est-il vraiment gratuit ?",
        answer: "Oui, notre plan gratuit est 100% gratuit, sans engagement et sans carte bancaire requise. Il inclut jusqu'a 3 QR codes dynamiques, 100 scans par mois, et les fonctionnalites de base. C'est ideal pour tester notre plateforme ou pour un usage personnel limite. Vous pouvez upgrader a tout moment si vos besoins evoluent."
      },
      {
        question: "Comment fonctionne la facturation ?",
        answer: "La facturation est mensuelle et automatique. Vous etes facture au debut de chaque periode d'abonnement. Nous acceptons les cartes bancaires (Visa, Mastercard, American Express) et les prelevements SEPA pour les entreprises. Les factures sont envoyees par email et disponibles dans votre espace client. La TVA est incluse pour les clients europeens."
      },
      {
        question: "Puis-je changer de plan ?",
        answer: "Vous pouvez changer de plan a tout moment depuis votre tableau de bord. L'upgrade est immediat : vous accedez instantanement aux nouvelles fonctionnalites, et le montant est calcule au prorata. En cas de downgrade, le changement prend effet a la fin de votre periode de facturation en cours."
      },
      {
        question: "Y a-t-il un engagement ?",
        answer: "Non, aucun engagement ! Tous nos abonnements sont sans engagement de duree. Vous pouvez annuler a tout moment depuis votre espace client, et vous continuerez a beneficier de votre abonnement jusqu'a la fin de la periode payee. Vos QR codes resteront actifs meme apres l'annulation (dans la limite du plan gratuit)."
      }
    ]
  },
  technical: {
    title: "Technique",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </svg>
    ),
    questions: [
      {
        question: "Mes QR codes expirent-ils ?",
        answer: "Par defaut, vos QR codes dynamiques n'expirent jamais tant que votre compte est actif. Cependant, vous pouvez volontairement definir une date d'expiration pour vos QR codes si necessaire (par exemple, pour une promotion limitee dans le temps). Les QR codes statiques ne peuvent pas expirer car le contenu est encode directement dans le code."
      },
      {
        question: "Comment fonctionne le tracking ?",
        answer: "Chaque scan d'un QR code dynamique est enregistre avec des informations anonymisees : date et heure, localisation geographique approximative (pays, ville), type d'appareil (mobile, tablette), systeme d'exploitation et navigateur. Ces donnees sont agregees dans votre tableau de bord pour vous offrir des insights precieux sur l'utilisation de vos QR codes. Nous respectons le RGPD et ne collectons aucune donnee personnelle identifiable."
      },
      {
        question: "L'API est-elle disponible ?",
        answer: "Oui, une API REST complete est disponible avec le plan Business. Elle vous permet de creer, modifier et supprimer des QR codes, de recuperer les statistiques de scan, et de gerer vos campagnes de maniere programmatique. La documentation complete est disponible dans notre centre d'aide, et nous fournissons des SDKs pour les langages les plus populaires (JavaScript, Python, PHP)."
      },
      {
        question: "Mes donnees sont-elles securisees ?",
        answer: "La securite est notre priorite absolue. Toutes les communications sont chiffrees en HTTPS/TLS 1.3. Vos donnees sont hebergees sur des serveurs securises en France (AWS Paris), conformes aux normes ISO 27001 et SOC 2. Nous effectuons des sauvegardes quotidiennes et des audits de securite reguliers. Vous pouvez egalement activer l'authentification a deux facteurs (2FA) sur votre compte."
      }
    ]
  },
  support: {
    title: "Support",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    questions: [
      {
        question: "Comment contacter le support ?",
        answer: "Plusieurs options s'offrent a vous : 1) Email : envoyez-nous un message a support@qrgenerator.fr. 2) Chat en direct : disponible en bas a droite de votre ecran (heures ouvrables). 3) Centre d'aide : consultez nos guides et tutoriels detailles. 4) Pour les clients Business : ligne telephonique dediee et gestionnaire de compte personnel."
      },
      {
        question: "Quel est le delai de reponse ?",
        answer: "Nous nous engageons a repondre dans les meilleurs delais : Plan Gratuit : sous 48-72 heures ouvrees. Plan Pro : sous 24 heures ouvrees. Plan Business : sous 4 heures ouvrees, avec support prioritaire et ligne dediee. Notre equipe support est basee en France et disponible du lundi au vendredi, de 9h a 18h."
      }
    ]
  }
};

// Generate FAQ Schema for SEO
const generateFAQSchema = () => {
  const allQuestions = Object.values(faqData).flatMap(category =>
    category.questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  );

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allQuestions
  };
};

export const metadata: Metadata = {
  title: "FAQ - Questions frequentes | QR Generator",
  description: "Trouvez les reponses a toutes vos questions sur QR Generator : creation de QR codes, personnalisation, tarifs, fonctionnalites techniques et support.",
  keywords: ["FAQ", "questions frequentes", "QR code", "aide", "support", "tarifs", "fonctionnalites"],
  openGraph: {
    title: "FAQ - Questions frequentes | QR Generator",
    description: "Trouvez les reponses a toutes vos questions sur la creation et la gestion de QR codes dynamiques.",
    type: "website",
    url: "https://qrgenerator.fr/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - Questions frequentes | QR Generator",
    description: "Trouvez les reponses a toutes vos questions sur la creation et la gestion de QR codes dynamiques.",
  },
  alternates: {
    canonical: "https://qrgenerator.fr/faq",
  },
};

// Accordion Item Component
function AccordionItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-b border-border last:border-0">
      <summary className="flex cursor-pointer items-center justify-between py-5 text-left font-medium transition-colors hover:text-primary">
        <span className="pr-6">{question}</span>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-muted/50 transition-transform group-open:rotate-45">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </span>
      </summary>
      <div className="pb-5 pr-12 text-muted-foreground leading-relaxed">
        {answer}
      </div>
    </details>
  );
}

// Category Section Component
function CategorySection({
  id,
  title,
  icon,
  questions
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  questions: { question: string; answer: string }[]
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="rounded-2xl border bg-card">
        <div className="px-6">
          {questions.map((q, index) => (
            <AccordionItem key={index} question={q.question} answer={q.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FAQPage() {
  const faqSchema = generateFAQSchema();

  return (
    <>
      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-card">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/5 via-transparent to-transparent blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-primary/5 via-transparent to-transparent blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl px-6 py-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              Centre d&apos;aide
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Questions frequentes
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Trouvez rapidement les reponses a vos questions sur QR Generator.
              Vous ne trouvez pas ce que vous cherchez ? Notre equipe support est la pour vous aider.
            </p>

            {/* Quick Navigation */}
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(faqData).map(([key, category]) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:border-primary/20"
                >
                  {category.icon}
                  {category.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <div className="space-y-16">
            {Object.entries(faqData).map(([key, category]) => (
              <CategorySection
                key={key}
                id={key}
                title={category.title}
                icon={category.icon}
                questions={category.questions}
              />
            ))}
          </div>
        </div>

        {/* Contact CTA Section */}
        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
            <div className="rounded-2xl border bg-card p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-bl from-primary/5 to-transparent blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-to-tr from-primary/5 to-transparent blur-3xl" />
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Vous n&apos;avez pas trouve votre reponse ?
              </h2>

              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Notre equipe support est disponible pour repondre a toutes vos questions.
                Contactez-nous par email ou via le chat en direct.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Nous contacter
                  </Button>
                </Link>
                <Link href="/docs/api">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                    </svg>
                    Documentation API
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                Support disponible du lundi au vendredi, 9h-18h (heure de Paris)
              </p>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="border-t">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <h2 className="text-xl font-bold mb-8 text-center">Ressources utiles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link
                href="/pricing"
                className="group rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <path d="M12 18V6" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Tarifs</h3>
                <p className="text-sm text-muted-foreground">Comparez nos plans et choisissez celui qui vous convient.</p>
              </Link>

              <Link
                href="/blog"
                className="group rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Blog</h3>
                <p className="text-sm text-muted-foreground">Conseils et bonnes pratiques pour vos QR codes.</p>
              </Link>

              <Link
                href="/use-cases"
                className="group rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    <rect width="20" height="14" x="2" y="6" rx="2" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Cas d&apos;usage</h3>
                <p className="text-sm text-muted-foreground">Decouvrez comment utiliser les QR codes dans votre secteur.</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
