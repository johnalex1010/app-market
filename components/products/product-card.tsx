import Link from 'next/link';
import { ProductImage } from '@/components/products/product-image';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types/product.types';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-brand-300 hover:shadow-md"
      href={`/products/${product.id}`}
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-slate-200">
        <ProductImage alt={product.name} src={product.image_url} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-950">{product.name}</h2>
            <p className="truncate text-xs text-slate-500">
              {product.categories?.name ?? 'Sin categoría'} · {product.units?.abbreviation ?? 'Sin unidad'}
            </p>
          </div>
          <Badge className="shrink-0 px-2 py-0.5 text-[11px]">{product.is_system ? 'Sistema' : 'Propio'}</Badge>
        </div>
      </div>
    </Link>
  );
}
