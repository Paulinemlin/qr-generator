"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
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
              className="text-orange-600"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <CardTitle className="text-2xl">QR Code expire</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Ce QR code n&apos;est plus actif. Il a peut-etre atteint sa date d&apos;expiration
            ou son nombre maximum de scans.
          </p>
          <p className="text-sm text-muted-foreground">
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, veuillez contacter
            le proprietaire de ce QR code.
          </p>
          <div className="pt-4">
            <Link href="/">
              <Button variant="outline" className="w-full">
                Retour a l&apos;accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
