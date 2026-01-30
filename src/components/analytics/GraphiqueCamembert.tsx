"use client";

import React from "react";

interface DonneeCamembert {
  label: string;
  valeur: number;
  pourcentage: number;
}

interface GraphiqueCamembertProps {
  donnees: DonneeCamembert[];
  titre?: string;
  taille?: number;
}

// Couleurs pour le camembert
const COULEURS = [
  "hsl(var(--foreground))",
  "hsl(var(--foreground) / 0.7)",
  "hsl(var(--foreground) / 0.5)",
  "hsl(var(--foreground) / 0.35)",
  "hsl(var(--foreground) / 0.2)",
];

export function GraphiqueCamembert({
  donnees,
  titre,
  taille = 120,
}: GraphiqueCamembertProps) {
  const total = donnees.reduce((acc, d) => acc + d.valeur, 0);

  // Generer les segments du camembert en SVG
  const genererSegments = () => {
    if (total === 0) {
      return (
        <circle
          cx={taille / 2}
          cy={taille / 2}
          r={taille / 2 - 2}
          fill="hsl(var(--muted))"
        />
      );
    }

    const segments: React.ReactElement[] = [];
    let angleDepart = -90; // Commencer en haut

    donnees.forEach((item, index) => {
      if (item.valeur === 0) return;

      const pourcentage = (item.valeur / total) * 100;
      const angle = (pourcentage / 100) * 360;
      const angleFin = angleDepart + angle;

      // Convertir les angles en radians
      const startRad = (angleDepart * Math.PI) / 180;
      const endRad = (angleFin * Math.PI) / 180;

      const rayon = taille / 2 - 2;
      const centreX = taille / 2;
      const centreY = taille / 2;

      const x1 = centreX + rayon * Math.cos(startRad);
      const y1 = centreY + rayon * Math.sin(startRad);
      const x2 = centreX + rayon * Math.cos(endRad);
      const y2 = centreY + rayon * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const d = [
        `M ${centreX} ${centreY}`,
        `L ${x1} ${y1}`,
        `A ${rayon} ${rayon} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");

      segments.push(
        <path
          key={index}
          d={d}
          fill={COULEURS[index % COULEURS.length]}
          className="transition-opacity hover:opacity-80"
        />
      );

      angleDepart = angleFin;
    });

    return segments;
  };

  return (
    <div className="space-y-3">
      {titre && <h4 className="text-sm font-medium text-muted-foreground">{titre}</h4>}
      <div className="flex items-start gap-4">
        <svg
          width={taille}
          height={taille}
          viewBox={`0 0 ${taille} ${taille}`}
          className="flex-shrink-0"
        >
          {genererSegments()}
        </svg>
        <div className="flex-1 space-y-1.5">
          {donnees.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: COULEURS[index % COULEURS.length] }}
              />
              <span className="flex-1 truncate text-muted-foreground" title={item.label}>
                {item.label}
              </span>
              <span className="font-medium">{item.pourcentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
