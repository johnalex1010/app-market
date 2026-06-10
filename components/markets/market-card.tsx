import Link from 'next/link';
import { CalendarDays, MoreHorizontal, Package, WalletCards } from 'lucide-react';
import { formatCurrencyCOP } from '@/lib/formatters/currency.formatter';
import { formatShortDate } from '@/lib/formatters/date.formatter';
import type { Market } from '@/types/market.types';

type MarketCardProps = {
  market: Market;
};

export function MarketCard({ market }: MarketCardProps) {
  return (
    <Link
      className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md"
      href={`/markets/${market.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-950">{market.name}</h2>
          <p className="mt-2 inline-flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
            {formatShortDate(market.market_date)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Completado</span>
          <MoreHorizontal aria-hidden="true" className="h-4 w-4 text-slate-500" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2">
          <Package aria-hidden="true" className="h-4 w-4" />
          {market.item_count ?? 0} productos
        </span>
        <span className="inline-flex items-center gap-2">
          <WalletCards aria-hidden="true" className="h-4 w-4" />
          {formatCurrencyCOP(market.total_amount)}
        </span>
      </div>
    </Link>
  );
}
