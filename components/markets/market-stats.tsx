import { BarChart3, CalendarDays, ShoppingBasket, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { formatCurrencyCOP } from '@/lib/formatters/currency.formatter';
import type { Market } from '@/types/market.types';

type MarketStatsProps = {
  markets: Market[];
};

function StatCard({
  icon,
  label,
  value,
  description
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">{icon}</span>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-950">{value}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function MarketStats({ markets }: MarketStatsProps) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const thisMonthCount = markets.filter((market) => {
    const marketDate = new Date(market.market_date);

    return marketDate.getMonth() === currentMonth && marketDate.getFullYear() === currentYear;
  }).length;
  const totalAmount = markets.reduce((total, market) => total + market.total_amount, 0);
  const averageAmount = markets.length > 0 ? totalAmount / markets.length : 0;

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <StatCard description="Todos los registros" icon={<ShoppingBasket aria-hidden="true" className="h-5 w-5" />} label="Total mercados" value={markets.length} />
      <StatCard description="Mercados registrados" icon={<CalendarDays aria-hidden="true" className="h-5 w-5" />} label="Este mes" value={thisMonthCount} />
      <StatCard description="En todos los mercados" icon={<TrendingUp aria-hidden="true" className="h-5 w-5" />} label="Gasto total" value={formatCurrencyCOP(totalAmount)} />
      <StatCard description="Gasto promedio" icon={<BarChart3 aria-hidden="true" className="h-5 w-5" />} label="Promedio por mercado" value={formatCurrencyCOP(averageAmount)} />
    </div>
  );
}
