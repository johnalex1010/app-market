import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/products/product-form';
import { getProductById, getProductFormCatalogs } from '@/services/products.service';

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, catalogs] = await Promise.all([getProductById(id), getProductFormCatalogs()]);

  if (!product || product.is_system) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Editar producto</h1>
        <p className="mt-1 text-sm text-slate-600">Actualiza la información de tu producto propio.</p>
      </div>
      <ProductForm categories={catalogs.categories} product={product} units={catalogs.units} />
    </section>
  );
}
