import Link from 'next/link';
import { MoreVertical, Pencil } from 'lucide-react';
import { ProductCard } from '@/components/products/product-card';
import { ProductImage } from '@/components/products/product-image';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Table } from '@/components/ui/table';
import type { Product } from '@/types/product.types';

type ProductListProps = {
  products: Product[];
};

function ProductTypeBadge({ isSystem }: { isSystem: boolean }) {
  return <Badge className={isSystem ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-50 text-brand-700'}>{isSystem ? 'Sistema' : 'Propio'}</Badge>;
}

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes productos disponibles."
        description="Crea tu primer producto para poder agregarlo a un mercado."
      />
    );
  }

  return (
    <>
      <div className="grid gap-3 lg:hidden">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:block">
        <Table aria-label="Productos disponibles">
          <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Unidad base</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link className="flex items-center gap-3" href={`/products/${product.id}`}>
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200">
                      <ProductImage alt={product.name} src={product.image_url} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-slate-950">{product.name}</span>
                      <span className="block truncate text-xs text-slate-500">{product.description ?? 'Sin descripción'}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{product.categories?.name ?? 'Sin categoría'}</td>
                <td className="px-4 py-3 text-slate-600">{product.units?.abbreviation ?? 'Sin unidad'}</td>
                <td className="px-4 py-3">
                  <ProductTypeBadge isSystem={product.is_system} />
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Activo
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {!product.is_system ? (
                      <Link
                        aria-label={`Editar ${product.name}`}
                        className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        href={`/products/${product.id}/edit`}
                      >
                        <Pencil aria-hidden="true" className="h-4 w-4" />
                      </Link>
                    ) : null}
                    <Link
                      aria-label={`Ver detalle de ${product.name}`}
                      className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      href={`/products/${product.id}`}
                    >
                      <MoreVertical aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
          <span>Mostrando 1 a {products.length} de {products.length} productos</span>
          <span>Página 1</span>
        </div>
      </div>
    </>
  );
}
