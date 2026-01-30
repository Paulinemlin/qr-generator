"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QRMockupPreviewProps {
  qrContent: string;
  foregroundColor: string;
  backgroundColor: string;
  logoUrl?: string | null;
  isPremium?: boolean;
}

type MockupType = "business-card" | "poster" | "phone";

interface MockupConfig {
  id: MockupType;
  name: string;
  description: string;
}

const MOCKUPS: MockupConfig[] = [
  {
    id: "business-card",
    name: "Carte de visite",
    description: "Format standard 85x55mm",
  },
  {
    id: "poster",
    name: "Affiche",
    description: "Format A4 portrait",
  },
  {
    id: "phone",
    name: "Ecran mobile",
    description: "Affichage sur smartphone",
  },
];

export default function QRMockupPreview({
  qrContent,
  foregroundColor,
  backgroundColor,
  logoUrl,
  isPremium = false,
}: QRMockupPreviewProps) {
  const [selectedMockup, setSelectedMockup] = useState<MockupType>("business-card");

  if (!isPremium) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Previsualisation mockups
            <Badge variant="secondary" className="text-xs">Pro</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-xl border-2 border-dashed border-border p-8 text-center">
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-3 text-muted-foreground"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h.01" />
                  <path d="M17 7h.01" />
                  <path d="M7 17h.01" />
                  <path d="M12 12h.01" />
                </svg>
                <p className="text-sm text-muted-foreground mb-2">
                  Visualisez votre QR code sur differents supports
                </p>
                <p className="text-xs text-muted-foreground">
                  Disponible avec les plans Pro et Business
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderMockup = () => {
    const qrCodeElement = (
      <QRCodeSVG
        value={qrContent}
        size={selectedMockup === "poster" ? 80 : selectedMockup === "phone" ? 100 : 50}
        level="H"
        fgColor={foregroundColor}
        bgColor={backgroundColor}
        imageSettings={
          logoUrl
            ? {
                src: logoUrl,
                height: selectedMockup === "poster" ? 16 : selectedMockup === "phone" ? 20 : 10,
                width: selectedMockup === "poster" ? 16 : selectedMockup === "phone" ? 20 : 10,
                excavate: true,
              }
            : undefined
        }
      />
    );

    switch (selectedMockup) {
      case "business-card":
        return (
          <div className="flex items-center justify-center p-6">
            {/* Carte de visite */}
            <div
              className="relative bg-white rounded-lg shadow-xl overflow-hidden"
              style={{
                width: "280px",
                height: "160px",
                background: "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
              }}
            >
              {/* Contenu de la carte */}
              <div className="absolute inset-0 p-4 flex">
                {/* Cote gauche - Infos */}
                <div className="flex-1 flex flex-col justify-center pr-4">
                  <div className="h-2 w-24 bg-gray-800 rounded mb-2"></div>
                  <div className="h-1.5 w-32 bg-gray-400 rounded mb-4"></div>
                  <div className="space-y-1.5">
                    <div className="h-1 w-28 bg-gray-300 rounded"></div>
                    <div className="h-1 w-24 bg-gray-300 rounded"></div>
                    <div className="h-1 w-20 bg-gray-300 rounded"></div>
                  </div>
                </div>
                {/* Cote droit - QR Code */}
                <div className="flex items-center justify-center">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {qrCodeElement}
                  </div>
                </div>
              </div>
              {/* Ligne decorative */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: foregroundColor }}
              ></div>
            </div>
          </div>
        );

      case "poster":
        return (
          <div className="flex items-center justify-center p-6">
            {/* Affiche A4 */}
            <div
              className="relative bg-white rounded-lg shadow-xl overflow-hidden"
              style={{
                width: "180px",
                height: "254px",
                background: "linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)",
              }}
            >
              {/* En-tete */}
              <div className="p-4 text-center border-b border-gray-100">
                <div className="h-2 w-20 bg-gray-800 rounded mx-auto mb-1.5"></div>
                <div className="h-1 w-28 bg-gray-300 rounded mx-auto"></div>
              </div>

              {/* Zone centrale avec QR */}
              <div className="flex flex-col items-center justify-center py-6">
                <div className="p-3 bg-white rounded-xl shadow-md border border-gray-100">
                  {qrCodeElement}
                </div>
                <div className="mt-3 text-center">
                  <div className="h-1 w-24 bg-gray-400 rounded mx-auto mb-1"></div>
                  <div className="h-1 w-16 bg-gray-300 rounded mx-auto"></div>
                </div>
              </div>

              {/* Pied */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-gray-50 border-t border-gray-100">
                <div className="h-1 w-20 bg-gray-300 rounded mx-auto"></div>
              </div>
            </div>
          </div>
        );

      case "phone":
        return (
          <div className="flex items-center justify-center p-6">
            {/* Smartphone */}
            <div
              className="relative bg-gray-900 rounded-[2rem] overflow-hidden shadow-xl"
              style={{
                width: "160px",
                height: "320px",
                padding: "8px",
              }}
            >
              {/* Encoche */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-gray-900 rounded-b-xl z-10"></div>

              {/* Ecran */}
              <div
                className="relative w-full h-full bg-white rounded-[1.5rem] overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)",
                }}
              >
                {/* Barre de statut */}
                <div className="flex items-center justify-between px-4 pt-6 pb-2">
                  <div className="text-[8px] font-medium text-gray-800">9:41</div>
                  <div className="flex gap-1">
                    <div className="w-3 h-1.5 bg-gray-800 rounded-sm"></div>
                    <div className="w-3 h-1.5 bg-gray-800 rounded-sm"></div>
                  </div>
                </div>

                {/* Contenu de l'app */}
                <div className="px-4 py-3">
                  {/* Header app */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-2 w-16 bg-gray-800 rounded"></div>
                    <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                  </div>

                  {/* QR Code card */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex justify-center mb-3">
                      {qrCodeElement}
                    </div>
                    <div className="text-center">
                      <div className="h-1.5 w-20 bg-gray-800 rounded mx-auto mb-1"></div>
                      <div className="h-1 w-28 bg-gray-300 rounded mx-auto"></div>
                    </div>
                  </div>

                  {/* Boutons */}
                  <div className="flex gap-2 mt-4">
                    <div
                      className="flex-1 h-6 rounded-lg"
                      style={{ backgroundColor: foregroundColor, opacity: 0.9 }}
                    ></div>
                    <div className="flex-1 h-6 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>

                {/* Barre de navigation */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-800 rounded-full"></div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Previsualisation mockups</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Selecteur de mockup */}
        <div className="flex gap-2 mb-4">
          {MOCKUPS.map((mockup) => (
            <button
              key={mockup.id}
              type="button"
              onClick={() => setSelectedMockup(mockup.id)}
              className={`flex-1 rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                selectedMockup === mockup.id
                  ? "border-foreground bg-muted"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="font-medium">{mockup.name}</div>
              <div className="text-xs text-muted-foreground">{mockup.description}</div>
            </button>
          ))}
        </div>

        {/* Zone de previsualisation */}
        <div className="rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 min-h-[300px] flex items-center justify-center">
          {renderMockup()}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Apercu indicatif - Le rendu final peut varier selon les supports d'impression
        </p>
      </CardContent>
    </Card>
  );
}
