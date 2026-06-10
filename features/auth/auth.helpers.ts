export function isAuthRoute(pathname: string) {
  return pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
}
