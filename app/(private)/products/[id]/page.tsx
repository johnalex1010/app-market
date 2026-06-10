import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ConfirmSubmitButton } from '@/components/ui/confirm-submit-button';
import { ProductPriceHistory } from '@/components/products/product-price-history';
import { deleteProductAction } from '@/features/products/product.actions';
import { getProductById, getProductPriceHistory } from '@/services/products.service';

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const [product, history] = await Promise.all([getProductById(id), getProductPriceHistory(id)]);

  if (!product) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:flex lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{product.is_system ? 'Producto del sistema' : 'Producto propio'}</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">{product.name}</h1>
          {product.description ? <p className="mt-2 max-w-3xl text-sm text-slate-600">{product.description}</p> : null}
        </div>
        {!product.is_system ? (
          <div className="flex flex-wrap gap-2">
            <Link
              className="inline-flex items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200"
              href={`/products/${product.id}/edit`}
            >
              Editar producto
            </Link>
            <form action={deleteProductAction.bind(null, product.id)}>
              <ConfirmSubmitButton message="¿Eliminar este producto? Los items históricos conservarán el nombre registrado en cada mercado.">
                Eliminar producto
              </ConfirmSubmitButton>
            </form>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Categoría</p>
          <p className="mt-1 font-semibold text-slate-950">{product.categories?.name ?? 'Sin categoría'}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Unidad por defecto</p>
          <p className="mt-1 font-semibold text-slate-950">{product.units?.name ?? 'Sin unidad'}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Historial</p>
          <p className="mt-1 font-semibold text-slate-950">{history.length} registros</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-950">Historial de precios</h2>
        <ProductPriceHistory history={history} />
      </div>
    </section>
  );
}
