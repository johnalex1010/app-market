import Link from 'next/link';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ExpenseOverview } from '@/components/dashboard/expense-overview';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { LastMarketCard } from '@/components/dashboard/last-market-card';
import { MarketSummaryCard } from '@/components/dashboard/market-summary-card';
import { PriceTrendCard } from '@/components/dashboard/price-trend-card';
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

export default async function DashboardPage() {
  const statistics = await getStatistics();
  const lastMarket = statistics.recentMarkets[0];

  return (
    <section className="space-y-6">
      <DashboardHeader />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statistics.summaries.map((summary) => (
          <KpiCard key={summary.label} helper={summary.helper} label={summary.label} value={formatSummary(summary)} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_1fr]">
        <LastMarketCard market={lastMarket} />
        <MarketSummaryCard markets={statistics.recentMarkets} />
        <Card>
          <p className="text-sm text-slate-600">Accesos rápidos</p>
          <div className="mt-4 grid gap-2">
            <Link className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200" href="/markets">
              Ver mercados
            </Link>
            <Link className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200" href="/products">
              Ver productos
            </Link>
            <Link className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200" href="/statistics">
              Ver estadísticas completas
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ExpenseOverview categories={statistics.categoryExpenses.slice(0, 5)} />
        <PriceTrendCard variations={statistics.productVariations.slice(0, 5)} />
      </div>
    </section>
  );
}
