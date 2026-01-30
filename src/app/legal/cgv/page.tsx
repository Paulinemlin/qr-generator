import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Conditions Generales de Vente (CGV) - QR Generator",
  description:
    "Conditions Generales de Vente de QR Generator. Informations sur les prix, paiements, abonnements, resiliation et responsabilites.",
  openGraph: {
    title: "Conditions Generales de Vente (CGV) - QR Generator",
    description:
      "Conditions Generales de Vente de QR Generator. Informations sur les prix, paiements, abonnements, resiliation et responsabilites.",
    type: "website",
  },
};

export default function CGVPage() {
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
            Conditions Generales de Vente
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
            <a href="#objet" className="text-sm text-primary hover:underline">
              Objet
            </a>
            <span className="text-muted-foreground">-</span>
            <a href="#prix" className="text-sm text-primary hover:underline">
              Prix et paiement
            </a>
            <span className="text-muted-foreground">-</span>
            <a
              href="#abonnements"
              className="text-sm text-primary hover:underline"
            >
              Abonnements
            </a>
            <span className="text-muted-foreground">-</span>
            <a
              href="#resiliation"
              className="text-sm text-primary hover:underline"
            >
              Resiliation
            </a>
            <span className="text-muted-foreground">-</span>
            <a
              href="#responsabilite"
              className="text-sm text-primary hover:underline"
            >
              Responsabilite
            </a>
          </nav>
        </div>

        {/* Preambule */}
        <div className="mb-10 p-6 rounded-xl border bg-card">
          <h2 className="font-semibold text-foreground mb-3">Preambule</h2>
          <p className="text-muted-foreground text-sm">
            Les presentes Conditions Generales de Vente (ci-apres &quot;CGV&quot;)
            s&apos;appliquent a toutes les ventes de services conclues sur le site
            qrgenerator.fr. Toute souscription a un abonnement implique
            l&apos;acceptation sans reserve des presentes CGV.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {/* Objet */}
          <section id="objet" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Les presentes CGV ont pour objet de definir les droits et
                obligations des parties dans le cadre de la vente des services
                proposes par QR Generator SAS sur son site internet.
              </p>

              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Services proposes
                </h3>
                <ul className="space-y-2">
                  <li>
                    - Creation et gestion de QR codes dynamiques personnalisables
                  </li>
                  <li>- Suivi et analyse des statistiques de scan en temps reel</li>
                  <li>- Personnalisation avancee (couleurs, logos, formes)</li>
                  <li>- API pour l&apos;integration dans vos applications</li>
                  <li>- Fonctionnalites de securite (mot de passe, expiration)</li>
                  <li>- Support technique prioritaire</li>
                </ul>
              </div>

              <p>
                QR Generator SAS se reserve le droit de modifier ses services a
                tout moment, les modifications n&apos;affectant pas les commandes en
                cours.
              </p>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Prix et paiement */}
          <section id="prix" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Prix et paiement</h2>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="font-semibold text-foreground">2.1 Tarification</h3>
              <p>
                Les prix des services sont indiques en euros toutes taxes comprises
                (TTC). Les tarifs en vigueur sont ceux affiches sur le site au
                moment de la souscription.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-6">
                  <h4 className="font-semibold text-foreground mb-2">Gratuit</h4>
                  <p className="text-2xl font-bold text-foreground mb-2">0 EUR</p>
                  <p className="text-sm">
                    Acces limite aux fonctionnalites de base. Ideal pour decouvrir
                    la plateforme.
                  </p>
                </div>

                <div className="rounded-xl border-2 border-primary bg-card p-6">
                  <h4 className="font-semibold text-foreground mb-2">Pro</h4>
                  <p className="text-2xl font-bold text-foreground mb-2">
                    9 EUR<span className="text-sm font-normal">/mois</span>
                  </p>
                  <p className="text-sm">
                    QR codes illimites, analytics avances, personnalisation complete.
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h4 className="font-semibold text-foreground mb-2">Business</h4>
                  <p className="text-2xl font-bold text-foreground mb-2">
                    29 EUR<span className="text-sm font-normal">/mois</span>
                  </p>
                  <p className="text-sm">
                    Toutes les fonctionnalites Pro + API, equipes, SSO.
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-foreground mt-6">
                2.2 Modalites de paiement
              </h3>
              <div className="rounded-xl border bg-card p-6">
                <ul className="space-y-2">
                  <li>
                    <strong className="text-foreground">Moyens acceptes :</strong>{" "}
                    Carte bancaire (Visa, Mastercard, American Express)
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Prestataire de paiement :
                    </strong>{" "}
                    Stripe (securise et conforme PCI-DSS)
                  </li>
                  <li>
                    <strong className="text-foreground">Facturation :</strong>{" "}
                    Mensuelle, a la date anniversaire de la souscription
                  </li>
                  <li>
                    <strong className="text-foreground">Factures :</strong>{" "}
                    Disponibles dans votre espace client
                  </li>
                </ul>
              </div>

              <h3 className="font-semibold text-foreground mt-6">
                2.3 Modification des prix
              </h3>
              <p>
                QR Generator SAS se reserve le droit de modifier ses prix a tout
                moment. Les nouveaux tarifs s&apos;appliqueront aux nouvelles
                souscriptions et aux renouvellements, apres notification prealable
                de 30 jours par email.
              </p>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Abonnements */}
          <section id="abonnements" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. Abonnements</h2>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="font-semibold text-foreground">3.1 Duree</h3>
              <p>
                Les abonnements sont souscrits pour une duree d&apos;un mois et sont
                renouveles automatiquement par tacite reconduction, sauf
                resiliation par l&apos;une des parties.
              </p>

              <h3 className="font-semibold text-foreground mt-6">
                3.2 Activation du service
              </h3>
              <p>
                L&apos;acces aux services premium est active immediatement apres
                validation du paiement. Un email de confirmation est envoye a
                l&apos;adresse indiquee lors de l&apos;inscription.
              </p>

              <h3 className="font-semibold text-foreground mt-6">
                3.3 Changement de formule
              </h3>
              <div className="rounded-xl border bg-card p-6">
                <p className="mb-3">
                  Vous pouvez changer de formule d&apos;abonnement a tout moment :
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong className="text-foreground">Passage a une formule superieure :</strong>{" "}
                    La difference est facturee au prorata pour la periode en cours.
                  </li>
                  <li>
                    <strong className="text-foreground">Passage a une formule inferieure :</strong>{" "}
                    Le changement prend effet a la fin de la periode en cours.
                  </li>
                </ul>
              </div>

              <h3 className="font-semibold text-foreground mt-6">
                3.4 Periode d&apos;essai
              </h3>
              <p>
                QR Generator peut proposer des periodes d&apos;essai gratuites pour
                certaines formules. A l&apos;issue de la periode d&apos;essai,
                l&apos;abonnement sera automatiquement renouvele au tarif en vigueur,
                sauf annulation prealable.
              </p>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Resiliation */}
          <section id="resiliation" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Resiliation</h2>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="font-semibold text-foreground">
                4.1 Resiliation par le client
              </h3>
              <div className="rounded-xl border bg-card p-6">
                <p className="mb-3">
                  Vous pouvez resilier votre abonnement a tout moment depuis votre
                  espace client. La resiliation prendra effet :
                </p>
                <ul className="space-y-2">
                  <li>- A la fin de la periode de facturation en cours</li>
                  <li>- Sans frais supplementaires</li>
                  <li>
                    - Avec maintien de l&apos;acces aux services jusqu&apos;a la fin de la
                    periode payee
                  </li>
                </ul>
              </div>

              <h3 className="font-semibold text-foreground mt-6">
                4.2 Resiliation par QR Generator
              </h3>
              <p>
                QR Generator SAS se reserve le droit de resilier un abonnement en
                cas de :
              </p>
              <ul className="space-y-1 ml-4">
                <li>- Non-paiement apres relance</li>
                <li>- Violation des conditions d&apos;utilisation</li>
                <li>- Utilisation frauduleuse ou abusive du service</li>
                <li>- Atteinte aux droits de tiers</li>
              </ul>

              <h3 className="font-semibold text-foreground mt-6">
                4.3 Consequences de la resiliation
              </h3>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm">
                  Apres resiliation, vos QR codes dynamiques resteront accessibles
                  pendant une periode de grace de 30 jours, durant laquelle vous
                  pourrez exporter vos donnees. Passe ce delai, les QR codes seront
                  desactives et les donnees supprimees conformement a notre politique
                  de conservation.
                </p>
              </div>

              <h3 className="font-semibold text-foreground mt-6">
                4.4 Droit de retractation
              </h3>
              <p>
                Conformement a l&apos;article L.221-28 du Code de la consommation, le
                droit de retractation ne peut etre exerce pour les services
                pleinement executes avant la fin du delai de retractation et dont
                l&apos;execution a commence apres accord prealable expres du
                consommateur.
              </p>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Responsabilite */}
          <section id="responsabilite" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Responsabilite</h2>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="font-semibold text-foreground">
                5.1 Engagements de QR Generator
              </h3>
              <div className="rounded-xl border bg-card p-6">
                <ul className="space-y-2">
                  <li>
                    <strong className="text-foreground">Disponibilite :</strong> QR
                    Generator s&apos;engage a mettre en oeuvre tous les moyens
                    raisonnables pour assurer une disponibilite du service de 99,9%
                    (hors maintenance programmee).
                  </li>
                  <li>
                    <strong className="text-foreground">Securite :</strong> Nous
                    mettons en place des mesures de securite techniques et
                    organisationnelles appropriees pour proteger vos donnees.
                  </li>
                  <li>
                    <strong className="text-foreground">Support :</strong> Assistance
                    technique disponible selon la formule souscrite.
                  </li>
                </ul>
              </div>

              <h3 className="font-semibold text-foreground mt-6">
                5.2 Limitations de responsabilite
              </h3>
              <p>
                QR Generator SAS ne saurait etre tenue responsable :
              </p>
              <ul className="space-y-1 ml-4">
                <li>
                  - Des dommages indirects ou consequents (perte de chiffre
                  d&apos;affaires, de donnees, d&apos;opportunites)
                </li>
                <li>
                  - Des interruptions de service dues a un cas de force majeure
                </li>
                <li>- Du contenu genere par les utilisateurs</li>
                <li>
                  - De l&apos;utilisation frauduleuse des QR codes par des tiers
                </li>
                <li>
                  - Des dysfonctionnements lies aux equipements ou reseaux de
                  l&apos;utilisateur
                </li>
              </ul>

              <h3 className="font-semibold text-foreground mt-6">
                5.3 Responsabilite du client
              </h3>
              <p>Le client s&apos;engage a :</p>
              <ul className="space-y-1 ml-4">
                <li>- Utiliser le service conformement a sa destination</li>
                <li>- Ne pas utiliser le service a des fins illicites</li>
                <li>- Maintenir la confidentialite de ses identifiants</li>
                <li>- Respecter les droits de propriete intellectuelle des tiers</li>
              </ul>

              <h3 className="font-semibold text-foreground mt-6">
                5.4 Force majeure
              </h3>
              <p className="text-sm">
                Aucune des parties ne sera responsable de l&apos;inexecution de ses
                obligations en cas de force majeure, telle que definie par
                l&apos;article 1218 du Code civil.
              </p>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Dispositions generales */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              6. Dispositions generales
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="font-semibold text-foreground">6.1 Droit applicable</h3>
              <p>
                Les presentes CGV sont soumises au droit francais. Tout litige
                relatif a leur interpretation et/ou a leur execution releve des
                tribunaux francais competents.
              </p>

              <h3 className="font-semibold text-foreground mt-6">
                6.2 Mediation
              </h3>
              <p>
                En cas de litige, le client peut recourir gratuitement au service de
                mediation de la consommation. Le mediateur competent peut etre saisi
                via la plateforme de reglement en ligne des litiges de la Commission
                europeenne :{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>

              <h3 className="font-semibold text-foreground mt-6">
                6.3 Modification des CGV
              </h3>
              <p>
                QR Generator SAS se reserve le droit de modifier les presentes CGV a
                tout moment. Les modifications seront notifiees par email et
                prendront effet 30 jours apres leur publication.
              </p>
            </div>
          </section>
        </div>

        {/* Related pages */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-lg font-semibold mb-4">Pages connexes</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/legal">
              <Button variant="outline" size="sm">
                Mentions legales
              </Button>
            </Link>
            <Link href="/legal/privacy">
              <Button variant="outline" size="sm">
                Politique de confidentialite
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="sm">
                Voir les tarifs
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
