"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface LinkClick {
  id: string;
  userAgent: string | null;
  ip: string | null;
  country: string | null;
  referer: string | null;
  clickedAt: string;
}

interface ShortLinkDetail {
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
  clicks: LinkClick[];
  _count: {
    clicks: number;
  };
}

export default function LinkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [link, setLink] = useState<ShortLinkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Edit form state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    targetUrl: "",
    isActive: true,
    expiresAt: "",
    maxClicks: "",
  });

  useEffect(() => {
    fetchLink();
  }, [id]);

  const fetchLink = async () => {
    try {
      const res = await fetch(`/api/links/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLink(data);
        setFormData({
          title: data.title || "",
          targetUrl: data.targetUrl,
          isActive: data.isActive,
          expiresAt: data.expiresAt
            ? new Date(data.expiresAt).toISOString().slice(0, 16)
            : "",
          maxClicks: data.maxClicks?.toString() || "",
        });
      } else {
        router.push("/links");
      }
    } catch (error) {
      console.error("Error fetching link:", error);
      router.push("/links");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        title: formData.title || null,
        targetUrl: formData.targetUrl,
        isActive: formData.isActive,
        expiresAt: formData.expiresAt || null,
        maxClicks: formData.maxClicks ? parseInt(formData.maxClicks) : null,
      };

      const res = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setEditMode(false);
        fetchLink();
      } else {
        const error = await res.json();
        alert(error.error || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Error saving link:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce lien ?")) return;

    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/links");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const copyToClipboard = async () => {
    if (!link) return;
    const shortUrl = `${window.location.origin}/l/${link.shortCode}`;
    await navigator.clipboard.writeText(shortUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const getShortUrl = () => {
    if (!link) return "";
    if (typeof window !== "undefined") {
      return `${window.location.origin}/l/${link.shortCode}`;
    }
    return `/l/${link.shortCode}`;
  };

  // Calculate stats
  const getClicksByCountry = () => {
    if (!link) return [];
    const countries: Record<string, number> = {};
    link.clicks.forEach((click) => {
      const country = click.country || "Inconnu";
      countries[country] = (countries[country] || 0) + 1;
    });
    return Object.entries(countries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const getClicksByReferer = () => {
    if (!link) return [];
    const referers: Record<string, number> = {};
    link.clicks.forEach((click) => {
      const referer = click.referer || "Direct";
      referers[referer] = (referers[referer] || 0) + 1;
    });
    return Object.entries(referers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const getDeviceType = (userAgent: string | null) => {
    if (!userAgent) return "Inconnu";
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
      return "Mobile";
    }
    if (ua.includes("tablet") || ua.includes("ipad")) {
      return "Tablet";
    }
    return "Desktop";
  };

  const getClicksByDevice = () => {
    if (!link) return [];
    const devices: Record<string, number> = {};
    link.clicks.forEach((click) => {
      const device = getDeviceType(click.userAgent);
      devices[device] = (devices[device] || 0) + 1;
    });
    return Object.entries(devices).sort((a, b) => b[1] - a[1]);
  };

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

  if (!link) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/links"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm">Liens courts</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-sm font-medium truncate max-w-[200px]">
              {link.title || link.shortCode}
            </h1>
            {!link.isActive && <Badge variant="secondary">Inactif</Badge>}
          </div>
          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                >
                  Annuler
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditMode(true)}>
                  Modifier
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Supprimer
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Link info card */}
            <Card>
              <CardHeader>
                <CardTitle>Informations du lien</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Mon lien"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetUrl">URL de destination</Label>
                      <Input
                        id="targetUrl"
                        type="url"
                        value={formData.targetUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, targetUrl: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isActive">Lien actif</Label>
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isActive: checked })
                        }
                      />
                    </div>
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
                          value={formData.maxClicks}
                          onChange={(e) =>
                            setFormData({ ...formData, maxClicks: e.target.value })
                          }
                          placeholder="Illimité"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Lien court</p>
                        <a
                          href={getShortUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-mono font-medium"
                        >
                          {getShortUrl()}
                        </a>
                      </div>
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        {copiedUrl ? (
                          <>
                            <svg
                              className="w-4 h-4 mr-2 text-green-600"
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
                            Copié
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
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Copier
                          </>
                        )}
                      </Button>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        URL de destination
                      </p>
                      <a
                        href={link.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:underline break-all"
                      >
                        {link.targetUrl}
                      </a>
                    </div>

                    {(link.utmSource || link.utmMedium || link.utmCampaign) && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Paramètres UTM
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {link.utmSource && (
                            <Badge variant="outline">
                              source: {link.utmSource}
                            </Badge>
                          )}
                          {link.utmMedium && (
                            <Badge variant="outline">
                              medium: {link.utmMedium}
                            </Badge>
                          )}
                          {link.utmCampaign && (
                            <Badge variant="outline">
                              campaign: {link.utmCampaign}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Créé le</p>
                        <p>{new Date(link.createdAt).toLocaleString()}</p>
                      </div>
                      {link.expiresAt && (
                        <div>
                          <p className="text-sm text-muted-foreground">Expire le</p>
                          <p>{new Date(link.expiresAt).toLocaleString()}</p>
                        </div>
                      )}
                      {link.maxClicks && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Clics max
                          </p>
                          <p>
                            {link._count.clicks} / {link.maxClicks}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent clicks */}
            <Card>
              <CardHeader>
                <CardTitle>Clics récents</CardTitle>
                <CardDescription>
                  Les 50 derniers clics sur ce lien
                </CardDescription>
              </CardHeader>
              <CardContent>
                {link.clicks.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucun clic enregistré
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2">Date</th>
                          <th className="text-left py-2 px-2">Pays</th>
                          <th className="text-left py-2 px-2">Appareil</th>
                          <th className="text-left py-2 px-2">Referer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {link.clicks.map((click) => (
                          <tr key={click.id} className="border-b last:border-0">
                            <td className="py-2 px-2">
                              {new Date(click.clickedAt).toLocaleString()}
                            </td>
                            <td className="py-2 px-2">
                              {click.country || "—"}
                            </td>
                            <td className="py-2 px-2">
                              {getDeviceType(click.userAgent)}
                            </td>
                            <td className="py-2 px-2 truncate max-w-[200px]">
                              {click.referer || "Direct"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar stats */}
          <div className="space-y-6">
            {/* Total clicks */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total des clics</CardDescription>
                <CardTitle className="text-4xl">{link._count.clicks}</CardTitle>
              </CardHeader>
            </Card>

            {/* Clicks by country */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Par pays</CardTitle>
              </CardHeader>
              <CardContent>
                {getClicksByCountry().length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune donnée</p>
                ) : (
                  <div className="space-y-2">
                    {getClicksByCountry().map(([country, count]) => (
                      <div
                        key={country}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{country}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Clicks by device */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Par appareil</CardTitle>
              </CardHeader>
              <CardContent>
                {getClicksByDevice().length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune donnée</p>
                ) : (
                  <div className="space-y-2">
                    {getClicksByDevice().map(([device, count]) => (
                      <div
                        key={device}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{device}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Clicks by referer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Par source</CardTitle>
              </CardHeader>
              <CardContent>
                {getClicksByReferer().length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune donnée</p>
                ) : (
                  <div className="space-y-2">
                    {getClicksByReferer().map(([referer, count]) => (
                      <div
                        key={referer}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm truncate max-w-[150px]">
                          {referer}
                        </span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
