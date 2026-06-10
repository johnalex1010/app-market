import Link from 'next/link';
import { MarketCard } from '@/components/markets/market-card';
import { MarketToolbar } from '@/components/markets/market-toolbar';
import { EmptyState } from '@/components/ui/empty-state';
import type { Market } from '@/types/market.types';

type MarketListProps = {
  markets: Market[];
};

export function MarketList({ markets }: MarketListProps) {
  if (markets.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes mercados registrados."
        description="Crea tu primer mercado para empezar a comparar precios."
      />
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="border-b border-slate-200 pb-3">
        <MarketToolbar />
      </div>

      <div className="grid gap-4 py-4 lg:grid-cols-3">
        {markets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
        <Link className="sr-only" href="/markets/new">
          Crear mercado
        </Link>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-1 pt-3 text-sm text-slate-500">
        <span>Mostrando 1 a {markets.length} de {markets.length} mercados</span>
        <span>Página 1</span>
      </div>
    </div>
  );
}
