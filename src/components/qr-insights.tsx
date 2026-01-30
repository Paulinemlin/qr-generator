"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalyticsData {
  scansParJour: { date: string; label: string; scans: number }[];
  scansParHeure: { heure: number; label: string; scans: number }[];
  appareils: { type: string; scans: number; pourcentage: number }[];
  totalScans: number;
  scans7Jours: number;
  scans30Jours: number;
}

interface Insight {
  id: string;
  type: "success" | "warning" | "info" | "tip";
  titre: string;
  description: string;
  icon: React.ReactNode;
}

interface QRInsightsProps {
  qrcodeId: string;
  peutVoirInsights: boolean;
}

export function QRInsights({ qrcodeId, peutVoirInsights }: QRInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (peutVoirInsights) {
      analyserDonnees();
    } else {
      setLoading(false);
    }
  }, [qrcodeId, peutVoirInsights]);

  const analyserDonnees = async () => {
    try {
      const res = await fetch(`/api/qrcodes/${qrcodeId}/analytics`, {
        credentials: "include",
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data: AnalyticsData = await res.json();
      const nouvellesInsights = genererInsights(data);
      setInsights(nouvellesInsights);
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
    } finally {
      setLoading(false);
    }
  };

  const genererInsights = (data: AnalyticsData): Insight[] => {
    const insights: Insight[] = [];

    // 1. Analyse des heures de pic
    const heuresPic = data.scansParHeure
      .filter((h) => h.scans > 0)
      .sort((a, b) => b.scans - a.scans)
      .slice(0, 3);

    if (heuresPic.length > 0) {
      const meilleureMoment = getMomentJournee(heuresPic[0].heure);
      insights.push({
        id: "heures-pic",
        type: "tip",
        titre: `Pic d'activite ${meilleureMoment}`,
        description: `Vos scans sont les plus nombreux entre ${heuresPic[0].heure}h et ${heuresPic[0].heure + 1}h. Programmez vos campagnes marketing a ces heures pour maximiser l'engagement.`,
        icon: (
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
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      });
    }

    // 2. Analyse du taux de scan
    if (data.totalScans === 0) {
      insights.push({
        id: "aucun-scan",
        type: "warning",
        titre: "Aucun scan enregistre",
        description: "Votre QR code n'a pas encore ete scanne. Assurez-vous qu'il est bien visible et accessible. Considerez l'amelioration de son placement.",
        icon: (
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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        ),
      });
    } else if (data.scans7Jours < data.scans30Jours / 4) {
      // Baisse d'activite
      insights.push({
        id: "baisse-activite",
        type: "warning",
        titre: "Baisse d'activite recente",
        description: "L'activite des 7 derniers jours est en baisse par rapport a la moyenne mensuelle. Relancez votre campagne ou modifiez l'emplacement du QR code.",
        icon: (
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
            <path d="m3 16 4 4 4-4" />
            <path d="M7 20V4" />
            <path d="M11 4h10" />
            <path d="M11 8h7" />
            <path d="M11 12h4" />
          </svg>
        ),
      });
    } else if (data.scans7Jours > 0) {
      insights.push({
        id: "activite-stable",
        type: "success",
        titre: "Bonne activite recente",
        description: `Vous avez enregistre ${data.scans7Jours} scans cette semaine. Continuez ainsi !`,
        icon: (
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ),
      });
    }

    // 3. Analyse des appareils
    const appareilMobile = data.appareils.find((a) => a.type === "Mobile");
    if (appareilMobile && appareilMobile.pourcentage >= 70) {
      insights.push({
        id: "mobile-dominant",
        type: "info",
        titre: `${appareilMobile.pourcentage}% de scans mobiles`,
        description: "La majorite de vos visiteurs utilisent un mobile. Assurez-vous que votre page de destination est parfaitement optimisee pour mobile (responsive, temps de chargement rapide).",
        icon: (
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
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
        ),
      });
    }

    // 4. Conseil placement si peu de scans
    if (data.totalScans > 0 && data.totalScans < 10) {
      insights.push({
        id: "ameliorer-placement",
        type: "tip",
        titre: "Optimisez le placement",
        description: "Avec peu de scans, considerez: placer le QR code a hauteur des yeux, augmenter sa taille, ajouter un appel a l'action clair, ou le positionner dans des zones de fort passage.",
        icon: (
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
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        ),
      });
    }

    return insights;
  };

  const getMomentJournee = (heure: number): string => {
    if (heure >= 6 && heure < 12) return "le matin";
    if (heure >= 12 && heure < 14) return "a midi";
    if (heure >= 14 && heure < 18) return "l'apres-midi";
    if (heure >= 18 && heure < 22) return "en soiree";
    return "la nuit";
  };

  const getInsightStyles = (type: Insight["type"]) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          titleColor: "text-green-900",
          textColor: "text-green-700",
        };
      case "warning":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          iconBg: "bg-orange-100",
          iconColor: "text-orange-600",
          titleColor: "text-orange-900",
          textColor: "text-orange-700",
        };
      case "info":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          titleColor: "text-blue-900",
          textColor: "text-blue-700",
        };
      case "tip":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
          titleColor: "text-purple-900",
          textColor: "text-purple-700",
        };
    }
  };

  if (!peutVoirInsights) {
    return (
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
              className="text-muted-foreground"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Suggestions d&apos;amelioration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
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
            <p className="text-center text-muted-foreground">
              Les suggestions d&apos;amelioration sont disponibles avec les plans Pro et Business.
            </p>
            <Badge variant="secondary" className="mt-4">
              PRO / BUSINESS
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Suggestions d&apos;amelioration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-6 w-6 text-muted-foreground" viewBox="0 0 24 24">
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

  if (insights.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Suggestions d&apos;amelioration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Pas de suggestions pour le moment. Continuez a utiliser votre QR code pour obtenir des insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          Suggestions d&apos;amelioration
          <Badge variant="secondary" className="ml-2">
            {insights.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => {
          const styles = getInsightStyles(insight.type);
          return (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${styles.bg} ${styles.border}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconColor}`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${styles.titleColor}`}>
                    {insight.titre}
                  </h4>
                  <p className={`text-sm mt-1 ${styles.textColor}`}>
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
