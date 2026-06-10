import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

const PRIVATE_ROUTES = ['/dashboard', '/markets', '/products', '/categories', '/statistics', '/settings', '/offline'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return redirectToLogin(request);
  }

  const { response, supabase } = createSupabaseMiddlewareClient(request);
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirectToLogin(request);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};

function redirectToLogin(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = '/login';
  redirectUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(redirectUrl);
}
