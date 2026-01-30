import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Politique de Confidentialite - QR Generator",
  description:
    "Politique de confidentialite de QR Generator. Decouvrez comment nous collectons, utilisons et protegeeons vos donnees personnelles conformement au RGPD.",
  openGraph: {
    title: "Politique de Confidentialite - QR Generator",
    description:
      "Politique de confidentialite de QR Generator. Decouvrez comment nous collectons, utilisons et protegeons vos donnees personnelles conformement au RGPD.",
    type: "website",
  },
};

export default function PrivacyPage() {
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
            Politique de Confidentialite
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
              href="#donnees-collectees"
              className="text-sm text-primary hover:underline"
            >
              Donnees collectees
            </a>
            <span className="text-muted-foreground">-</span>
            <a
              href="#utilisation"
              className="text-sm text-primary hover:underline"
            >
              Utilisation des donnees
            </a>
            <span className="text-muted-foreground">-</span>
            <a href="#cookies" className="text-sm text-primary hover:underline">
              Cookies
            </a>
            <span className="text-muted-foreground">-</span>
            <a href="#droits" className="text-sm text-primary hover:underline">
              Droits des utilisateurs
            </a>
            <span className="text-muted-foreground">-</span>
            <a href="#contact" className="text-sm text-primary hover:underline">
              Contact DPO
            </a>
          </nav>
        </div>

        {/* Introduction */}
        <div className="mb-10 p-6 rounded-xl border bg-card">
          <h2 className="font-semibold text-foreground mb-3">Introduction</h2>
          <p className="text-muted-foreground text-sm">
            Chez QR Generator, nous accordons une grande importance a la protection
            de vos donnees personnelles. Cette politique de confidentialite vous
            informe sur la maniere dont nous collectons, utilisons et protegeons vos
            informations conformement au Reglement General sur la Protection des
            Donnees (RGPD) et a la loi Informatique et Libertes.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {/* Donnees collectees */}
          <section id="donnees-collectees" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Donnees collectees</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Nous collectons differents types de donnees selon votre utilisation
                de nos services :
              </p>

              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  1.1 Donnees d&apos;identification
                </h3>
                <ul className="space-y-2">
                  <li>- Nom et prenom</li>
                  <li>- Adresse email</li>
                  <li>- Numero de telephone (optionnel)</li>
                  <li>- Nom de l&apos;entreprise (optionnel)</li>
                  <li>- Photo de profil (optionnel)</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  1.2 Donnees de connexion
                </h3>
                <ul className="space-y-2">
                  <li>- Adresse IP</li>
                  <li>- Type de navigateur et version</li>
                  <li>- Systeme d&apos;exploitation</li>
                  <li>- Pages visitees et date/heure d&apos;acces</li>
                  <li>- Donnees de session</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  1.3 Donnees de paiement
                </h3>
                <ul className="space-y-2">
                  <li>- Informations de facturation (adresse, pays)</li>
                  <li>
                    - Les donnees de carte bancaire sont traitees directement par
                    notre prestataire Stripe et ne sont jamais stockees sur nos
                    serveurs
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  1.4 Donnees d&apos;utilisation du service
                </h3>
                <ul className="space-y-2">
                  <li>- QR codes crees (nom, URL de destination, parametres)</li>
                  <li>- Logos et images telecharges</li>
                  <li>
                    - Statistiques de scan (localisation geographique, appareil,
                    date/heure)
                  </li>
                  <li>- Preferences et parametres du compte</li>
                </ul>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 mt-4">
                <p className="text-sm">
                  <strong className="text-foreground">Base legale :</strong> La
                  collecte de ces donnees repose sur l&apos;execution du contrat
                  (fourniture du service), votre consentement (cookies non
                  essentiels), notre interet legitime (amelioration du service) et
                  nos obligations legales (facturation).
                </p>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Utilisation des donnees */}
          <section id="utilisation" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              2. Utilisation des donnees
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Vos donnees personnelles sont utilisees pour :</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Fourniture du service
                  </h3>
                  <ul className="text-sm space-y-1">
                    <li>- Creation et gestion de votre compte</li>
                    <li>- Generation et hebergement de vos QR codes</li>
                    <li>- Collecte et affichage des statistiques</li>
                    <li>- Traitement des paiements</li>
                  </ul>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Communication
                  </h3>
                  <ul className="text-sm space-y-1">
                    <li>- Notifications sur votre compte</li>
                    <li>- Support technique</li>
                    <li>- Informations sur les mises a jour</li>
                    <li>- Newsletter (avec consentement)</li>
                  </ul>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Amelioration du service
                  </h3>
                  <ul className="text-sm space-y-1">
                    <li>- Analyse de l&apos;utilisation</li>
                    <li>- Detection et correction des bugs</li>
                    <li>- Developpement de nouvelles fonctionnalites</li>
                    <li>- Personnalisation de l&apos;experience</li>
                  </ul>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Securite et conformite
                  </h3>
                  <ul className="text-sm space-y-1">
                    <li>- Prevention de la fraude</li>
                    <li>- Protection contre les abus</li>
                    <li>- Respect des obligations legales</li>
                    <li>- Gestion des litiges</li>
                  </ul>
                </div>
              </div>

              <h3 className="font-semibold text-foreground mt-6">
                Duree de conservation
              </h3>
              <div className="rounded-xl border bg-card p-6">
                <ul className="space-y-2">
                  <li>
                    <strong className="text-foreground">Donnees de compte :</strong>{" "}
                    Conservees pendant toute la duree de la relation commerciale et
                    3 ans apres la derniere interaction
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Donnees de facturation :
                    </strong>{" "}
                    10 ans (obligation legale)
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Statistiques de scan :
                    </strong>{" "}
                    3 ans glissants
                  </li>
                  <li>
                    <strong className="text-foreground">Logs de connexion :</strong>{" "}
                    1 an
                  </li>
                </ul>
              </div>

              <h3 className="font-semibold text-foreground mt-6">
                Partage des donnees
              </h3>
              <p>
                Nous ne vendons jamais vos donnees personnelles. Nous partageons vos
                donnees uniquement avec :
              </p>
              <ul className="space-y-1 ml-4">
                <li>
                  - <strong className="text-foreground">Stripe</strong> : traitement
                  des paiements
                </li>
                <li>
                  - <strong className="text-foreground">Vercel</strong> : hebergement
                  de la plateforme
                </li>
                <li>
                  - <strong className="text-foreground">Prestataires email</strong> :
                  envoi de communications
                </li>
                <li>
                  - <strong className="text-foreground">Autorites</strong> : sur
                  requisition legale uniquement
                </li>
              </ul>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Cookies */}
          <section id="cookies" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. Cookies</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Notre site utilise des cookies pour ameliorer votre experience de
                navigation et nous permettre d&apos;analyser l&apos;utilisation du
                site.
              </p>

              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="font-semibold text-foreground">
                  Types de cookies utilises
                </h3>

                <div className="border-b pb-4">
                  <h4 className="font-medium text-foreground mb-2">
                    Cookies strictement necessaires
                  </h4>
                  <p className="text-sm mb-2">
                    Indispensables au fonctionnement du site. Ils permettent
                    l&apos;authentification, la securite et la memorisation de vos
                    preferences.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Duree : Session ou 1 an maximum
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-medium text-foreground mb-2">
                    Cookies analytiques
                  </h4>
                  <p className="text-sm mb-2">
                    Nous aident a comprendre comment les visiteurs interagissent avec
                    le site en collectant des informations de maniere anonyme.
                  </p>
                  <p className="text-xs text-muted-foreground">Duree : 13 mois</p>
                </div>

                <div className="border-b pb-4">
                  <h4 className="font-medium text-foreground mb-2">
                    Cookies fonctionnels
                  </h4>
                  <p className="text-sm mb-2">
                    Permettent de memoriser vos choix (langue, theme) pour
                    personnaliser votre experience.
                  </p>
                  <p className="text-xs text-muted-foreground">Duree : 1 an</p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Cookies marketing
                  </h4>
                  <p className="text-sm mb-2">
                    Utilises pour suivre les visiteurs sur les sites web afin
                    d&apos;afficher des publicites pertinentes.
                  </p>
                  <p className="text-xs text-muted-foreground">Duree : 6 mois</p>
                </div>
              </div>

              <h3 className="font-semibold text-foreground mt-6">
                Gestion des cookies
              </h3>
              <p>
                Vous pouvez gerer vos preferences de cookies de plusieurs manieres :
              </p>
              <ul className="space-y-2 ml-4">
                <li>
                  - Via notre bandeau de consentement lors de votre premiere visite
                </li>
                <li>- Dans les parametres de votre navigateur</li>
                <li>
                  - En utilisant des outils comme{" "}
                  <a
                    href="https://www.youronlinechoices.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Your Online Choices
                  </a>
                </li>
              </ul>

              <div className="rounded-lg bg-muted/50 p-4 mt-4">
                <p className="text-sm">
                  <strong className="text-foreground">Note :</strong> La
                  desactivation de certains cookies peut affecter le fonctionnement
                  du site et limiter l&apos;acces a certaines fonctionnalites.
                </p>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Droits des utilisateurs */}
          <section id="droits" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              4. Droits des utilisateurs
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Conformement au RGPD, vous disposez des droits suivants concernant
                vos donnees personnelles :
              </p>

              <div className="grid gap-4">
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Droit d&apos;acces
                  </h3>
                  <p className="text-sm">
                    Vous pouvez demander une copie de toutes les donnees personnelles
                    que nous detenons a votre sujet. Cette demande sera traitee sous
                    30 jours.
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Droit de rectification
                  </h3>
                  <p className="text-sm">
                    Vous pouvez demander la correction de donnees inexactes ou
                    incompletes directement depuis votre espace client ou en nous
                    contactant.
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Droit a l&apos;effacement
                  </h3>
                  <p className="text-sm">
                    Vous pouvez demander la suppression de vos donnees personnelles.
                    Ce droit peut etre limite par nos obligations legales de
                    conservation.
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Droit a la limitation du traitement
                  </h3>
                  <p className="text-sm">
                    Vous pouvez demander la limitation du traitement de vos donnees
                    dans certaines circonstances (contestation de l&apos;exactitude,
                    traitement illicite, etc.).
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Droit a la portabilite
                  </h3>
                  <p className="text-sm">
                    Vous pouvez recevoir vos donnees dans un format structure,
                    couramment utilise et lisible par machine, et les transmettre a
                    un autre responsable de traitement.
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Droit d&apos;opposition
                  </h3>
                  <p className="text-sm">
                    Vous pouvez vous opposer au traitement de vos donnees pour des
                    motifs lies a votre situation particuliere, notamment pour le
                    marketing direct.
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Droit de retirer votre consentement
                  </h3>
                  <p className="text-sm">
                    Lorsque le traitement est base sur votre consentement, vous
                    pouvez le retirer a tout moment sans que cela n&apos;affecte la
                    licite du traitement effectue avant le retrait.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mt-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Comment exercer vos droits ?
                </h3>
                <p className="text-sm mb-4">
                  Pour exercer l&apos;un de ces droits, vous pouvez :
                </p>
                <ul className="text-sm space-y-2">
                  <li>
                    - Utiliser les parametres de votre compte pour modifier ou
                    supprimer vos donnees
                  </li>
                  <li>
                    - Envoyer un email a{" "}
                    <a
                      href="mailto:privacy@qrgenerator.fr"
                      className="text-primary hover:underline"
                    >
                      privacy@qrgenerator.fr
                    </a>
                  </li>
                  <li>
                    - Contacter notre DPO (voir section suivante)
                  </li>
                </ul>
                <p className="text-sm mt-4">
                  Nous repondrons a votre demande dans un delai de 30 jours. Si votre
                  demande est complexe, ce delai peut etre prolonge de 60 jours
                  supplementaires.
                </p>
              </div>

              <p className="text-sm mt-4">
                Vous disposez egalement du droit d&apos;introduire une reclamation
                aupres de la CNIL :{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  www.cnil.fr
                </a>
              </p>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Contact DPO */}
          <section id="contact" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              5. Contact DPO (Delegue a la Protection des Donnees)
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Pour toute question relative a la protection de vos donnees
                personnelles ou pour exercer vos droits, vous pouvez contacter notre
                Delegue a la Protection des Donnees :
              </p>

              <div className="rounded-xl border bg-card p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      Coordonnees du DPO
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <strong className="text-foreground">Nom :</strong> [Nom du
                        DPO]
                      </li>
                      <li>
                        <strong className="text-foreground">Email :</strong>{" "}
                        <a
                          href="mailto:dpo@qrgenerator.fr"
                          className="text-primary hover:underline"
                        >
                          dpo@qrgenerator.fr
                        </a>
                      </li>
                      <li>
                        <strong className="text-foreground">Adresse :</strong>
                        <br />
                        QR Generator SAS
                        <br />
                        A l&apos;attention du DPO
                        <br />
                        123 Rue de l&apos;Innovation
                        <br />
                        75001 Paris, France
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      Delais de reponse
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong className="text-foreground">
                          Accuse de reception :
                        </strong>{" "}
                        sous 48h
                      </li>
                      <li>
                        <strong className="text-foreground">
                          Reponse complete :
                        </strong>{" "}
                        sous 30 jours
                      </li>
                      <li>
                        <strong className="text-foreground">
                          Extension si necessaire :
                        </strong>{" "}
                        +60 jours (avec notification)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 mt-4">
                <p className="text-sm">
                  <strong className="text-foreground">Important :</strong> Pour
                  verifier votre identite et traiter votre demande, nous pourrons
                  vous demander de fournir une copie d&apos;une piece d&apos;identite.
                  Ce document sera utilise uniquement a cette fin et sera supprime
                  apres traitement de votre demande.
                </p>
              </div>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Securite */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">6. Securite des donnees</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Nous mettons en oeuvre des mesures de securite techniques et
                organisationnelles appropriees pour proteger vos donnees
                personnelles :
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Mesures techniques
                  </h3>
                  <ul className="text-sm space-y-1">
                    <li>- Chiffrement SSL/TLS pour les transmissions</li>
                    <li>- Chiffrement des donnees au repos</li>
                    <li>- Authentification a deux facteurs</li>
                    <li>- Pare-feu et systemes de detection d&apos;intrusion</li>
                    <li>- Sauvegardes regulieres et securisees</li>
                  </ul>
                </div>

                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Mesures organisationnelles
                  </h3>
                  <ul className="text-sm space-y-1">
                    <li>- Acces restreint aux donnees (principe du moindre privilege)</li>
                    <li>- Formation du personnel a la protection des donnees</li>
                    <li>- Procedures de gestion des incidents</li>
                    <li>- Audits de securite reguliers</li>
                    <li>- Politique de mots de passe robustes</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm mt-4">
                En cas de violation de donnees susceptible d&apos;engendrer un risque
                eleve pour vos droits et libertes, nous vous en informerons dans les
                meilleurs delais conformement a l&apos;article 34 du RGPD.
              </p>
            </div>
          </section>

          <Separator className="my-8" />

          {/* Modifications */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              7. Modifications de la politique
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Nous pouvons mettre a jour cette politique de confidentialite
                periodiquement pour refleter les changements dans nos pratiques ou
                pour d&apos;autres raisons operationnelles, legales ou reglementaires.
              </p>
              <p>
                En cas de modification substantielle, nous vous en informerons par
                email ou via une notification sur notre site avant l&apos;entree en
                vigueur des changements.
              </p>
              <p className="text-sm">
                Nous vous encourageons a consulter regulierement cette page pour
                rester informe de nos pratiques en matiere de protection des donnees.
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
            <Link href="/legal/cgv">
              <Button variant="outline" size="sm">
                Conditions Generales de Vente
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
