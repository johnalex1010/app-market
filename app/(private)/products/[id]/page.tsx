type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  return (
    <section>
      <h1 className="text-2xl font-bold">Detalle de producto</h1>
      <p className="mt-2 text-slate-600">ID: {id}</p>
    </section>
  );
}
