import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrencyCOP } from '@/lib/formatters/currency.formatter';
import { formatShortDate } from '@/lib/formatters/date.formatter';
import type { MarketExpensePoint } from '@/types/statistics.types';

type MarketBarChartProps = {
  data: MarketExpensePoint[];
};

export function MarketBarChart({ data }: MarketBarChartProps) {
  if (data.length === 0) {
    return <EmptyState title="Sin mercados registrados." description="Crea mercados para ver el gasto reciente." />;
  }

  const maxValue = Math.max(...data.map((item) => item.totalAmount), 1);

  return (
    <div className="space-y-3" role="img" aria-label="Gasto por mercado reciente">
      {data.map((item) => (
        <div key={item.marketId} className="space-y-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <Link className="font-medium text-brand-700 hover:text-brand-800" href={`/markets/${item.marketId}`}>
              {item.name}
            </Link>
            <span className="text-slate-600">{formatCurrencyCOP(item.totalAmount)}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-brand-600" style={{ width: `${Math.max((item.totalAmount / maxValue) * 100, 4)}%` }} />
          </div>
          <p className="text-xs text-slate-500">{formatShortDate(item.marketDate)}</p>
        </div>
      ))}
    </div>
  );
}
