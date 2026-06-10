import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

const PRIVATE_ROUTES = ['/dashboard', '/markets', '/products', '/categories', '/statistics', '/settings', '/offline'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const hasSupabaseSessionCookie = request.cookies.getAll().some((cookie) => cookie.name.startsWith('sb-') && cookie.name.includes('auth-token'));

  if (!isPrivateRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute && !hasSupabaseSessionCookie) {
    return NextResponse.next();
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return isPrivateRoute ? redirectToLogin(request) : NextResponse.next();
  }

  const { response, supabase } = createSupabaseMiddlewareClient(request);
  const user = await getUserWithTimeout(supabase);

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!user) {
    return redirectToLogin(request);
  }

  return response;
}

async function getUserWithTimeout(supabase: ReturnType<typeof createSupabaseMiddlewareClient>['supabase']) {
  const timeout = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), 5000);
  });

  const userRequest = supabase.auth.getUser().then(({ data }) => data.user);

  return Promise.race([userRequest, timeout]);
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
