import { NextResponse, type NextRequest } from "next/server";

export const config = { matcher: ["/admin", "/admin/:path*"] };

/**
 * Gate the admin studio with HTTP Basic Auth when ADMIN_PASSWORD is set.
 * If it isn't set (e.g. local dev), the admin stays open as before.
 * This is independent of the Supabase login used to manage live content.
 */
export function proxy(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.next();

  const header = req.headers.get("authorization") || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    // Edge runtime: use atob, not Buffer.
    const decoded = atob(encoded);
    const password = decoded.slice(decoded.indexOf(":") + 1);
    if (password === expected) return NextResponse.next();
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Ferrova Admin", charset="UTF-8"' },
  });
}
