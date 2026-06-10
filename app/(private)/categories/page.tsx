import { CategoryForm } from '@/components/categories/category-form';
import { CategoryList } from '@/components/categories/category-list';
import { getCurrentUserId } from '@/services/markets.service';
import { getCategories } from '@/services/categories.service';

export default async function CategoriesPage() {
  const userId = await getCurrentUserId();
  const categories = userId ? await getCategories(userId) : [];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Categorías</h1>
        <p className="mt-1 text-sm text-slate-600">Administra categorías propias y consulta las categorías del sistema.</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-950">Crear categoría</h2>
        <CategoryForm />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-950">Listado de categorías</h2>
        <CategoryList categories={categories} />
      </div>
    </section>
  );
}
