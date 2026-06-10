import { notFound } from 'next/navigation';
import { CategoryForm } from '@/components/categories/category-form';
import { getCategoryById } from '@/services/categories.service';
import { getCurrentUserId } from '@/services/markets.service';

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  if (!userId) {
    notFound();
  }

  const category = await getCategoryById(id, userId);

  if (!category || category.is_system) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Editar categoría</h1>
        <p className="mt-1 text-sm text-slate-600">Actualiza el nombre, ícono y color de tu categoría propia.</p>
      </div>
      <CategoryForm category={category} />
    </section>
  );
}
