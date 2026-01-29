"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              QR Generator
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            {session ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Connexion</Button>
                </Link>
                <Link href="/register">
                  <Button>Inscription</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            Créez des QR codes
            <br />
            <span className="text-muted-foreground">personnalisés</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
            Générez des QR codes avec votre logo et suivez combien de fois ils
            sont scannés en temps réel.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href={session ? "/create" : "/register"}>
              <Button size="lg" className="h-12 px-8 text-base">
                Créer un QR code
              </Button>
            </Link>
            {!session && (
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  Se connecter
                </Button>
              </Link>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="border-0 bg-muted/50 shadow-none transition-apple hover:bg-muted">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-background">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold">Personnalisable</h3>
                <p className="text-sm text-muted-foreground">
                  Ajoutez votre logo au centre du QR code pour une meilleure
                  visibilité de votre marque.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-muted/50 shadow-none transition-apple hover:bg-muted">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-background">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold">Statistiques</h3>
                <p className="text-sm text-muted-foreground">
                  Suivez le nombre de scans et analysez les performances de vos
                  QR codes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-muted/50 shadow-none transition-apple hover:bg-muted">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-background">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold">Rapide</h3>
                <p className="text-sm text-muted-foreground">
                  Créez vos QR codes en quelques secondes, téléchargez-les
                  immédiatement.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} QR Generator. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
