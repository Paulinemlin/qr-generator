import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Mentions Legales - QR Generator",
  description:
    "Mentions legales de QR Generator. Informations sur l'editeur, l'hebergeur, la propriete intellectuelle et la protection des donnees personnelles.",
  openGraph: {
    title: "Mentions Legales - QR Generator",
    description:
      "Mentions legales de QR Generator. Informations sur l'editeur, l'hebergeur, la propriete intellectuelle et la protection des donnees personnelles.",
    type: "website",
  },
};

export default function MentionsLegalesPage() {
  const lastUpdated = "30 janvier 2026";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              QR Generator
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-4xl px-6 py-12">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Mentions Legales
          </h1>
          <p className="mt-2 text-muted-foreground">
            Derniere mise a jour : {lastUpdated}
          </p>
        </div>

        {/* Navigation rapide */}
        <div className="mb-10 p-6 rounded-xl border bg-muted/30">
          <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
            Sur cette page
          </h2>
          <nav className="flex flex-wrap gap-3">
            <a
              href="#editeur"
              className="text-sm text-primary hover:underline"
            >
              Editeur du site
            </a>
            <span className="text-muted-foreground">-</span>
            <a
              href="#hebergeur"
              className="text-sm text-primary hover:underline"
            >
              Hebergeur
            </a>
            <span className="text-muted-foreground">-</span>
            <a
              href="#propriete-intellectuelle"
              className="text-sm text-primary hover:underline"
            >
              Propriete intellectuelle
            </a>
            <span className="text-muted-foreground">-</span>
            <a
              href="#donnees-personnelles"
              className="text-sm text-primary hover:underline"
            >
              Donnees personnelles
            </a>
            <span className="text-muted-foreground">-</span>
            <a href="#cookies" className="text-sm text-primary hover:underline">
              Cookies
            </a>
          </nav>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {/* Editeur du site */}
          <section id="editeur" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Editeur du site</h2>
            <div className="rounded-xl border bg-card p-6 space-y-3">
              <p className="text-muted-foreground">
                Le site <strong className="text-foreground">qrgenerator.fr</strong> est
                edite par :
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Raison sociale :</strong> QR
                  Generator SAS
                </li>
                <li>
                  <strong className="text-foreground">Siege social :</strong> 123 Rue
                  de l&apos;Innovation, 75001 Paris, France
                </li>
                <li>
                  <strong className="text-foreground">Capital social :</strong> 10 000
                  euros
                </li>
                <li>
                  <strong className="text-foreground">RCS :</strong> Paris B 123 456
                  789
                </li>
                <li>
                  <strong className="text-foreground">SIRET :</strong> 123 456 789
                  00012
                </li>
                <li>
                  <strong className="text-foreground">
                    Numero de TVA intracommunautaire :
                  </strong>{" "}
                  FR 12 345678901
                </li>
                <li>
                  <strong className="text-foreground">
                    Directeur de la publication :
                  </strong>{" "}
                  [Nom du directeur]
                </li>
                <li>
                  <strong className="text-foreground">Email :</strong>{" "}
                  <a
                    href="mailto:contact@qrgenerator.fr"
                    className="text-primary hover:underline"
                  >
                    contact@qrgenerator.fr
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">Telephone :</strong> +33 1 23 45
                  67 89
                </li>
              </ul>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Hebergeur */}
          <section id="hebergeur" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Hebergeur</h2>
            <div className="rounded-xl border bg-card p-6 space-y-3">
              <p className="text-muted-foreground">
                Le site est heberge par :
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Raison sociale :</strong>{" "}
                  Vercel Inc.
                </li>
                <li>
                  <strong className="text-foreground">Adresse :</strong> 340 S Lemon
                  Ave #4133, Walnut, CA 91789, USA
                </li>
                <li>
                  <strong className="text-foreground">Site web :</strong>{" "}
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://vercel.com
                  </a>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Les donnees sont stockees sur des serveurs securises situes dans
                l&apos;Union Europeenne, conformement aux exigences du RGPD.
              </p>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Propriete intellectuelle */}
          <section id="propriete-intellectuelle" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              3. Propriete intellectuelle
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                L&apos;ensemble des elements figurant sur le site QR Generator
                (textes, graphismes, logos, icones, images, clips audio et video,
                logiciels, bases de donnees, etc.) sont proteges par les
                dispositions du Code de la Propriete Intellectuelle et
                appartiennent a QR Generator SAS ou font l&apos;objet d&apos;une
                autorisation d&apos;utilisation.
              </p>
              <p>
                Toute reproduction, representation, modification, publication,
                transmission, denaturation, totale ou partielle du site ou de son
                contenu, par quelque procede que ce soit, et sur quelque support
                que ce soit est interdite sans l&apos;autorisation ecrite prealable
                de QR Generator SAS.
              </p>
              <p>
                La marque <strong className="text-foreground">QR Generator</strong>,
                ainsi que l&apos;ensemble des marques figuratives ou non et plus
                generalement toutes les autres marques, illustrations, images et
                logotypes figurant sur le site, sont et resteront la propriete
                exclusive de QR Generator SAS.
              </p>
              <div className="rounded-lg bg-muted/50 p-4 mt-4">
                <p className="text-sm">
                  <strong className="text-foreground">Note :</strong> Les QR codes
                  generes par les utilisateurs restent la propriete de ces derniers.
                  QR Generator SAS n&apos;acquiert aucun droit sur le contenu cree par
                  les utilisateurs via la plateforme.
                </p>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Donnees personnelles */}
          <section id="donnees-personnelles" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              4. Donnees personnelles
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Conformement au Reglement General sur la Protection des Donnees
                (RGPD) et a la loi Informatique et Libertes du 6 janvier 1978
                modifiee, vous disposez de droits concernant vos donnees
                personnelles.
              </p>

              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="font-semibold text-foreground">
                  Responsable du traitement
                </h3>
                <p>
                  QR Generator SAS est responsable du traitement des donnees
                  personnelles collectees sur ce site.
                </p>

                <h3 className="font-semibold text-foreground">Vos droits</h3>
                <ul className="space-y-1">
                  <li>- Droit d&apos;acces a vos donnees</li>
                  <li>- Droit de rectification</li>
                  <li>- Droit a l&apos;effacement (droit a l&apos;oubli)</li>
                  <li>- Droit a la limitation du traitement</li>
                  <li>- Droit a la portabilite des donnees</li>
                  <li>- Droit d&apos;opposition</li>
                </ul>

                <h3 className="font-semibold text-foreground">Contact DPO</h3>
                <p>
                  Pour exercer vos droits ou pour toute question relative a la
                  protection de vos donnees personnelles, contactez notre Delegue
                  a la Protection des Donnees :{" "}
                  <a
                    href="mailto:dpo@qrgenerator.fr"
                    className="text-primary hover:underline"
                  >
                    dpo@qrgenerator.fr
                  </a>
                </p>
              </div>

              <p className="text-sm">
                Pour plus d&apos;informations, consultez notre{" "}
                <Link
                  href="/legal/privacy"
                  className="text-primary hover:underline"
                >
                  Politique de confidentialite
                </Link>
                .
              </p>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Cookies */}
          <section id="cookies" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Le site QR Generator utilise des cookies pour assurer son bon
                fonctionnement et ameliorer l&apos;experience utilisateur.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Cookies essentiels
                  </h3>
                  <p className="text-sm">
                    Necessaires au fonctionnement du site (authentification,
                    securite, preferences). Ces cookies ne peuvent pas etre
                    desactives.
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Cookies analytiques
                  </h3>
                  <p className="text-sm">
                    Utilises pour comprendre comment les visiteurs interagissent
                    avec le site et ameliorer nos services.
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Cookies fonctionnels
                  </h3>
                  <p className="text-sm">
                    Permettent de memoriser vos preferences et de personnaliser
                    votre experience.
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Cookies marketing
                  </h3>
                  <p className="text-sm">
                    Utilises pour suivre l&apos;efficacite de nos campagnes
                    publicitaires et vous proposer des contenus pertinents.
                  </p>
                </div>
              </div>

              <p className="text-sm">
                Vous pouvez gerer vos preferences de cookies a tout moment via les
                parametres de votre navigateur ou notre bandeau de consentement.
              </p>
            </div>
          </section>
        </div>

        {/* Related pages */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-lg font-semibold mb-4">Pages connexes</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/legal/cgv">
              <Button variant="outline" size="sm">
                Conditions Generales de Vente
              </Button>
            </Link>
            <Link href="/legal/privacy">
              <Button variant="outline" size="sm">
                Politique de confidentialite
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} QR Generator. Tous droits reserves.</p>
            <div className="flex gap-4">
              <Link href="/legal" className="hover:text-foreground transition-colors">
                Mentions legales
              </Link>
              <Link href="/legal/cgv" className="hover:text-foreground transition-colors">
                CGV
              </Link>
              <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                Confidentialite
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
