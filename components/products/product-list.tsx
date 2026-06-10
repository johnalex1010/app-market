import { EmptyState } from '@/components/ui/empty-state';
import { ProductCard } from '@/components/products/product-card';
import type { Product } from '@/types/product.types';

type ProductListProps = {
  products: Product[];
};

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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
