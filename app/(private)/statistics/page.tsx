import { CategoryPieChart } from '@/components/charts/category-pie-chart';
import { MarketBarChart } from '@/components/charts/market-bar-chart';
import { ProductVariationChart } from '@/components/charts/product-variation-chart';
import { Card } from '@/components/ui/card';
import { formatCurrencyCOP } from '@/lib/formatters/currency.formatter';
import { getStatistics } from '@/services/statistics.service';
import type { StatisticSummary } from '@/types/statistics.types';

function formatSummary(summary: StatisticSummary) {
  if (summary.format === 'currency') {
    return formatCurrencyCOP(summary.value);
  }

  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0
  }).format(summary.value);
}

export default async function StatisticsPage() {
  const statistics = await getStatistics();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Estadísticas</h1>
        <p className="mt-1 text-sm text-slate-600">Analiza gastos, categorías y variaciones usando tus mercados registrados.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.summaries.map((summary) => (
          <Card key={summary.label}>
            <p className="text-sm text-slate-600">{summary.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{formatSummary(summary)}</p>
            {summary.helper ? <p className="mt-1 text-xs text-slate-500">{summary.helper}</p> : null}
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-950">Gasto por mercado</h2>
            <p className="text-sm text-slate-600">Últimos mercados registrados.</p>
          </div>
          <MarketBarChart data={statistics.recentMarkets} />
        </Card>

        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-950">Gasto por categoría</h2>
            <p className="text-sm text-slate-600">Distribución según los productos registrados.</p>
          </div>
          <CategoryPieChart data={statistics.categoryExpenses} />
        </Card>
      </div>

      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-950">Variación de productos</h2>
          <p className="text-sm text-slate-600">Productos con al menos dos registros, ordenados por mayor cambio porcentual.</p>
        </div>
        <ProductVariationChart data={statistics.productVariations} />
      </Card>
    </section>
  );
}
