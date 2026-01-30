"use client";

import { useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Check,
  X,
  Loader2,
  Zap,
  Shield,
  CreditCard,
  Clock,
  HelpCircle,
  ChevronDown,
  Star,
  Building2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS, PlanType } from "@/lib/plans";

// FAQ data
const faqItems = [
  {
    question: "Puis-je changer de plan a tout moment ?",
    answer:
      "Oui, vous pouvez passer a un plan superieur ou inferieur a tout moment. Si vous passez a un plan superieur, la difference sera calculee au prorata. Si vous passez a un plan inferieur, le changement prendra effet a la fin de votre periode de facturation actuelle.",
  },
  {
    question: "Y a-t-il un engagement minimum ?",
    answer:
      "Non, tous nos plans sont sans engagement. Vous pouvez annuler a tout moment et vous ne serez pas facture pour la periode suivante. Vos QR codes resteront actifs jusqu'a la fin de votre periode de facturation.",
  },
  {
    question: "Comment fonctionne la facturation ?",
    answer:
      "Nous facturons mensuellement par carte bancaire. Vous recevez une facture par email a chaque paiement. Pour les entreprises, nous proposons egalement la facturation annuelle avec 2 mois offerts.",
  },
  {
    question: "Que se passe-t-il si je depasse les limites de mon plan ?",
    answer:
      "Pour le plan Gratuit, vos QR codes resteront actifs mais vous ne pourrez plus en creer de nouveaux. Pour les scans, une fois la limite atteinte, vos QR codes continueront de fonctionner mais les statistiques ne seront plus enregistrees jusqu'au mois suivant.",
  },
  {
    question: "Proposez-vous des reductions pour les associations ?",
    answer:
      "Oui ! Nous offrons 50% de reduction sur tous nos plans pour les associations et organisations a but non lucratif. Contactez notre equipe avec un justificatif pour beneficier de cette offre.",
  },
  {
    question: "Les QR codes crees sont-ils permanents ?",
    answer:
      "Oui, tous les QR codes crees sont permanents et continueront de fonctionner meme si vous passez au plan gratuit. Cependant, certaines fonctionnalites avancees (comme l'analytics) ne seront plus disponibles.",
  },
];

// Feature comparison data
const comparisonFeatures = [
  {
    category: "QR Codes",
    features: [
      { name: "Nombre de QR codes", free: "3", pro: "Illimites", business: "Illimites" },
      { name: "Scans par mois", free: "100", pro: "Illimites", business: "Illimites" },
      { name: "Types de QR codes", free: "URL, Texte", pro: "Tous les types", business: "Tous les types" },
      { name: "QR codes dynamiques", free: true, pro: true, business: true },
    ],
  },
  {
    category: "Design & Personnalisation",
    features: [
      { name: "Design standard", free: true, pro: true, business: true },
      { name: "Logo personnalise", free: false, pro: true, business: true },
      { name: "Templates premium", free: false, pro: true, business: true },
      { name: "Formes personnalisees", free: false, pro: true, business: true },
      { name: "Degrades de couleurs", free: false, pro: true, business: true },
    ],
  },
  {
    category: "Analytics & Suivi",
    features: [
      { name: "Statistiques de base", free: true, pro: true, business: true },
      { name: "Analytics avances", free: false, pro: true, business: true },
      { name: "Geolocalisation des scans", free: false, pro: true, business: true },
      { name: "A/B testing", free: false, pro: false, business: true },
    ],
  },
  {
    category: "Securite & Controle",
    features: [
      { name: "Protection par mot de passe", free: false, pro: true, business: true },
      { name: "Date d'expiration", free: false, pro: true, business: true },
      { name: "Limite de scans", free: false, pro: true, business: true },
    ],
  },
  {
    category: "Export",
    features: [
      { name: "Export PNG", free: true, pro: true, business: true },
      { name: "Export SVG", free: false, pro: true, business: true },
      { name: "Export PDF", free: false, pro: false, business: true },
    ],
  },
  {
    category: "Integration & Equipe",
    features: [
      { name: "Acces API", free: false, pro: false, business: true },
      { name: "Domaines personnalises", free: false, pro: false, business: true },
      { name: "Equipes & permissions", free: false, pro: false, business: true },
      { name: "Webhooks", free: false, pro: false, business: true },
    ],
  },
  {
    category: "Support",
    features: [
      { name: "Support email", free: true, pro: true, business: true },
      { name: "Support prioritaire", free: false, pro: true, business: true },
      { name: "Support dedie", free: false, pro: false, business: true },
      { name: "SLA 99.9%", free: false, pro: false, business: true },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-medium text-foreground">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-muted-foreground">{answer}</p>
      </div>
    </div>
  );
}

function PricingContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");
  const [loading, setLoading] = useState<PlanType | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const handleSubscribe = async (plan: PlanType) => {
    if (!session) {
      router.push("/login?redirect=/pricing");
      return;
    }

    if (plan === "FREE") {
      return;
    }

    setLoading(plan);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        setLoading(null);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(null);
    }
  };

  // Plan features for cards
  const plans = [
    {
      id: "FREE" as PlanType,
      name: "Gratuit",
      price: 0,
      annualPrice: 0,
      description: "Parfait pour decouvrir",
      icon: <Zap className="h-6 w-6" />,
      popular: false,
      features: [
        { text: "3 QR codes", included: true },
        { text: "100 scans/mois", included: true },
        { text: "Types basiques (URL, texte)", included: true },
        { text: "Design standard", included: true },
        { text: "Support email", included: true },
        { text: "Logo personnalise", included: false },
        { text: "Analytics avances", included: false },
      ],
      cta: "Plan actuel",
      ctaDisabled: true,
    },
    {
      id: "PRO" as PlanType,
      name: "Pro",
      price: 9,
      annualPrice: 7,
      description: "Pour les professionnels",
      icon: <Star className="h-6 w-6" />,
      popular: true,
      features: [
        { text: "QR codes illimites", included: true },
        { text: "Scans illimites", included: true },
        { text: "Tous les types (WiFi, vCard, Email, SMS)", included: true },
        { text: "Logo personnalise", included: true },
        { text: "Analytics avances", included: true },
        { text: "QR codes dynamiques", included: true },
        { text: "Expiration & limite de scans", included: true },
        { text: "Protection par mot de passe", included: true },
        { text: "Templates premium", included: true },
        { text: "Export SVG", included: true },
        { text: "Support prioritaire", included: true },
      ],
      cta: "Commencer l'essai gratuit",
      ctaDisabled: false,
    },
    {
      id: "BUSINESS" as PlanType,
      name: "Business",
      price: 29,
      annualPrice: 24,
      description: "Pour les entreprises",
      icon: <Building2 className="h-6 w-6" />,
      popular: false,
      features: [
        { text: "Tout le plan Pro +", included: true, highlight: true },
        { text: "Acces API", included: true },
        { text: "Domaines personnalises", included: true },
        { text: "Equipes & permissions", included: true },
        { text: "Export PDF", included: true },
        { text: "A/B testing", included: true },
        { text: "Webhooks", included: true },
        { text: "Support dedie", included: true },
        { text: "SLA 99.9%", included: true },
      ],
      cta: "Contacter l'equipe",
      ctaDisabled: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
            </div>
            <span className="text-xl font-semibold tracking-tight">QR Generator</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/pricing"
              className="text-sm font-medium text-foreground transition-colors"
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

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                Tarifs transparents
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground mb-6">
                Choisissez le plan adapte
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  a vos besoins
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Creez des QR codes professionnels avec des fonctionnalites avancees.
                Commencez gratuitement et evoluez selon vos besoins.
              </p>

              {canceled && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-800 dark:text-yellow-200 max-w-md mx-auto">
                  Paiement annule. Vous pouvez reessayer quand vous le souhaitez.
                </div>
              )}

              {/* Billing toggle */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <span
                  className={`text-sm ${
                    billingPeriod === "monthly" ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  Mensuel
                </span>
                <button
                  onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}
                  className={`relative h-7 w-14 rounded-full transition-colors ${
                    billingPeriod === "annual" ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                      billingPeriod === "annual" ? "left-8" : "left-1"
                    }`}
                  />
                </button>
                <span
                  className={`text-sm ${
                    billingPeriod === "annual" ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  Annuel
                </span>
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  -20%
                </Badge>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col transition-all duration-300 hover:shadow-xl ${
                    plan.popular
                      ? "border-2 border-primary shadow-lg shadow-primary/10 scale-105 z-10"
                      : "border hover:border-primary/30"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground shadow-lg">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Populaire
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-2">
                    <div
                      className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
                        plan.popular
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {plan.icon}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-bold">
                          {billingPeriod === "monthly" ? plan.price : plan.annualPrice}
                        </span>
                        <span className="text-muted-foreground text-lg">/mois</span>
                      </div>
                      {billingPeriod === "annual" && plan.price > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Facture {plan.annualPrice * 12} par an
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                          )}
                          <span
                            className={`text-sm ${
                              feature.included ? "text-foreground" : "text-muted-foreground/60"
                            } ${"highlight" in feature && feature.highlight ? "font-medium text-primary" : ""}`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={plan.ctaDisabled || loading !== null}
                      variant={plan.popular ? "default" : "outline"}
                      className={`w-full h-12 text-base ${
                        plan.popular
                          ? "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                          : ""
                      }`}
                    >
                      {loading === plan.id ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Chargement...
                        </>
                      ) : (
                        plan.cta
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 border-y bg-muted/30">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mb-3">
                  <Shield className="h-6 w-6" />
                </div>
                <span className="font-medium text-sm">Paiement securise</span>
                <span className="text-xs text-muted-foreground">Chiffrement SSL 256-bit</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-3">
                  <Clock className="h-6 w-6" />
                </div>
                <span className="font-medium text-sm">Sans engagement</span>
                <span className="text-xs text-muted-foreground">Annulez a tout moment</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mb-3">
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className="font-medium text-sm">Facturation flexible</span>
                <span className="text-xs text-muted-foreground">Mensuel ou annuel</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <span className="font-medium text-sm">+10 000 clients</span>
                <span className="text-xs text-muted-foreground">Nous font confiance</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-4">
                Comparaison detaillee des plans
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Retrouvez toutes les fonctionnalites disponibles selon votre plan
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 px-4 text-left font-medium text-muted-foreground">
                      Fonctionnalite
                    </th>
                    <th className="py-4 px-4 text-center font-medium">
                      <span className="text-foreground">Gratuit</span>
                      <span className="block text-sm text-muted-foreground font-normal">0/mois</span>
                    </th>
                    <th className="py-4 px-4 text-center font-medium bg-primary/5 rounded-t-lg">
                      <span className="text-primary">Pro</span>
                      <span className="block text-sm text-muted-foreground font-normal">9/mois</span>
                    </th>
                    <th className="py-4 px-4 text-center font-medium">
                      <span className="text-foreground">Business</span>
                      <span className="block text-sm text-muted-foreground font-normal">29/mois</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category, catIdx) => (
                    <>
                      <tr key={`cat-${catIdx}`} className="bg-muted/30">
                        <td
                          colSpan={4}
                          className="py-3 px-4 font-semibold text-sm text-foreground"
                        >
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featIdx) => (
                        <tr key={`feat-${catIdx}-${featIdx}`} className="border-b border-border/50">
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {feature.name}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {typeof feature.free === "boolean" ? (
                              feature.free ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-foreground">{feature.free}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center bg-primary/5">
                            {typeof feature.pro === "boolean" ? (
                              feature.pro ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm font-medium text-primary">{feature.pro}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {typeof feature.business === "boolean" ? (
                              feature.business ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                              )
                            ) : (
                              <span className="text-sm text-foreground">{feature.business}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTA after table */}
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-6">
                Besoin d&apos;aide pour choisir ? Notre equipe est la pour vous conseiller.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8">
                    Commencer gratuitement
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    Contacter l&apos;equipe commerciale
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HelpCircle className="h-6 w-6" />
                </div>
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-4">
                Questions frequentes
              </h2>
              <p className="text-lg text-muted-foreground">
                Tout ce que vous devez savoir sur nos tarifs et la facturation
              </p>
            </div>

            <Card className="divide-y divide-border">
              <CardContent className="p-0">
                <div className="divide-y divide-border px-6">
                  {faqItems.map((item, idx) => (
                    <FAQItem key={idx} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                Vous avez d&apos;autres questions ?
              </p>
              <Link href="/contact">
                <Button variant="outline">
                  Contactez-nous
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground mb-4">
              Pret a creer vos QR codes ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez plus de 10 000 entreprises qui utilisent QR Generator pour
              connecter le monde physique au digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 shadow-lg shadow-primary/20">
                  Creer mon premier QR code
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="h-12 px-8">
                  Voir la demo
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Aucune carte bancaire requise pour commencer
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} QR Generator. Tous droits reserves.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Confidentialite
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                CGU
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
