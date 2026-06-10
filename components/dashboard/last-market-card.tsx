import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrencyCOP } from '@/lib/formatters/currency.formatter';
import { formatShortDate } from '@/lib/formatters/date.formatter';
import type { MarketExpensePoint } from '@/types/statistics.types';

type LastMarketCardProps = {
  market?: MarketExpensePoint;
};

export function LastMarketCard({ market }: LastMarketCardProps) {
  if (!market) {
    return (
      <Card>
        <EmptyState title="Aún no hay mercados." description="Crea tu primer mercado para activar el resumen." />
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-sm text-slate-600">Último mercado</p>
      <Link className="mt-1 block text-lg font-semibold text-brand-700 hover:text-brand-800" href={`/markets/${market.marketId}`}>
        {market.name}
      </Link>
      <p className="mt-1 text-sm text-slate-500">{formatShortDate(market.marketDate)}</p>
      <p className="mt-4 text-2xl font-bold text-slate-950">{formatCurrencyCOP(market.totalAmount)}</p>
    </Card>
  );
}
