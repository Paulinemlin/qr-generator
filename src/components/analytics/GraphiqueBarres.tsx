"use client";

interface DonneesBarre {
  label: string;
  valeur: number;
}

interface GraphiqueBarresProps {
  donnees: DonneesBarre[];
  titre?: string;
  hauteur?: number;
  couleur?: string;
  afficherValeurs?: boolean;
  orientation?: "vertical" | "horizontal";
}

export function GraphiqueBarres({
  donnees,
  titre,
  hauteur = 200,
  couleur = "hsl(var(--foreground))",
  afficherValeurs = true,
  orientation = "vertical",
}: GraphiqueBarresProps) {
  const maxValeur = Math.max(...donnees.map((d) => d.valeur), 1);

  if (orientation === "horizontal") {
    return (
      <div className="space-y-3">
        {titre && <h4 className="text-sm font-medium text-muted-foreground">{titre}</h4>}
        <div className="space-y-2">
          {donnees.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-20 truncate" title={item.label}>
                {item.label}
              </span>
              <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-500 ease-out"
                  style={{
                    width: `${(item.valeur / maxValeur) * 100}%`,
                    backgroundColor: couleur,
                    minWidth: item.valeur > 0 ? "4px" : "0",
                  }}
                />
              </div>
              {afficherValeurs && (
                <span className="text-xs font-medium w-10 text-right">{item.valeur}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {titre && <h4 className="text-sm font-medium text-muted-foreground">{titre}</h4>}
      <div
        className="flex items-end gap-1 overflow-x-auto pb-2"
        style={{ height: hauteur }}
      >
        {donnees.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-shrink-0 group"
            style={{ minWidth: donnees.length > 15 ? "12px" : "24px" }}
          >
            <div className="flex-1 w-full flex items-end justify-center relative">
              {afficherValeurs && item.valeur > 0 && (
                <span className="absolute -top-5 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.valeur}
                </span>
              )}
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${(item.valeur / maxValeur) * 100}%`,
                  backgroundColor: couleur,
                  minHeight: item.valeur > 0 ? "4px" : "0",
                }}
              />
            </div>
            <span
              className="text-[9px] text-muted-foreground mt-1 truncate w-full text-center"
              title={item.label}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
