import { NextResponse, type NextRequest } from 'next/server';

const PRIVATE_ROUTES = ['/dashboard', '/markets', '/products', '/categories', '/statistics', '/settings', '/offline'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  // La validación real de sesión se conectará en 03_SUPABASE_SETUP.md.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
