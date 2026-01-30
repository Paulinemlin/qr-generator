"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CustomDomain {
  id: string;
  domain: string;
  verified: boolean;
  verificationToken: string;
  verifiedAt: string | null;
  createdAt: string;
  _count: {
    qrcodes: number;
  };
}

interface VerificationInstructions {
  txt: {
    type: string;
    host: string;
    value: string;
    description: string;
  };
  cname: {
    type: string;
    host: string;
    value: string;
    description: string;
  };
}

export default function DomainsSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [addingDomain, setAddingDomain] = useState(false);
  const [verifyingDomain, setVerifyingDomain] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<{
    [key: string]: VerificationInstructions;
  }>({});
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  const fetchDomains = useCallback(async () => {
    try {
      const res = await fetch("/api/domains", {
        credentials: "include",
      });

      if (res.status === 403) {
        // L'utilisateur n'a pas le plan BUSINESS
        setError("Les domaines personnalises sont reserves au plan Business.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Erreur lors de la recuperation des domaines");
      }

      const data = await res.json();
      setDomains(data.domains);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la recuperation des domaines");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchDomains();
    }
  }, [session, fetchDomains]);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setAddingDomain(true);

    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomain }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess("Domaine ajoute avec succes !");
      setNewDomain("");
      await fetchDomains();

      // Recuperer les instructions pour le nouveau domaine
      await fetchInstructions(data.domain.id);
      setExpandedDomain(data.domain.id);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'ajout du domaine");
    } finally {
      setAddingDomain(false);
    }
  };

  const fetchInstructions = async (domainId: string) => {
    try {
      const res = await fetch(`/api/domains/verify/${domainId}`, {
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();
      setInstructions((prev) => ({
        ...prev,
        [domainId]: data.instructions,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    setError("");
    setSuccess("");
    setVerifyingDomain(domainId);

    try {
      const res = await fetch(`/api/domains/verify/${domainId}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data.verified) {
        setSuccess(data.message);
        await fetchDomains();
      } else {
        setError(data.message);
        // Mettre a jour les instructions
        if (data.instructions) {
          setInstructions((prev) => ({
            ...prev,
            [domainId]: data.instructions,
          }));
        }
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la verification du domaine");
    } finally {
      setVerifyingDomain(null);
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    if (!confirm("Etes-vous sur de vouloir supprimer ce domaine ?")) return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/domains?id=${domainId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }

      setSuccess("Domaine supprime avec succes");
      await fetchDomains();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression du domaine");
    }
  };

  const toggleExpanded = async (domainId: string) => {
    if (expandedDomain === domainId) {
      setExpandedDomain(null);
    } else {
      setExpandedDomain(domainId);
      if (!instructions[domainId]) {
        await fetchInstructions(domainId);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Copie dans le presse-papiers !");
    setTimeout(() => setSuccess(""), 2000);
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

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Domaines personnalises
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configurez vos propres domaines pour les redirections de QR codes
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-lg bg-green-100 dark:bg-green-900/20 p-4 text-sm text-green-700 dark:text-green-400">
            {success}
          </div>
        )}

        {/* Ajouter un domaine */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ajouter un domaine</CardTitle>
            <CardDescription>
              Ajoutez votre propre domaine pour personnaliser les URLs de vos QR codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddDomain} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="domain" className="sr-only">
                  Domaine
                </Label>
                <Input
                  id="domain"
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="exemple.com"
                  className="h-11"
                  required
                />
              </div>
              <Button type="submit" disabled={addingDomain} className="h-11">
                {addingDomain ? (
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
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
                ) : (
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
                )}
                Ajouter
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Liste des domaines */}
        <Card>
          <CardHeader>
            <CardTitle>Vos domaines</CardTitle>
            <CardDescription>
              Gerez vos domaines personnalises et leur verification DNS
            </CardDescription>
          </CardHeader>
          <CardContent>
            {domains.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
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
                  className="mx-auto mb-4 text-muted-foreground/50"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" x2="22" y1="12" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <p>Aucun domaine configure</p>
                <p className="text-sm mt-1">
                  Ajoutez votre premier domaine pour commencer
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div
                    key={domain.id}
                    className="border rounded-lg p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{domain.domain}</span>
                            <Badge
                              variant={domain.verified ? "default" : "secondary"}
                              className={
                                domain.verified
                                  ? "bg-green-500 hover:bg-green-600"
                                  : ""
                              }
                            >
                              {domain.verified ? "Verifie" : "Non verifie"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {domain._count.qrcodes} QR code(s) associe(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!domain.verified && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerifyDomain(domain.id)}
                            disabled={verifyingDomain === domain.id}
                          >
                            {verifyingDomain === domain.id ? (
                              <svg
                                className="animate-spin h-4 w-4"
                                viewBox="0 0 24 24"
                              >
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
                            ) : (
                              "Verifier"
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(domain.id)}
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
                            className={`transition-transform ${
                              expandedDomain === domain.id ? "rotate-180" : ""
                            }`}
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDomain(domain.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
                      </div>
                    </div>

                    {/* Instructions DNS */}
                    {expandedDomain === domain.id && instructions[domain.id] && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-3">
                          Instructions de configuration DNS
                        </h4>
                        <div className="space-y-4">
                          {/* Enregistrement TXT */}
                          <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                Enregistrement TXT (verification)
                              </span>
                              <Badge variant="outline">Requis</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              {instructions[domain.id].txt.description}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Type:
                                </span>
                                <span className="ml-2 font-mono">TXT</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Host:
                                </span>
                                <span className="ml-2 font-mono">@</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-sm text-muted-foreground">
                                Valeur:
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="flex-1 bg-background p-2 rounded text-xs font-mono break-all">
                                  {instructions[domain.id].txt.value}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    copyToClipboard(
                                      instructions[domain.id].txt.value
                                    )
                                  }
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
                                    <rect
                                      width="14"
                                      height="14"
                                      x="8"
                                      y="8"
                                      rx="2"
                                      ry="2"
                                    />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Enregistrement CNAME */}
                          <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                Enregistrement CNAME (redirections)
                              </span>
                              <Badge variant="outline">Recommande</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              {instructions[domain.id].cname.description}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Type:
                                </span>
                                <span className="ml-2 font-mono">CNAME</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Host:
                                </span>
                                <span className="ml-2 font-mono">@</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-sm text-muted-foreground">
                                Valeur:
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="flex-1 bg-background p-2 rounded text-xs font-mono">
                                  {instructions[domain.id].cname.value}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    copyToClipboard(
                                      instructions[domain.id].cname.value
                                    )
                                  }
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
                                    <rect
                                      width="14"
                                      height="14"
                                      x="8"
                                      y="8"
                                      rx="2"
                                      ry="2"
                                    />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-foreground mb-2">
                              Note importante
                            </p>
                            <p>
                              La propagation DNS peut prendre jusqu&apos;a 48 heures.
                              Si la verification echoue, reessayez plus tard.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
