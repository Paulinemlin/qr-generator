"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ShortLink {
  id: string;
  shortCode: string;
  targetUrl: string;
  title: string | null;
  isActive: boolean;
  isPasswordProtected: boolean;
  expiresAt: string | null;
  maxClicks: number | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
  _count: {
    clicks: number;
  };
}

interface UserPlan {
  plan: "FREE" | "PRO" | "BUSINESS";
}

export default function LinksPage() {
  const router = useRouter();
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    targetUrl: "",
    title: "",
    customCode: "",
    useCustomCode: false,
    expiresAt: "",
    maxClicks: "",
    password: "",
    usePassword: false,
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    showUtm: false,
  });

  useEffect(() => {
    fetchLinks();
    fetchUserPlan();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPlan = async () => {
    try {
      const res = await fetch("/api/user/plan");
      if (res.ok) {
        const data = await res.json();
        setUserPlan(data);
      }
    } catch (error) {
      console.error("Error fetching user plan:", error);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const body: Record<string, unknown> = {
        targetUrl: formData.targetUrl,
      };

      if (formData.title) body.title = formData.title;
      if (formData.useCustomCode && formData.customCode) {
        body.customCode = formData.customCode;
      }
      if (formData.expiresAt) body.expiresAt = formData.expiresAt;
      if (formData.maxClicks) body.maxClicks = parseInt(formData.maxClicks);
      if (formData.usePassword && formData.password) {
        body.password = formData.password;
      }
      if (formData.utmSource) body.utmSource = formData.utmSource;
      if (formData.utmMedium) body.utmMedium = formData.utmMedium;
      if (formData.utmCampaign) body.utmCampaign = formData.utmCampaign;

      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsCreateDialogOpen(false);
        setFormData({
          targetUrl: "",
          title: "",
          customCode: "",
          useCustomCode: false,
          expiresAt: "",
          maxClicks: "",
          password: "",
          usePassword: false,
          utmSource: "",
          utmMedium: "",
          utmCampaign: "",
          showUtm: false,
        });
        fetchLinks();
      } else {
        const error = await res.json();
        alert(error.error || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Error creating link:", error);
      alert("Erreur lors de la création");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce lien ?")) return;

    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchLinks();
      }
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        fetchLinks();
      }
    } catch (error) {
      console.error("Error toggling link:", error);
    }
  };

  const copyToClipboard = async (shortCode: string, id: string) => {
    const shortUrl = `${window.location.origin}/l/${shortCode}`;
    await navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getShortUrl = (shortCode: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/l/${shortCode}`;
    }
    return `/l/${shortCode}`;
  };

  // Mode test: toujours afficher les options avancees en dev
  const isTestMode = typeof window !== "undefined" && window.location.hostname === "localhost";
  const isPro = isTestMode || userPlan?.plan === "PRO" || userPlan?.plan === "BUSINESS";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight">
                QR Generator
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                QR Codes
              </Link>
              <Link
                href="/links"
                className="px-3 py-2 text-sm font-medium rounded-md bg-accent text-accent-foreground"
              >
                Liens courts
              </Link>
              <Link
                href="/teams"
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                Équipes
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline">{userPlan?.plan || "FREE"}</Badge>
            <Link href="/pricing">
              <Button variant="ghost" size="sm">
                Upgrade
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Liens courts</h1>
            <p className="mt-1 text-muted-foreground">
              Créez et gérez vos liens raccourcis
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nouveau lien
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer un lien court</DialogTitle>
                <DialogDescription>
                  Raccourcissez une URL longue en quelques secondes
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateLink} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="targetUrl">URL de destination *</Label>
                  <Input
                    id="targetUrl"
                    type="url"
                    placeholder="https://example.com/ma-page-tres-longue"
                    value={formData.targetUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, targetUrl: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Titre (optionnel)</Label>
                  <Input
                    id="title"
                    placeholder="Mon lien marketing"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                {/* Custom code - PRO only */}
                {isPro && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="useCustomCode">Code personnalisé</Label>
                      <Switch
                        id="useCustomCode"
                        checked={formData.useCustomCode}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, useCustomCode: checked })
                        }
                      />
                    </div>
                    {formData.useCustomCode && (
                      <Input
                        placeholder="mon-code"
                        value={formData.customCode}
                        onChange={(e) =>
                          setFormData({ ...formData, customCode: e.target.value })
                        }
                      />
                    )}
                  </div>
                )}

                {/* Expiration - PRO only */}
                {isPro && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiresAt">Date d&apos;expiration</Label>
                      <Input
                        id="expiresAt"
                        type="datetime-local"
                        value={formData.expiresAt}
                        onChange={(e) =>
                          setFormData({ ...formData, expiresAt: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxClicks">Clics maximum</Label>
                      <Input
                        id="maxClicks"
                        type="number"
                        min="1"
                        placeholder="Illimité"
                        value={formData.maxClicks}
                        onChange={(e) =>
                          setFormData({ ...formData, maxClicks: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Password protection - PRO only */}
                {isPro && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="usePassword">Protection par mot de passe</Label>
                      <Switch
                        id="usePassword"
                        checked={formData.usePassword}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, usePassword: checked })
                        }
                      />
                    </div>
                    {formData.usePassword && (
                      <Input
                        type="password"
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    )}
                  </div>
                )}

                {/* UTM Parameters */}
                <div className="space-y-3">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      setFormData({ ...formData, showUtm: !formData.showUtm })
                    }
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        formData.showUtm ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Paramètres UTM
                  </button>
                  {formData.showUtm && (
                    <div className="space-y-3 pl-6">
                      <div className="space-y-2">
                        <Label htmlFor="utmSource">utm_source</Label>
                        <Input
                          id="utmSource"
                          placeholder="newsletter"
                          value={formData.utmSource}
                          onChange={(e) =>
                            setFormData({ ...formData, utmSource: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="utmMedium">utm_medium</Label>
                        <Input
                          id="utmMedium"
                          placeholder="email"
                          value={formData.utmMedium}
                          onChange={(e) =>
                            setFormData({ ...formData, utmMedium: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="utmCampaign">utm_campaign</Label>
                        <Input
                          id="utmCampaign"
                          placeholder="summer_sale"
                          value={formData.utmCampaign}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              utmCampaign: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? "Création..." : "Créer le lien"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total liens</CardDescription>
              <CardTitle className="text-3xl">{links.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total clics</CardDescription>
              <CardTitle className="text-3xl">
                {links.reduce((acc, link) => acc + link._count.clicks, 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Liens actifs</CardDescription>
              <CardTitle className="text-3xl">
                {links.filter((l) => l.isActive).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Links list */}
        {links.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Aucun lien court</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre premier lien court pour commencer
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Créer un lien
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <Card key={link.id} className={!link.isActive ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">
                          {link.title || link.targetUrl}
                        </h3>
                        {!link.isActive && (
                          <Badge variant="secondary">Inactif</Badge>
                        )}
                        {link.isPasswordProtected && (
                          <Badge variant="outline">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                            Protégé
                          </Badge>
                        )}
                        {link.expiresAt && (
                          <Badge variant="outline">
                            Expire le{" "}
                            {new Date(link.expiresAt).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <a
                          href={getShortUrl(link.shortCode)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-mono"
                        >
                          {getShortUrl(link.shortCode)}
                        </a>
                        <button
                          onClick={() => copyToClipboard(link.shortCode, link.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {copiedId === link.id ? (
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>

                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        → {link.targetUrl}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {link._count.clicks}
                        </div>
                        <div className="text-xs text-muted-foreground">clics</div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => copyToClipboard(link.shortCode, link.id)}
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Copier le lien
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(getShortUrl(link.shortCode), "_blank")
                            }
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            Ouvrir le lien
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/links/${link.id}`)}
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                            Voir les stats
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleActive(link.id, link.isActive)
                            }
                          >
                            {link.isActive ? (
                              <>
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                  />
                                </svg>
                                Désactiver
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Activer
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteLink(link.id)}
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upgrade CTA for FREE users */}
        {userPlan?.plan === "FREE" && (
          <Card className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">
                    Débloquez plus de fonctionnalités
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Codes personnalisés, expiration, protection par mot de passe,
                    et plus encore avec le plan Pro.
                  </p>
                </div>
                <Link href="/pricing">
                  <Button>Passer à Pro</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
