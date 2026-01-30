"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AnalyticsSection } from "@/components/analytics";
import { QRInsights } from "@/components/qr-insights";
import { canViewAnalytics, PlanType } from "@/lib/plans";

interface Scan {
  id: string;
  userAgent: string | null;
  ip: string | null;
  scannedAt: string;
}

interface QRCodeDetail {
  id: string;
  name: string;
  targetUrl: string;
  qrImageUrl: string | null;
  logoUrl: string | null;
  foregroundColor: string;
  backgroundColor: string;
  size: number;
  cornerStyle: string;
  createdAt: string;
  expiresAt: string | null;
  maxScans: number | null;
  isActive: boolean;
  isPasswordProtected: boolean;
  scans: Scan[];
  _count: {
    scans: number;
  };
  user?: {
    plan: PlanType;
  };
}

const EXPORT_FORMATS = [
  { value: "png", label: "PNG", description: "Image standard, idéal pour le web" },
  { value: "svg", label: "SVG", description: "Vectoriel, parfait pour l'impression" },
  { value: "jpeg", label: "JPEG", description: "Fichier plus léger, compression" },
];

const EXPORT_SIZES = [
  { value: 200, label: "200px" },
  { value: 400, label: "400px" },
  { value: 800, label: "800px" },
  { value: 1200, label: "1200px" },
  { value: 2000, label: "2000px" },
];

export default function QRCodeDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [qrcode, setQrcode] = useState<QRCodeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState("png");
  const [exportSize, setExportSize] = useState(400);
  const [downloading, setDownloading] = useState(false);
  const [planUtilisateur, setPlanUtilisateur] = useState<PlanType>("FREE");
  // Gestion du mot de passe
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && params.id) {
      fetchQRCode();
      fetchPlanUtilisateur();
    }
  }, [session, params.id]);

  const fetchQRCode = async () => {
    try {
      const res = await fetch(`/api/qrcodes/${params.id}`, { credentials: "include" });
      if (!res.ok) {
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      setQrcode(data);
      setExportSize(data.size || 400);
    } catch (error) {
      console.error("Error fetching QR code:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanUtilisateur = async () => {
    try {
      const res = await fetch("/api/user/plan", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setPlanUtilisateur(data.plan || "FREE");
      }
    } catch (error) {
      console.error("Erreur lors de la recuperation du plan:", error);
    }
  };

  const downloadQRCode = async () => {
    if (!qrcode) return;

    setDownloading(true);
    try {
      const response = await fetch(
        `/api/qrcodes/${qrcode.id}/export?format=${exportFormat}&size=${exportSize}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const extension = exportFormat === "jpeg" ? "jpg" : exportFormat;
      link.download = `${qrcode.name.replace(/[^a-zA-Z0-9]/g, "_")}.${extension}`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setDownloading(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeviceIcon = (userAgent: string | null) => {
    if (!userAgent) return null;
    if (/mobile/i.test(userAgent) || /tablet/i.test(userAgent)) {
      return (
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
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
          <path d="M12 18h.01" />
        </svg>
      );
    }
    return (
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
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
      </svg>
    );
  };

  const getDeviceType = (userAgent: string | null) => {
    if (!userAgent) return "Inconnu";
    if (/mobile/i.test(userAgent)) return "Mobile";
    if (/tablet/i.test(userAgent)) return "Tablette";
    return "Desktop";
  };

  const handlePasswordUpdate = async (action: "set" | "remove") => {
    setPasswordError("");
    setPasswordSuccess("");

    if (action === "set") {
      if (newPassword.length < 4) {
        setPasswordError("Le mot de passe doit contenir au moins 4 caracteres.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("Les mots de passe ne correspondent pas.");
        return;
      }
    }

    setSavingPassword(true);
    try {
      const res = await fetch(`/api/qrcodes/${params.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          password: action === "set" ? newPassword : undefined,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Erreur lors de la mise a jour");
        return;
      }

      setPasswordSuccess(
        action === "set"
          ? "Mot de passe configure avec succes"
          : "Protection par mot de passe desactivee"
      );
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      // Rafraichir les donnees du QR code
      fetchQRCode();
    } catch (error) {
      console.error("Erreur:", error);
      setPasswordError("Erreur de connexion");
    } finally {
      setSavingPassword(false);
    }
  };

  if (status === "loading" || loading) {
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

  if (!session || !qrcode) return null;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const redirectUrl = `${baseUrl}/r/${qrcode.id}`;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
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

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* QR Code Card */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">{qrcode.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {qrcode.qrImageUrl && (
                  <div
                    className="flex justify-center overflow-x-auto p-8"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrcode.qrImageUrl}
                      alt={qrcode.name}
                      style={{
                        width: `${qrcode.size || 400}px`,
                        height: `${qrcode.size || 400}px`,
                        minWidth: `${qrcode.size || 400}px`,
                        minHeight: `${qrcode.size || 400}px`,
                        imageRendering: "pixelated",
                      }}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      URL de destination
                    </p>
                    <p className="text-sm break-all">{qrcode.targetUrl}</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      URL du QR code
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded-lg bg-muted px-3 py-2 text-xs break-all">
                        {redirectUrl}
                      </code>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyUrl(redirectUrl)}
                      >
                        {copied ? (
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
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        ) : (
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
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                        )}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Cree le</p>
                      <p>{formatDate(qrcode.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Taille</p>
                      <p>{qrcode.size}px</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-muted-foreground">Couleur QR</p>
                      <div
                        className="h-4 w-4 rounded border"
                        style={{ backgroundColor: qrcode.foregroundColor }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-muted-foreground">Fond</p>
                      <div
                        className="h-4 w-4 rounded border"
                        style={{ backgroundColor: qrcode.backgroundColor }}
                      />
                    </div>
                  </div>

                  {/* Informations d'expiration */}
                  {(qrcode.expiresAt || qrcode.maxScans) && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={qrcode.isActive ? "default" : "destructive"}>
                            {qrcode.isActive ? "Actif" : "Expire"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {qrcode.expiresAt && (
                            <div>
                              <p className="text-muted-foreground">Expire le</p>
                              <p>{formatDate(qrcode.expiresAt)}</p>
                            </div>
                          )}
                          {qrcode.maxScans && (
                            <div>
                              <p className="text-muted-foreground">Scans restants</p>
                              <p>{Math.max(0, qrcode.maxScans - qrcode._count.scans)} / {qrcode.maxScans}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bouton A/B Test */}
            {(planUtilisateur === "PRO" || planUtilisateur === "BUSINESS") && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
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
                      <path d="M10 2h4" />
                      <path d="M4 6h16" />
                      <path d="M6 6v14c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V6" />
                      <path d="M8 10h8" />
                      <path d="M8 14h8" />
                      <path d="M8 18h8" />
                    </svg>
                    Test A/B
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Testez differentes URLs pour optimiser vos conversions.
                  </p>
                  <Link href={`/qrcode/${qrcode.id}/ab-test`}>
                    <Button className="w-full">
                      Configurer le test A/B
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Protection par mot de passe (PRO/BUSINESS) */}
            {(planUtilisateur === "PRO" || planUtilisateur === "BUSINESS") && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
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
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Protection par mot de passe
                    {qrcode.isPasswordProtected && (
                      <Badge variant="default" className="ml-2">Active</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {passwordError && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="rounded-lg bg-green-100 p-3 text-sm text-green-800">
                      {passwordSuccess}
                    </div>
                  )}

                  {qrcode.isPasswordProtected ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Ce QR code est protege par un mot de passe. Les utilisateurs devront saisir le mot de passe pour acceder au contenu.
                      </p>

                      {showPasswordForm ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Nouveau mot de passe"
                              className="h-11"
                              minLength={4}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirmer le mot de passe"
                              className="h-11"
                              minLength={4}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setShowPasswordForm(false);
                                setNewPassword("");
                                setConfirmPassword("");
                                setPasswordError("");
                              }}
                            >
                              Annuler
                            </Button>
                            <Button
                              className="flex-1"
                              disabled={savingPassword || !newPassword || newPassword !== confirmPassword}
                              onClick={() => handlePasswordUpdate("set")}
                            >
                              {savingPassword ? "Enregistrement..." : "Changer"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowPasswordForm(true)}
                          >
                            Changer le mot de passe
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            disabled={savingPassword}
                            onClick={() => handlePasswordUpdate("remove")}
                          >
                            {savingPassword ? "Suppression..." : "Supprimer la protection"}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Protegez l&apos;acces a votre QR code avec un mot de passe. Les utilisateurs devront saisir ce mot de passe pour acceder au contenu.
                      </p>

                      {showPasswordForm ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">Mot de passe</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Saisir un mot de passe"
                              className="h-11"
                              minLength={4}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirmer le mot de passe"
                              className="h-11"
                              minLength={4}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setShowPasswordForm(false);
                                setNewPassword("");
                                setConfirmPassword("");
                                setPasswordError("");
                              }}
                            >
                              Annuler
                            </Button>
                            <Button
                              className="flex-1"
                              disabled={savingPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 4}
                              onClick={() => handlePasswordUpdate("set")}
                            >
                              {savingPassword ? "Activation..." : "Activer la protection"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => setShowPasswordForm(true)}
                        >
                          Ajouter un mot de passe
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Export Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Telecharger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Format</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {EXPORT_FORMATS.map((format) => (
                      <button
                        key={format.value}
                        type="button"
                        onClick={() => setExportFormat(format.value)}
                        className={`rounded-lg border p-3 text-left transition-apple hover:bg-muted ${
                          exportFormat === format.value
                            ? "border-foreground bg-muted"
                            : "border-border"
                        }`}
                      >
                        <p className="font-medium">{format.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {format.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Taille</Label>
                  <div className="flex flex-wrap gap-2">
                    {EXPORT_SIZES.map((size) => (
                      <button
                        key={size.value}
                        type="button"
                        onClick={() => setExportSize(size.value)}
                        className={`rounded-lg border px-3 py-2 text-sm transition-apple hover:bg-muted ${
                          exportSize === size.value
                            ? "border-foreground bg-muted"
                            : "border-border"
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={downloadQRCode}
                  disabled={downloading}
                  className="w-full h-11"
                >
                  {downloading ? (
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
                      Préparation...
                    </span>
                  ) : (
                    <>
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
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                      Télécharger en {exportFormat.toUpperCase()} ({exportSize}px)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats Card - Derniers scans */}
          <Card className="border-0 shadow-lg h-fit">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Derniers scans</CardTitle>
              <Badge variant="secondary" className="text-base px-4 py-1">
                {qrcode._count.scans} scans
              </Badge>
            </CardHeader>
            <CardContent>
              {qrcode.scans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                  </div>
                  <p className="text-center text-muted-foreground">
                    Aucun scan pour l&apos;instant.
                    <br />
                    Partagez votre QR code pour voir les statistiques.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Historique recent</p>
                  <div className="max-h-[400px] space-y-2 overflow-y-auto pr-2">
                    {qrcode.scans.map((scan) => (
                      <div
                        key={scan.id}
                        className="flex items-center justify-between rounded-lg bg-muted/50 p-3 transition-apple hover:bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background">
                            {getDeviceIcon(scan.userAgent)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {getDeviceType(scan.userAgent)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(scan.scannedAt)}
                            </p>
                          </div>
                        </div>
                        {scan.ip && (
                          <span className="text-xs text-muted-foreground">
                            {scan.ip}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Section Insights - pleine largeur */}
        <div className="mt-8">
          <QRInsights
            qrcodeId={qrcode.id}
            peutVoirInsights={canViewAnalytics(planUtilisateur)}
          />
        </div>

        {/* Section Analytics detaillees - pleine largeur */}
        <div className="mt-8">
          <AnalyticsSection
            qrcodeId={qrcode.id}
            peutVoirAnalytics={canViewAnalytics(planUtilisateur)}
          />
        </div>
      </main>
    </div>
  );
}
