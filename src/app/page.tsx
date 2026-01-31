import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AnimatedQRPreview } from "@/components/animated-qr-preview";

export const metadata: Metadata = {
  title: "QR Generator - Creez des QR codes dynamiques et personnalises",
  description:
    "La plateforme francaise de QR codes dynamiques. Creez, personnalisez et suivez vos QR codes en temps reel. Utilise par plus de 10 000 entreprises.",
  openGraph: {
    title: "QR Generator - QR codes dynamiques pour entreprises",
    description:
      "Creez des QR codes personnalises avec votre logo. Suivez chaque scan en temps reel.",
    type: "website",
  },
};

// Icons as components for cleaner code
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
  Refresh: () => (
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
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  ),
  BarChart: () => (
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
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  ),
  Palette: () => (
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
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
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
  Pill: () => (
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
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  ),
  Utensils: () => (
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
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  ),
  Megaphone: () => (
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
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  ),
  Building: () => (
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
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  ),
  ShoppingBag: () => (
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
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Calendar: () => (
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  ),
  Home: () => (
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
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  Check: () => (
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
      <path d="M20 6 9 17l-5-5" />
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
  Star: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated gradient background - violet/pink/blue */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[oklch(0.55_0.25_290/0.15)] via-[oklch(0.65_0.22_340/0.08)] to-transparent blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[oklch(0.55_0.20_260/0.12)] via-[oklch(0.65_0.22_340/0.06)] to-transparent blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[oklch(0.70_0.15_200/0.08)] to-transparent blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[oklch(0.55_0.25_290)] to-[oklch(0.65_0.22_340)] text-white transition-transform group-hover:scale-105 shadow-md shadow-[oklch(0.55_0.25_290/0.3)]">
              <Icons.QrCode />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              QR Generator
            </span>
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
              {/* Badge */}
              <div className="mb-8 flex justify-center">
                <Badge
                  variant="secondary"
                  className="px-4 py-1.5 text-sm font-medium"
                >
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Nouveau : Export haute resolution disponible
                </Badge>
              </div>

              {/* Headline */}
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Vos QR codes.
                <br />
                <span className="bg-gradient-to-r from-[oklch(0.55_0.25_290)] via-[oklch(0.65_0.22_340)] to-[oklch(0.55_0.20_260)] bg-clip-text text-transparent">
                  Intelligents et dynamiques.
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Creez des QR codes que vous pouvez modifier a tout moment,
                personnalisez-les avec votre marque et suivez chaque scan en
                temps reel. La solution complete pour les entreprises exigeantes.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="h-12 px-8 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  >
                    Creer un QR code gratuit
                    <Icons.ArrowRight />
                  </Button>
                </Link>
                <Link href="/#demo">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base font-medium"
                  >
                    Voir la demo
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icons.Check />
                  <span>Gratuit pour commencer</span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <Icons.Check />
                  <span>Aucune carte requise</span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <Icons.Check />
                  <span>+10 000 entreprises</span>
                </div>
              </div>
            </div>

            {/* Floating QR Preview */}
            <div className="relative mt-20 flex justify-center">
              <div className="relative">
                {/* Glow effect - violet/pink */}
                <div className="absolute inset-0 -m-4 rounded-3xl bg-gradient-to-r from-[oklch(0.55_0.25_290/0.25)] via-[oklch(0.65_0.22_340/0.15)] to-[oklch(0.55_0.20_260/0.25)] blur-2xl" />

                {/* QR Code Preview Card */}
                <div className="relative rounded-2xl border bg-card p-8 shadow-2xl">
                  <div className="flex gap-8 items-center">
                    {/* Sample QR Code */}
                    <div className="relative">
                      <div className="h-40 w-40 rounded-xl bg-gradient-to-br from-muted to-muted/50 p-4">
                        <div className="h-full w-full rounded-lg bg-foreground/10 flex items-center justify-center">
                          <div className="grid grid-cols-5 gap-1">
                            {Array.from({ length: 25 }).map((_, i) => (
                              <div
                                key={i}
                                className={`h-5 w-5 rounded-sm ${
                                  [0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 19, 20, 22, 23, 24].includes(i)
                                    ? "bg-foreground"
                                    : "bg-transparent"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Scan animation ring - violet glow */}
                      <div className="absolute inset-0 rounded-xl border-2 border-[oklch(0.55_0.25_290/0.6)] animate-ping" style={{ animationDuration: '3s' }} />
                    </div>

                    {/* Stats preview */}
                    <div className="hidden sm:block space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Scans aujourd&apos;hui</div>
                        <div className="text-3xl font-bold">1,247</div>
                      </div>
                      <div className="h-px bg-border w-full" />
                      <div className="flex gap-6">
                        <div>
                          <div className="text-xs text-muted-foreground">Cette semaine</div>
                          <div className="text-lg font-semibold text-green-600">+23%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Total</div>
                          <div className="text-lg font-semibold">45.2K</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-center text-sm font-medium text-muted-foreground mb-8">
              Utilise par des milliers d&apos;entreprises en France
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">50K+</div>
                <div className="text-sm text-muted-foreground mt-1">QR codes crees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">2M+</div>
                <div className="text-sm text-muted-foreground mt-1">Scans enregistres</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">10K+</div>
                <div className="text-sm text-muted-foreground mt-1">Entreprises</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground mt-1">Disponibilite</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Bento Grid */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <Badge variant="secondary" className="mb-4">Fonctionnalites</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Tout ce dont vous avez besoin
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Des outils puissants pour creer, gerer et analyser vos QR codes
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Feature 1 - Large */}
              <div className="lg:col-span-2 group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card to-[oklch(0.55_0.25_290/0.03)] p-8 transition-all hover:shadow-lg hover:shadow-[oklch(0.55_0.25_290/0.1)] hover:border-[oklch(0.55_0.25_290/0.3)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.55_0.25_290/0.15)] to-[oklch(0.65_0.22_340/0.15)] text-[oklch(0.55_0.25_290)] mb-6">
                  <Icons.Refresh />
                </div>
                <h3 className="text-xl font-semibold mb-2">QR codes dynamiques</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Modifiez la destination de vos QR codes a tout moment, sans avoir
                  a les reimprimer. Ideal pour les campagnes marketing evolutives.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Sans reimpression</Badge>
                  <Badge variant="outline">Modification instantanee</Badge>
                  <Badge variant="outline">Historique des URLs</Badge>
                </div>
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:from-primary/10 transition-all" />
              </div>

              {/* Feature 2 */}
              <div className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card to-[oklch(0.65_0.22_340/0.03)] p-8 transition-all hover:shadow-lg hover:shadow-[oklch(0.65_0.22_340/0.1)] hover:border-[oklch(0.65_0.22_340/0.3)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.65_0.22_340/0.15)] to-[oklch(0.55_0.20_260/0.15)] text-[oklch(0.65_0.22_340)] mb-6">
                  <Icons.BarChart />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analytics avances</h3>
                <p className="text-muted-foreground">
                  Suivez chaque scan en temps reel : localisation, appareil,
                  heure, et bien plus encore.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card to-[oklch(0.55_0.20_260/0.03)] p-8 transition-all hover:shadow-lg hover:shadow-[oklch(0.55_0.20_260/0.1)] hover:border-[oklch(0.55_0.20_260/0.3)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.55_0.20_260/0.15)] to-[oklch(0.70_0.15_200/0.15)] text-[oklch(0.55_0.20_260)] mb-6">
                  <Icons.Palette />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personnalisation totale</h3>
                <p className="text-muted-foreground">
                  Couleurs, formes, logo au centre... Creez des QR codes qui
                  refletent parfaitement votre identite de marque.
                </p>
              </div>

              {/* Feature 4 - Large */}
              <div className="lg:col-span-2 group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card to-[oklch(0.70_0.15_200/0.03)] p-8 transition-all hover:shadow-lg hover:shadow-[oklch(0.70_0.15_200/0.1)] hover:border-[oklch(0.70_0.15_200/0.3)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.70_0.15_200/0.15)] to-[oklch(0.55_0.25_290/0.15)] text-[oklch(0.70_0.15_200)] mb-6">
                  <Icons.Shield />
                </div>
                <h3 className="text-xl font-semibold mb-2">Securite et controle</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Protegez vos QR codes avec des mots de passe, definissez des dates
                  d&apos;expiration ou limitez le nombre de scans autorises.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Mot de passe</Badge>
                  <Badge variant="outline">Date d&apos;expiration</Badge>
                  <Badge variant="outline">Limite de scans</Badge>
                  <Badge variant="outline">Georestriction</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-24 md:py-32 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <Badge variant="secondary" className="mb-4">Cas d&apos;usage</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Adapte a votre secteur
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Decouvrez comment les entreprises utilisent nos QR codes
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: <Icons.Pill />, label: "Pharmacies", href: "/use-cases/pharmacie" },
                { icon: <Icons.Utensils />, label: "Restaurants", href: "/use-cases/restaurant" },
                { icon: <Icons.Megaphone />, label: "Marketing", href: "/use-cases/marketing" },
                { icon: <Icons.Home />, label: "Immobilier", href: "/use-cases/immobilier" },
                { icon: <Icons.Calendar />, label: "Événements", href: "/use-cases/evenement" },
                { icon: <Icons.ShoppingBag />, label: "Retail", href: "/use-cases/retail" },
              ].map((useCase) => (
                <Link
                  key={useCase.label}
                  href={useCase.href}
                  className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center transition-all hover:shadow-lg hover:shadow-[oklch(0.55_0.25_290/0.15)] hover:border-[oklch(0.55_0.25_290/0.3)] hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-gradient-to-br group-hover:from-[oklch(0.55_0.25_290/0.15)] group-hover:to-[oklch(0.65_0.22_340/0.15)] group-hover:text-[oklch(0.55_0.25_290)] transition-colors">
                    {useCase.icon}
                  </div>
                  <span className="text-sm font-medium">{useCase.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Product Demo Preview */}
        <section id="demo" className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <Badge variant="secondary" className="mb-4">Interface</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Simple et intuitif
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Creez votre premier QR code en moins de 30 secondes
              </p>
            </div>

            <AnimatedQRPreview />
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-24 md:py-32 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <Badge variant="secondary" className="mb-4">Tarifs</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Un prix simple et transparent
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Commencez gratuitement, evoluez selon vos besoins
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="rounded-2xl border bg-card p-8 transition-all hover:shadow-lg">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Gratuit</h3>
                  <p className="text-sm text-muted-foreground mt-1">Pour decouvrir</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">0</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "5 QR codes dynamiques",
                    "100 scans/mois",
                    "Statistiques de base",
                    "Export PNG",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Icons.Check />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button variant="outline" className="w-full">
                    Commencer gratuitement
                  </Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="rounded-2xl border-2 border-[oklch(0.55_0.25_290)] bg-card p-8 relative transition-all hover:shadow-lg hover:shadow-[oklch(0.55_0.25_290/0.2)] shadow-lg shadow-[oklch(0.55_0.25_290/0.15)]">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium text-white rounded-full bg-gradient-to-r from-[oklch(0.55_0.25_290)] via-[oklch(0.60_0.23_310)] to-[oklch(0.65_0.22_340)]">
                  Populaire
                </span>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Pro</h3>
                  <p className="text-sm text-muted-foreground mt-1">Pour les professionnels</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">9</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "QR codes illimites",
                    "Scans illimites",
                    "Analytics avances",
                    "Logo personnalise",
                    "Export HD (PNG, SVG, PDF)",
                    "Support prioritaire",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Icons.Check />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register?plan=pro" className="block">
                  <Button className="w-full">
                    Essayer Pro gratuitement
                  </Button>
                </Link>
              </div>

              {/* Business Plan */}
              <div className="rounded-2xl border bg-card p-8 transition-all hover:shadow-lg">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Business</h3>
                  <p className="text-sm text-muted-foreground mt-1">Pour les equipes</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">29</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Tout dans Pro",
                    "5 membres d'equipe",
                    "API access",
                    "Webhooks",
                    "SSO / SAML",
                    "SLA 99.99%",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Icons.Check />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register?plan=business" className="block">
                  <Button variant="outline" className="w-full">
                    Contacter l&apos;equipe
                  </Button>
                </Link>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                Voir tous les details des tarifs
                <Icons.ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <Badge variant="secondary" className="mb-4">Temoignages</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ils nous font confiance
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Decouvrez ce que nos clients disent de nous
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    "QR Generator a revolutionne notre gestion des menus. Nous pouvons maintenant mettre a jour les prix instantanement sans reimprimer.",
                  author: "Marie Dupont",
                  role: "Proprietaire",
                  company: "Le Petit Bistrot",
                },
                {
                  quote:
                    "Les analytics nous permettent de mesurer precisement le ROI de nos campagnes print. Un outil indispensable pour notre equipe marketing.",
                  author: "Thomas Martin",
                  role: "Directeur Marketing",
                  company: "AgenceDigitale",
                },
                {
                  quote:
                    "La securite avec mot de passe est parfaite pour nos documents confidentiels. Simple a utiliser et tres fiable.",
                  author: "Sophie Bernard",
                  role: "Pharmacienne",
                  company: "Pharmacie du Centre",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="rounded-2xl border bg-card p-8 transition-all hover:shadow-lg"
                >
                  <div className="flex gap-1 text-yellow-500 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icons.Star key={i} />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.author}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Gradient violet/pink/blue */}
        <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, oklch(0.35 0.20 290) 0%, oklch(0.30 0.18 320) 50%, oklch(0.25 0.15 260) 100%)' }}>
          {/* Animated gradient orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[oklch(0.55_0.25_290/0.3)] blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[oklch(0.65_0.22_340/0.25)] blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[oklch(0.55_0.20_260/0.2)] blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
          </div>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="mx-auto max-w-4xl px-6 text-center relative text-white">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Pret a creer votre premier QR code ?
            </h2>
            <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
              Rejoignez plus de 10 000 entreprises qui utilisent QR Generator
              pour connecter le monde physique au digital.
            </p>

            {/* Email capture */}
            <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="votre@email.com"
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/20"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-white text-[oklch(0.30_0.18_290)] hover:bg-white/90 shrink-0 font-semibold"
              >
                Commencer gratuitement
              </Button>
            </form>

            <p className="mt-4 text-sm text-white/60">
              Creez votre premier QR code en 30 secondes. Aucune carte bancaire requise.
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[oklch(0.55_0.25_290)] to-[oklch(0.65_0.22_340)] text-white shadow-md shadow-[oklch(0.55_0.25_290/0.3)]">
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
                  <Link href="/api" className="hover:text-foreground transition-colors">
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
                  <Link href="/about" className="hover:text-foreground transition-colors">
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
