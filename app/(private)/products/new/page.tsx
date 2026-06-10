import { ProductForm } from '@/components/products/product-form';
import { getProductFormCatalogs } from '@/services/products.service';

export default async function NewProductPage() {
  const catalogs = await getProductFormCatalogs();

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Nuevo producto</h1>
        <p className="mt-1 text-sm text-slate-600">Crea un producto propio para usarlo en tus mercados.</p>
      </div>
      <ProductForm categories={catalogs.categories} units={catalogs.units} />
    </section>
  );
}
