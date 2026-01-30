"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  QRCodeType,
  QR_CODE_TYPES,
  URLData,
  WiFiData,
  VCardData,
  EmailData,
  SMSData,
  PhoneData,
  QRCodeData,
  generateQRContent,
  getDefaultData,
} from "@/lib/qr-types";
import { Badge } from "@/components/ui/badge";
import { PlanType } from "@/lib/plans";
import {
  QR_TEMPLATES,
  TemplateId,
  ModuleShape,
  EyeShape,
  MODULE_SHAPES,
  EYE_SHAPES,
  GRADIENT_PRESETS,
  canUseTemplate,
  canUseModuleShape,
  canUseEyeShape,
  canUseGradient,
  canUseMockups,
} from "@/lib/qr-templates";
import QRMockupPreview from "@/components/QRMockupPreview";

const COLOR_PRESETS = [
  { name: "Classique", foreground: "#000000", background: "#ffffff" },
  { name: "Bleu", foreground: "#1e40af", background: "#ffffff" },
  { name: "Vert", foreground: "#166534", background: "#ffffff" },
  { name: "Rouge", foreground: "#991b1b", background: "#ffffff" },
  { name: "Violet", foreground: "#6b21a8", background: "#ffffff" },
  { name: "Orange", foreground: "#c2410c", background: "#ffffff" },
  { name: "Inverse", foreground: "#ffffff", background: "#000000" },
];

const SIZE_OPTIONS = [
  { value: 200, label: "Petit (200px)" },
  { value: 400, label: "Moyen (400px)" },
  { value: 800, label: "Grand (800px)" },
  { value: 1200, label: "Tres grand (1200px)" },
];

// Templates prédéfinis pour les cas d'usage
const PRESET_TEMPLATES = {
  pharmacie: {
    type: "email" as QRCodeType,
    name: "QR Code Ordonnance",
    data: {
      email: "", // L'utilisateur doit entrer son email
      subject: "Ordonnance à préparer",
      body: `Bonjour,

Veuillez trouver ci-joint mon ordonnance à préparer.

Je passerai récupérer ma commande vers [heure souhaitée].

Merci,
[Votre nom]
[Votre téléphone]`,
    } as EmailData,
  },
};

function CreatePageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [qrType, setQrType] = useState<QRCodeType>("url");
  const [qrData, setQrData] = useState<QRCodeData>(getDefaultData("url"));
  const [initialized, setInitialized] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [size, setSize] = useState(400);
  const [cornerStyle, setCornerStyle] = useState<"square" | "rounded">("square");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Options d'expiration (PRO/BUSINESS)
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [maxScansEnabled, setMaxScansEnabled] = useState(false);
  const [maxScans, setMaxScans] = useState<number | "">("");
  const [userPlan, setUserPlan] = useState<PlanType>("FREE");
  // Protection par mot de passe (PRO/BUSINESS)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [qrPassword, setQrPassword] = useState("");
  const [qrPasswordConfirm, setQrPasswordConfirm] = useState("");

  // Options de design premium
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("classic");
  const [moduleShape, setModuleShape] = useState<ModuleShape>("square");
  const [eyeShape, setEyeShape] = useState<EyeShape>("square");
  const [useGradient, setUseGradient] = useState(false);
  const [gradientColors, setGradientColors] = useState<[string, string]>(["#667eea", "#764ba2"]);
  const [gradientDirection, setGradientDirection] = useState<"horizontal" | "vertical" | "diagonal">("diagonal");

  // Domaines personnalises (BUSINESS uniquement)
  const [customDomains, setCustomDomains] = useState<{ id: string; domain: string }[]>([]);
  const [selectedCustomDomainId, setSelectedCustomDomainId] = useState<string>("");

  // Equipes (BUSINESS uniquement)
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Gérer les paramètres URL pour les templates prédéfinis
  useEffect(() => {
    if (initialized) return;

    const typeParam = searchParams.get("type");
    const templateParam = searchParams.get("template");

    if (templateParam && templateParam in PRESET_TEMPLATES) {
      const preset = PRESET_TEMPLATES[templateParam as keyof typeof PRESET_TEMPLATES];
      setQrType(preset.type);
      setQrData(preset.data);
      setName(preset.name);
      setInitialized(true);
    } else if (typeParam && typeParam in QR_CODE_TYPES) {
      setQrType(typeParam as QRCodeType);
      setQrData(getDefaultData(typeParam as QRCodeType));
      setInitialized(true);
    } else {
      setInitialized(true);
    }
  }, [searchParams, initialized]);

  useEffect(() => {
    if (session) {
      fetchUserPlan();
      fetchCustomDomains();
      fetchTeams();
    }
  }, [session]);

  const fetchCustomDomains = async () => {
    try {
      const res = await fetch("/api/domains", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        // Filtrer pour ne garder que les domaines verifies
        const verifiedDomains = data.domains?.filter((d: { verified: boolean }) => d.verified) || [];
        setCustomDomains(verifiedDomains);
      }
    } catch (error) {
      console.error("Erreur lors de la recuperation des domaines:", error);
    }
  };

  const fetchUserPlan = async () => {
    try {
      const res = await fetch("/api/user/plan", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUserPlan(data.plan || "FREE");
      }
    } catch (error) {
      console.error("Erreur lors de la recuperation du plan:", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams || []);
      }
    } catch (error) {
      // Silencieux si l'utilisateur n'a pas le plan BUSINESS
      console.log("Pas d'equipes disponibles:", error);
    }
  };

  const canUseAdvancedFeatures = userPlan === "PRO" || userPlan === "BUSINESS";
  const isPremiumUser = userPlan === "PRO" || userPlan === "BUSINESS";

  const handleTypeChange = (newType: QRCodeType) => {
    setQrType(newType);
    setQrData(getDefaultData(newType));
  };

  const updateQrData = useCallback(<K extends keyof QRCodeData>(field: string, value: string | boolean) => {
    setQrData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setLogoUrl(data.url);
    } catch {
      setError("Erreur lors de l'upload du logo");
    } finally {
      setUploading(false);
    }
  };

  const handleColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setForegroundColor(preset.foreground);
    setBackgroundColor(preset.background);
    setUseGradient(false);
  };

  const handleTemplateSelect = (templateId: TemplateId) => {
    if (!canUseTemplate(templateId, userPlan)) {
      return;
    }
    setSelectedTemplate(templateId);
    const template = QR_TEMPLATES[templateId];
    setModuleShape(template.moduleShape);
    setEyeShape(template.eyeShape);
    setUseGradient(template.useGradient);
    if (template.gradientColors) {
      setGradientColors(template.gradientColors);
    }
    if (template.gradientDirection) {
      setGradientDirection(template.gradientDirection);
    }
  };

  const handleGradientPreset = (preset: { name: string; colors: [string, string] }) => {
    if (!canUseGradient(userPlan)) return;
    setGradientColors(preset.colors);
    setUseGradient(true);
  };

  const getPreviewContent = (): string => {
    try {
      // Pour les types avec redirection (URL), on affiche un placeholder
      if (qrType === "url") {
        const urlData = qrData as URLData;
        return urlData.url || "https://exemple.com";
      }
      // Pour les autres types, on genere le contenu directement
      return generateQRContent(qrType, qrData) || "https://exemple.com";
    } catch {
      return "https://exemple.com";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Generer le contenu QR
      let qrContent: string;
      let targetUrl: string;

      if (qrType === "url") {
        const urlData = qrData as URLData;
        targetUrl = urlData.url;
        qrContent = urlData.url;
      } else {
        qrContent = generateQRContent(qrType, qrData);
        targetUrl = qrContent; // Pour les types non-URL, le contenu est la cible
      }

      const res = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type: qrType,
          targetUrl,
          qrContent,
          qrData,
          logoUrl,
          foregroundColor: useGradient ? gradientColors[0] : foregroundColor,
          backgroundColor,
          size,
          cornerStyle,
          // Options de design premium
          template: selectedTemplate,
          moduleShape,
          eyeShape,
          useGradient,
          gradientColors,
          gradientDirection,
          // Options d'expiration (PRO/BUSINESS)
          expiresAt: expirationEnabled && expiresAt ? new Date(expiresAt).toISOString() : null,
          maxScans: maxScansEnabled && maxScans ? Number(maxScans) : null,
          // Protection par mot de passe (PRO/BUSINESS)
          isPasswordProtected: isPasswordProtected && qrPassword.length > 0,
          password: isPasswordProtected && qrPassword.length > 0 ? qrPassword : null,
          // Domaine personnalise (BUSINESS uniquement)
          customDomainId: selectedCustomDomainId || null,
          // Equipe (BUSINESS uniquement)
          teamId: selectedTeamId || null,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Erreur lors de la creation du QR code");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-foreground" viewBox="0 0 24 24">
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
      </div>
    );
  }

  if (!session) return null;

  const previewContent = getPreviewContent();

  // Formulaires specifiques pour chaque type
  const renderTypeForm = () => {
    switch (qrType) {
      case "url":
        return (
          <div className="space-y-2">
            <Label htmlFor="targetUrl">URL de destination</Label>
            <Input
              id="targetUrl"
              type="url"
              value={(qrData as URLData).url}
              onChange={(e) => updateQrData("url", e.target.value)}
              required
              placeholder="https://www.exemple.com"
              className="h-11"
            />
          </div>
        );

      case "wifi":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ssid">Nom du reseau (SSID)</Label>
              <Input
                id="ssid"
                type="text"
                value={(qrData as WiFiData).ssid}
                onChange={(e) => updateQrData("ssid", e.target.value)}
                required
                placeholder="MonWiFi"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="encryption">Type de securite</Label>
              <Select
                value={(qrData as WiFiData).encryption}
                onValueChange={(value) => updateQrData("encryption", value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choisir le type de securite" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">Reseau ouvert (sans mot de passe)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(qrData as WiFiData).encryption !== "nopass" && (
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={(qrData as WiFiData).password}
                  onChange={(e) => updateQrData("password", e.target.value)}
                  required
                  placeholder="Mot de passe WiFi"
                  className="h-11"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hidden"
                checked={(qrData as WiFiData).hidden || false}
                onChange={(e) => updateQrData("hidden", e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <Label htmlFor="hidden" className="text-sm font-normal">
                Reseau masque
              </Label>
            </div>
          </div>
        );

      case "vcard":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prenom</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={(qrData as VCardData).firstName}
                  onChange={(e) => updateQrData("firstName", e.target.value)}
                  required
                  placeholder="Jean"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={(qrData as VCardData).lastName}
                  onChange={(e) => updateQrData("lastName", e.target.value)}
                  required
                  placeholder="Dupont"
                  className="h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vcardPhone">Telephone</Label>
              <Input
                id="vcardPhone"
                type="tel"
                value={(qrData as VCardData).phone || ""}
                onChange={(e) => updateQrData("phone", e.target.value)}
                placeholder="+33 6 00 00 00 00"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vcardEmail">Email</Label>
              <Input
                id="vcardEmail"
                type="email"
                value={(qrData as VCardData).email || ""}
                onChange={(e) => updateQrData("email", e.target.value)}
                placeholder="jean.dupont@exemple.com"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                type="text"
                value={(qrData as VCardData).company || ""}
                onChange={(e) => updateQrData("company", e.target.value)}
                placeholder="Nom de l'entreprise"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Poste / Titre</Label>
              <Input
                id="title"
                type="text"
                value={(qrData as VCardData).title || ""}
                onChange={(e) => updateQrData("title", e.target.value)}
                placeholder="Directeur Marketing"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                type="url"
                value={(qrData as VCardData).website || ""}
                onChange={(e) => updateQrData("website", e.target.value)}
                placeholder="https://www.exemple.com"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                type="text"
                value={(qrData as VCardData).address || ""}
                onChange={(e) => updateQrData("address", e.target.value)}
                placeholder="123 Rue de Paris, 75001 Paris"
                className="h-11"
              />
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailAddress">Adresse email</Label>
              <Input
                id="emailAddress"
                type="email"
                value={(qrData as EmailData).email}
                onChange={(e) => updateQrData("email", e.target.value)}
                required
                placeholder="contact@exemple.com"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet (optionnel)</Label>
              <Input
                id="subject"
                type="text"
                value={(qrData as EmailData).subject || ""}
                onChange={(e) => updateQrData("subject", e.target.value)}
                placeholder="Demande d'information"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message (optionnel)</Label>
              <Textarea
                id="body"
                value={(qrData as EmailData).body || ""}
                onChange={(e) => updateQrData("body", e.target.value)}
                placeholder="Bonjour, je souhaiterais..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      case "sms":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smsPhone">Numero de telephone</Label>
              <Input
                id="smsPhone"
                type="tel"
                value={(qrData as SMSData).phone}
                onChange={(e) => updateQrData("phone", e.target.value)}
                required
                placeholder="+33 6 00 00 00 00"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smsMessage">Message (optionnel)</Label>
              <Textarea
                id="smsMessage"
                value={(qrData as SMSData).message || ""}
                onChange={(e) => updateQrData("message", e.target.value)}
                placeholder="Votre message..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      case "phone":
        return (
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Numero de telephone</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={(qrData as PhoneData).phone}
              onChange={(e) => updateQrData("phone", e.target.value)}
              required
              placeholder="+33 6 00 00 00 00"
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Format international recommande (ex: +33 6 00 00 00 00)
            </p>
          </div>
        );

      default:
        return null;
    }
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
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
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
                className="mr-2"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Creer un QR Code
          </h1>
          <p className="mt-2 text-muted-foreground">
            Personnalisez votre QR code avec des couleurs et un logo
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Formulaire - 3 colonnes */}
          <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-3">
            {/* Type Selection */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Type de QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={qrType} onValueChange={(v) => handleTypeChange(v as QRCodeType)}>
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                    {(Object.keys(QR_CODE_TYPES) as QRCodeType[]).map((type) => (
                      <TabsTrigger key={type} value={type} className="text-xs sm:text-sm">
                        {QR_CODE_TYPES[type].label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                <p className="mt-3 text-sm text-muted-foreground">
                  {QR_CODE_TYPES[qrType].description}
                </p>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Informations</CardTitle>
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du QR Code</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ma campagne marketing"
                    className="h-11"
                  />
                </div>

                {/* Selecteur d'equipe (BUSINESS uniquement) */}
                {userPlan === "BUSINESS" && teams.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="team">Equipe (optionnel)</Label>
                    <Select
                      value={selectedTeamId}
                      onValueChange={(value) => setSelectedTeamId(value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Personnel (pas d'equipe)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Personnel (pas d'equipe)</SelectItem>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {selectedTeamId
                        ? "Ce QR code sera partage avec les membres de l'equipe."
                        : "Ce QR code restera prive, visible uniquement par vous."}
                    </p>
                  </div>
                )}

                {renderTypeForm()}
              </CardContent>
            </Card>

            {/* Templates Premium */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Templates artistiques
                  {!isPremiumUser && <Badge variant="secondary" className="text-xs">Pro</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {(Object.keys(QR_TEMPLATES) as TemplateId[]).map((templateId) => {
                    const template = QR_TEMPLATES[templateId];
                    const canUse = canUseTemplate(templateId, userPlan);
                    return (
                      <button
                        key={templateId}
                        type="button"
                        onClick={() => handleTemplateSelect(templateId)}
                        disabled={!canUse}
                        className={`relative rounded-xl border p-3 text-left transition-all ${selectedTemplate === templateId ? "border-foreground bg-muted" : canUse ? "border-border hover:bg-muted/50" : "border-border opacity-50 cursor-not-allowed"}`}
                      >
                        {template.isPremium && !canUse && (
                          <div className="absolute top-1 right-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                          </div>
                        )}
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Styles de modules */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Styles de modules
                  {!isPremiumUser && <Badge variant="secondary" className="text-xs">Pro</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Forme des modules</Label>
                  <div className="flex flex-wrap gap-2">
                    {MODULE_SHAPES.map((shape) => {
                      const canUse = canUseModuleShape(shape.value, userPlan);
                      return (
                        <button
                          key={shape.value}
                          type="button"
                          onClick={() => canUse && setModuleShape(shape.value)}
                          disabled={!canUse}
                          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${moduleShape === shape.value ? "border-foreground bg-muted" : canUse ? "border-border hover:bg-muted/50" : "border-border opacity-50 cursor-not-allowed"}`}
                        >
                          {shape.value === "square" && <div className="h-4 w-4 bg-foreground" />}
                          {shape.value === "circle" && <div className="h-4 w-4 bg-foreground rounded-full" />}
                          {shape.value === "diamond" && <div className="h-4 w-4 bg-foreground rotate-45" />}
                          {shape.label}
                          {shape.isPremium && !canUse && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <Label>Forme des yeux (coins)</Label>
                  <div className="flex flex-wrap gap-2">
                    {EYE_SHAPES.map((shape) => {
                      const canUse = canUseEyeShape(shape.value, userPlan);
                      return (
                        <button
                          key={shape.value}
                          type="button"
                          onClick={() => canUse && setEyeShape(shape.value)}
                          disabled={!canUse}
                          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-all ${eyeShape === shape.value ? "border-foreground bg-muted" : canUse ? "border-border hover:bg-muted/50" : "border-border opacity-50 cursor-not-allowed"}`}
                        >
                          {shape.value === "square" && <div className="h-5 w-5 border-2 border-foreground" />}
                          {shape.value === "circle" && <div className="h-5 w-5 border-2 border-foreground rounded-full" />}
                          {shape.value === "leaf" && <div className="h-5 w-5 border-2 border-foreground rounded-tl-lg rounded-br-lg" />}
                          {shape.label}
                          {shape.isPremium && !canUse && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Couleurs */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Couleurs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Color Presets */}
                <div className="space-y-3">
                  <Label>Couleurs predefinies</Label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleColorPreset(preset)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-apple hover:bg-muted ${
                          foregroundColor === preset.foreground &&
                          backgroundColor === preset.background
                            ? "border-foreground bg-muted"
                            : "border-border"
                        }`}
                      >
                        <div
                          className="h-4 w-4 rounded border"
                          style={{
                            backgroundColor: preset.background,
                            borderColor: preset.foreground,
                          }}
                        >
                          <div
                            className="h-full w-full rounded-sm"
                            style={{
                              background: `linear-gradient(135deg, ${preset.foreground} 50%, ${preset.background} 50%)`,
                            }}
                          />
                        </div>
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Gradient presets */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    Degrades
                    {!isPremiumUser && <Badge variant="secondary" className="text-xs">Pro</Badge>}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {GRADIENT_PRESETS.map((preset) => {
                      const canUse = canUseGradient(userPlan);
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleGradientPreset(preset)}
                          disabled={!canUse}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-apple ${useGradient && gradientColors[0] === preset.colors[0] && gradientColors[1] === preset.colors[1] ? "border-foreground bg-muted" : canUse ? "border-border hover:bg-muted" : "border-border opacity-50 cursor-not-allowed"}`}
                        >
                          <div className="h-4 w-4 rounded" style={{ background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})` }} />
                          {preset.name}
                        </button>
                      );
                    })}
                  </div>
                  {useGradient && canUseGradient(userPlan) && (
                    <div className="mt-4 space-y-3">
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                          <Label>Couleur de debut</Label>
                          <div className="flex gap-2">
                            <input type="color" value={gradientColors[0]} onChange={(e) => setGradientColors([e.target.value, gradientColors[1]])} className="h-11 w-14 cursor-pointer rounded-lg border border-border p-1" />
                            <Input type="text" value={gradientColors[0]} onChange={(e) => setGradientColors([e.target.value, gradientColors[1]])} className="h-11 font-mono" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label>Couleur de fin</Label>
                          <div className="flex gap-2">
                            <input type="color" value={gradientColors[1]} onChange={(e) => setGradientColors([gradientColors[0], e.target.value])} className="h-11 w-14 cursor-pointer rounded-lg border border-border p-1" />
                            <Input type="text" value={gradientColors[1]} onChange={(e) => setGradientColors([gradientColors[0], e.target.value])} className="h-11 font-mono" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Direction du degrade</Label>
                        <div className="flex gap-2">
                          {(["horizontal", "vertical", "diagonal"] as const).map((dir) => (
                            <button key={dir} type="button" onClick={() => setGradientDirection(dir)} className={`rounded-lg border px-3 py-2 text-sm transition-all ${gradientDirection === dir ? "border-foreground bg-muted" : "border-border hover:bg-muted/50"}`}>
                              {dir === "horizontal" && "Horizontal"}
                              {dir === "vertical" && "Vertical"}
                              {dir === "diagonal" && "Diagonal"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setUseGradient(false)}>Desactiver le degrade</Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Custom Colors */}
                {!useGradient && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foregroundColor">Couleur du QR</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="foregroundColor"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="h-11 w-14 cursor-pointer rounded-lg border border-border p-1"
                      />
                      <Input
                        type="text"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="h-11 font-mono"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Couleur de fond</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        id="backgroundColor"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="h-11 w-14 cursor-pointer rounded-lg border border-border p-1"
                      />
                      <Input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="h-11 font-mono"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                  </div>
                </div>
                )}

                <Separator />

                {/* Size */}
                <div className="space-y-3">
                  <Label>Taille</Label>
                  <div className="flex flex-wrap gap-2">
                    {SIZE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSize(option.value)}
                        className={`rounded-lg border px-3 py-2 text-sm transition-apple hover:bg-muted ${
                          size === option.value
                            ? "border-foreground bg-muted"
                            : "border-border"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Corner Style */}
                <div className="space-y-3">
                  <Label>Style des coins</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCornerStyle("square")}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-apple hover:bg-muted ${
                        cornerStyle === "square"
                          ? "border-foreground bg-muted"
                          : "border-border"
                      }`}
                    >
                      <div className="h-4 w-4 border-2 border-foreground" />
                      Carres
                    </button>
                    <button
                      type="button"
                      onClick={() => setCornerStyle("rounded")}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-apple hover:bg-muted ${
                        cornerStyle === "rounded"
                          ? "border-foreground bg-muted"
                          : "border-border"
                      }`}
                    >
                      <div className="h-4 w-4 rounded border-2 border-foreground" />
                      Arrondis
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logo */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Logo (optionnel)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="rounded-xl border-2 border-dashed border-border p-6 text-center transition-apple hover:border-foreground/50 hover:bg-muted/50">
                      {logoUrl ? (
                        <div className="flex flex-col items-center">
                          <Image
                            src={logoUrl}
                            alt="Logo"
                            width={80}
                            height={80}
                            className="rounded-lg mb-2"
                          />
                          <span className="text-sm text-muted-foreground">
                            Logo ajoute
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
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
                              className="text-muted-foreground"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" x2="12" y1="3" y2="15" />
                            </svg>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {uploading
                              ? "Upload en cours..."
                              : "Cliquez pour ajouter un logo"}
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleLogoUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {logoUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setLogoUrl(null)}
                      className="text-destructive hover:text-destructive"
                    >
                      Supprimer
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  PNG, JPG ou WebP. Max 5MB. Le logo sera centre sur le QR code.
                </p>
              </CardContent>
            </Card>

            {/* Options d'expiration (PRO/BUSINESS) */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Options d&apos;expiration</CardTitle>
                  <Badge variant="secondary">PRO / BUSINESS</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!canUseAdvancedFeatures ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
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
                        className="text-muted-foreground"
                      >
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Les options d&apos;expiration sont disponibles avec les plans Pro et Business.
                    </p>
                    <Link href="/pricing">
                      <Button variant="link" size="sm" className="mt-2">
                        Voir les plans
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Date d'expiration */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="expirationEnabled"
                          checked={expirationEnabled}
                          onChange={(e) => setExpirationEnabled(e.target.checked)}
                          className="h-4 w-4 rounded border-border"
                        />
                        <Label htmlFor="expirationEnabled" className="font-normal">
                          Date d&apos;expiration
                        </Label>
                      </div>
                      {expirationEnabled && (
                        <div className="pl-7">
                          <Input
                            type="datetime-local"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                            className="h-11"
                          />
                          <p className="mt-1 text-xs text-muted-foreground">
                            Le QR code ne fonctionnera plus apres cette date.
                          </p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Nombre maximum de scans */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="maxScansEnabled"
                          checked={maxScansEnabled}
                          onChange={(e) => setMaxScansEnabled(e.target.checked)}
                          className="h-4 w-4 rounded border-border"
                        />
                        <Label htmlFor="maxScansEnabled" className="font-normal">
                          Nombre maximum de scans
                        </Label>
                      </div>
                      {maxScansEnabled && (
                        <div className="pl-7">
                          <Input
                            type="number"
                            min="1"
                            value={maxScans}
                            onChange={(e) => setMaxScans(e.target.value ? parseInt(e.target.value) : "")}
                            placeholder="Ex: 100"
                            className="h-11"
                          />
                          <p className="mt-1 text-xs text-muted-foreground">
                            Le QR code expirera apres ce nombre de scans.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Protection par mot de passe (PRO/BUSINESS) */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Protection par mot de passe</CardTitle>
                  <Badge variant="secondary">PRO / BUSINESS</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!canUseAdvancedFeatures ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
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
                        className="text-muted-foreground"
                      >
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      La protection par mot de passe est disponible avec les plans Pro et Business.
                    </p>
                    <Link href="/pricing">
                      <Button variant="link" size="sm" className="mt-2">
                        Voir les plans
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="isPasswordProtected"
                          checked={isPasswordProtected}
                          onChange={(e) => {
                            setIsPasswordProtected(e.target.checked);
                            if (!e.target.checked) {
                              setQrPassword("");
                              setQrPasswordConfirm("");
                            }
                          }}
                          className="h-4 w-4 rounded border-border"
                        />
                        <Label htmlFor="isPasswordProtected" className="font-normal">
                          Proteger par mot de passe
                        </Label>
                      </div>
                      {isPasswordProtected && (
                        <div className="pl-7 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="qrPassword">Mot de passe</Label>
                            <Input
                              id="qrPassword"
                              type="password"
                              value={qrPassword}
                              onChange={(e) => setQrPassword(e.target.value)}
                              placeholder="Saisir un mot de passe"
                              className="h-11"
                              minLength={4}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="qrPasswordConfirm">Confirmer le mot de passe</Label>
                            <Input
                              id="qrPasswordConfirm"
                              type="password"
                              value={qrPasswordConfirm}
                              onChange={(e) => setQrPasswordConfirm(e.target.value)}
                              placeholder="Confirmer le mot de passe"
                              className="h-11"
                              minLength={4}
                            />
                            {qrPassword && qrPasswordConfirm && qrPassword !== qrPasswordConfirm && (
                              <p className="text-xs text-destructive">
                                Les mots de passe ne correspondent pas.
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Les utilisateurs devront saisir ce mot de passe pour acceder au contenu du QR code.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Domaine personnalise (BUSINESS uniquement) */}
            {qrType === "url" && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Domaine personnalise</CardTitle>
                    <Badge variant="secondary">BUSINESS</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userPlan !== "BUSINESS" ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
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
                          className="text-muted-foreground"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" x2="22" y1="12" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Les domaines personnalises sont disponibles avec le plan Business.
                      </p>
                      <Link href="/pricing">
                        <Button variant="link" size="sm" className="mt-2">
                          Voir les plans
                        </Button>
                      </Link>
                    </div>
                  ) : customDomains.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
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
                          className="text-muted-foreground"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="2" x2="22" y1="12" y2="12" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Aucun domaine personnalise configure ou verifie.
                      </p>
                      <Link href="/settings/domains">
                        <Button variant="link" size="sm" className="mt-2">
                          Configurer un domaine
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label htmlFor="customDomain">Choisir un domaine</Label>
                      <Select
                        value={selectedCustomDomainId}
                        onValueChange={(value) => setSelectedCustomDomainId(value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Domaine par defaut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Domaine par defaut</SelectItem>
                          {customDomains.map((domain) => (
                            <SelectItem key={domain.id} value={domain.id}>
                              {domain.domain}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {selectedCustomDomainId
                          ? `Le QR code utilisera votre domaine personnalise (ex: ${customDomains.find(d => d.id === selectedCustomDomainId)?.domain}/abc123)`
                          : "Par defaut, l'URL standard de l'application sera utilisee."}
                      </p>
                      <Link href="/settings/domains">
                        <Button variant="link" size="sm" className="px-0">
                          Gerer mes domaines
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Submit buttons - visible on mobile */}
            <div className="flex gap-3 lg:hidden">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full h-11">
                  Annuler
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading || uploading || (isPasswordProtected && (qrPassword !== qrPasswordConfirm || qrPassword.length < 4))}
                className="flex-1 h-11"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                    Creation...
                  </span>
                ) : (
                  "Creer le QR Code"
                )}
              </Button>
            </div>
          </form>

          {/* Preview - 2 colonnes, sticky */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Apercu en temps reel</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div
                    className="rounded-2xl p-6 transition-apple"
                    style={{ backgroundColor }}
                  >
                    <QRCodeSVG
                      value={previewContent}
                      size={200}
                      level="H"
                      fgColor={foregroundColor}
                      bgColor={backgroundColor}
                      imageSettings={
                        logoUrl
                          ? {
                              src: logoUrl,
                              height: 40,
                              width: 40,
                              excavate: true,
                            }
                          : undefined
                      }
                      style={{
                        borderRadius: cornerStyle === "rounded" ? "8px" : "0px",
                      }}
                    />
                  </div>

                  <div className="mt-6 w-full space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">{QR_CODE_TYPES[qrType].label}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Template</span>
                      <span className="font-medium">{QR_TEMPLATES[selectedTemplate].name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Taille finale</span>
                      <span className="font-medium">{size}px</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Modules</span>
                      <span className="font-medium">{MODULE_SHAPES.find((s) => s.value === moduleShape)?.label}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Yeux</span>
                      <span className="font-medium">{EYE_SHAPES.find((s) => s.value === eyeShape)?.label}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Couleur</span>
                      <div className="flex items-center gap-2">
                        {useGradient ? (
                          <>
                            <div className="h-4 w-8 rounded border" style={{ background: `linear-gradient(90deg, ${gradientColors[0]}, ${gradientColors[1]})` }} />
                            <span className="text-xs">Degrade</span>
                          </>
                        ) : (
                          <>
                            <div className="h-4 w-4 rounded border" style={{ backgroundColor: foregroundColor }} />
                            <span className="font-mono text-xs">{foregroundColor}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {logoUrl && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Logo</span>
                        <span className="font-medium text-green-600">Ajoute</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-6" />

                  <p className="text-center text-xs text-muted-foreground mb-4">
                    L&apos;apercu montre le rendu avec vos parametres.
                    <br />
                    {qrType === "url"
                      ? "Le QR code final encodera l'URL de redirection."
                      : `Le QR code encodera directement les donnees ${QR_CODE_TYPES[qrType].label}.`
                    }
                  </p>
                </CardContent>
                <CardFooter className="hidden lg:flex gap-3">
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full h-11">
                      Annuler
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    form="create-form"
                    disabled={loading || uploading || (isPasswordProtected && (qrPassword !== qrPasswordConfirm || qrPassword.length < 4))}
                    className="flex-1 h-11"
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                        Creation...
                      </span>
                    ) : (
                      "Creer le QR Code"
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Mockup Preview */}
              <QRMockupPreview
                qrContent={previewContent}
                foregroundColor={useGradient ? gradientColors[0] : foregroundColor}
                backgroundColor={backgroundColor}
                logoUrl={logoUrl}
                isPremium={canUseMockups(userPlan)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Wrapper avec Suspense pour useSearchParams
export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
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
        </div>
      }
    >
      <CreatePageContent />
    </Suspense>
  );
}
