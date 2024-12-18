import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server"
import { decrypt } from "./_lib/session";


const PROTECTED_ROUTES = [
  "/board",
];

export default async (req: NextRequest) => {
  const currentPath = req.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_ROUTES.includes(currentPath);

  if (isProtectedRoute) {
    const cookie = (await cookies()).get("session")?.value;

    if (!cookie || !(await decrypt(cookie))?.sub) {
      return NextResponse.redirect(new URL("/join", req.nextUrl));
    }
  }
  return NextResponse.next();
};


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
}