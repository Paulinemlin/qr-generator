import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RedirectPage({ params }: PageProps) {
  const { id } = await params;

  const qrcode = await prisma.qRCode.findUnique({
    where: { id },
  });

  if (!qrcode) {
    redirect("/");
  }

  // Record the scan
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || undefined;
  const forwarded = headersList.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : undefined;

  try {
    await prisma.scan.create({
      data: {
        qrcodeId: qrcode.id,
        userAgent,
        ip,
      },
    });
  } catch (error) {
    console.error("Error recording scan:", error);
  }

  let targetUrl = qrcode.targetUrl;

  // Ensure URL has a valid protocol
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = "https://" + targetUrl;
  }

  // Escape for safe JavaScript insertion
  const safeUrl = targetUrl.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/'/g, "\\'");

  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0;url=${encodeURI(targetUrl)}`} />
        <meta name="robots" content="noindex" />
        <title>Redirection...</title>
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#f5f5f5"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40,
            height: 40,
            border: "3px solid #e5e5e5",
            borderTopColor: "#333",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px"
          }} />
          <p style={{ color: "#666", margin: 0 }}>Redirection en cours...</p>
          <p style={{ marginTop: 16 }}>
            <a href={targetUrl} style={{ color: "#0066cc" }}>
              Cliquez ici si la redirection ne fonctionne pas
            </a>
          </p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            window.location.replace("${safeUrl}");
          } catch(e) {
            window.location.href = "${safeUrl}";
          }
        `}} />
      </body>
    </html>
  );
}
