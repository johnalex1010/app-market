import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { formatCurrencyCOP } from '@/lib/formatters/currency.formatter';
import { formatShortDate } from '@/lib/formatters/date.formatter';
import type { Market } from '@/types/market.types';

type MarketCardProps = {
  market: Market;
};

export function MarketCard({ market }: MarketCardProps) {
  return (
    <Card className="transition hover:border-brand-300 hover:shadow-md">
      <Link className="block space-y-3" href={`/markets/${market.id}`}>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{market.name}</h2>
          <p className="text-sm text-slate-600">{formatShortDate(market.market_date)}</p>
        </div>
        <p className="text-sm font-medium text-slate-800">Total: {formatCurrencyCOP(market.total_amount)}</p>
      </Link>
    </Card>
  );
}
