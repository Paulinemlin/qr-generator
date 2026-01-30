"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface QRCodeInfo {
  id: string;
  name: string;
  isPasswordProtected: boolean;
  isActive: boolean;
  isUnlocked: boolean;
}

export default function UnlockPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [qrcodeInfo, setQrcodeInfo] = useState<QRCodeInfo | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  useEffect(() => {
    fetchQRCodeInfo();
  }, [id]);

  const fetchQRCodeInfo = async () => {
    try {
      const res = await fetch(`/api/qrcodes/${id}/unlock`);
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          router.push("/");
          return;
        }
        setError(data.error || "Erreur lors du chargement");
        setLoading(false);
        return;
      }

      setQrcodeInfo(data);

      // Si deja deverrouille, rediriger vers le QR code
      if (data.isUnlocked) {
        router.push(`/r/${id}`);
        return;
      }

      // Si pas protege par mot de passe, rediriger
      if (!data.isPasswordProtected) {
        router.push(`/r/${id}`);
        return;
      }

      // Si inactif, rediriger vers expired
      if (!data.isActive) {
        router.push("/expired");
        return;
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/qrcodes/${id}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError("Trop de tentatives. Veuillez reessayer dans une minute.");
          setRemainingAttempts(0);
        } else if (res.status === 401) {
          setError("Mot de passe incorrect");
          setRemainingAttempts(data.remainingAttempts);
        } else {
          setError(data.error || "Erreur lors de la verification");
        }
        return;
      }

      // Succes ! Rediriger vers la destination
      if (data.targetUrl) {
        window.location.href = data.targetUrl;
      } else {
        router.push(`/r/${id}`);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur de connexion");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <CardTitle className="text-2xl">Contenu protege</CardTitle>
          {qrcodeInfo && (
            <p className="text-lg text-muted-foreground mt-2">
              {qrcodeInfo.name}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Ce QR code est protege par un mot de passe. Veuillez saisir le mot de passe pour acceder au contenu.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive text-center">
                {error}
                {remainingAttempts !== null && remainingAttempts > 0 && (
                  <span className="block mt-1 text-xs">
                    Tentatives restantes : {remainingAttempts}
                  </span>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                required
                autoFocus
                className="h-11"
                disabled={submitting || remainingAttempts === 0}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={submitting || !password || remainingAttempts === 0}
            >
              {submitting ? (
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
                  Verification...
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
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </svg>
                  Deverrouiller
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button variant="link" className="text-muted-foreground">
              Retour a l&apos;accueil
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
