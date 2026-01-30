"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ApiKey {
  id: string;
  name: string;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
}

interface NewApiKey extends ApiKey {
  key: string;
  message: string;
}

export default function ApiKeysPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyExpiry, setNewKeyExpiry] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<NewApiKey | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchApiKeys();
    }
  }, [session]);

  const fetchApiKeys = async () => {
    try {
      const res = await fetch("/api/keys", { credentials: "include" });
      if (!res.ok) {
        if (res.status === 403) {
          setError("L'accès API nécessite un abonnement Business.");
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch");
      }
      const data = await res.json();
      setApiKeys(data.apiKeys);
      setError(null);
    } catch (err) {
      console.error("Error fetching API keys:", err);
      setError("Erreur lors du chargement des clés API");
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: newKeyName.trim(),
          expiresAt: newKeyExpiry || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la création");
        return;
      }

      const data: NewApiKey = await res.json();
      setNewlyCreatedKey(data);
      setApiKeys([{ id: data.id, name: data.name, createdAt: data.createdAt, lastUsedAt: null, expiresAt: data.expiresAt }, ...apiKeys]);
      setNewKeyName("");
      setNewKeyExpiry("");
      setShowCreateForm(false);
    } catch (err) {
      console.error("Error creating API key:", err);
      setError("Erreur lors de la création de la clé API");
    } finally {
      setCreating(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette clé API ?")) return;

    try {
      const res = await fetch(`/api/keys/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      setApiKeys(apiKeys.filter((key) => key.id !== id));
    } catch (err) {
      console.error("Error deleting API key:", err);
      setError("Erreur lors de la suppression de la clé API");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-foreground" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
            <span className="text-xl font-semibold tracking-tight">QR Generator</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <Link href="/docs/api">
              <Button variant="ghost" size="sm">
                Documentation API
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Title */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Clés API</h1>
            <p className="mt-1 text-muted-foreground">
              Gérez vos clés d'accès à l'API QR Generator
            </p>
          </div>
          {!error?.includes("Business") && (
            <Button onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Nouvelle clé API
            </Button>
          )}
        </div>

        {/* Error message for non-Business users */}
        {error?.includes("Business") && (
          <Card className="mb-8 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600 dark:text-orange-400">
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                    <path d="M3.586 20.414A2 2 0 0 0 5.414 21h13.172a2 2 0 0 0 1.414-.586l.121-.121a2 2 0 0 0 .464-2.112L13.88 3.37a2 2 0 0 0-3.76 0L3.414 18.181a2 2 0 0 0 .172 2.233z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                    Accès API réservé au plan Business
                  </h3>
                  <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                    L'accès à l'API programmable nécessite un abonnement Business. Passez au plan Business pour créer des clés API et intégrer QR Generator dans vos applications.
                  </p>
                  <Link href="/pricing" className="mt-4 inline-block">
                    <Button size="sm">
                      Voir les plans
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Newly created key alert */}
        {newlyCreatedKey && (
          <Card className="mb-8 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    Clé API créée avec succès
                  </h3>
                  <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                    Conservez cette clé en lieu sûr. Elle ne sera plus affichée.
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <code className="flex-1 rounded-md bg-green-100 dark:bg-green-800 px-3 py-2 font-mono text-sm text-green-800 dark:text-green-200 overflow-x-auto">
                      {newlyCreatedKey.key}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(newlyCreatedKey.key)}
                      className="shrink-0"
                    >
                      {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => setNewlyCreatedKey(null)}
                  className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create form */}
        {showCreateForm && !error?.includes("Business") && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Créer une nouvelle clé API</h2>
              <form onSubmit={createApiKey} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Nom de la clé</Label>
                  <Input
                    id="keyName"
                    type="text"
                    placeholder="Ex: Production, Development, Mobile App..."
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keyExpiry">Date d'expiration (optionnel)</Label>
                  <Input
                    id="keyExpiry"
                    type="datetime-local"
                    value={newKeyExpiry}
                    onChange={(e) => setNewKeyExpiry(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Laissez vide pour une clé sans expiration.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={creating || !newKeyName.trim()}>
                    {creating ? "Création..." : "Créer la clé"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewKeyName("");
                      setNewKeyExpiry("");
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Error message */}
        {error && !error.includes("Business") && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* API Keys list */}
        {!error?.includes("Business") && (
          <>
            {apiKeys.length === 0 ? (
              <Card className="border-0 bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-background">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Aucune clé API</h2>
                  <p className="text-muted-foreground text-center mb-6 max-w-sm">
                    Créez votre première clé API pour commencer à intégrer QR Generator dans vos applications.
                  </p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    Créer une clé API
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <Card key={apiKey.id} className="border-0 bg-card shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{apiKey.name}</h3>
                            {apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date() && (
                              <Badge variant="destructive">Expirée</Badge>
                            )}
                            {apiKey.expiresAt && new Date(apiKey.expiresAt) > new Date() && (
                              <Badge variant="secondary">Expire le {new Date(apiKey.expiresAt).toLocaleDateString("fr-FR")}</Badge>
                            )}
                            {!apiKey.expiresAt && (
                              <Badge variant="outline">Sans expiration</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Créée le {formatDate(apiKey.createdAt)}</p>
                            {apiKey.lastUsedAt && (
                              <p>Dernière utilisation : {formatDate(apiKey.lastUsedAt)}</p>
                            )}
                            {!apiKey.lastUsedAt && (
                              <p>Jamais utilisée</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteApiKey(apiKey.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          </>
        )}

        {/* Quick documentation link */}
        {!error?.includes("Business") && (
          <Card className="mt-8 border-0 bg-muted/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Documentation API</h3>
                  <p className="text-sm text-muted-foreground">
                    Consultez la documentation complète pour intégrer l'API dans vos applications.
                  </p>
                </div>
                <Link href="/docs/api">
                  <Button variant="outline">
                    Voir la documentation
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
