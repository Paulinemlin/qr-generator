"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ABVariant {
  id: string;
  url: string;
  weight: number;
  name: string;
  scans?: number;
  pourcentage?: number;
}

interface ABTest {
  id: string;
  qrcodeId: string;
  variants: ABVariant[];
  isActive: boolean;
  createdAt: string;
}

interface QRCodeInfo {
  id: string;
  name: string;
  targetUrl: string;
}

export default function ABTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [qrcode, setQrcode] = useState<QRCodeInfo | null>(null);
  const [abTest, setAbTest] = useState<ABTest | null>(null);
  const [variants, setVariants] = useState<ABVariant[]>([
    { id: "", url: "", weight: 50, name: "Variante A" },
    { id: "", url: "", weight: 50, name: "Variante B" },
  ]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && params.id) {
      fetchData();
    }
  }, [session, params.id]);

  const fetchData = async () => {
    try {
      // Recuperer les infos du QR code
      const qrRes = await fetch(`/api/qrcodes/${params.id}`, { credentials: "include" });
      if (!qrRes.ok) {
        router.push("/dashboard");
        return;
      }
      const qrData = await qrRes.json();
      setQrcode(qrData);

      // Recuperer le test A/B existant
      const abRes = await fetch(`/api/qrcodes/${params.id}/ab-test`, { credentials: "include" });
      if (abRes.ok) {
        const abData = await abRes.json();
        if (abData.abTest) {
          setAbTest(abData.abTest);
          setVariants(abData.abTest.variants);
          setIsActive(abData.abTest.isActive);
        } else {
          // Initialiser avec l'URL actuelle comme variante A
          setVariants([
            { id: "", url: qrData.targetUrl, weight: 50, name: "Variante A (originale)" },
            { id: "", url: "", weight: 50, name: "Variante B" },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    const letter = String.fromCharCode(65 + variants.length); // A, B, C, ...
    setVariants([
      ...variants,
      { id: "", url: "", weight: 0, name: `Variante ${letter}` },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 2) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof ABVariant, value: string | number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const equalizeWeights = () => {
    const equalWeight = Math.floor(100 / variants.length);
    const remainder = 100 - equalWeight * variants.length;
    setVariants(
      variants.map((v, i) => ({
        ...v,
        weight: equalWeight + (i === 0 ? remainder : 0),
      }))
    );
  };

  const getTotalWeight = () => variants.reduce((sum, v) => sum + v.weight, 0);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    // Validation
    const totalWeight = getTotalWeight();
    if (totalWeight !== 100) {
      setError(`Le total des poids doit etre de 100% (actuellement ${totalWeight}%)`);
      setSaving(false);
      return;
    }

    for (const variant of variants) {
      if (!variant.url.trim()) {
        setError("Toutes les variantes doivent avoir une URL");
        setSaving(false);
        return;
      }
      if (!variant.name.trim()) {
        setError("Toutes les variantes doivent avoir un nom");
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch(`/api/qrcodes/${params.id}/ab-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variants, isActive }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requiresUpgrade) {
          setRequiresUpgrade(true);
        }
        setError(data.error);
        return;
      }

      setAbTest(data);
      setSuccess("Test A/B enregistre avec succes");
    } catch {
      setError("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Etes-vous sur de vouloir supprimer ce test A/B ?")) return;

    try {
      const res = await fetch(`/api/qrcodes/${params.id}/ab-test`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setAbTest(null);
        setVariants([
          { id: "", url: qrcode?.targetUrl || "", weight: 50, name: "Variante A (originale)" },
          { id: "", url: "", weight: 50, name: "Variante B" },
        ]);
        setSuccess("Test A/B supprime");
      }
    } catch {
      setError("Erreur lors de la suppression");
    }
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
          <Link href={`/qrcode/${params.id}`}>
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
              Retour au QR Code
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Test A/B
            </h1>
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Actif" : "Inactif"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Configurez plusieurs URLs pour tester differentes versions de votre page de destination.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            QR Code: <span className="font-medium">{qrcode.name}</span>
          </p>
        </div>

        {requiresUpgrade && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
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
                    className="text-orange-600"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900">Fonctionnalite Pro</h3>
                  <p className="text-sm text-orange-800 mt-1">
                    Le test A/B est disponible avec les plans Pro et Business.
                    Passez a un plan superieur pour utiliser cette fonctionnalite.
                  </p>
                  <Link href="/pricing">
                    <Button size="sm" className="mt-3">
                      Voir les plans
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && !requiresUpgrade && (
          <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Variantes */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Variantes</CardTitle>
                  <CardDescription>
                    Definissez les differentes URLs a tester et leur poids de distribution.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={equalizeWeights}>
                  Egaliser les poids
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="space-y-3 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">
                      {variant.name}
                      {variant.scans !== undefined && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          ({variant.scans} scans - {variant.pourcentage}%)
                        </span>
                      )}
                    </Label>
                    {variants.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="text-destructive hover:text-destructive"
                      >
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
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-1">
                      <Label htmlFor={`name-${index}`} className="text-sm">Nom</Label>
                      <Input
                        id={`name-${index}`}
                        value={variant.name}
                        onChange={(e) => updateVariant(index, "name", e.target.value)}
                        placeholder="Nom de la variante"
                        className="h-10 mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`url-${index}`} className="text-sm">URL</Label>
                      <Input
                        id={`url-${index}`}
                        type="url"
                        value={variant.url}
                        onChange={(e) => updateVariant(index, "url", e.target.value)}
                        placeholder="https://exemple.com/page"
                        className="h-10 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`weight-${index}`} className="text-sm">Poids (%)</Label>
                      <Input
                        id={`weight-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        value={variant.weight}
                        onChange={(e) => updateVariant(index, "weight", parseInt(e.target.value) || 0)}
                        className="h-10 mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={addVariant}>
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
                  Ajouter une variante
                </Button>

                <div className="text-sm">
                  Total:{" "}
                  <span className={getTotalWeight() === 100 ? "text-green-600 font-medium" : "text-destructive font-medium"}>
                    {getTotalWeight()}%
                  </span>
                  {getTotalWeight() !== 100 && (
                    <span className="text-muted-foreground ml-1">(doit etre 100%)</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="isActive" className="font-normal">
                  Activer le test A/B
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Lorsque desactive, le QR code redirigera vers l&apos;URL par defaut du QR code.
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <Separator />

          <div className="flex items-center justify-between">
            {abTest && (
              <Button variant="destructive" onClick={handleDelete}>
                Supprimer le test A/B
              </Button>
            )}
            <div className="flex gap-3 ml-auto">
              <Link href={`/qrcode/${params.id}`}>
                <Button variant="outline">Annuler</Button>
              </Link>
              <Button onClick={handleSave} disabled={saving || requiresUpgrade}>
                {saving ? (
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
                    Enregistrement...
                  </span>
                ) : (
                  "Enregistrer le test A/B"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
