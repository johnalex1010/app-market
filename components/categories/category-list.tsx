import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { CategoryIcon } from '@/components/categories/category-icon';
import { CategoryToolbar } from '@/components/categories/category-toolbar';
import { Badge } from '@/components/ui/badge';
import { ConfirmSubmitButton } from '@/components/ui/confirm-submit-button';
import { EmptyState } from '@/components/ui/empty-state';
import { Table } from '@/components/ui/table';
import { deleteCategoryAction } from '@/features/categories/category.actions';
import type { Category } from '@/types/category.types';

type CategoryListProps = {
  categories: Category[];
};

function TypeBadge({ isSystem }: { isSystem: boolean }) {
  return <Badge className={isSystem ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}>{isSystem ? 'Sistema' : 'Propia'}</Badge>;
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return <EmptyState title="Aún no hay categorías disponibles." description="Crea tu primera categoría para clasificar productos." />;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid gap-3 border-b border-slate-200 pb-3 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-base font-semibold text-slate-950">Listado de categorías</h2>
        <CategoryToolbar />
      </div>

      <div className="grid gap-3 py-3 lg:hidden">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex items-start gap-3">
              <CategoryIcon color={category.color} icon={category.icon} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-950">{category.name}</h3>
                    <p className="text-xs text-slate-500">{category.is_system ? 'Categoría del sistema' : 'Categoría personalizada'}</p>
                  </div>
                  <TypeBadge isSystem={category.is_system} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{category.product_count ?? 0} productos</p>
              </div>
            </div>

            {!category.is_system ? (
              <Link className="mt-3 inline-flex text-sm font-medium text-brand-700 hover:text-brand-800" href={`/categories/${category.id}/edit`}>
                Editar categoría
              </Link>
            ) : null}
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden lg:block">
        <Table aria-label="Listado de categorías">
          <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
            <tr>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {categories.map((category) => (
              <tr key={category.id} className="align-top transition-colors hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CategoryIcon color={category.color} icon={category.icon} />
                    <div>
                      <p className="font-semibold text-slate-950">{category.name}</p>
                      <p className="text-xs text-slate-500">{category.is_system ? 'Categoría predeterminada' : 'Categoría personalizada'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <TypeBadge isSystem={category.is_system} />
                </td>
                <td className="px-4 py-3 text-slate-700">{category.product_count ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {!category.is_system ? (
                      <>
                        <Link
                          aria-label={`Editar ${category.name}`}
                          className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          href={`/categories/${category.id}/edit`}
                        >
                          <Pencil aria-hidden="true" className="h-4 w-4" />
                        </Link>
                        <form action={deleteCategoryAction.bind(null, category.id)}>
                          <ConfirmSubmitButton
                            aria-label={`Eliminar ${category.name}`}
                            className="rounded-md bg-transparent p-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                            message="¿Eliminar esta categoría? Los productos asociados quedarán sin categoría."
                            variant="ghost"
                          >
                            <Trash2 aria-hidden="true" className="h-4 w-4" />
                          </ConfirmSubmitButton>
                        </form>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">Solo lectura</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-1 pt-3 text-sm text-slate-500">
        <span>Mostrando 1 a {categories.length} de {categories.length} categorías</span>
        <span>Página 1</span>
      </div>
    </div>
  );
}
