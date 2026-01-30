import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Base de données des articles (en production, utiliser un CMS ou une DB)
const articlesData: Record<string, {
  title: string;
  description: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
}> = {
  "comment-creer-qr-code-gratuit": {
    title: "Comment créer un QR code gratuit en 2024 : Guide complet",
    description:
      "Apprenez à créer des QR codes professionnels gratuitement. Notre guide étape par étape vous montre comment générer, personnaliser et suivre vos QR codes.",
    category: "Guide",
    date: "2024-01-15",
    readTime: "5 min",
    author: "QR Generator",
    content: `
## Qu'est-ce qu'un QR code ?

Un QR code (Quick Response code) est un code-barres bidimensionnel qui peut stocker des informations comme des URLs, du texte, des coordonnées ou des informations WiFi. Inventé au Japon en 1994, le QR code est devenu un outil incontournable du marketing digital.

## Pourquoi utiliser des QR codes ?

Les QR codes offrent de nombreux avantages :

- **Accès instantané** : Les utilisateurs accèdent à votre contenu en un scan
- **Traçabilité** : Suivez les performances de vos campagnes
- **Polyvalence** : Utilisables sur tous supports (print, digital, produits)
- **Économique** : Création gratuite et mise à jour facile

## Comment créer un QR code gratuit

### Étape 1 : Choisir le type de QR code

Selon votre besoin, sélectionnez le type approprié :
- **URL** : Redirige vers un site web
- **vCard** : Partage vos coordonnées
- **WiFi** : Connexion automatique au réseau
- **Email** : Ouvre un email pré-rempli
- **SMS** : Envoie un message pré-défini

### Étape 2 : Personnaliser le design

Un QR code personnalisé augmente le taux de scan de 30%. Vous pouvez :
- Modifier les couleurs (respectez un contraste suffisant)
- Ajouter votre logo au centre
- Changer la forme des modules
- Adapter le style des yeux (coins)

### Étape 3 : Télécharger et utiliser

Exportez votre QR code en haute résolution :
- **PNG** : Idéal pour le web
- **SVG** : Parfait pour l'impression (vectoriel)
- **PDF** : Pour les documents professionnels

## Bonnes pratiques

1. **Testez toujours** votre QR code avant impression
2. **Taille minimale** : 2x2 cm pour une lecture optimale
3. **Contraste** : Fond clair, QR code foncé
4. **Zone de silence** : Laissez un espace blanc autour
5. **Call-to-action** : Ajoutez un texte "Scannez-moi"

## Conclusion

Créer un QR code gratuit n'a jamais été aussi simple. Avec QR Generator, vous pouvez créer des QR codes professionnels en quelques clics, les personnaliser à votre image et suivre leurs performances.

[Créer mon QR code gratuitement →](/register)
    `,
  },
  "qr-code-restaurant-menu": {
    title: "QR Code Menu Restaurant : Digitaliser votre carte en 5 minutes",
    description:
      "Découvrez comment les restaurants utilisent les QR codes pour leurs menus. Avantages, mise en place et meilleures pratiques.",
    category: "Cas d'usage",
    date: "2024-01-10",
    readTime: "7 min",
    author: "QR Generator",
    content: `
## La révolution du menu digital

Depuis la pandémie, les QR codes menus sont devenus la norme dans la restauration. Plus de 60% des restaurants français ont adopté cette solution pour offrir une expérience sans contact et plus hygiénique.

## Avantages du QR code menu

### Pour le restaurant
- **Économies** : Plus besoin d'imprimer des menus à chaque changement
- **Flexibilité** : Modifiez vos plats et prix en temps réel
- **Hygiène** : Réduisez les contacts physiques
- **Analytics** : Découvrez quels plats sont les plus consultés

### Pour les clients
- **Praticité** : Menu accessible sur smartphone
- **Multilingue** : Traduction automatique possible
- **Informations** : Allergènes, calories, photos des plats
- **Commande** : Possibilité de commander directement

## Comment mettre en place un QR code menu

### 1. Créez votre menu digital

Plusieurs options s'offrent à vous :
- PDF hébergé en ligne
- Page web dédiée
- Application de commande
- Google Drive / Dropbox

### 2. Générez votre QR code

Utilisez QR Generator pour créer un QR code qui pointe vers votre menu. Personnalisez-le aux couleurs de votre établissement.

### 3. Imprimez et disposez

Placez vos QR codes :
- Sur chaque table (chevalet, sticker)
- À l'entrée du restaurant
- Sur les sets de table
- À la caisse

## Meilleures pratiques

- **URL courte** : Utilisez un raccourcisseur de lien pour un QR code plus simple
- **Design cohérent** : Adaptez les couleurs à votre charte graphique
- **Instructions claires** : "Scannez pour voir le menu"
- **Alternative** : Gardez quelques menus papier pour les clients moins technophiles

## ROI et statistiques

Les restaurants avec QR code menu constatent :
- +25% de panier moyen (grâce aux photos des plats)
- -40% de coûts d'impression
- +15% de satisfaction client

## Conclusion

Le QR code menu n'est plus une option mais une nécessité pour les restaurants modernes. Simple à mettre en place et économique, il améliore l'expérience client tout en optimisant vos opérations.

[Créer mon QR code menu →](/register)
    `,
  },
  "qr-code-marketing-campagne": {
    title: "QR Codes Marketing : 10 stratégies pour booster vos campagnes",
    description:
      "Les QR codes révolutionnent le marketing digital. Découvrez 10 stratégies efficaces pour intégrer les QR codes dans vos campagnes.",
    category: "Marketing",
    date: "2024-01-05",
    readTime: "8 min",
    author: "QR Generator",
    content: `
## Le retour en force des QR codes

Longtemps sous-estimés, les QR codes connaissent une renaissance spectaculaire. Avec 89 millions de scans en France en 2023, ils sont devenus un canal marketing incontournable.

## 10 stratégies marketing avec les QR codes

### 1. Packaging interactif
Ajoutez un QR code sur vos emballages pour :
- Vidéos de démonstration
- Recettes et tutoriels
- Certificats d'authenticité
- Programme de fidélité

### 2. Print-to-digital
Connectez vos supports print au digital :
- Flyers vers landing pages
- Affiches vers réseaux sociaux
- Catalogues vers e-commerce
- Cartes de visite vers LinkedIn

### 3. Événementiel
Optimisez vos événements :
- Check-in automatisé
- Programme de l'événement
- Networking digital
- Feedback instantané

### 4. Retail et point de vente
En magasin, les QR codes permettent :
- Informations produit détaillées
- Avis clients
- Comparateur de prix
- Click & Collect

### 5. Campagnes TV et radio
Convertissez l'audience broadcast :
- QR code sur spot TV
- Lien vers offre exclusive
- Téléchargement d'app
- Inscription newsletter

### 6. Street marketing
Créativité dans l'espace public :
- Affiches interactives
- Guerilla marketing
- Chasse au trésor digitale
- Réalité augmentée

### 7. Emailing et newsletter
Ajoutez un QR code dans vos emails pour :
- Téléchargement mobile
- Coupon en magasin
- Calendrier d'événement
- Carte de fidélité

### 8. Réseaux sociaux
Facilitez les connexions :
- Suivre votre compte
- Rejoindre un groupe
- Partager un profil
- Accéder à un filtre AR

### 9. Support client
Améliorez l'expérience :
- FAQ et guides
- Chat en direct
- Formulaire de contact
- Suivi de commande

### 10. A/B Testing
Optimisez vos campagnes :
- Testez différentes landing pages
- Comparez les messages
- Mesurez les conversions
- Itérez rapidement

## Mesurer le ROI

Avec QR Generator, suivez :
- Nombre de scans
- Localisation géographique
- Appareils utilisés
- Heures de scan
- Taux de conversion

## Conclusion

Les QR codes sont un pont puissant entre le monde physique et digital. Intégrés stratégiquement dans vos campagnes, ils augmentent l'engagement et les conversions.

[Lancer ma campagne QR code →](/register)
    `,
  },
  "qr-code-carte-visite": {
    title: "QR Code Carte de Visite : Le networking moderne",
    description:
      "Transformez votre carte de visite avec un QR code vCard. Partagez vos coordonnées professionnelles de manière moderne.",
    category: "Business",
    date: "2024-01-01",
    readTime: "4 min",
    author: "QR Generator",
    content: `
## La carte de visite réinventée

À l'ère du digital, la carte de visite traditionnelle évolue. Le QR code vCard permet de partager instantanément vos coordonnées professionnelles, sans ressaisie manuelle.

## Qu'est-ce qu'un QR code vCard ?

Un QR code vCard contient toutes vos informations de contact :
- Nom et prénom
- Entreprise et fonction
- Téléphone(s)
- Email(s)
- Adresse
- Site web
- Réseaux sociaux

Lorsqu'il est scanné, le contact s'enregistre automatiquement dans le téléphone.

## Avantages du QR code sur carte de visite

### Gain de temps
Plus besoin de taper manuellement les coordonnées. Un scan suffit pour enregistrer le contact.

### Zéro erreur
Fini les fautes de frappe dans les numéros de téléphone ou adresses email.

### Informations complètes
Incluez plus d'informations que sur une carte traditionnelle (plusieurs numéros, réseaux sociaux, etc.)

### Écologique
Réduisez l'impression de cartes en partageant votre QR code digitalement.

### Mise à jour facile
Avec un QR code dynamique, mettez à jour vos coordonnées sans réimprimer vos cartes.

## Comment créer votre QR code vCard

1. **Renseignez vos informations** sur QR Generator
2. **Personnalisez le design** à vos couleurs
3. **Téléchargez** en haute résolution
4. **Intégrez** sur votre carte de visite

## Où placer le QR code ?

- Au verso de votre carte
- À côté de vos coordonnées
- En remplacement du texte (carte minimaliste)
- Sur votre signature email

## Conseils design

- Taille minimum : 1.5 x 1.5 cm
- Contraste suffisant avec le fond
- Logo centré pour la reconnaissance
- Couleurs de votre charte graphique

## Conclusion

Le QR code vCard modernise votre image et facilite le networking. Adoptez cette solution simple et efficace pour vous démarquer.

[Créer mon QR code vCard →](/register)
    `,
  },
  "statistiques-qr-code-analytics": {
    title: "Analytics QR Code : Mesurez l'efficacité de vos campagnes",
    description:
      "Apprenez à analyser les performances de vos QR codes. Toutes les métriques pour optimiser vos résultats.",
    category: "Analytics",
    date: "2023-12-28",
    readTime: "6 min",
    author: "QR Generator",
    content: `
## L'importance des analytics QR code

Un QR code sans tracking, c'est comme une campagne publicitaire sans mesure de performance. Les analytics vous permettent d'optimiser vos campagnes et de maximiser votre ROI.

## Métriques essentielles

### Nombre de scans
La métrique de base : combien de fois votre QR code a été scanné.

### Scans uniques vs totaux
Distinguez les nouveaux utilisateurs des scans répétés pour comprendre l'engagement.

### Évolution temporelle
Analysez les pics d'activité :
- Par heure
- Par jour de la semaine
- Par mois

### Géolocalisation
Découvrez d'où viennent vos scans :
- Pays
- Ville
- Zone de chalandise

### Appareils
Comprenez votre audience :
- iOS vs Android
- Mobile vs Tablette
- Modèles populaires

### Source de scan
Identifiez les supports les plus performants :
- Print (affiches, flyers)
- Packaging
- Écran (TV, digital)

## Comment interpréter les données

### Taux de scan
Comparez le nombre de scans à l'exposition estimée :
- Affiche vue par 1000 personnes → 50 scans = 5% de taux

### Heures de pointe
Adaptez vos actions marketing aux moments d'engagement maximal.

### Performance géographique
Concentrez vos efforts sur les zones les plus réactives.

### Comparaison A/B
Testez différentes versions pour optimiser vos résultats.

## Dashboards QR Generator

Notre plateforme offre :
- Graphiques en temps réel
- Export des données
- Alertes personnalisées
- Rapports automatiques

## Actions correctives

Selon vos analytics :
- **Peu de scans** : Améliorez la visibilité, ajoutez un CTA
- **Beaucoup de scans, peu de conversions** : Optimisez la landing page
- **Scans concentrés** : Étendez votre présence géographique
- **Pics horaires** : Planifiez vos publications

## Conclusion

Les analytics transforment vos QR codes en outils marketing mesurables et optimisables. Avec QR Generator Pro, accédez à des statistiques détaillées pour piloter vos campagnes.

[Accéder aux analytics avancés →](/pricing)
    `,
  },
  "qr-code-wifi-partager-connexion": {
    title: "QR Code WiFi : Partagez votre connexion sans mot de passe",
    description:
      "Créez un QR code WiFi pour permettre à vos invités de se connecter instantanément à votre réseau.",
    category: "Guide",
    date: "2023-12-20",
    readTime: "4 min",
    author: "QR Generator",
    content: `
## Simplifiez le partage WiFi

Fini les mots de passe compliqués à dicter ! Un QR code WiFi permet à vos invités de se connecter à votre réseau en un scan.

## Comment ça marche ?

Le QR code WiFi contient :
- Le nom du réseau (SSID)
- Le type de sécurité (WPA, WPA2, WEP)
- Le mot de passe crypté

Lorsqu'il est scanné, le smartphone propose automatiquement de se connecter au réseau.

## Cas d'usage

### Hôtels et hébergements
- QR code dans les chambres
- Accès instantané sans réception
- Plusieurs réseaux (standard/premium)

### Restaurants et cafés
- QR code sur les tables
- Expérience client améliorée
- Pas d'attente au comptoir

### Espaces de coworking
- Accès simplifié pour les visiteurs
- Différents niveaux d'accès
- Rotation facile des mots de passe

### Événements
- WiFi temporaire pour les participants
- Distribution facile
- Gestion des accès

### Domicile
- Accueil des invités
- Pas besoin de révéler le mot de passe
- Pratique pour les Airbnb

## Créer votre QR code WiFi

### Étape 1 : Informations réseau
Récupérez sur votre box/routeur :
- Nom du réseau (SSID)
- Type de sécurité
- Mot de passe

### Étape 2 : Génération
Sur QR Generator, sélectionnez "WiFi" et entrez les informations.

### Étape 3 : Personnalisation
Adaptez le design à votre environnement (couleurs, logo).

### Étape 4 : Impression
Imprimez et placez dans un endroit visible.

## Sécurité

- Le mot de passe est encodé, pas visible en clair
- Changez régulièrement votre mot de passe WiFi
- Créez un réseau invité séparé
- Limitez la bande passante si nécessaire

## Bonnes pratiques

- **Emplacement** : Visible mais pas accessible depuis l'extérieur
- **Instructions** : "Scannez pour vous connecter au WiFi"
- **Mise à jour** : Nouveau QR code si changement de mot de passe
- **Support** : Plastifiez pour la durabilité

## Conclusion

Le QR code WiFi est une solution élégante pour partager votre connexion. Simple à créer et à utiliser, il améliore l'expérience de vos visiteurs.

[Créer mon QR code WiFi →](/register)
    `,
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articlesData[slug];

  if (!article) {
    return {
      title: "Article non trouvé",
    };
  }

  return {
    title: `${article.title} | QR Generator Blog`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(articlesData).map((slug) => ({
    slug,
  }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articlesData[slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            QR Generator
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Tarifs
            </Link>
            <Link href="/login">
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Connexion
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/blog" className="hover:text-foreground">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span>{article.category}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="px-2 py-1 rounded-md bg-muted">{article.category}</span>
            <span>{article.date}</span>
            <span>{article.readTime} de lecture</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-muted-foreground">{article.description}</p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {article.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return (
                <h2 key={i} className="text-2xl font-semibold mt-8 mb-4">
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.startsWith("### ")) {
              return (
                <h3 key={i} className="text-xl font-semibold mt-6 mb-3">
                  {line.replace("### ", "")}
                </h3>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <li key={i} className="ml-4">
                  {line.replace("- ", "")}
                </li>
              );
            }
            if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ") || line.startsWith("5. ")) {
              return (
                <li key={i} className="ml-4 list-decimal">
                  {line.replace(/^\d+\. /, "")}
                </li>
              );
            }
            if (line.includes("[") && line.includes("](")) {
              const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
              if (match) {
                return (
                  <p key={i} className="my-4">
                    <Link href={match[2]} className="text-primary hover:underline font-medium">
                      {match[1]}
                    </Link>
                  </p>
                );
              }
            }
            if (line.trim() === "") return null;
            if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <p key={i} className="font-semibold my-2">
                  {line.replace(/\*\*/g, "")}
                </p>
              );
            }
            return (
              <p key={i} className="my-4 text-muted-foreground">
                {line}
              </p>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 rounded-xl bg-primary/5 border border-primary/10 text-center">
          <h2 className="text-2xl font-semibold mb-2">
            Prêt à créer vos QR codes ?
          </h2>
          <p className="text-muted-foreground mb-6">
            Créez des QR codes professionnels gratuitement avec QR Generator.
          </p>
          <Link
            href="/register"
            className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Commencer gratuitement
          </Link>
        </div>

        {/* Author */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Écrit par <span className="font-medium text-foreground">{article.author}</span>
          </p>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 QR Generator. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
