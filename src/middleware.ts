import { NextRequest, NextResponse } from "next/server";

// Read directly from env here — do NOT import from admin-config.ts in middleware
// because the Edge runtime needs a statically-analyzable env read.
const ADMIN_SECRET_SEGMENT = process.env.ADMIN_SECRET_PATH ?? "admin-panel";
const ADMIN_INTERNAL_PATH = "/admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block direct access to /admin (and all sub-paths)
  if (pathname === ADMIN_INTERNAL_PATH || pathname.startsWith(`${ADMIN_INTERNAL_PATH}/`)) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  // Rewrite secret path → internal /admin (URL stays secret in the browser)
  const secretPrefix = `/${ADMIN_SECRET_SEGMENT}`;
  if (pathname === secretPrefix || pathname.startsWith(`${secretPrefix}/`)) {
    const rewritePath = pathname.replace(secretPrefix, ADMIN_INTERNAL_PATH);
    const url = request.nextUrl.clone();
    url.pathname = rewritePath || ADMIN_INTERNAL_PATH;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Static matchers — Next.js evaluates these at build time
  matcher: ["/admin/:path*", "/admin", "/:secret((?!api|_next|favicon).*)/:path*"],
};
