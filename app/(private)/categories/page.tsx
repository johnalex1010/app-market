import Link from 'next/link';
import { Plus } from 'lucide-react';
import { CategoryForm } from '@/components/categories/category-form';
import { CategoryList } from '@/components/categories/category-list';
import { CategoryStats } from '@/components/categories/category-stats';
import { getCategories } from '@/services/categories.service';
import { getCurrentUserId } from '@/services/markets.service';

export default async function CategoriesPage() {
  const userId = await getCurrentUserId();
  const categories = userId ? await getCategories(userId) : [];

  return (
    <section className="space-y-6">
      <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Categorías</h1>
          <p className="mt-1 text-sm text-slate-600">Administra categorías propias y consulta las categorías del sistema.</p>
        </div>
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          href="#crear-categoria"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Nueva categoría
        </Link>
      </div>

      <CategoryStats categories={categories} />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-950">Crear categoría</h2>
        <CategoryForm />
      </div>

      <CategoryList categories={categories} />
    </section>
  );
}
