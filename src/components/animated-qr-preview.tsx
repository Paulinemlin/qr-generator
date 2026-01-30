"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const styles = [
  { name: "Carré", borderRadius: "0" },
  { name: "Arrondi", borderRadius: "4px" },
  { name: "Points", borderRadius: "50%" },
];

const colors = [
  { name: "Noir", primary: "#000000", accent: "oklch(0.55 0.25 290)" },
  { name: "Violet", primary: "oklch(0.55 0.25 290)", accent: "oklch(0.65 0.22 340)" },
  { name: "Bleu", primary: "oklch(0.55 0.20 260)", accent: "oklch(0.70 0.15 200)" },
  { name: "Rose", primary: "oklch(0.65 0.22 340)", accent: "oklch(0.55 0.25 290)" },
];

const brands = [
  {
    name: "Apple",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    )
  },
  {
    name: "Nike",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-8">
        <path d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z"/>
      </svg>
    )
  },
  {
    name: "Spotify",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    )
  },
  {
    name: "McDonald's",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 0C8.3 0 5.2 3.4 3.2 8.5L0 24h4.8l1.3-6.4C7.4 20.2 9.5 22 12 22s4.6-1.8 5.9-4.4L19.2 24H24l-3.2-15.5C18.8 3.4 15.7 0 12 0zm0 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
      </svg>
    )
  },
];

// QR code pattern data (7x7 grid with typical QR patterns)
const qrPattern = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

export function AnimatedQRPreview() {
  const [styleIndex, setStyleIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [brandIndex, setBrandIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Cycle through styles every 2 seconds
    const styleInterval = setInterval(() => {
      setStyleIndex((prev) => (prev + 1) % styles.length);
    }, 2000);

    // Cycle through colors every 3 seconds
    const colorInterval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 3000);

    // Cycle through brands every 2.5 seconds
    const brandInterval = setInterval(() => {
      setBrandIndex((prev) => (prev + 1) % brands.length);
    }, 2500);

    // Toggle logo visibility every 4 seconds
    const logoInterval = setInterval(() => {
      setShowLogo((prev) => !prev);
    }, 4000);

    return () => {
      clearInterval(styleInterval);
      clearInterval(colorInterval);
      clearInterval(brandInterval);
      clearInterval(logoInterval);
    };
  }, []);

  const currentStyle = styles[styleIndex];
  const currentColor = colors[colorIndex];
  const currentBrand = brands[brandIndex];

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Glow - animated based on color */}
      <div
        className="absolute inset-0 -m-8 rounded-3xl blur-3xl transition-all duration-1000"
        style={{
          background: `linear-gradient(135deg, ${currentColor.primary}26 0%, ${currentColor.accent}15 100%)`
        }}
      />

      <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden">
        {/* Window Header */}
        <div className="flex items-center gap-2 border-b px-4 py-3 bg-muted/50">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-muted-foreground">app.qrgenerator.fr/create</span>
          </div>
        </div>

        {/* Interface Content */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
          {/* Left - Form */}
          <div className="p-8 space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">URL de destination</label>
              <div className="h-10 rounded-lg bg-muted/50 border px-3 flex items-center text-sm text-muted-foreground">
                https://votresite.com/promo
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Nom du QR code</label>
              <div className="h-10 rounded-lg bg-muted/50 border px-3 flex items-center text-sm text-muted-foreground">
                Campagne Printemps 2024
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">Style</label>
              <div className="flex gap-3">
                {styles.map((style, i) => (
                  <div
                    key={style.name}
                    className={`flex-1 h-10 rounded-lg border flex items-center justify-center text-sm transition-all duration-300 ${
                      i === styleIndex
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {style.name}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">Couleur</label>
              <div className="flex gap-2">
                {colors.map((color, i) => (
                  <button
                    key={color.name}
                    className={`h-8 w-8 rounded-full border-2 transition-all duration-300 ${
                      i === colorIndex ? "border-primary scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.primary }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">Logo (optionnel)</label>
              <div className="flex gap-2 flex-wrap">
                {brands.map((brand, i) => (
                  <div
                    key={brand.name}
                    className={`h-10 w-10 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                      showLogo && i === brandIndex
                        ? "border-primary bg-primary/5 text-primary"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {brand.logo}
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full">
              Générer le QR code
            </Button>
          </div>

          {/* Right - Preview */}
          <div className="p-8 flex flex-col items-center justify-center bg-muted/20">
            <div className="text-sm text-muted-foreground mb-4">Aperçu</div>
            <div className="h-48 w-48 rounded-xl bg-white p-4 shadow-lg relative overflow-hidden">
              <div className="h-full w-full flex items-center justify-center">
                <div className="grid grid-cols-7 gap-0.5">
                  {qrPattern.flat().map((cell, i) => (
                    <div
                      key={i}
                      className="h-5 w-5 transition-all duration-500"
                      style={{
                        backgroundColor: cell ? currentColor.primary : "transparent",
                        borderRadius: currentStyle.borderRadius,
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Logo overlay */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                  showLogo ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}
              >
                <div
                  className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-md"
                  style={{ color: currentColor.primary }}
                >
                  {currentBrand.logo}
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Style: <span className="font-medium text-foreground">{currentStyle.name}</span>
                {showLogo && (
                  <> · Logo: <span className="font-medium text-foreground">{currentBrand.name}</span></>
                )}
              </p>
              <div className="flex gap-2 justify-center">
                <Badge variant="outline">PNG</Badge>
                <Badge variant="outline">SVG</Badge>
                <Badge variant="outline">PDF</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
