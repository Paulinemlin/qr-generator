"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const subjectOptions = [
  { value: "general", label: "Question generale" },
  { value: "technical", label: "Support technique" },
  { value: "billing", label: "Facturation et paiements" },
  { value: "partnership", label: "Partenariat" },
  { value: "feedback", label: "Suggestion ou feedback" },
  { value: "other", label: "Autre" },
];

const faqItems = [
  {
    question: "Comment puis-je creer un QR code personnalise ?",
    answer:
      "Connectez-vous a votre compte, accedez au tableau de bord et cliquez sur 'Creer un QR code'. Vous pourrez personnaliser les couleurs, ajouter votre logo et definir l'URL de destination.",
  },
  {
    question: "Quels formats d'export sont disponibles ?",
    answer:
      "Vous pouvez telecharger vos QR codes aux formats PNG, SVG et PDF. Les formats vectoriels (SVG, PDF) sont recommandes pour l'impression haute qualite.",
  },
  {
    question: "Comment fonctionne le suivi des scans ?",
    answer:
      "Chaque scan de vos QR codes est enregistre avec des informations anonymisees : date, pays, type d'appareil. Consultez vos statistiques depuis le tableau de bord.",
  },
  {
    question: "Puis-je modifier l'URL de destination apres creation ?",
    answer:
      "Oui, nos QR codes sont dynamiques. Vous pouvez modifier l'URL de destination a tout moment sans avoir a reimprimer le QR code.",
  },
  {
    question: "Comment puis-je annuler mon abonnement ?",
    answer:
      "Rendez-vous dans les parametres de votre compte, section 'Abonnement'. Vous pouvez annuler a tout moment. Votre acces reste actif jusqu'a la fin de la periode en cours.",
  },
  {
    question: "L'API est-elle disponible pour tous les plans ?",
    answer:
      "L'acces API est reserve aux utilisateurs du plan Business. Consultez notre documentation API pour plus de details sur les endpoints disponibles.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide";
    }

    if (!formData.subject) {
      newErrors.subject = "Veuillez selectionner un sujet";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setSubmitted(true);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              QR Generator
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <Link href="/pricing">
              <Button variant="ghost" size="sm">
                Tarifs
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Contactez-nous
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une question, une suggestion ou besoin d&apos;aide ? Notre equipe est la
            pour vous accompagner.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Message envoye !
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Merci de nous avoir contactes. Nous vous repondrons dans
                      les plus brefs delais.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          subject: "",
                          message: "",
                        });
                      }}
                    >
                      Envoyer un autre message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Nom complet <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Jean Dupont"
                          className={`h-11 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="jean@exemple.com"
                          className={`h-11 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">
                        Sujet <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) =>
                          handleInputChange("subject", value)
                        }
                      >
                        <SelectTrigger
                          id="subject"
                          className={`h-11 ${errors.subject ? "border-red-500 focus:ring-red-500" : ""}`}
                          aria-invalid={!!errors.subject}
                        >
                          <SelectValue placeholder="Selectionnez un sujet" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.subject && (
                        <p className="text-sm text-red-500">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        placeholder="Decrivez votre demande en detail..."
                        className={`min-h-[150px] ${errors.message ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        aria-invalid={!!errors.message}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Envoi en cours...
                        </span>
                      ) : (
                        "Envoyer le message"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-6">
            {/* Contact Info Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:contact@qr-generator.fr"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      contact@qr-generator.fr
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-muted-foreground">
                      123 Rue de l&apos;Innovation
                      <br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Delai de reponse</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Notre equipe s&apos;engage a vous repondre dans les meilleurs
                  delais :
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>
                      <strong>Support technique :</strong> 24h ouvrables
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>
                      <strong>Questions generales :</strong> 48h ouvrables
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>
                      <strong>Partenariats :</strong> 3-5 jours ouvrables
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Help Resources Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Ressources utiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/docs/api"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">
                      Documentation API
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Guide complet d&apos;integration
                    </p>
                  </div>
                </Link>

                <Link
                  href="/pricing"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">
                      Plans et tarifs
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Comparez nos offres
                    </p>
                  </div>
                </Link>

                <Link
                  href="/use-cases"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">
                      Cas d&apos;usage
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Exemples par secteur
                    </p>
                  </div>
                </Link>

                <Link
                  href="/blog"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                >
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-orange-600 dark:text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">
                      Blog
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Actualites et conseils
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Questions frequentes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Retrouvez les reponses aux questions les plus courantes. Si vous
              ne trouvez pas ce que vous cherchez, n&apos;hesitez pas a nous
              contacter.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <Card
                key={index}
                className={`border-0 shadow-sm transition-all cursor-pointer ${
                  expandedFaq === index ? "shadow-md" : ""
                }`}
                onClick={() => toggleFaq(index)}
              >
                <CardContent className="p-0">
                  <button
                    className="w-full flex items-center justify-between p-6 text-left"
                    aria-expanded={expandedFaq === index}
                  >
                    <span className="font-medium pr-4">{item.question}</span>
                    <svg
                      className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                        expandedFaq === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6 pt-0">
                      <Separator className="mb-4" />
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="border-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Vous ne trouvez pas ce que vous cherchez ?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Notre equipe est disponible pour repondre a toutes vos questions
                et vous accompagner dans l&apos;utilisation de QR Generator.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                  <a href="mailto:contact@qr-generator.fr">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Nous ecrire
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/docs/api">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Consulter la documentation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} QR Generator. Tous droits
              reserves.
            </p>
            <div className="flex gap-6">
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Tarifs
              </Link>
              <Link
                href="/docs/api"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                API
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
