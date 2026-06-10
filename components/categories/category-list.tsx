import { CategoryBadge } from '@/components/categories/category-badge';
import { CategoryForm } from '@/components/categories/category-form';
import { ConfirmSubmitButton } from '@/components/ui/confirm-submit-button';
import { EmptyState } from '@/components/ui/empty-state';
import { deleteCategoryAction } from '@/features/categories/category.actions';
import type { Category } from '@/types/category.types';

type CategoryListProps = {
  categories: Category[];
};

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return <EmptyState title="Aún no hay categorías disponibles." description="Crea tu primera categoría para clasificar productos." />;
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <div key={category.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:flex md:items-start md:justify-between">
            <div className="space-y-2">
              <CategoryBadge category={category} />
              <p className="text-sm text-slate-600">{category.is_system ? 'Categoría del sistema' : 'Categoría propia'}</p>
            </div>
            {!category.is_system ? (
              <form action={deleteCategoryAction.bind(null, category.id)}>
                <ConfirmSubmitButton message="¿Eliminar esta categoría? Los productos asociados quedarán sin categoría." variant="ghost">
                  Eliminar
                </ConfirmSubmitButton>
              </form>
            ) : null}
          </div>

          {!category.is_system ? (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-brand-700">Editar categoría</summary>
              <div className="mt-3">
                <CategoryForm category={category} compact />
              </div>
            </details>
          ) : null}
        </div>
      ))}
    </div>
  );
}
