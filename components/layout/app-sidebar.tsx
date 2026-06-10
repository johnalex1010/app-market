import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/markets', label: 'Mercados' },
  { href: '/products', label: 'Productos' },
  { href: '/categories', label: 'Categorías' },
  { href: '/statistics', label: 'Estadísticas' },
  { href: '/settings', label: 'Configuración' }
];

export function AppSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-200 bg-white p-4 md:block">
      <p className="mb-6 text-lg font-bold">App Mercado</p>
      <nav className="grid gap-1" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => (
          <Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
