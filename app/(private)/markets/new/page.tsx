import { MarketForm } from '@/components/markets/market-form';

export default function NewMarketPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Nuevo mercado</h1>
        <p className="mt-1 text-sm text-slate-600">Crea el mercado y luego agrega los productos comprados.</p>
      </div>
      <MarketForm />
    </section>
  );
}
