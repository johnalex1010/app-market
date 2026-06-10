import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { MarketCard } from '@/components/markets/market-card';
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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {markets.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
      <Link className="sr-only" href="/markets/new">
        Crear mercado
      </Link>
    </div>
  );
}
