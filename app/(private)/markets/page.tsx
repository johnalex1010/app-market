import Link from 'next/link';
import { MarketList } from '@/components/markets/market-list';
import { getMarketsByUser } from '@/services/markets.service';

export default async function MarketsPage() {
  const markets = await getMarketsByUser();

  return (
    <section className="space-y-6">
      <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Mis mercados</h1>
          <p className="mt-1 text-sm text-slate-600">Registra tus compras y construye histórico de precios.</p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          href="/markets/new"
        >
          Nuevo mercado
        </Link>
      </div>
      <MarketList markets={markets} />
    </section>
  );
}
