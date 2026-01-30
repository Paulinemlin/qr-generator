import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog QR Code - Guides, Astuces et Tendances | QR Generator",
  description:
    "Découvrez nos articles sur les QR codes : guides pratiques, cas d'usage, tendances marketing et conseils pour optimiser vos campagnes.",
  keywords: [
    "qr code",
    "guide qr code",
    "marketing qr code",
    "qr code restaurant",
    "qr code entreprise",
  ],
};

// Articles statiques pour le SEO
const articles = [
  {
    slug: "comment-creer-qr-code-gratuit",
    title: "Comment créer un QR code gratuit en 2024 : Guide complet",
    excerpt:
      "Apprenez à créer des QR codes professionnels gratuitement. Notre guide étape par étape vous montre comment générer, personnaliser et suivre vos QR codes.",
    category: "Guide",
    date: "2024-01-15",
    readTime: "5 min",
  },
  {
    slug: "qr-code-restaurant-menu",
    title: "QR Code Menu Restaurant : Digitaliser votre carte en 5 minutes",
    excerpt:
      "Découvrez comment les restaurants utilisent les QR codes pour leurs menus. Avantages, mise en place et meilleures pratiques pour une expérience client optimale.",
    category: "Cas d'usage",
    date: "2024-01-10",
    readTime: "7 min",
  },
  {
    slug: "qr-code-marketing-campagne",
    title: "QR Codes Marketing : 10 stratégies pour booster vos campagnes",
    excerpt:
      "Les QR codes révolutionnent le marketing digital. Découvrez 10 stratégies efficaces pour intégrer les QR codes dans vos campagnes publicitaires.",
    category: "Marketing",
    date: "2024-01-05",
    readTime: "8 min",
  },
  {
    slug: "qr-code-carte-visite",
    title: "QR Code Carte de Visite : Le networking moderne",
    excerpt:
      "Transformez votre carte de visite avec un QR code vCard. Partagez instantanément vos coordonnées professionnelles de manière moderne et écologique.",
    category: "Business",
    date: "2024-01-01",
    readTime: "4 min",
  },
  {
    slug: "statistiques-qr-code-analytics",
    title: "Analytics QR Code : Mesurez l'efficacité de vos campagnes",
    excerpt:
      "Apprenez à analyser les performances de vos QR codes. Taux de scan, géolocalisation, appareils : toutes les métriques pour optimiser vos résultats.",
    category: "Analytics",
    date: "2023-12-28",
    readTime: "6 min",
  },
  {
    slug: "qr-code-wifi-partager-connexion",
    title: "QR Code WiFi : Partagez votre connexion sans mot de passe",
    excerpt:
      "Créez un QR code WiFi pour permettre à vos invités de se connecter instantanément. Idéal pour les hôtels, restaurants et espaces de coworking.",
    category: "Guide",
    date: "2023-12-20",
    readTime: "4 min",
  },
];

const categories = [
  { name: "Tous", count: articles.length },
  { name: "Guide", count: articles.filter((a) => a.category === "Guide").length },
  { name: "Marketing", count: articles.filter((a) => a.category === "Marketing").length },
  { name: "Business", count: articles.filter((a) => a.category === "Business").length },
  { name: "Cas d'usage", count: articles.filter((a) => a.category === "Cas d'usage").length },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            QR Generator
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/blog" className="text-sm font-medium">
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
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Blog QR Code
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Guides pratiques, tendances marketing et conseils d&apos;experts pour
            maîtriser les QR codes et booster votre business.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="font-semibold mb-4">Catégories</h2>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <button className="flex items-center justify-between w-full text-left text-sm py-2 px-3 rounded-md hover:bg-muted transition-colors">
                      <span>{cat.name}</span>
                      <span className="text-muted-foreground">{cat.count}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h3 className="font-medium mb-2">Créez votre QR code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Générez des QR codes professionnels gratuitement.
                </p>
                <Link
                  href="/register"
                  className="block text-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Commencer gratuitement
                </Link>
              </div>
            </div>
          </aside>

          {/* Articles */}
          <div className="lg:col-span-3">
            <div className="grid gap-8">
              {articles.map((article) => (
                <article
                  key={article.slug}
                  className="group border rounded-xl p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="px-2 py-1 rounded-md bg-muted">
                      {article.category}
                    </span>
                    <span>{article.date}</span>
                    <span>{article.readTime} de lecture</span>
                  </div>
                  <Link href={`/blog/${article.slug}`}>
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Lire l&apos;article →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer SEO */}
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
                <li><Link href="/use-cases/restaurant" className="hover:text-foreground">Restaurant</Link></li>
                <li><Link href="/use-cases/marketing" className="hover:text-foreground">Marketing</Link></li>
                <li><Link href="/use-cases/evenement" className="hover:text-foreground">Événement</Link></li>
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
