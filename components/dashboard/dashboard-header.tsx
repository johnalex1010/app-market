import Link from 'next/link';

export function DashboardHeader() {
  return (
    <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Resumen rápido de tus mercados, gastos y variaciones.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          href="/markets/new"
        >
          Nuevo mercado
        </Link>
        <Link
          className="inline-flex items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200"
          href="/products/new"
        >
          Nuevo producto
        </Link>
      </div>
    </div>
  );
}
