import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; tableId: string }> }
) {
  const { slug, tableId } = await params;

  // Build the redirect URL properly to avoid encoding issues on iOS
  const baseUrl = new URL(request.url).origin;
  const redirectUrl = new URL(`/m/${encodeURIComponent(slug)}`, baseUrl);
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
