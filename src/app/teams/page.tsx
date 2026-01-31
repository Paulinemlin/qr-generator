"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface Team {
  id: string;
  name: string;
  createdAt: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  isOwner: boolean;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  _count: {
    members: number;
    qrcodes: number;
  };
}

const ROLE_LABELS = {
  OWNER: "Proprietaire",
  ADMIN: "Administrateur",
  MEMBER: "Membre",
  VIEWER: "Lecteur",
};

const ROLE_COLORS = {
  OWNER: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  MEMBER: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  VIEWER: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

export default function TeamsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchTeams();
    }
  }, [session]);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams", { credentials: "include" });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          setError(data.error);
        } else {
          throw new Error(data.error);
        }
        return;
      }

      setTeams(data.teams);
    } catch (err) {
      setError("Erreur lors du chargement des equipes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    setCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTeamName.trim() }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setTeams([data, ...teams]);
      setNewTeamName("");
      setShowCreateForm(false);
    } catch (err) {
      setError("Erreur lors de la creation de l'equipe");
    } finally {
      setCreating(false);
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

  if (!session) return null;

  // Afficher un message si l'utilisateur n'a pas le plan Business
  if (error && error.includes("Business")) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-6xl px-6 py-12">
          <Card className="max-w-lg mx-auto border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
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
                  className="text-purple-600 dark:text-purple-400"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <CardTitle>Gestion des equipes</CardTitle>
              <CardDescription>
                Fonctionnalite reservee au plan Business
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                La gestion des equipes vous permet de collaborer avec vos collegues
                sur vos QR codes. Passez au plan Business pour debloquer cette fonctionnalite.
              </p>
              <Link href="/pricing">
                <Button className="mt-4">
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
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Passer au plan Business
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Titre et bouton creation */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Mes equipes
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gerez vos equipes et collaborez sur vos QR codes
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
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
            Nouvelle equipe
          </Button>
        </div>

        {/* Erreur */}
        {error && !error.includes("Business") && (
          <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {/* Formulaire de creation */}
        {showCreateForm && (
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Creer une nouvelle equipe</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTeam} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="teamName" className="sr-only">
                    Nom de l'equipe
                  </Label>
                  <Input
                    id="teamName"
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Nom de l'equipe"
                    className="h-11"
                    maxLength={100}
                    required
                  />
                </div>
                <Button type="submit" disabled={creating || !newTeamName.trim()}>
                  {creating ? (
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
                      Creation...
                    </span>
                  ) : (
                    "Creer"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewTeamName("");
                  }}
                >
                  Annuler
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Liste des equipes */}
        {teams.length === 0 ? (
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Aucune equipe</h2>
              <p className="text-muted-foreground text-center mb-6 max-w-sm">
                Creez votre premiere equipe pour commencer a collaborer avec vos collegues.
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                Creer une equipe
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Link key={team.id} href={`/teams/${team.id}`}>
                <Card className="group border-0 bg-card shadow-sm transition-apple hover:shadow-md cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-lg truncate pr-2">
                        {team.name}
                      </h3>
                      <Badge className={ROLE_COLORS[team.role]}>
                        {ROLE_LABELS[team.role]}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
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
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span>{team._count.members + 1} membres</span>
                      </div>
                      <div className="flex items-center gap-2">
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
                        <span>{team._count.qrcodes} QR codes</span>
                      </div>
                      {!team.isOwner && (
                        <div className="flex items-center gap-2">
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
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span>
                            Proprietaire: {team.owner.name || team.owner.email}
                          </span>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Cree le{" "}
                        {new Date(team.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
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
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
