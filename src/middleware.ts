import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { decrypt } from "@/_lib/session";


const PROTECTED_ROUTES = [
  "/board",
];

const PUBLIC_ROUTES = [
  "/join",
];

const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_ROUTES.includes(path);
  const isPublicRoute = PUBLIC_ROUTES.includes(path);

  const cookie = (await cookies()).get("session")?.value;
  const userId = (await decrypt(cookie))?.sub;

  if (isProtectedRoute && !userId) {
    return NextResponse.redirect(new URL("/join", req.nextUrl));
  }

  if (isPublicRoute && userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};