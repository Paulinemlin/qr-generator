"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamMember {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  isOwner: boolean;
  createdAt: string;
}

interface Invitation {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER" | "VIEWER";
  expiresAt: string;
  createdAt: string;
}

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
  members: TeamMember[];
  invitations: Invitation[];
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

const ROLE_DESCRIPTIONS = {
  OWNER: "Acces complet, peut supprimer l'equipe",
  ADMIN: "Peut gerer les membres et tous les QR codes",
  MEMBER: "Peut creer et modifier ses propres QR codes",
  VIEWER: "Peut uniquement consulter les QR codes",
};

export default function TeamDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const teamId = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Etats pour l'edition du nom
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Etats pour l'invitation
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER" | "VIEWER">("MEMBER");
  const [inviting, setInviting] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  // Etats pour les actions sur les membres
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Etat pour la suppression
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && teamId) {
      fetchTeam();
    }
  }, [session, teamId]);

  const fetchTeam = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}`, { credentials: "include" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setTeam(data);
      setNewName(data.name);

      // Construire la liste des membres avec le proprietaire en premier
      const allMembers: TeamMember[] = [
        {
          id: "owner",
          userId: data.owner.id,
          user: data.owner,
          role: "OWNER",
          isOwner: true,
          createdAt: data.createdAt,
        },
        ...data.members.map((m: TeamMember) => ({ ...m, isOwner: false })),
      ];
      setMembers(allMembers);
    } catch (err) {
      setError("Erreur lors du chargement de l'equipe");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === team?.name) {
      setIsEditingName(false);
      return;
    }

    setSavingName(true);
    setError(null);

    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setTeam((prev) => prev ? { ...prev, name: newName.trim() } : null);
      setIsEditingName(false);
    } catch (err) {
      setError("Erreur lors de la mise a jour du nom");
    } finally {
      setSavingName(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    setError(null);
    setInviteLink(null);

    try {
      const res = await fetch(`/api/teams/${teamId}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setInviteLink(data.inviteLink);
      setInviteEmail("");

      // Rafraichir l'equipe pour voir la nouvelle invitation
      fetchTeam();
    } catch (err) {
      setError("Erreur lors de l'envoi de l'invitation");
    } finally {
      setInviting(false);
    }
  };

  const handleCopyInviteLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
    }
  };

  const handleChangeRole = async (userId: string, newRole: "ADMIN" | "MEMBER" | "VIEWER") => {
    setActionLoading(userId);
    setError(null);

    try {
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      // Mettre a jour localement
      setMembers((prev) =>
        prev.map((m) =>
          m.userId === userId ? { ...m, role: newRole } : m
        )
      );
    } catch (err) {
      setError("Erreur lors du changement de role");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Etes-vous sur de vouloir retirer ce membre de l'equipe ?")) return;

    setActionLoading(userId);
    setError(null);

    try {
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      // Mettre a jour localement
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
      if (team) {
        setTeam({ ...team, _count: { ...team._count, members: team._count.members - 1 } });
      }
    } catch (err) {
      setError("Erreur lors de la suppression du membre");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    setActionLoading(invitationId);
    setError(null);

    try {
      const res = await fetch(`/api/teams/${teamId}/invitations`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      // Mettre a jour localement
      if (team) {
        setTeam({
          ...team,
          invitations: team.invitations.filter((i) => i.id !== invitationId),
        });
      }
    } catch (err) {
      setError("Erreur lors de l'annulation de l'invitation");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm("Etes-vous sur de vouloir quitter cette equipe ?")) return;

    setActionLoading("leave");
    setError(null);

    try {
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push("/teams");
    } catch (err) {
      setError("Erreur lors de la sortie de l'equipe");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTeam = async () => {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setShowDeleteConfirm(false);
        return;
      }

      router.push("/teams");
    } catch (err) {
      setError("Erreur lors de la suppression de l'equipe");
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const canManageMembers = team?.role === "OWNER" || team?.role === "ADMIN";
  const canEditTeam = team?.role === "OWNER" || team?.role === "ADMIN";
  const canDeleteTeam = team?.role === "OWNER";

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

  if (error && !team) {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight">
                QR Generator
              </span>
            </Link>
            <Link href="/teams">
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
                Mes equipes
              </Button>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-12">
          <Card className="max-w-lg mx-auto border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">Erreur</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Link href="/teams">
                <Button>Retour aux equipes</Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

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
          <Link href="/teams">
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
              Mes equipes
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Erreur */}
        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-4 text-sm underline"
            >
              Fermer
            </button>
          </div>
        )}

        {/* En-tete de l'equipe */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="h-10 text-xl font-semibold max-w-xs"
                      maxLength={100}
                      autoFocus
                    />
                    <Button size="sm" onClick={handleUpdateName} disabled={savingName}>
                      {savingName ? "..." : "Enregistrer"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditingName(false);
                        setNewName(team?.name || "");
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">{team?.name}</h1>
                    {canEditTeam && (
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-muted-foreground hover:text-foreground"
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
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </button>
                    )}
                    <Badge className={ROLE_COLORS[team?.role || "VIEWER"]}>
                      {ROLE_LABELS[team?.role || "VIEWER"]}
                    </Badge>
                  </div>
                )}
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{members.length} membres</span>
                  <span>{team?._count.qrcodes} QR codes</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/dashboard?team=${teamId}`}>
                  <Button variant="outline">
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
                    Voir les QR codes
                  </Button>
                </Link>
                {!team?.isOwner && (
                  <Button
                    variant="outline"
                    onClick={handleLeaveTeam}
                    disabled={actionLoading === "leave"}
                    className="text-destructive hover:text-destructive"
                  >
                    {actionLoading === "leave" ? "..." : "Quitter l'equipe"}
                  </Button>
                )}
                {canDeleteTeam && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="max-w-md w-full mx-4 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-red-600">Supprimer l'equipe</CardTitle>
                <CardDescription>
                  Etes-vous sur de vouloir supprimer l'equipe "{team?.name}" ?
                  Cette action est irreversible. Les QR codes de l'equipe seront
                  dissocies mais pas supprimes.
                </CardDescription>
              </CardHeader>
              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteTeam}
                  disabled={deleting}
                >
                  {deleting ? "Suppression..." : "Supprimer definitivement"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Section membres */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Membres de l'equipe</CardTitle>
                  <CardDescription>
                    {members.length} membre{members.length > 1 ? "s" : ""}
                  </CardDescription>
                </div>
                {canManageMembers && (
                  <Button onClick={() => setShowInviteForm(!showInviteForm)}>
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" x2="19" y1="8" y2="14" />
                      <line x1="22" x2="16" y1="11" y2="11" />
                    </svg>
                    Inviter
                  </Button>
                )}
              </CardHeader>

              {/* Formulaire d'invitation */}
              {showInviteForm && canManageMembers && (
                <CardContent className="border-t border-b bg-muted/30">
                  <form onSubmit={handleInvite} className="space-y-4 py-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="flex-1">
                        <Label htmlFor="inviteEmail">Adresse email</Label>
                        <Input
                          id="inviteEmail"
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="collegue@exemple.com"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div className="w-full sm:w-40">
                        <Label htmlFor="inviteRole">Role</Label>
                        <Select
                          value={inviteRole}
                          onValueChange={(v) => setInviteRole(v as "ADMIN" | "MEMBER" | "VIEWER")}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {team?.role === "OWNER" && (
                              <SelectItem value="ADMIN">Administrateur</SelectItem>
                            )}
                            <SelectItem value="MEMBER">Membre</SelectItem>
                            <SelectItem value="VIEWER">Lecteur</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button type="submit" disabled={inviting || !inviteEmail.trim()}>
                        {inviting ? "Envoi..." : "Envoyer l'invitation"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowInviteForm(false);
                          setInviteEmail("");
                          setInviteLink(null);
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>

                  {/* Lien d'invitation */}
                  {inviteLink && (
                    <div className="pb-4">
                      <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
                        <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                          Invitation creee ! Partagez ce lien avec la personne invitee :
                        </p>
                        <div className="flex items-center gap-2">
                          <Input
                            value={inviteLink}
                            readOnly
                            className="text-xs font-mono"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleCopyInviteLink}
                          >
                            Copier
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}

              <CardContent className="p-0">
                <div className="divide-y">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                          {(member.user.name || member.user.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">
                            {member.user.name || member.user.email}
                            {member.userId === session?.user?.id && (
                              <span className="ml-2 text-xs text-muted-foreground">(vous)</span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {member.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={ROLE_COLORS[member.role]}>
                          {ROLE_LABELS[member.role]}
                        </Badge>
                        {canManageMembers && !member.isOwner && member.userId !== session?.user?.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={actionLoading === member.userId}
                              >
                                {actionLoading === member.userId ? (
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
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="19" cy="12" r="1" />
                                    <circle cx="5" cy="12" r="1" />
                                  </svg>
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {team?.role === "OWNER" && member.role !== "ADMIN" && (
                                <DropdownMenuItem
                                  onClick={() => handleChangeRole(member.userId, "ADMIN")}
                                >
                                  Promouvoir Administrateur
                                </DropdownMenuItem>
                              )}
                              {member.role !== "MEMBER" && (
                                <DropdownMenuItem
                                  onClick={() => handleChangeRole(member.userId, "MEMBER")}
                                >
                                  Definir comme Membre
                                </DropdownMenuItem>
                              )}
                              {member.role !== "VIEWER" && (
                                <DropdownMenuItem
                                  onClick={() => handleChangeRole(member.userId, "VIEWER")}
                                >
                                  Definir comme Lecteur
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleRemoveMember(member.userId)}
                                className="text-destructive focus:text-destructive"
                              >
                                Retirer de l'equipe
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section invitations en attente */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Invitations en attente</CardTitle>
                <CardDescription>
                  {team?.invitations.length || 0} invitation{(team?.invitations.length || 0) > 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {team?.invitations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune invitation en attente
                  </p>
                ) : (
                  <div className="space-y-3">
                    {team?.invitations.map((invitation) => (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{invitation.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {ROLE_LABELS[invitation.role]} - Expire le{" "}
                            {new Date(invitation.expiresAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        {canManageMembers && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelInvitation(invitation.id)}
                            disabled={actionLoading === invitation.id}
                            className="text-destructive hover:text-destructive"
                          >
                            {actionLoading === invitation.id ? "..." : "Annuler"}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info sur les roles */}
            <Card className="mt-6 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Roles et permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const).map((role) => (
                  <div key={role} className="flex items-start gap-3">
                    <Badge className={`${ROLE_COLORS[role]} shrink-0 mt-0.5`}>
                      {ROLE_LABELS[role]}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {ROLE_DESCRIPTIONS[role]}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
