import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; tableId: string }> }
) {
  const { slug, tableId } = await params;

  // Get the host from headers (works better than request.url for redirects)
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") || "http";

  // Build the redirect URL
  const redirectUrl = new URL(`${protocol}://${host}/m/${encodeURIComponent(slug)}`);
  redirectUrl.searchParams.set("tableId", tableId);

  // Use 302 redirect with no-cache headers for iOS compatibility
  const response = NextResponse.redirect(redirectUrl.toString(), 302);
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}
