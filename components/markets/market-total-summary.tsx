import { Card } from '@/components/ui/card';
import { formatCurrencyCOP } from '@/lib/formatters/currency.formatter';
import { formatShortDate } from '@/lib/formatters/date.formatter';
import type { Market } from '@/types/market.types';

type MarketTotalSummaryProps = {
  market: Market;
  itemCount: number;
};

export function MarketTotalSummary({ market, itemCount }: MarketTotalSummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Card>
        <p className="text-sm text-slate-600">Total acumulado</p>
        <p className="mt-1 text-2xl font-bold text-slate-950">{formatCurrencyCOP(market.total_amount)}</p>
      </Card>
      <Card>
        <p className="text-sm text-slate-600">Productos</p>
        <p className="mt-1 text-2xl font-bold text-slate-950">{itemCount}</p>
      </Card>
      <Card>
        <p className="text-sm text-slate-600">Fecha</p>
        <p className="mt-1 text-lg font-semibold text-slate-950">{formatShortDate(market.market_date)}</p>
      </Card>
    </div>
  );
}
