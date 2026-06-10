import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { formatCurrencyCOP } from '@/lib/formatters/currency.formatter';
import type { MarketExpensePoint } from '@/types/statistics.types';

type MarketSummaryCardProps = {
  markets: MarketExpensePoint[];
};

export function MarketSummaryCard({ markets }: MarketSummaryCardProps) {
  const total = markets.reduce((sum, market) => sum + market.totalAmount, 0);
  const topMarket = [...markets].sort((a, b) => b.totalAmount - a.totalAmount)[0];

  return (
    <Card>
      <p className="text-sm text-slate-600">Resumen de mercados recientes</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{formatCurrencyCOP(total)}</p>
      <p className="mt-1 text-sm text-slate-500">Suma de los últimos {markets.length} mercados mostrados.</p>
      {topMarket ? (
        <p className="mt-4 text-sm text-slate-700">
          Mayor gasto reciente:{' '}
          <Link className="font-medium text-brand-700 hover:text-brand-800" href={`/markets/${topMarket.marketId}`}>
            {topMarket.name}
          </Link>
        </p>
      ) : null}
    </Card>
  );
}
