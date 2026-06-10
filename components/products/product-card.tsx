import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Product } from '@/types/product.types';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="transition hover:border-brand-300 hover:shadow-md">
      <Link className="block space-y-3" href={`/products/${product.id}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{product.name}</h2>
            <p className="text-sm text-slate-600">{product.categories?.name ?? 'Sin categoría'}</p>
          </div>
          <Badge>{product.is_system ? 'Sistema' : 'Propio'}</Badge>
        </div>
        <p className="text-sm text-slate-600">Unidad base: {product.units?.abbreviation ?? 'Sin unidad'}</p>
      </Link>
    </Card>
  );
}
