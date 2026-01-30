"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

function LinkExpiredContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const getMessage = () => {
    switch (reason) {
      case "date":
        return "Ce lien a expire et n'est plus accessible.";
      case "clicks":
        return "Ce lien a atteint son nombre maximum de clics.";
      case "inactive":
        return "Ce lien a ete desactive par son proprietaire.";
      default:
        return "Ce lien n'est plus disponible.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border-0 shadow-lg text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-600"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>
          <CardTitle className="text-2xl">Lien expire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{getMessage()}</p>

          <div className="flex flex-col gap-3">
            <Link href="/">
              <Button className="w-full">Retour a l&apos;accueil</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="w-full">
                Creer vos propres liens courts
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LinkExpiredPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <LinkExpiredContent />
    </Suspense>
  );
}
