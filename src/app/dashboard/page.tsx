"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface QRCode {
  id: string;
  name: string;
  targetUrl: string;
  qrImageUrl: string | null;
  createdAt: string;
  _count: {
    scans: number;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [qrcodes, setQrcodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchQRCodes();
    }
  }, [session]);

  const fetchQRCodes = async () => {
    try {
      const res = await fetch("/api/qrcodes", {
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
      setQrcodes(data);
    } catch (error) {
      console.error("Error fetching QR codes:", error);
    } finally {
      setLoading(false);
    }
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
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              QR Generator
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
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
        {/* Title */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Mes QR Codes
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gérez et suivez vos QR codes
            </p>
          </div>
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
                    <Badge variant="secondary" className="shrink-0">
                      {qr._count.scans} scans
                    </Badge>
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
