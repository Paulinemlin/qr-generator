"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Configuration des plans (côté client)
const PLANS_CONFIG = {
  FREE: {
    name: "Gratuit",
    price: 0,
    limits: { qrcodes: 3 },
  },
  PRO: {
    name: "Pro",
    price: 9,
    limits: { qrcodes: -1 },
  },
  BUSINESS: {
    name: "Business",
    price: 29,
    limits: { qrcodes: -1 },
  },
} as const;

type PlanType = keyof typeof PLANS_CONFIG;

interface Team {
  id: string;
  name: string;
}

interface QRCode {
  id: string;
  name: string;
  targetUrl: string;
  qrImageUrl: string | null;
  createdAt: string;
  teamId: string | null;
  team: Team | null;
  _count: {
    scans: number;
  };
}

interface UserInfo {
  plan: PlanType;
  subscriptionStatus: "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | null;
  subscriptionEndDate: string | null;
  stripeCustomerId: string | null;
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [qrcodes, setQrcodes] = useState<QRCode[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Vérifier si l'URL contient ?success=true pour afficher le message de félicitations
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      // Retirer le paramètre de l'URL après affichage
      const timer = setTimeout(() => {
        router.replace("/dashboard");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Initialiser avec le parametre team de l'URL si present
  useEffect(() => {
    const teamParam = searchParams.get("team");
    if (teamParam) {
      setSelectedTeam(teamParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (session) {
      fetchQRCodes(selectedTeam);
    }
  }, [session, selectedTeam]);

  const fetchQRCodes = async (teamFilter: string) => {
    try {
      let url = "/api/qrcodes";
      if (teamFilter && teamFilter !== "all") {
        url += `?team=${teamFilter}`;
      }
      const res = await fetch(url, {
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch");
      }
      const data = await res.json();
      setQrcodes(data.qrcodes);
      setUserInfo(data.user);
      if (data.teams) {
        setTeams(data.teams);
      }
    } catch (error) {
      console.error("Error fetching QR codes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamChange = (value: string) => {
    setSelectedTeam(value);
    // Mettre a jour l'URL
    if (value === "all") {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard?team=${value}`);
    }
  };

  // Fonction pour ouvrir le portail Stripe
  const openStripePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture du portail:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  // Calcul de l'utilisation des QR codes
  const getQRCodeUsage = () => {
    if (!userInfo) return { used: 0, limit: 3, percentage: 0 };
    const plan = PLANS_CONFIG[userInfo.plan];
    const used = qrcodes.length;
    const limit = plan.limits.qrcodes;
    const percentage = limit === -1 ? 0 : Math.min((used / limit) * 100, 100);
    return { used, limit, percentage };
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce QR code ?")) return;

    try {
      await fetch(`/api/qrcodes/${id}`, { method: "DELETE", credentials: "include" });
      setQrcodes(qrcodes.filter((qr) => qr.id !== id));
    } catch (error) {
      console.error("Error deleting QR code:", error);
    }
  };

  const downloadQRCode = (qrImageUrl: string, name: string) => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `${name}.png`;
    link.click();
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

  if (!session) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight">
                QR Generator
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium rounded-md bg-accent text-accent-foreground"
              >
                QR Codes
              </Link>
              <Link
                href="/links"
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                Liens courts
              </Link>
              <Link
                href="/teams"
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                Équipes
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-muted-foreground">
              {session.user?.email}
            </span>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Message de félicitations après souscription réussie */}
        {showSuccess && (
          <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
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
                  className="text-green-600 dark:text-green-400"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  Félicitations ! Votre abonnement est actif
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Vous pouvez maintenant profiter de toutes les fonctionnalités de votre nouveau plan.
                </p>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="ml-auto text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
              >
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Section Plan Utilisateur */}
        {userInfo && (
          <Card className="mb-8 border-0 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-semibold">Mon abonnement</h2>
                    <Badge
                      variant={userInfo.plan === "FREE" ? "secondary" : "default"}
                      className={
                        userInfo.plan === "PRO"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : userInfo.plan === "BUSINESS"
                          ? "bg-purple-500 hover:bg-purple-600"
                          : ""
                      }
                    >
                      {PLANS_CONFIG[userInfo.plan].name}
                    </Badge>
                    {userInfo.subscriptionStatus === "ACTIVE" && (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        Actif
                      </Badge>
                    )}
                    {userInfo.subscriptionStatus === "CANCELED" && (
                      <Badge variant="outline" className="border-orange-500 text-orange-600">
                        Annulé
                      </Badge>
                    )}
                    {userInfo.subscriptionStatus === "PAST_DUE" && (
                      <Badge variant="outline" className="border-red-500 text-red-600">
                        Paiement en retard
                      </Badge>
                    )}
                  </div>

                  {/* Utilisation des QR codes */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        QR codes utilisés
                      </span>
                      <span className="text-sm font-medium">
                        {getQRCodeUsage().used}{" "}
                        {getQRCodeUsage().limit === -1 ? (
                          <span className="text-muted-foreground">/ illimité</span>
                        ) : (
                          <span className="text-muted-foreground">
                            / {getQRCodeUsage().limit}
                          </span>
                        )}
                      </span>
                    </div>
                    {getQRCodeUsage().limit !== -1 && (
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            getQRCodeUsage().percentage >= 100
                              ? "bg-red-500"
                              : getQRCodeUsage().percentage >= 80
                              ? "bg-orange-500"
                              : "bg-primary"
                          }`}
                          style={{ width: `${getQRCodeUsage().percentage}%` }}
                        />
                      </div>
                    )}
                    {getQRCodeUsage().limit !== -1 && getQRCodeUsage().percentage >= 80 && (
                      <p className="mt-2 text-sm text-orange-600">
                        {getQRCodeUsage().percentage >= 100
                          ? "Vous avez atteint la limite de votre plan. Passez à un plan supérieur pour créer plus de QR codes."
                          : "Vous approchez de la limite de votre plan."}
                      </p>
                    )}
                  </div>

                  {/* Date de fin d'abonnement */}
                  {userInfo.subscriptionEndDate && userInfo.subscriptionStatus === "CANCELED" && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Votre abonnement prendra fin le{" "}
                      {new Date(userInfo.subscriptionEndDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
                  {userInfo.plan === "BUSINESS" && (
                    <>
                      <Link href="/teams">
                        <Button variant="outline" className="w-full">
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
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          Equipes
                        </Button>
                      </Link>
                      <Link href="/api-keys">
                        <Button variant="outline" className="w-full">
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
                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                          </svg>
                          Cles API
                        </Button>
                      </Link>
                      <Link href="/settings/domains">
                        <Button variant="outline" className="w-full">
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
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" x2="22" y1="12" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                          </svg>
                          Domaines
                        </Button>
                      </Link>
                    </>
                  )}
                  {userInfo.plan === "FREE" ? (
                    <Link href="/pricing">
                      <Button className="w-full">
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
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        Passer au plan Pro
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={openStripePortal}
                      disabled={portalLoading}
                    >
                      {portalLoading ? (
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
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
                      ) : (
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
                          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                      Gérer mon abonnement
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Title */}
        <div className="flex flex-col gap-4 mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Mes QR Codes
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gerez et suivez vos QR codes
            </p>
          </div>

          {/* Selecteur d'equipe pour les utilisateurs BUSINESS */}
          {userInfo?.plan === "BUSINESS" && teams.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtrer par :</span>
              <Select value={selectedTeam} onValueChange={handleTeamChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Toutes les equipes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les QR codes</SelectItem>
                  <SelectItem value="personal">Personnels uniquement</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {/* Boutons Import/Export CSV - PRO et BUSINESS uniquement */}
            {userInfo && userInfo.plan !== "FREE" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = "/api/qrcodes/export/csv"}
                  disabled={qrcodes.length === 0}
                >
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
                  Exporter CSV
                </Button>
                <Link href="/import">
                  <Button variant="outline" size="sm">
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
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                    Importer CSV
                  </Button>
                </Link>
                <Link href="/badges/import">
                  <Button variant="outline" size="sm">
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
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <rect x="7" y="7" width="3" height="9" />
                      <rect x="14" y="7" width="3" height="5" />
                    </svg>
                    Badges evenement
                  </Button>
                </Link>
              </>
            )}
            <Link href="/create">
              <Button className="h-10 px-6">
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
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Nouveau QR Code
              </Button>
            </Link>
          </div>
        </div>

        {qrcodes.length === 0 ? (
          <Card className="border-0 bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-background">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
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
              <h2 className="text-xl font-semibold mb-2">Aucun QR code</h2>
              <p className="text-muted-foreground text-center mb-6 max-w-sm">
                Créez votre premier QR code pour commencer à suivre vos scans.
              </p>
              <Link href="/create">
                <Button>Créer un QR Code</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {qrcodes.map((qr) => (
              <Card
                key={qr.id}
                className="group border-0 bg-card shadow-sm transition-apple hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold truncate pr-2">{qr.name}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {qr.team && (
                        <Badge variant="outline" className="text-xs">
                          {qr.team.name}
                        </Badge>
                      )}
                      <Badge variant="secondary">
                        {qr._count.scans} scans
                      </Badge>
                    </div>
                  </div>

                  {qr.qrImageUrl && (
                    <div className="flex justify-center mb-4 p-4 bg-muted/30 rounded-xl">
                      <Image
                        src={qr.qrImageUrl}
                        alt={qr.name}
                        width={180}
                        height={180}
                        className="rounded-lg"
                      />
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground truncate mb-4">
                    {qr.targetUrl}
                  </p>

                  <div className="flex gap-2">
                    <Link href={`/qrcode/${qr.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full" size="sm">
                        Détails
                      </Button>
                    </Link>
                    {qr.qrImageUrl && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => downloadQRCode(qr.qrImageUrl!, qr.name)}
                      >
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
                          className="mr-1"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        Télécharger
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(qr.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
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
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-foreground" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
