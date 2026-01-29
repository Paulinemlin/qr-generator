"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setLogoUrl(data.url);
    } catch {
      setError("Erreur lors de l'upload du logo");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, targetUrl, logoUrl }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Erreur lors de la création du QR code");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
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
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
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

      <main className="mx-auto max-w-xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Créer un QR Code
          </h1>
          <p className="mt-2 text-muted-foreground">
            Générez un QR code personnalisé avec votre logo
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-lg">Informations</CardTitle>
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du QR Code</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ma campagne marketing"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetUrl">URL de destination</Label>
                <Input
                  id="targetUrl"
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  required
                  placeholder="https://www.exemple.com"
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  L&apos;URL vers laquelle les utilisateurs seront redirigés
                </p>
              </div>

              <div className="space-y-2">
                <Label>Logo (optionnel)</Label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="rounded-xl border-2 border-dashed border-border p-6 text-center transition-apple hover:border-foreground/50 hover:bg-muted/50">
                      {logoUrl ? (
                        <div className="flex flex-col items-center">
                          <Image
                            src={logoUrl}
                            alt="Logo"
                            width={80}
                            height={80}
                            className="rounded-lg mb-2"
                          />
                          <span className="text-sm text-muted-foreground">
                            Logo ajouté
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
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
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" x2="12" y1="3" y2="15" />
                            </svg>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {uploading
                              ? "Upload en cours..."
                              : "Cliquez pour ajouter un logo"}
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleLogoUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {logoUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setLogoUrl(null)}
                      className="text-destructive hover:text-destructive"
                    >
                      Supprimer
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG ou WebP. Max 5MB. Le logo sera centré sur le QR code.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full h-11">
                  Annuler
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 h-11"
              >
                {loading ? (
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
                    Création...
                  </span>
                ) : (
                  "Créer le QR Code"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
