"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InvitationData {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER" | "VIEWER";
  expiresAt: string;
  team: {
    id: string;
    name: string;
    owner: {
      name: string | null;
      email: string;
    };
    _count: {
      members: number;
    };
  };
}

const ROLE_LABELS = {
  OWNER: "Proprietaire",
  ADMIN: "Administrateur",
  MEMBER: "Membre",
  VIEWER: "Lecteur",
};

const ROLE_DESCRIPTIONS = {
  ADMIN: "Peut gerer les membres et tous les QR codes",
  MEMBER: "Peut creer et modifier ses propres QR codes",
  VIEWER: "Peut uniquement consulter les QR codes",
};

export default function InvitePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const res = await fetch(`/api/invite/${token}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invitation non trouvee");
        return;
      }

      setInvitation(data.invitation);
    } catch (err) {
      setError("Erreur lors de la recuperation de l'invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!session?.user) {
      // Rediriger vers la connexion avec retour ici
      router.push(`/login?callbackUrl=/invite/${token}`);
      return;
    }

    setAccepting(true);
    setError(null);

    try {
      const res = await fetch(`/api/invite/${token}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'acceptation");
        return;
      }

      setSuccess(true);

      // Rediriger vers l'equipe apres 2 secondes
      setTimeout(() => {
        router.push(`/teams/${data.teamId}`);
      }, 2000);
    } catch (err) {
      setError("Erreur lors de l'acceptation de l'invitation");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
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

  if (error && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
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
                className="text-red-600 dark:text-red-400"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" x2="9" y1="9" y2="15" />
                <line x1="9" x2="15" y1="9" y2="15" />
              </svg>
            </div>
            <CardTitle className="text-xl">Invitation invalide</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/dashboard">
              <Button>Retour au tableau de bord</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
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
                className="text-green-600 dark:text-green-400"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <CardTitle className="text-xl">Bienvenue dans l'equipe !</CardTitle>
            <CardDescription>
              Vous avez rejoint l'equipe "{invitation?.team.name}" avec succes.
              <br />
              Redirection en cours...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
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
              className="text-primary"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <CardTitle className="text-xl">Invitation a rejoindre une equipe</CardTitle>
          <CardDescription>
            Vous avez ete invite a rejoindre l'equipe suivante
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Infos de l'equipe */}
          <div className="rounded-xl bg-muted/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Equipe</span>
              <span className="font-semibold">{invitation?.team.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Proprietaire</span>
              <span className="text-sm">
                {invitation?.team.owner.name || invitation?.team.owner.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Membres</span>
              <span className="text-sm">{(invitation?.team._count.members || 0) + 1} membres</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Votre role</span>
              <Badge variant="secondary">
                {ROLE_LABELS[invitation?.role || "MEMBER"]}
              </Badge>
            </div>
          </div>

          {/* Description du role */}
          <p className="text-sm text-muted-foreground text-center">
            En tant que {ROLE_LABELS[invitation?.role || "MEMBER"].toLowerCase()}, vous pourrez :{" "}
            {ROLE_DESCRIPTIONS[invitation?.role || "MEMBER"].toLowerCase()}.
          </p>

          {/* Erreur */}
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive text-center">
              {error}
            </div>
          )}

          {/* Info connexion */}
          {status === "unauthenticated" && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-200 text-center">
              Vous devez vous connecter pour accepter cette invitation.
              <br />
              L'invitation est destinee a : <strong>{invitation?.email}</strong>
            </div>
          )}

          {/* Verif email */}
          {status === "authenticated" && session?.user?.email !== invitation?.email && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-200 text-center">
              Cette invitation est destinee a <strong>{invitation?.email}</strong>.
              <br />
              Vous etes connecte en tant que <strong>{session?.user?.email}</strong>.
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-3">
          {status === "unauthenticated" ? (
            <>
              <Button onClick={handleAccept} className="w-full">
                Se connecter pour accepter
              </Button>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">
                  Annuler
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                onClick={handleAccept}
                disabled={accepting}
                className="w-full"
              >
                {accepting ? (
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
                    Acceptation...
                  </span>
                ) : (
                  "Accepter l'invitation"
                )}
              </Button>
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full">
                  Refuser
                </Button>
              </Link>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
