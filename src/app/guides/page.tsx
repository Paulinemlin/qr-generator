import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides QR Code - Tutoriels et Ressources | QR Generator",
  description:
    "Apprenez tout sur les QR codes : guides de demarrage, tutoriels par type, strategies avancees et guides par secteur d'activite.",
  keywords: [
    "guide qr code",
    "tutoriel qr code",
    "comment creer qr code",
    "qr code dynamique",
    "qr code wifi",
    "qr code vcard",
  ],
  openGraph: {
    title: "Guides QR Code - Tutoriels et Ressources | QR Generator",
    description:
      "Apprenez tout sur les QR codes : guides de demarrage, tutoriels par type, strategies avancees et guides par secteur d'activite.",
    type: "website",
  },
};

interface Guide {
  slug: string;
  title: string;
  description: string;
  icon: string;
  readTime: string;
}

interface GuideCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  guides: Guide[];
}

const guideCategories: GuideCategory[] = [
  {
    id: "demarrage",
    title: "Guides de demarrage",
    description: "Premiers pas avec les QR codes",
    icon: "rocket",
    guides: [
      {
        slug: "creer-premier-qr-code",
        title: "Comment creer votre premier QR code",
        description:
          "Guide etape par etape pour generer votre premier QR code en quelques minutes.",
        icon: "plus-circle",
        readTime: "5 min",
      },
      {
        slug: "personnaliser-qr-code",
        title: "Personnaliser votre QR code",
        description:
          "Ajoutez votre logo, changez les couleurs et creez un QR code a votre image.",
        icon: "palette",
        readTime: "7 min",
      },
      {
        slug: "comprendre-analytics",
        title: "Comprendre les analytics",
        description:
          "Apprenez a lire et interpreter les statistiques de vos QR codes.",
        icon: "bar-chart",
        readTime: "6 min",
      },
    ],
  },
  {
    id: "types",
    title: "Guides par type",
    description: "Maitrisez chaque type de QR code",
    icon: "grid",
    guides: [
      {
        slug: "qr-code-url",
        title: "QR code URL",
        description:
          "Redirigez vos utilisateurs vers n'importe quelle page web avec un simple scan.",
        icon: "link",
        readTime: "4 min",
      },
      {
        slug: "qr-code-wifi",
        title: "QR code WiFi",
        description:
          "Partagez votre connexion WiFi sans reveler votre mot de passe.",
        icon: "wifi",
        readTime: "5 min",
      },
      {
        slug: "qr-code-vcard",
        title: "QR code vCard",
        description:
          "Partagez vos coordonnees professionnelles en un scan.",
        icon: "user",
        readTime: "5 min",
      },
      {
        slug: "qr-code-email",
        title: "QR code Email",
        description:
          "Permettez a vos clients de vous contacter instantanement par email.",
        icon: "mail",
        readTime: "4 min",
      },
      {
        slug: "qr-code-sms",
        title: "QR code SMS",
        description:
          "Facilitez l'envoi de SMS avec un message pre-rempli.",
        icon: "message-square",
        readTime: "4 min",
      },
    ],
  },
  {
    id: "avances",
    title: "Guides avances",
    description: "Techniques pour utilisateurs experimentes",
    icon: "zap",
    guides: [
      {
        slug: "qr-codes-dynamiques",
        title: "QR codes dynamiques",
        description:
          "Modifiez la destination de vos QR codes sans les reimprimer.",
        icon: "refresh-cw",
        readTime: "8 min",
      },
      {
        slug: "ab-testing",
        title: "A/B testing",
        description:
          "Testez differentes destinations pour optimiser vos conversions.",
        icon: "git-branch",
        readTime: "10 min",
      },
      {
        slug: "protection-mot-de-passe",
        title: "Protection par mot de passe",
        description:
          "Securisez l'acces a vos contenus avec une authentification.",
        icon: "lock",
        readTime: "6 min",
      },
      {
        slug: "integration-api",
        title: "Integration API",
        description:
          "Generez des QR codes programmatiquement avec notre API REST.",
        icon: "code",
        readTime: "15 min",
      },
    ],
  },
  {
    id: "secteurs",
    title: "Guides par secteur",
    description: "Solutions adaptees a votre industrie",
    icon: "briefcase",
    guides: [
      {
        slug: "guide-restaurant",
        title: "Restaurant",
        description:
          "Menus digitaux, commandes et avis clients pour la restauration.",
        icon: "utensils",
        readTime: "10 min",
      },
      {
        slug: "guide-pharmacie",
        title: "Pharmacie",
        description:
          "Ordonnances, click & collect et informations medicaments.",
        icon: "pill",
        readTime: "8 min",
      },
      {
        slug: "guide-immobilier",
        title: "Immobilier",
        description:
          "Visites virtuelles et fiches de biens pour les agences.",
        icon: "home",
        readTime: "9 min",
      },
      {
        slug: "guide-marketing",
        title: "Marketing",
        description:
          "Campagnes print-to-digital et tracking de conversions.",
        icon: "trending-up",
        readTime: "12 min",
      },
    ],
  },
];

// Icon component using simple SVG icons
function Icon({ name, className = "" }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    "rocket": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    ),
    "grid": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="7" x="3" y="3" rx="1"/>
        <rect width="7" height="7" x="14" y="3" rx="1"/>
        <rect width="7" height="7" x="14" y="14" rx="1"/>
        <rect width="7" height="7" x="3" y="14" rx="1"/>
      </svg>
    ),
    "zap": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    "briefcase": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    "plus-circle": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12h8"/>
        <path d="M12 8v8"/>
      </svg>
    ),
    "palette": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5"/>
        <circle cx="17.5" cy="10.5" r=".5"/>
        <circle cx="8.5" cy="7.5" r=".5"/>
        <circle cx="6.5" cy="12.5" r=".5"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/>
      </svg>
    ),
    "bar-chart": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="20" y2="10"/>
        <line x1="18" x2="18" y1="20" y2="4"/>
        <line x1="6" x2="6" y1="20" y2="16"/>
      </svg>
    ),
    "link": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    "wifi": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13a10 10 0 0 1 14 0"/>
        <path d="M8.5 16.5a5 5 0 0 1 7 0"/>
        <path d="M2 8.82a15 15 0 0 1 20 0"/>
        <line x1="12" x2="12.01" y1="20" y2="20"/>
      </svg>
    ),
    "user": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    "mail": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
    "message-square": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    "refresh-cw": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M8 16H3v5"/>
      </svg>
    ),
    "git-branch": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" x2="6" y1="3" y2="15"/>
        <circle cx="18" cy="6" r="3"/>
        <circle cx="6" cy="18" r="3"/>
        <path d="M18 9a9 9 0 0 1-9 9"/>
      </svg>
    ),
    "lock": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    "code": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    "utensils": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
        <path d="M7 2v20"/>
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
      </svg>
    ),
    "pill": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
        <path d="m8.5 8.5 7 7"/>
      </svg>
    ),
    "home": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    "trending-up": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    "arrow-right": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"/>
        <path d="m12 5 7 7-7 7"/>
      </svg>
    ),
    "clock": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    "book-open": (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  };

  return <>{icons[name] || null}</>;
}

export default function GuidesPage() {
  const totalGuides = guideCategories.reduce(
    (acc, cat) => acc + cat.guides.length,
    0
  );

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
            <Link href="/guides" className="text-sm font-medium">
              Guides
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
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Icon name="book-open" className="h-4 w-4" />
            <span>{totalGuides} guides disponibles</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Centre de ressources QR Code
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Guides complets, tutoriels pratiques et conseils d&apos;experts pour
            maitriser les QR codes et maximiser leur impact.
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {guideCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <Icon name={category.icon} className="h-4 w-4" />
                {category.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Guide Categories */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-16">
          {guideCategories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-24">
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon name={category.icon} className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
              </div>

              {/* Guides Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.guides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group relative flex flex-col rounded-xl border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Icon name={guide.icon} className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Icon name="clock" className="h-3 w-3" />
                        {guide.readTime}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex-grow">
                      {guide.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Lire le guide
                      <Icon name="arrow-right" className="ml-1 h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center p-12 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/10">
          <h2 className="text-2xl font-bold mb-3">
            Pret a creer votre premier QR code ?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Mettez en pratique ce que vous avez appris. Creez des QR codes
            professionnels gratuitement en quelques clics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Commencer gratuitement
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/api"
              className="inline-flex items-center gap-2 rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              <Icon name="code" className="h-4 w-4" />
              Documentation API
            </Link>
          </div>
        </div>
      </main>

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
                  <Link
                    href="/use-cases/restaurant"
                    className="hover:text-foreground"
                  >
                    Restaurant
                  </Link>
                </li>
                <li>
                  <Link
                    href="/use-cases/marketing"
                    className="hover:text-foreground"
                  >
                    Marketing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/use-cases/pharmacie"
                    className="hover:text-foreground"
                  >
                    Pharmacie
                  </Link>
                </li>
                <li>
                  <Link
                    href="/use-cases/immobilier"
                    className="hover:text-foreground"
                  >
                    Immobilier
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
