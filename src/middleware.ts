import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/_lib/session";


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

  const session = await verifySession();

  if (isProtectedRoute && (!session || !session.userId)) {
    return NextResponse.redirect(new URL("/join", req.nextUrl));
  }

  if (isPublicRoute && session) {
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