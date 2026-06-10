import { notFound } from 'next/navigation';
import { MarketActions } from '@/components/markets/market-actions';
import { MarketItemForm } from '@/components/markets/market-item-form';
import { MarketItemsTable } from '@/components/markets/market-items-table';
import { MarketTotalSummary } from '@/components/markets/market-total-summary';
import { getMarketFormCatalogs, getMarketItems } from '@/services/market-items.service';
import { getCurrentUserId, getMarketById } from '@/services/markets.service';

type MarketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketDetailPage({ params }: MarketDetailPageProps) {
  const { id } = await params;
  const [market, userId] = await Promise.all([getMarketById(id), getCurrentUserId()]);

  if (!market || !userId) {
    notFound();
  }

  const [items, catalogs] = await Promise.all([getMarketItems(id), getMarketFormCatalogs(userId)]);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:flex lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">{market.name}</h1>
          {market.notes ? <p className="mt-2 max-w-3xl text-sm text-slate-600">{market.notes}</p> : null}
        </div>
        <MarketActions marketId={market.id} />
      </div>

      <MarketTotalSummary itemCount={items.length} market={market} />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-950">Agregar producto</h2>
        <MarketItemForm categories={catalogs.categories} marketId={market.id} products={catalogs.products} units={catalogs.units} />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-950">Productos del mercado</h2>
        <MarketItemsTable categories={catalogs.categories} items={items} marketId={market.id} products={catalogs.products} units={catalogs.units} />
      </div>
    </section>
  );
}
