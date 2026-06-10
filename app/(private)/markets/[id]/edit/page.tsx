import { notFound } from 'next/navigation';
import { MarketForm } from '@/components/markets/market-form';
import { getMarketById } from '@/services/markets.service';

type EditMarketPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMarketPage({ params }: EditMarketPageProps) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Editar mercado</h1>
        <p className="mt-1 text-sm text-slate-600">Actualiza la información general del mercado.</p>
      </div>
      <MarketForm market={market} />
    </section>
  );
}
