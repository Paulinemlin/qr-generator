import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "A propos - QR Generator | Notre mission et notre equipe",
  description:
    "Decouvrez QR Generator, la plateforme francaise de QR codes dynamiques. Notre mission : rendre la technologie QR accessible, simple et puissante pour toutes les entreprises.",
  openGraph: {
    title: "A propos de QR Generator - Notre histoire et nos valeurs",
    description:
      "Une equipe passionnee par l'innovation au service de votre communication digitale. Decouvrez notre mission et nos engagements.",
    type: "website",
  },
  keywords: [
    "qr generator",
    "a propos",
    "equipe",
    "mission",
    "valeurs",
    "entreprise francaise",
    "qr code france",
  ],
};

// Icons as components
const Icons = {
  QrCode: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>
  ),
  Lightbulb: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  ),
  Sparkles: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  ),
  Eye: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Shield: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Target: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Users: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Globe: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  Zap: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  ),
  Heart: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  Headphones: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  ),
  Award: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
  Twitter: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Linkedin: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

// Values data
const values = [
  {
    icon: <Icons.Lightbulb />,
    title: "Innovation",
    description:
      "Nous repoussons constamment les limites de la technologie QR pour vous offrir des solutions toujours plus performantes et creatives.",
  },
  {
    icon: <Icons.Sparkles />,
    title: "Simplicite",
    description:
      "La technologie doit etre accessible a tous. Nous concevons des outils intuitifs que chacun peut maitriser en quelques minutes.",
  },
  {
    icon: <Icons.Eye />,
    title: "Transparence",
    description:
      "Pas de frais caches, pas de surprises. Nous communiquons clairement sur nos tarifs, nos pratiques et l'utilisation de vos donnees.",
  },
  {
    icon: <Icons.Shield />,
    title: "Securite",
    description:
      "La protection de vos donnees est notre priorite absolue. Infrastructure securisee, chiffrement et conformite RGPD garantis.",
  },
];

// Team data
const team = [
  {
    name: "Antoine Dubois",
    role: "Co-fondateur & CEO",
    bio: "Ancien ingenieur chez Google, passionne par les technologies qui simplifient le quotidien.",
    initials: "AD",
  },
  {
    name: "Marie Laurent",
    role: "Co-fondatrice & CTO",
    bio: "Experte en developpement web avec 12 ans d'experience dans la creation de produits SaaS.",
    initials: "ML",
  },
  {
    name: "Thomas Bernard",
    role: "Directeur Produit",
    bio: "Designer de formation, il veille a ce que chaque fonctionnalite soit pensee pour l'utilisateur.",
    initials: "TB",
  },
  {
    name: "Sophie Martin",
    role: "Responsable Marketing",
    bio: "Specialiste du growth marketing, elle accompagne nos clients dans leur reussite digitale.",
    initials: "SM",
  },
  {
    name: "Lucas Petit",
    role: "Lead Developer",
    bio: "Architecte logiciel avec une passion pour les systemes performants et scalables.",
    initials: "LP",
  },
  {
    name: "Emma Rousseau",
    role: "Customer Success",
    bio: "Dediee a la satisfaction client, elle s'assure que chaque utilisateur atteint ses objectifs.",
    initials: "ER",
  },
];

// Stats data
const stats = [
  { value: "2M+", label: "QR codes crees" },
  { value: "50K+", label: "Utilisateurs actifs" },
  { value: "45+", label: "Pays" },
  { value: "99.9%", label: "Disponibilite" },
];

// Why choose us data
const whyChooseUs = [
  {
    icon: <Icons.Zap />,
    title: "Rapidite d'execution",
    description: "Creez et deployez vos QR codes en quelques secondes, pas en quelques heures.",
  },
  {
    icon: <Icons.Heart />,
    title: "Support humain",
    description: "Une equipe francaise disponible pour vous accompagner a chaque etape.",
  },
  {
    icon: <Icons.Globe />,
    title: "Infrastructure mondiale",
    description: "Serveurs repartis dans le monde entier pour des temps de reponse optimaux.",
  },
  {
    icon: <Icons.Award />,
    title: "Qualite premium",
    description: "QR codes haute resolution, toujours lisibles, meme imprimes en petit format.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/5 via-transparent to-transparent blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-primary/5 via-transparent to-transparent blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <Icons.QrCode />
            </div>
            <span className="text-xl font-semibold tracking-tight">QR Generator</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Tarifs
            </Link>
            <Link
              href="/use-cases"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cas d&apos;usage
            </Link>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link href="/about" className="text-sm font-medium">
              A propos
            </Link>
          </nav>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Commencer gratuitement</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-32 md:pb-32">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
                A propos de nous
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Connecter le monde physique
                <br />
                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                  au monde digital.
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Notre mission est de rendre la technologie QR accessible, simple et puissante
                pour toutes les entreprises, des startups aux grands groupes.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 md:py-32 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  Notre histoire
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                  Nes d&apos;une frustration, construits avec passion
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    En 2021, alors que nous cherchions une solution pour creer des QR codes
                    dynamiques pour notre precedent projet, nous avons realise a quel point les
                    outils existants etaient complexes, couteux et peu adaptes aux besoins des
                    entreprises francaises.
                  </p>
                  <p>
                    C&apos;est de cette frustration qu&apos;est ne QR Generator. Notre objectif etait
                    simple : creer la plateforme que nous aurions voulu utiliser. Une solution
                    intuitive, abordable et pensee pour le marche francophone.
                  </p>
                  <p>
                    Aujourd&apos;hui, nous accompagnons plus de 50 000 entreprises dans leur
                    transformation digitale, des restaurants aux pharmacies, des agences
                    immobilieres aux organisateurs d&apos;evenements.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 -m-4 rounded-3xl bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-2xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="rounded-2xl border bg-card p-6 shadow-lg">
                      <div className="text-4xl font-bold">2021</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Lancement de QR Generator
                      </div>
                    </div>
                    <div className="rounded-2xl border bg-card p-6 shadow-lg">
                      <div className="text-4xl font-bold">15</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Membres dans l&apos;equipe
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="rounded-2xl border bg-card p-6 shadow-lg">
                      <div className="text-4xl font-bold">Paris</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Siege social
                      </div>
                    </div>
                    <div className="rounded-2xl border bg-card p-6 shadow-lg">
                      <div className="text-4xl font-bold">100%</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Entreprise francaise
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <Badge variant="secondary" className="mb-4">
                Nos valeurs
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ce qui nous guide au quotidien
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Quatre piliers fondamentaux qui definissent notre facon de travailler et de servir
                nos clients.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card to-muted/30 p-8 transition-all hover:shadow-lg hover:border-primary/20"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:from-primary/10 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 md:py-32 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <Badge variant="secondary" className="mb-4">
                Notre equipe
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Des experts passionnes
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Une equipe multiculturelle et complementaire, unie par la volonte de creer le
                meilleur produit possible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg shrink-0">
                      {member.initials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-primary font-medium">{member.role}</p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Envie de rejoindre l&apos;aventure ?
              </p>
              <Link href="/careers">
                <Button variant="outline">
                  Voir nos offres d&apos;emploi
                  <Icons.ArrowRight />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <Badge variant="secondary" className="mb-4">
                En chiffres
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                QR Generator aujourd&apos;hui
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Des chiffres qui temoignent de la confiance de nos utilisateurs.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 md:py-32 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <Badge variant="secondary" className="mb-4">
                Pourquoi nous choisir
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ce qui fait la difference
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Au-dela de la technologie, c&apos;est notre engagement envers vous qui compte.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="group flex gap-6 rounded-2xl border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/20"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 bg-foreground text-background relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="mx-auto max-w-4xl px-6 text-center relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Pret a transformer votre communication ?
            </h2>
            <p className="mt-6 text-lg text-background/70 max-w-2xl mx-auto">
              Rejoignez les milliers d&apos;entreprises qui utilisent deja QR Generator pour
              connecter le monde physique au digital.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-medium bg-background text-foreground hover:bg-background/90"
                >
                  Commencer gratuitement
                  <Icons.ArrowRight />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base font-medium border-background/20 text-background hover:bg-background/10"
                >
                  Nous contacter
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-background/50">
              Gratuit pour commencer. Aucune carte bancaire requise.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icons.QrCode />
                </div>
                <span className="text-lg font-semibold">QR Generator</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                La plateforme francaise de QR codes dynamiques pour les entreprises.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icons.Twitter />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icons.Linkedin />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/features" className="hover:text-foreground transition-colors">
                    Fonctionnalites
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition-colors">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="/use-cases" className="hover:text-foreground transition-colors">
                    Cas d&apos;usage
                  </Link>
                </li>
                <li>
                  <Link href="/docs/api" className="hover:text-foreground transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="hover:text-foreground transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Centre d&apos;aide
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="hover:text-foreground transition-colors">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors font-medium text-foreground">
                    A propos
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Carrieres
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-foreground transition-colors">
                    Presse
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Confidentialite
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    CGU
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-foreground transition-colors">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="/gdpr" className="hover:text-foreground transition-colors">
                    RGPD
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} QR Generator. Tous droits reserves.</p>
            <p>Fait avec soin en France</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
