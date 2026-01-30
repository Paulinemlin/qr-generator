"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CSVRow {
  name: string;
  type: string;
  targetUrl: string;
  foregroundColor?: string;
  backgroundColor?: string;
  size?: string;
}

interface ImportError {
  line: number;
  error: string;
}

interface ImportResult {
  created: number;
  errors: ImportError[];
}

interface UserInfo {
  plan: "FREE" | "PRO" | "BUSINESS";
}

export default function ImportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CSVRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchUserInfo();
    }
  }, [session]);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("/api/user/plan", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      }
    } catch (error) {
      console.error("Erreur lors de la recuperation du plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = useCallback((content: string): CSVRow[] => {
    const lines = content.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length < 2) {
      throw new Error("Le fichier CSV doit contenir au moins une ligne de donnees");
    }

    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
    const requiredColumns = ["name", "type", "targeturl"];
    const missingColumns = requiredColumns.filter((col) => !headers.includes(col));

    if (missingColumns.length > 0) {
      throw new Error(`Colonnes manquantes: ${missingColumns.join(", ")}`);
    }

    const rows: CSVRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        if (values[index] !== undefined) {
          row[header] = values[index];
        }
      });

      rows.push({
        name: row.name || "",
        type: row.type || "url",
        targetUrl: row.targeturl || row.targetUrl || "",
        foregroundColor: row.foregroundcolor || row.foregroundColor,
        backgroundColor: row.backgroundcolor || row.backgroundColor,
        size: row.size,
      });
    }

    return rows;
  }, []);

  const handleFile = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setParseError(null);
    setResult(null);

    try {
      const content = await selectedFile.text();
      const rows = parseCSV(content);
      setPreview(rows);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : "Erreur lors de l'analyse du fichier");
      setPreview([]);
    }
  }, [parseCSV]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".csv") || droppedFile.type === "text/csv") {
        handleFile(droppedFile);
      } else {
        setParseError("Veuillez deposer un fichier CSV");
      }
    }
  }, [handleFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/qrcodes/import/csv", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setParseError(data.error || "Erreur lors de l'import");
        return;
      }

      setResult(data);
    } catch (error) {
      setParseError("Erreur lors de l'import");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    window.location.href = "/api/qrcodes/template";
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

  // Verifier si l'utilisateur a acces a cette fonctionnalite
  if (userInfo?.plan === "FREE") {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight">QR Generator</span>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Retour au dashboard</Button>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-6 py-12">
          <Card className="border-0 bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Fonctionnalite Premium</h2>
              <p className="text-muted-foreground text-center mb-6 max-w-sm">
                L'import/export CSV en masse est reserve aux plans Pro et Business.
              </p>
              <Link href="/pricing">
                <Button>Passer au plan Pro</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">QR Generator</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">Retour au dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Import CSV</h1>
          <p className="mt-1 text-muted-foreground">
            Importez plusieurs QR codes en une seule fois via un fichier CSV
          </p>
        </div>

        {/* Result Banner */}
        {result && (
          <Card className={`mb-8 border-0 ${result.errors.length === 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${result.errors.length === 0 ? 'bg-green-100 dark:bg-green-800' : 'bg-yellow-100 dark:bg-yellow-800'}`}>
                  {result.errors.length === 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 dark:text-yellow-400">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${result.errors.length === 0 ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'}`}>
                    Import termine
                  </h3>
                  <p className={`text-sm ${result.errors.length === 0 ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                    {result.created} QR code(s) cree(s) avec succes
                    {result.errors.length > 0 && `, ${result.errors.length} erreur(s)`}
                  </p>

                  {result.errors.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Erreurs :</p>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 max-h-40 overflow-y-auto">
                        {result.errors.map((err, i) => (
                          <li key={i} className="flex gap-2">
                            <Badge variant="outline" className="shrink-0">Ligne {err.line}</Badge>
                            <span>{err.error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4">
                    <Link href="/dashboard">
                      <Button size="sm">Voir mes QR codes</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Drop Zone */}
          <div className="md:col-span-2">
            <Card className="border-0 bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Fichier CSV</CardTitle>
                <CardDescription>
                  Deposez votre fichier CSV ou cliquez pour le selectionner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" x2="12" y1="3" y2="15" />
                      </svg>
                    </div>
                    {file ? (
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} Ko - {preview.length} ligne(s)
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Deposez votre fichier CSV ici</p>
                        <p className="text-sm text-muted-foreground">ou cliquez pour parcourir</p>
                      </div>
                    )}
                  </div>
                </div>

                {parseError && (
                  <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{parseError}</p>
                  </div>
                )}

                {/* Preview */}
                {preview.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Apercu ({preview.length} QR codes)</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium">#</th>
                              <th className="px-4 py-2 text-left font-medium">Nom</th>
                              <th className="px-4 py-2 text-left font-medium">Type</th>
                              <th className="px-4 py-2 text-left font-medium">URL</th>
                              <th className="px-4 py-2 text-left font-medium">Couleurs</th>
                            </tr>
                          </thead>
                          <tbody>
                            {preview.slice(0, 10).map((row, i) => (
                              <tr key={i} className="border-t">
                                <td className="px-4 py-2 text-muted-foreground">{i + 1}</td>
                                <td className="px-4 py-2">{row.name || <span className="text-destructive">Manquant</span>}</td>
                                <td className="px-4 py-2">
                                  <Badge variant="secondary">{row.type || "url"}</Badge>
                                </td>
                                <td className="px-4 py-2 max-w-[200px] truncate">
                                  {row.targetUrl || <span className="text-destructive">Manquant</span>}
                                </td>
                                <td className="px-4 py-2">
                                  <div className="flex items-center gap-1">
                                    <div
                                      className="w-5 h-5 rounded border"
                                      style={{ backgroundColor: row.foregroundColor || "#000000" }}
                                      title={`Premier plan: ${row.foregroundColor || "#000000"}`}
                                    />
                                    <div
                                      className="w-5 h-5 rounded border"
                                      style={{ backgroundColor: row.backgroundColor || "#ffffff" }}
                                      title={`Arriere-plan: ${row.backgroundColor || "#ffffff"}`}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {preview.length > 10 && (
                        <div className="px-4 py-2 bg-muted/50 text-sm text-muted-foreground text-center">
                          ... et {preview.length - 10} autre(s) ligne(s)
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Button onClick={handleImport} disabled={importing}>
                        {importing ? (
                          <>
                            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Import en cours...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" x2="12" y1="3" y2="15" />
                            </svg>
                            Importer {preview.length} QR code(s)
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={() => { setFile(null); setPreview([]); setResult(null); }}>
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Help Panel */}
          <div className="space-y-6">
            <Card className="border-0 bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Template CSV</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Telechargez un template CSV avec des exemples pour vous aider a formater vos donnees.
                </p>
                <Button variant="outline" className="w-full" onClick={downloadTemplate}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Telecharger le template
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Format attendu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Colonnes requises</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li><code className="bg-muted px-1 rounded">name</code> - Nom du QR code</li>
                    <li><code className="bg-muted px-1 rounded">type</code> - Type (url, wifi, etc.)</li>
                    <li><code className="bg-muted px-1 rounded">targetUrl</code> - URL cible</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-1">Colonnes optionnelles</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li><code className="bg-muted px-1 rounded">foregroundColor</code> - Couleur (#000000)</li>
                    <li><code className="bg-muted px-1 rounded">backgroundColor</code> - Fond (#ffffff)</li>
                    <li><code className="bg-muted px-1 rounded">size</code> - Taille (100-2000)</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-1">Limites</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Plan Pro : 50 QR codes par import</li>
                    <li>Plan Business : 100 QR codes par import</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Parse une ligne CSV en tenant compte des guillemets
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}
