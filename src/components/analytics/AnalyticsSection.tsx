"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraphiqueBarres } from "./GraphiqueBarres";
import { GraphiqueCamembert } from "./GraphiqueCamembert";

interface AnalyticsData {
  scansParJour: {
    date: string;
    label: string;
    scans: number;
  }[];
  scansParHeure: {
    heure: number;
    label: string;
    scans: number;
  }[];
  topPays: {
    pays: string;
    scans: number;
    pourcentage: number;
  }[];
  appareils: {
    type: string;
    scans: number;
    pourcentage: number;
  }[];
  navigateurs: {
    navigateur: string;
    scans: number;
    pourcentage: number;
  }[];
  totalScans: number;
  scans7Jours: number;
  scans30Jours: number;
}

interface AnalyticsSectionProps {
  qrcodeId: string;
  peutVoirAnalytics: boolean;
}

export function AnalyticsSection({ qrcodeId, peutVoirAnalytics }: AnalyticsSectionProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (peutVoirAnalytics) {
      chargerAnalytics();
    } else {
      setChargement(false);
    }
  }, [qrcodeId, peutVoirAnalytics]);

  const chargerAnalytics = async () => {
    try {
      const res = await fetch(`/api/qrcodes/${qrcodeId}/analytics`, {
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.requiresUpgrade) {
          setErreur("upgrade");
        } else {
          setErreur(data.error || "Erreur lors du chargement des analytics");
        }
        return;
      }

      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Erreur analytics:", error);
      setErreur("Erreur lors du chargement des analytics");
    } finally {
      setChargement(false);
    }
  };

  // Message pour les utilisateurs FREE
  if (!peutVoirAnalytics) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
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
              <path d="M3 3v16a2 2 0 0 0 2 2h16" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            Analytics detaillees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
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
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Passez au plan Pro pour voir les analytics detaillees
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Debloquez des statistiques avancees : graphiques de scans par jour,
              repartition par appareil, navigateur, pays et plus encore.
            </p>
            <Link href="/pricing">
              <Button>
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
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
                Decouvrir les plans Pro
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Chargement
  if (chargement) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Analytics detaillees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
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
        </CardContent>
      </Card>
    );
  }

  // Erreur
  if (erreur) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Analytics detaillees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">{erreur}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  // Preparer les donnees pour les graphiques
  const donneesJour = analytics.scansParJour.slice(-7).map((d) => ({
    label: d.label,
    valeur: d.scans,
  }));

  const donneesHeure = analytics.scansParHeure.map((d) => ({
    label: d.label,
    valeur: d.scans,
  }));

  const donneesAppareils = analytics.appareils.map((d) => ({
    label: d.type,
    valeur: d.scans,
    pourcentage: d.pourcentage,
  }));

  const donneesNavigateurs = analytics.navigateurs.map((d) => ({
    label: d.navigateur,
    valeur: d.scans,
    pourcentage: d.pourcentage,
  }));

  const donneesPays = analytics.topPays.map((d) => ({
    label: d.pays,
    valeur: d.scans,
    pourcentage: d.pourcentage,
  }));

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
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
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
          Analytics detaillees
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Statistiques resumees */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-2xl font-bold">{analytics.totalScans}</p>
            <p className="text-xs text-muted-foreground">Total scans</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-2xl font-bold">{analytics.scans7Jours}</p>
            <p className="text-xs text-muted-foreground">7 derniers jours</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-2xl font-bold">{analytics.scans30Jours}</p>
            <p className="text-xs text-muted-foreground">30 derniers jours</p>
          </div>
        </div>

        {/* Graphique des scans par jour */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Scans des 7 derniers jours</h4>
          <div className="rounded-xl bg-muted/30 p-4">
            <GraphiqueBarres
              donnees={donneesJour}
              hauteur={150}
              couleur="hsl(var(--foreground))"
            />
          </div>
        </div>

        {/* Graphique des scans par heure */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Repartition par heure de la journee</h4>
          <div className="rounded-xl bg-muted/30 p-4">
            <GraphiqueBarres
              donnees={donneesHeure}
              hauteur={120}
              couleur="hsl(var(--foreground) / 0.7)"
            />
          </div>
        </div>

        {/* Repartitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appareils */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Appareils</h4>
            <div className="rounded-xl bg-muted/30 p-4">
              {donneesAppareils.length > 0 ? (
                <GraphiqueCamembert donnees={donneesAppareils} taille={100} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune donnee
                </p>
              )}
            </div>
          </div>

          {/* Navigateurs */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Navigateurs</h4>
            <div className="rounded-xl bg-muted/30 p-4">
              {donneesNavigateurs.length > 0 ? (
                <GraphiqueCamembert donnees={donneesNavigateurs} taille={100} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune donnee
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Top Pays */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Top 5 des pays</h4>
          <div className="rounded-xl bg-muted/30 p-4">
            {donneesPays.length > 0 ? (
              <GraphiqueBarres
                donnees={donneesPays}
                orientation="horizontal"
                couleur="hsl(var(--foreground) / 0.6)"
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune donnee de localisation disponible
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
