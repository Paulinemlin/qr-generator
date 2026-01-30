import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Menu Restaurant - Créez votre menu digital gratuit | QR Generator",
  description:
    "Créez un QR code pour votre restaurant en 2 minutes. Menu digital sans contact, commande en ligne, avis clients. Solution gratuite pour restaurateurs.",
  keywords: [
    "qr code menu restaurant",
    "menu digital restaurant",
    "qr code restaurant gratuit",
    "menu sans contact",
    "menu qr code",
  ],
  openGraph: {
    title: "QR Code Menu Restaurant - Menu digital gratuit",
    description: "Créez un QR code pour votre restaurant. Menu sans contact, commande en ligne.",
  },
};

const features = [
  {
    title: "Menu sans contact",
    description: "Vos clients scannent et consultent le menu sur leur smartphone. Hygiénique et moderne.",
    icon: "📱",
  },
  {
    title: "Mise à jour instantanée",
    description: "Modifiez vos plats, prix et disponibilités en temps réel sans réimprimer.",
    icon: "✏️",
  },
  {
    title: "Multi-langues",
    description: "Proposez votre menu en plusieurs langues pour les touristes internationaux.",
    icon: "🌍",
  },
  {
    title: "Photos des plats",
    description: "Ajoutez des photos appétissantes pour augmenter le panier moyen de 25%.",
    icon: "📸",
  },
  {
    title: "Informations allergènes",
    description: "Affichez les allergènes et informations nutritionnelles obligatoires.",
    icon: "⚠️",
  },
  {
    title: "Analytics détaillés",
    description: "Découvrez quels plats sont les plus consultés et optimisez votre carte.",
    icon: "📊",
  },
];

const steps = [
  {
    step: "1",
    title: "Créez votre menu digital",
    description: "Uploadez votre carte au format PDF ou créez une page web dédiée.",
  },
  {
    step: "2",
    title: "Générez votre QR code",
    description: "Personnalisez-le aux couleurs de votre établissement avec votre logo.",
  },
  {
    step: "3",
    title: "Imprimez et placez",
    description: "Disposez vos QR codes sur les tables, à l'entrée ou sur vos supports.",
  },
];

const testimonials = [
  {
    quote: "Depuis qu'on a adopté les QR codes, nos clients adorent. Plus besoin de nettoyer les menus !",
    author: "Marie L.",
    role: "Gérante de brasserie, Paris",
  },
  {
    quote: "Le panier moyen a augmenté de 20% grâce aux photos des plats sur le menu digital.",
    author: "Thomas B.",
    role: "Chef restaurateur, Lyon",
  },
  {
    quote: "Je peux changer les plats du jour en 2 secondes depuis mon téléphone. Un gain de temps énorme.",
    author: "Sophie M.",
    role: "Propriétaire café, Bordeaux",
  },
];

const stats = [
  { value: "60%", label: "des restaurants français utilisent les QR codes" },
  { value: "+25%", label: "de panier moyen avec photos des plats" },
  { value: "2 min", label: "pour créer votre menu QR code" },
  { value: "0€", label: "pour commencer" },
];

export default function RestaurantUseCasePage() {
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
      <section className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Restaurant & Hôtellerie
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                QR Code Menu Restaurant
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Digitalisez votre carte en 2 minutes. Menu sans contact, mise à jour
                instantanée, analytics détaillés. Gratuit pour commencer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Créer mon menu QR code
                </Link>
                <Link
                  href="/blog/qr-code-restaurant-menu"
                  className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
                >
                  Lire le guide complet
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🍽️</div>
                  <div className="w-32 h-32 mx-auto bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <div className="w-24 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMSAyMSI+PHBhdGggZD0iTTEgMWgxdjFIMXptMiAwaDJ2MUgzem0zIDBoMXYxSDZ6bTIgMGgxdjFIOHptNiAwaDJ2MUgxNHptMyAwaDN2M2gtMXYtMmgtMnptLTE2IDJoMXYxSDF6bTIgMGgxdjFIM3ptMiAwaDN2MUg1em00IDBoMXYxSDl6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTQgMGgxdjFoLTF6TTEgNWgxdjFIMXptNCAwaDJ2MUg1em0zIDBoMXYxSDh6bTIgMGgxdjFoLTF6bTIgMGgydjFoLTJ6bTMgMGgxdjFoLTF6bTMgMGgxdjFoLTF6TTMgN2gxdjFIM3ptMiAwaDN2MUg1em00IDBoMXYxSDl6bTQgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6TTEgOWgzdjFIMXptNCAwaDJ2MUg1em0zIDBoMXYxSDh6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgydjFoLTJ6bTQgMGgxdjFoLTF6TTMgMTFoMXYxSDN6bTQgMGgxdjFIN3ptMiAwaDJ2MWgtMnptMyAwaDN2MWgtM3ptNCAwaDJ2MWgtMnpNMSAxM2gxdjFIMXptMiAwaDJ2MUgzem0zIDBoMXYxSDZ6bTIgMGgydjFIOHptNSAwaDJ2MWgtMnptMyAwaDN2MWgtM3pNNSAxNWgxdjFINXptMiAwaDJ2MUg3em0zIDBoMXYxaC0xem0yIDBoMXYxaC0xem00IDBoMXYxaC0xem0yIDBoMXYxaC0xek0xIDE3aDN2M0gxem0yIDFoMXYxSDN6bTQtMWgxdjFIN3ptMiAwaDN2MUg5em00IDBoM3YxaC0zem00IDBoM3YzaC0xdi0yaC0yem0tMTQgMmgxdjFINXptMiAwaDN2MWgtM3ptNSAwaDN2MWgtM3ptNCAwaDN2MWgtM3oiLz48L3N2Zz4=')] bg-contain"></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">Scannez pour voir le menu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
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
              Tout ce dont votre restaurant a besoin
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des fonctionnalités pensées pour les restaurateurs, de la création
              du menu au suivi des performances.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border rounded-xl p-6 hover:border-primary/50 transition-colors"
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
              Comment créer votre menu QR code
            </h2>
            <p className="text-muted-foreground">
              3 étapes simples pour digitaliser votre carte
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Commencer maintenant - C&apos;est gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ils ont adopté le menu QR code
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="border rounded-xl p-6">
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

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            <details className="border rounded-lg p-4 bg-background">
              <summary className="font-medium cursor-pointer">
                Le QR code menu est-il vraiment gratuit ?
              </summary>
              <p className="mt-4 text-muted-foreground">
                Oui, vous pouvez créer jusqu&apos;à 3 QR codes gratuitement avec le plan Free.
                Pour des fonctionnalités avancées (analytics, personnalisation poussée),
                des plans payants sont disponibles à partir de 9€/mois.
              </p>
            </details>
            <details className="border rounded-lg p-4 bg-background">
              <summary className="font-medium cursor-pointer">
                Comment mes clients accèdent-ils au menu ?
              </summary>
              <p className="mt-4 text-muted-foreground">
                Vos clients scannent simplement le QR code avec l&apos;appareil photo de leur
                smartphone. Aucune application à télécharger. Le menu s&apos;affiche
                directement dans leur navigateur.
              </p>
            </details>
            <details className="border rounded-lg p-4 bg-background">
              <summary className="font-medium cursor-pointer">
                Puis-je modifier mon menu après création du QR code ?
              </summary>
              <p className="mt-4 text-muted-foreground">
                Absolument ! Avec nos QR codes dynamiques, vous pouvez modifier le contenu
                (plats, prix, horaires) à tout moment sans changer le QR code imprimé.
              </p>
            </details>
            <details className="border rounded-lg p-4 bg-background">
              <summary className="font-medium cursor-pointer">
                Quel format de menu puis-je utiliser ?
              </summary>
              <p className="mt-4 text-muted-foreground">
                Vous pouvez utiliser un PDF, une page web, ou créer directement votre menu
                dans notre interface. Nous supportons aussi les intégrations avec les
                principales plateformes de commande en ligne.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à digitaliser votre menu ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de restaurants qui utilisent déjà QR Generator.
            Création gratuite, sans carte bancaire.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90"
          >
            Créer mon menu QR code gratuitement
          </Link>
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
                <li><Link href="/use-cases/restaurant" className="hover:text-foreground">Restaurant</Link></li>
                <li><Link href="/use-cases/marketing" className="hover:text-foreground">Marketing</Link></li>
                <li><Link href="/use-cases/evenement" className="hover:text-foreground">Événement</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/blog/qr-code-restaurant-menu" className="hover:text-foreground">Guide menu QR</Link></li>
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
