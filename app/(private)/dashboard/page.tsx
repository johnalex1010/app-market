import { KpiCard } from '@/components/dashboard/kpi-card';

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-600">Resumen inicial del control de mercado.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Mercados" value="0" />
        <KpiCard label="Productos" value="0" />
        <KpiCard label="Categorías" value="0" />
        <KpiCard label="Variación" value="0%" />
      </div>
    </section>
  );
}
