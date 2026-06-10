import Link from 'next/link';
import { ProductList } from '@/components/products/product-list';
import { ProductToolbar } from '@/components/products/product-toolbar';
import { getProducts } from '@/services/products.service';

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = products.reduce<{ id: string; name: string }[]>((accumulator, product) => {
    if (!product.categories || accumulator.some((category) => category.id === product.categories?.id)) {
      return accumulator;
    }

    return [...accumulator, product.categories];
  }, []);

  return (
    <section className="space-y-6">
      <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Productos</h1>
          <p className="mt-1 text-sm text-slate-600">Administra tus productos propios y consulta los productos del sistema.</p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          href="/products/new"
        >
          Nuevo producto
        </Link>
      </div>
      <ProductToolbar categories={categories} />
      <ProductList products={products} />
    </section>
  );
}
