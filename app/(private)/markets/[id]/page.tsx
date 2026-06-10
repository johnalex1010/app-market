type MarketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketDetailPage({ params }: MarketDetailPageProps) {
  const { id } = await params;

  return (
    <section>
      <h1 className="text-2xl font-bold">Detalle de mercado</h1>
      <p className="mt-2 text-slate-600">ID: {id}</p>
    </section>
  );
}
