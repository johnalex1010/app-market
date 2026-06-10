import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductImage } from '@/components/products/product-image';
import { ProductPriceHistory } from '@/components/products/product-price-history';
import { Badge } from '@/components/ui/badge';
import { ConfirmSubmitButton } from '@/components/ui/confirm-submit-button';
import { deleteProductAction } from '@/features/products/product.actions';
import { formatShortDate } from '@/lib/formatters/date.formatter';
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
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[11rem_1fr_auto] lg:items-start">
          <div className="aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <ProductImage alt={product.name} src={product.image_url} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-950">{product.name}</h1>
              <Badge>{product.is_system ? 'Sistema' : 'Propio'}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-600">{product.categories?.name ?? 'Sin categoría'}</p>
            <p className="mt-3 text-sm text-slate-500">Producto {product.is_system ? 'del sistema' : 'creado por el usuario'}</p>
            <p className="mt-1 text-sm text-slate-500">Creado el {formatShortDate(product.created_at)}</p>
          </div>

          {!product.is_system ? (
            <div className="flex flex-wrap gap-2 lg:justify-end">
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
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h2 className="text-base font-semibold text-slate-950">Información general</h2>
          {!product.is_system ? (
            <Link className="text-sm font-medium text-brand-700 hover:text-brand-800" href={`/products/${product.id}/edit`}>
              Editar
            </Link>
          ) : null}
        </div>

        <dl className="grid gap-0 divide-y divide-slate-200 text-sm md:grid-cols-3 md:divide-x md:divide-y-0">
          <div className="py-4 md:px-4 md:first:pl-0">
            <dt className="text-xs font-medium text-slate-500">Categoría</dt>
            <dd className="mt-1 font-semibold text-slate-950">{product.categories?.name ?? 'Sin categoría'}</dd>
          </div>
          <div className="py-4 md:px-4">
            <dt className="text-xs font-medium text-slate-500">Unidad base</dt>
            <dd className="mt-1 font-semibold text-slate-950">
              {product.units ? `${product.units.name} (${product.units.abbreviation})` : 'Sin unidad'}
            </dd>
          </div>
          <div className="py-4 md:px-4">
            <dt className="text-xs font-medium text-slate-500">Tipo</dt>
            <dd className="mt-1 font-semibold text-slate-950">{product.is_system ? 'Sistema' : 'Propio'}</dd>
          </div>
        </dl>

        <div className="space-y-2 border-t border-slate-200 pt-4">
          <p className="text-xs font-medium text-slate-500">Descripción</p>
          <p className="text-sm text-slate-700">{product.description ?? 'Sin descripción registrada.'}</p>
        </div>

        {product.image_url ? (
          <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
            <p className="text-xs font-medium text-slate-500">Imagen</p>
            <a className="block break-all text-sm font-medium text-brand-700 hover:text-brand-800" href={product.image_url} rel="noreferrer" target="_blank">
              {product.image_url}
            </a>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Veces comprado</p>
          <p className="mt-1 text-xl font-semibold text-slate-950">{history.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Historial</p>
          <p className="mt-1 text-xl font-semibold text-slate-950">{history.length} registros</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Estado</p>
          <p className="mt-1 inline-flex items-center gap-2 font-semibold text-slate-950">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Activo
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-950">Historial de precios</h2>
        <ProductPriceHistory history={history} />
      </div>
    </section>
  );
}
