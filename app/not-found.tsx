import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Página no encontrada</p>
      <h1 className="text-3xl font-bold">No encontramos esta sección</h1>
      <p className="text-slate-600">Verifica la URL o vuelve al panel principal.</p>
      <Link className="rounded-md bg-brand-600 px-4 py-2 font-medium text-white" href="/dashboard">
        Ir al dashboard
      </Link>
    </main>
  );
}
