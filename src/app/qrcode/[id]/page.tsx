"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

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
  scans: Scan[];
  _count: {
    scans: number;
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && params.id) {
      fetchQRCode();
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
                    className="flex justify-center rounded-xl p-6"
                    style={{ backgroundColor: qrcode.backgroundColor }}
                  >
                    <Image
                      src={qrcode.qrImageUrl}
                      alt={qrcode.name}
                      width={280}
                      height={280}
                      className="rounded-lg"
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
                      <p className="text-muted-foreground">Créé le</p>
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
                </div>
              </CardContent>
            </Card>

            {/* Export Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Télécharger</CardTitle>
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

          {/* Stats Card */}
          <Card className="border-0 shadow-lg h-fit">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Statistiques</CardTitle>
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
                  <p className="text-sm text-muted-foreground">Derniers scans</p>
                  <div className="max-h-[500px] space-y-2 overflow-y-auto pr-2">
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
      </main>
    </div>
  );
}
