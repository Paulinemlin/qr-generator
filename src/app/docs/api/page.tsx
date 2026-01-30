"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

function CodeBlock({ code, language = "bash", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group">
      {filename && (
        <div className="bg-zinc-800 text-zinc-400 text-xs px-4 py-2 rounded-t-lg border-b border-zinc-700 font-mono">
          {filename}
        </div>
      )}
      <pre className={`bg-zinc-900 text-zinc-100 ${filename ? 'rounded-b-lg' : 'rounded-lg'} p-4 overflow-x-auto text-sm`}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 rounded-md bg-zinc-700 hover:bg-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copier le code"
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}

function EndpointCard({
  method,
  path,
  description,
  children,
}: {
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  path: string;
  description: string;
  children: React.ReactNode;
}) {
  const methodColors = {
    GET: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    POST: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    PUT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    PATCH: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    DELETE: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <Card className="border-0 bg-card shadow-sm mb-6" id={`endpoint-${method.toLowerCase()}-${path.replace(/[/:]/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Badge className={`${methodColors[method]} font-mono font-semibold`}>{method}</Badge>
          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{path}</code>
        </div>
        <p className="text-muted-foreground mb-4">{description}</p>
        {children}
      </CardContent>
    </Card>
  );
}

function TableOfContents() {
  const sections = [
    { id: "introduction", label: "Introduction" },
    { id: "quick-start", label: "Demarrage rapide" },
    { id: "authentication", label: "Authentification" },
    { id: "rate-limits", label: "Limites de requetes" },
    { id: "endpoints", label: "Endpoints" },
    { id: "errors", label: "Gestion des erreurs" },
    { id: "sdks", label: "SDKs et bibliotheques" },
  ];

  return (
    <nav className="hidden xl:block fixed left-8 top-32 w-56">
      <h4 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Sur cette page</h4>
      <ul className="space-y-2 text-sm">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function CodeTabs({ tabs }: { tabs: { label: string; language: string; code: string }[] }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="rounded-lg overflow-hidden border border-zinc-800">
      <div className="flex bg-zinc-800 border-b border-zinc-700">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === index
                ? "bg-zinc-900 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <CodeBlock code={tabs[activeTab].code} language={tabs[activeTab].language} />
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">QR Generator</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <Link href="/api-keys">
              <Button variant="ghost" size="sm">
                Mes cles API
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <TableOfContents />

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Title */}
        <div className="mb-12">
          <Badge variant="secondary" className="mb-4">API v1</Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation API</h1>
          <p className="text-xl text-muted-foreground">
            Integrez la generation de QR codes directement dans vos applications avec notre API REST.
          </p>
        </div>

        {/* Introduction */}
        <section id="introduction" className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Introduction</h2>

          <div className="prose prose-zinc dark:prose-invert max-w-none mb-6">
            <p className="text-muted-foreground leading-relaxed">
              L&apos;API QR Generator vous permet de creer, gerer et suivre vos QR codes de maniere programmatique.
              Que vous souhaitiez generer des QR codes en masse, les integrer dans votre workflow existant,
              ou automatiser la creation de codes pour vos campagnes marketing, notre API RESTful
              offre une interface simple et puissante.
            </p>
          </div>

          <Card className="border-0 bg-muted/50 mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">URL de base</h3>
              <CodeBlock code="https://qr-generator.fr/api/v1" />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Securise</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Toutes les communications sont chiffrees via HTTPS. Vos cles API sont hashees en base de donnees.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Performant</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Temps de reponse moyen inferieur a 100ms. Infrastructure hautement disponible.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quick-start" className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Demarrage rapide</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Souscrivez au plan Business</h3>
                <p className="text-muted-foreground mb-3">
                  L&apos;acces a l&apos;API est reserve aux utilisateurs ayant souscrit au plan Business.
                  <Link href="/pricing" className="text-primary hover:underline ml-1">Voir les tarifs</Link>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Creez votre cle API</h3>
                <p className="text-muted-foreground mb-3">
                  Rendez-vous sur la page <Link href="/api-keys" className="text-primary hover:underline">Cles API</Link> pour
                  generer votre premiere cle. Conservez-la precieusement, elle ne sera affichee qu&apos;une seule fois.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Effectuez votre premiere requete</h3>
                <p className="text-muted-foreground mb-4">
                  Utilisez les exemples ci-dessous pour creer votre premier QR code via l&apos;API.
                </p>

                <CodeTabs
                  tabs={[
                    {
                      label: "cURL",
                      language: "bash",
                      code: `curl -X POST "https://qr-generator.fr/api/v1/qrcodes" \\
  -H "X-API-Key: qr_votre_cle_api" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Mon premier QR Code",
    "targetUrl": "https://mon-site.fr"
  }'`,
                    },
                    {
                      label: "JavaScript",
                      language: "javascript",
                      code: `const response = await fetch("https://qr-generator.fr/api/v1/qrcodes", {
  method: "POST",
  headers: {
    "X-API-Key": "qr_votre_cle_api",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Mon premier QR Code",
    targetUrl: "https://mon-site.fr",
  }),
});

const qrCode = await response.json();
console.log(qrCode);`,
                    },
                    {
                      label: "Python",
                      language: "python",
                      code: `import requests

response = requests.post(
    "https://qr-generator.fr/api/v1/qrcodes",
    headers={
        "X-API-Key": "qr_votre_cle_api",
        "Content-Type": "application/json",
    },
    json={
        "name": "Mon premier QR Code",
        "targetUrl": "https://mon-site.fr",
    }
)

qr_code = response.json()
print(qr_code)`,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section id="authentication" className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Authentification</h2>

          <p className="text-muted-foreground mb-4">
            Toutes les requetes vers l&apos;API doivent inclure votre cle API dans le header HTTP <code className="bg-muted px-1.5 py-0.5 rounded text-sm">X-API-Key</code>.
          </p>

          <Card className="border-0 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-l-amber-500 mb-6">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200">Securite</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Ne partagez jamais votre cle API publiquement et ne l&apos;incluez pas dans le code cote client.
                    Utilisez des variables d&apos;environnement pour stocker vos cles.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <CodeBlock
            code={`# Exemple d'authentification
curl -X GET "https://qr-generator.fr/api/v1/qrcodes" \\
  -H "X-API-Key: qr_votre_cle_api"`}
          />

          <div className="mt-6">
            <h3 className="font-semibold mb-3">Reponse en cas de cle invalide</h3>
            <CodeBlock
              language="json"
              code={`{
  "error": "Cle API invalide ou manquante"
}`}
            />
          </div>
        </section>

        {/* Rate Limits */}
        <section id="rate-limits" className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Limites de requetes</h2>

          <p className="text-muted-foreground mb-6">
            Pour garantir la stabilite du service, l&apos;API impose des limites sur le nombre de requetes.
          </p>

          <Card className="border-0 bg-card shadow-sm mb-6">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-semibold">Plan</th>
                    <th className="text-left py-3 px-4 font-semibold">Requetes / minute</th>
                    <th className="text-left py-3 px-4 font-semibold">Requetes / jour</th>
                    <th className="text-left py-3 px-4 font-semibold">Cles API max</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-3 px-4">
                      <Badge variant="secondary">Business</Badge>
                    </td>
                    <td className="py-3 px-4">60</td>
                    <td className="py-3 px-4">10 000</td>
                    <td className="py-3 px-4">10</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          <h3 className="font-semibold mb-3">En-tetes de reponse</h3>
          <p className="text-muted-foreground mb-4">
            Chaque reponse inclut des en-tetes vous informant de votre utilisation :
          </p>
          <CodeBlock
            code={`X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1706187600`}
          />

          <Card className="border-0 bg-red-50 dark:bg-red-950/30 border-l-4 border-l-red-500 mt-6">
            <CardContent className="p-4">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Limite atteinte (429 Too Many Requests)</h4>
              <CodeBlock
                language="json"
                code={`{
  "error": "Limite de requetes atteinte. Reessayez dans 45 secondes."
}`}
              />
            </CardContent>
          </Card>
        </section>

        {/* Endpoints */}
        <section id="endpoints" className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Endpoints</h2>

          {/* POST /qrcodes - Create */}
          <EndpointCard
            method="POST"
            path="/qrcodes"
            description="Cree un nouveau QR code dynamique avec les options de personnalisation specifiees."
          >
            <h4 className="font-semibold mb-3">Corps de la requete</h4>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-2 px-3 font-semibold">Parametre</th>
                    <th className="text-left py-2 px-3 font-semibold">Type</th>
                    <th className="text-left py-2 px-3 font-semibold">Requis</th>
                    <th className="text-left py-2 px-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-2 px-3"><code className="text-xs">name</code></td>
                    <td className="py-2 px-3">string</td>
                    <td className="py-2 px-3"><Badge variant="destructive" className="text-xs">Oui</Badge></td>
                    <td className="py-2 px-3">Nom du QR code</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3"><code className="text-xs">targetUrl</code></td>
                    <td className="py-2 px-3">string</td>
                    <td className="py-2 px-3"><Badge variant="destructive" className="text-xs">Oui</Badge></td>
                    <td className="py-2 px-3">URL de destination</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3"><code className="text-xs">type</code></td>
                    <td className="py-2 px-3">string</td>
                    <td className="py-2 px-3"><Badge variant="secondary" className="text-xs">Non</Badge></td>
                    <td className="py-2 px-3">Type de QR code (defaut: &quot;url&quot;)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3"><code className="text-xs">qrContent</code></td>
                    <td className="py-2 px-3">string</td>
                    <td className="py-2 px-3"><Badge variant="secondary" className="text-xs">Non</Badge></td>
                    <td className="py-2 px-3">Contenu additionnel</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3"><code className="text-xs">logoUrl</code></td>
                    <td className="py-2 px-3">string</td>
                    <td className="py-2 px-3"><Badge variant="secondary" className="text-xs">Non</Badge></td>
                    <td className="py-2 px-3">URL du logo a incruster</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3"><code className="text-xs">foregroundColor</code></td>
                    <td className="py-2 px-3">string</td>
                    <td className="py-2 px-3"><Badge variant="secondary" className="text-xs">Non</Badge></td>
                    <td className="py-2 px-3">Couleur de premier plan en hex (defaut: #000000)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3"><code className="text-xs">backgroundColor</code></td>
                    <td className="py-2 px-3">string</td>
                    <td className="py-2 px-3"><Badge variant="secondary" className="text-xs">Non</Badge></td>
                    <td className="py-2 px-3">Couleur de fond en hex (defaut: #ffffff)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3"><code className="text-xs">size</code></td>
                    <td className="py-2 px-3">number</td>
                    <td className="py-2 px-3"><Badge variant="secondary" className="text-xs">Non</Badge></td>
                    <td className="py-2 px-3">Taille en pixels (100-2000, defaut: 400)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3"><code className="text-xs">cornerStyle</code></td>
                    <td className="py-2 px-3">string</td>
                    <td className="py-2 px-3"><Badge variant="secondary" className="text-xs">Non</Badge></td>
                    <td className="py-2 px-3">&quot;square&quot; ou &quot;rounded&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="font-semibold mb-2">Exemple de requete</h4>
            <CodeBlock
              code={`curl -X POST "https://qr-generator.fr/api/v1/qrcodes" \\
  -H "X-API-Key: qr_votre_cle_api" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Campagne Ete 2024",
    "targetUrl": "https://mon-site.fr/promo-ete",
    "foregroundColor": "#1e40af",
    "backgroundColor": "#f0f9ff",
    "size": 600,
    "cornerStyle": "rounded"
  }'`}
            />

            <h4 className="font-semibold mt-6 mb-2">Reponse (201 Created)</h4>
            <CodeBlock
              language="json"
              code={`{
  "id": "clx1234567890abcdef",
  "name": "Campagne Ete 2024",
  "type": "url",
  "targetUrl": "https://mon-site.fr/promo-ete",
  "foregroundColor": "#1e40af",
  "backgroundColor": "#f0f9ff",
  "size": 600,
  "cornerStyle": "rounded",
  "qrImageUrl": "data:image/png;base64,iVBORw0KGgo...",
  "redirectUrl": "https://qr-generator.fr/r/clx1234567890abcdef",
  "createdAt": "2024-06-15T14:22:00.000Z"
}`}
            />
          </EndpointCard>

          {/* GET /qrcodes - List */}
          <EndpointCard
            method="GET"
            path="/qrcodes"
            description="Recupere la liste de tous vos QR codes avec pagination."
          >
            <h4 className="font-semibold mb-3">Parametres de requete</h4>
            <ul className="text-sm text-muted-foreground mb-4 space-y-2">
              <li><code className="bg-muted px-1.5 py-0.5 rounded">page</code> - Numero de page (defaut: 1)</li>
              <li><code className="bg-muted px-1.5 py-0.5 rounded">limit</code> - Nombre de resultats par page (defaut: 20, max: 100)</li>
            </ul>

            <h4 className="font-semibold mb-2">Exemple</h4>
            <CodeBlock
              code={`curl -X GET "https://qr-generator.fr/api/v1/qrcodes?page=1&limit=10" \\
  -H "X-API-Key: qr_votre_cle_api"`}
            />

            <h4 className="font-semibold mt-6 mb-2">Reponse (200 OK)</h4>
            <CodeBlock
              language="json"
              code={`{
  "data": [
    {
      "id": "clx1234567890abcdef",
      "name": "Campagne Ete 2024",
      "type": "url",
      "targetUrl": "https://mon-site.fr/promo-ete",
      "foregroundColor": "#1e40af",
      "backgroundColor": "#f0f9ff",
      "size": 600,
      "cornerStyle": "rounded",
      "createdAt": "2024-06-15T14:22:00.000Z",
      "scanCount": 142
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}`}
            />
          </EndpointCard>

          {/* GET /qrcodes/:id - Get single */}
          <EndpointCard
            method="GET"
            path="/qrcodes/:id"
            description="Recupere les details complets d'un QR code specifique, incluant l'image encodee en base64."
          >
            <h4 className="font-semibold mb-2">Exemple</h4>
            <CodeBlock
              code={`curl -X GET "https://qr-generator.fr/api/v1/qrcodes/clx1234567890abcdef" \\
  -H "X-API-Key: qr_votre_cle_api"`}
            />

            <h4 className="font-semibold mt-6 mb-2">Reponse (200 OK)</h4>
            <CodeBlock
              language="json"
              code={`{
  "id": "clx1234567890abcdef",
  "name": "Campagne Ete 2024",
  "type": "url",
  "targetUrl": "https://mon-site.fr/promo-ete",
  "logoUrl": null,
  "qrImageUrl": "data:image/png;base64,iVBORw0KGgo...",
  "foregroundColor": "#1e40af",
  "backgroundColor": "#f0f9ff",
  "size": 600,
  "cornerStyle": "rounded",
  "redirectUrl": "https://qr-generator.fr/r/clx1234567890abcdef",
  "createdAt": "2024-06-15T14:22:00.000Z",
  "scanCount": 142
}`}
            />
          </EndpointCard>

          {/* DELETE /qrcodes/:id */}
          <EndpointCard
            method="DELETE"
            path="/qrcodes/:id"
            description="Supprime definitivement un QR code. Cette action est irreversible."
          >
            <Card className="border-0 bg-red-50 dark:bg-red-950/30 border-l-4 border-l-red-500 mb-4">
              <CardContent className="p-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  Attention : La suppression d&apos;un QR code entrainera egalement la suppression de toutes ses statistiques de scan.
                </p>
              </CardContent>
            </Card>

            <h4 className="font-semibold mb-2">Exemple</h4>
            <CodeBlock
              code={`curl -X DELETE "https://qr-generator.fr/api/v1/qrcodes/clx1234567890abcdef" \\
  -H "X-API-Key: qr_votre_cle_api"`}
            />

            <h4 className="font-semibold mt-6 mb-2">Reponse (200 OK)</h4>
            <CodeBlock
              language="json"
              code={`{
  "success": true,
  "message": "QR code supprime avec succes."
}`}
            />
          </EndpointCard>

          {/* GET /qrcodes/:id/stats */}
          <EndpointCard
            method="GET"
            path="/qrcodes/:id/stats"
            description="Recupere les statistiques detaillees de scan d'un QR code : tendances, repartition geographique, types d'appareils."
          >
            <h4 className="font-semibold mb-3">Parametres de requete</h4>
            <ul className="text-sm text-muted-foreground mb-4 space-y-2">
              <li><code className="bg-muted px-1.5 py-0.5 rounded">startDate</code> - Date de debut au format ISO 8601 (optionnel)</li>
              <li><code className="bg-muted px-1.5 py-0.5 rounded">endDate</code> - Date de fin au format ISO 8601 (optionnel)</li>
            </ul>

            <h4 className="font-semibold mb-2">Exemple</h4>
            <CodeBlock
              code={`curl -X GET "https://qr-generator.fr/api/v1/qrcodes/clx.../stats?startDate=2024-01-01&endDate=2024-06-30" \\
  -H "X-API-Key: qr_votre_cle_api"`}
            />

            <h4 className="font-semibold mt-6 mb-2">Reponse (200 OK)</h4>
            <CodeBlock
              language="json"
              code={`{
  "qrCodeId": "clx1234567890abcdef",
  "qrCodeName": "Campagne Ete 2024",
  "totalScans": 142,
  "scansByDay": [
    { "date": "2024-06-13", "count": 23 },
    { "date": "2024-06-14", "count": 45 },
    { "date": "2024-06-15", "count": 38 }
  ],
  "scansByCountry": [
    { "country": "FR", "count": 98 },
    { "country": "BE", "count": 24 },
    { "country": "CH", "count": 12 },
    { "country": "CA", "count": 8 }
  ],
  "deviceStats": {
    "mobile": 112,
    "desktop": 22,
    "tablet": 8,
    "other": 0
  },
  "recentScans": [
    {
      "scannedAt": "2024-06-15T16:45:00.000Z",
      "country": "FR",
      "device": "mobile"
    }
  ]
}`}
            />
          </EndpointCard>
        </section>

        {/* Error Handling */}
        <section id="errors" className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Gestion des erreurs</h2>

          <p className="text-muted-foreground mb-6">
            L&apos;API utilise les codes de statut HTTP standards pour indiquer le succes ou l&apos;echec d&apos;une requete.
            En cas d&apos;erreur, le corps de la reponse contient un message explicatif.
          </p>

          <Card className="border-0 bg-card shadow-sm mb-6">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-semibold">Code</th>
                    <th className="text-left py-3 px-4 font-semibold">Statut</th>
                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-3 px-4"><code className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">200</code></td>
                    <td className="py-3 px-4">OK</td>
                    <td className="py-3 px-4">Requete reussie</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4"><code className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">201</code></td>
                    <td className="py-3 px-4">Created</td>
                    <td className="py-3 px-4">Ressource creee avec succes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4"><code className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">400</code></td>
                    <td className="py-3 px-4">Bad Request</td>
                    <td className="py-3 px-4">Parametres manquants ou invalides</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4"><code className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">401</code></td>
                    <td className="py-3 px-4">Unauthorized</td>
                    <td className="py-3 px-4">Cle API manquante ou invalide</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4"><code className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">403</code></td>
                    <td className="py-3 px-4">Forbidden</td>
                    <td className="py-3 px-4">Plan insuffisant ou limite atteinte</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4"><code className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">404</code></td>
                    <td className="py-3 px-4">Not Found</td>
                    <td className="py-3 px-4">Ressource non trouvee</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4"><code className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">429</code></td>
                    <td className="py-3 px-4">Too Many Requests</td>
                    <td className="py-3 px-4">Limite de requetes atteinte</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4"><code className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">500</code></td>
                    <td className="py-3 px-4">Internal Server Error</td>
                    <td className="py-3 px-4">Erreur serveur interne</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          <h3 className="font-semibold mb-3">Format des erreurs</h3>
          <p className="text-muted-foreground mb-4">
            Toutes les erreurs retournent un objet JSON avec un champ <code className="bg-muted px-1.5 py-0.5 rounded text-sm">error</code> decrivant le probleme.
          </p>
          <CodeBlock
            language="json"
            code={`{
  "error": "Le parametre 'name' est requis."
}`}
          />

          <h3 className="font-semibold mt-6 mb-3">Exemples d&apos;erreurs courantes</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Cle API invalide (401)</p>
              <CodeBlock
                language="json"
                code={`{
  "error": "Cle API invalide ou manquante"
}`}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">QR code non trouve (404)</p>
              <CodeBlock
                language="json"
                code={`{
  "error": "QR code non trouve"
}`}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Parametre invalide (400)</p>
              <CodeBlock
                language="json"
                code={`{
  "error": "L'URL de destination doit etre une URL valide"
}`}
              />
            </div>
          </div>
        </section>

        {/* SDKs */}
        <section id="sdks" className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">SDKs et bibliotheques</h2>

          <p className="text-muted-foreground mb-6">
            Nous travaillons sur des SDKs officiels pour simplifier l&apos;integration de notre API dans vos projets.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                      <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
                    </svg>
                    <span className="font-semibold">JavaScript / Node.js</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">Bientot</Badge>
                </div>
                <p className="text-sm text-muted-foreground">SDK officiel pour Node.js et navigateurs modernes.</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                      <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
                    </svg>
                    <span className="font-semibold">Python</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">Bientot</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Package pip pour Python 3.8+.</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-purple-500">
                      <path d="M10.27 3.017c-.688-.163-1.449-.206-2.211-.206-.789 0-1.577.043-2.366.206-.789.163-1.532.434-2.229.789-.697.354-1.313.789-1.848 1.306-.535.516-.989 1.115-1.361 1.795-.372.68-.663 1.442-.871 2.284-.209.842-.313 1.766-.313 2.773 0 1.006.104 1.93.313 2.773.208.842.499 1.603.871 2.284.372.68.826 1.279 1.361 1.795.535.517 1.151.952 1.848 1.306.697.355 1.44.626 2.229.789.789.163 1.577.206 2.366.206.762 0 1.523-.043 2.211-.206v-2.855c-.526.163-1.078.245-1.658.245-.553 0-1.078-.082-1.577-.245-.498-.163-.943-.408-1.334-.734-.391-.327-.717-.734-.979-1.224-.262-.489-.453-1.06-.571-1.713-.118-.653-.177-1.388-.177-2.204 0-.816.059-1.551.177-2.204.118-.653.309-1.224.571-1.713.262-.49.588-.898.979-1.224.391-.327.836-.571 1.334-.734.499-.163 1.024-.245 1.577-.245.58 0 1.132.082 1.658.245V3.017zM23.186 5.52c-.372-.68-.826-1.279-1.361-1.795-.535-.517-1.151-.952-1.848-1.306-.697-.355-1.44-.626-2.229-.789-.789-.163-1.577-.206-2.366-.206v2.855c.58 0 1.132.082 1.658.245.499.163.943.408 1.334.734.391.326.717.734.979 1.224.262.489.453 1.06.571 1.713.118.653.177 1.388.177 2.204 0 .816-.059 1.551-.177 2.204-.118.653-.309 1.224-.571 1.713-.262.49-.588.897-.979 1.224-.391.326-.836.571-1.334.734-.526.163-1.078.245-1.658.245v2.855c.789 0 1.577-.043 2.366-.206.789-.163 1.532-.434 2.229-.789.697-.354 1.313-.789 1.848-1.306.535-.516.989-1.115 1.361-1.795.372-.681.663-1.442.871-2.284.209-.843.313-1.767.313-2.773 0-1.007-.104-1.931-.313-2.773-.208-.842-.499-1.604-.871-2.284z"/>
                    </svg>
                    <span className="font-semibold">PHP</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">Bientot</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Package Composer pour PHP 8.0+.</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                      <path d="M2.52 3.515l9.48-3.515 9.48 3.515v8.97c0 4.178-4.015 7.785-9.48 10-5.465-2.215-9.48-5.822-9.48-10v-8.97zm6.48 9.485h6v-1.5h-4.5v-1.5h3v-1.5h-3v-1.5h4.5v-1.5h-6v7.5z"/>
                    </svg>
                    <span className="font-semibold">Ruby</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">Bientot</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Gem Ruby pour Rails et applications standalone.</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-500">
                      <path d="M0 12C0 5.373 5.373 0 12 0c4.873 0 9.067 2.904 10.947 7.077l-15.87 15.87a11.981 11.981 0 0 1-1.935-1.099L14.99 12H12l-8.485 8.485A11.962 11.962 0 0 1 0 12zm12.004 12L24 12.004C23.998 18.628 18.628 23.998 12.004 24z"/>
                    </svg>
                    <span className="font-semibold">Go</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">Bientot</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Module Go pour applications backend.</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 14.683c-.247.46-.644.916-1.155 1.34-.54.447-1.236.82-2.013 1.073-1.033.336-2.293.482-3.6.402a11.437 11.437 0 0 1-2.32-.313c-.742-.18-1.385-.416-1.873-.664-.49-.25-.913-.554-1.236-.848-.304-.276-.531-.573-.688-.841l1.732-1.001c.175.311.417.607.71.875.308.282.664.524 1.042.714.396.2.82.353 1.254.45.452.102.91.154 1.361.154.577 0 1.092-.064 1.53-.191.426-.124.776-.298 1.036-.507.246-.197.42-.429.516-.681.097-.253.121-.524.072-.807-.053-.31-.185-.575-.393-.79-.22-.229-.516-.417-.876-.56-.38-.15-.827-.27-1.327-.356-.524-.09-1.103-.162-1.72-.213-.62-.051-1.235-.099-1.842-.143-.59-.043-1.11-.099-1.553-.168a6.088 6.088 0 0 1-1.194-.29c-.33-.122-.612-.28-.832-.469-.208-.178-.364-.401-.463-.665-.092-.247-.107-.543-.046-.881.068-.374.229-.712.479-1.005.261-.306.607-.57 1.027-.783.437-.221.946-.39 1.514-.503.592-.118 1.24-.177 1.93-.177.686 0 1.346.054 1.963.163.604.107 1.151.26 1.627.457.462.19.854.422 1.166.69.302.259.519.553.646.874l-1.759.928c-.126-.239-.317-.456-.565-.641a3.796 3.796 0 0 0-.827-.472 5.36 5.36 0 0 0-.994-.295 6.38 6.38 0 0 0-1.085-.102c-.48 0-.908.045-1.273.135-.354.088-.652.21-.883.366-.222.15-.386.328-.487.533-.097.197-.123.415-.08.649.048.263.171.483.366.655.206.183.48.33.812.44.348.117.759.208 1.22.273.481.067 1.016.122 1.59.166.576.044 1.164.094 1.756.15.578.055 1.115.132 1.597.23.464.094.866.218 1.194.371.316.148.565.329.738.542.168.206.26.454.277.743.015.276-.048.584-.188.922z"/>
                    </svg>
                    <span className="font-semibold">C# / .NET</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">Bientot</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Package NuGet pour .NET 6+.</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-l-blue-500 mt-6">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Vous souhaitez un SDK pour votre langage ?</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Contactez-nous a <a href="mailto:api@qr-generator.fr" className="underline">api@qr-generator.fr</a> pour nous faire part de vos besoins.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section>
          <Card className="border-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-2">Pret a commencer ?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Creez votre premiere cle API et integrez QR Generator dans vos applications en quelques minutes.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/api-keys">
                  <Button size="lg" className="w-full sm:w-auto">
                    Creer une cle API
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Voir les plans
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Des questions ? Contactez notre equipe a{" "}
            <a href="mailto:support@qr-generator.fr" className="text-primary hover:underline">
              support@qr-generator.fr
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
