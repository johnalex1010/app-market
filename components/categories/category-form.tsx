'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { SubmitButton } from '@/components/auth/submit-button';
import { CategoryIcon } from '@/components/categories/category-icon';
import { Input } from '@/components/ui/input';
import { createCategoryAction, updateCategoryAction } from '@/features/categories/category.actions';
import type { Category, CategoryFormState } from '@/types/category.types';

const initialState: CategoryFormState = {
  success: false,
  message: ''
};

type CategoryFormProps = {
  category?: Category;
  compact?: boolean;
};

export function CategoryForm({ category, compact = false }: CategoryFormProps) {
  const action = category ? updateCategoryAction.bind(null, category.id) : createCategoryAction;
  const [state, formAction] = useActionState(action, initialState);
  const idPrefix = category?.id ?? 'new';

  return (
    <form
      action={formAction}
      className={compact ? 'grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3' : 'space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm'}
      id={!category && !compact ? 'crear-categoria' : undefined}
    >
      {state.message ? (
        <p className={state.success ? 'text-sm text-green-700' : 'text-sm text-red-600'}>{state.message}</p>
      ) : null}

      <div className={compact ? 'grid gap-3 md:grid-cols-[1fr_11rem_8rem]' : 'grid gap-3 lg:grid-cols-[1fr_11rem_9rem]'}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${idPrefix}-name`}>
            Nombre
          </label>
          <Input defaultValue={category?.name ?? ''} id={`${idPrefix}-name`} maxLength={80} name="name" placeholder="Ej: Lácteos" required />
          {state.errors?.name?.[0] ? <p className="text-sm text-red-600">{state.errors.name[0]}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${idPrefix}-icon`}>
            Ícono
          </label>
          <div className="flex gap-2">
            <CategoryIcon color={category?.color} icon={category?.icon} />
            <Input defaultValue={category?.icon ?? ''} id={`${idPrefix}-icon`} maxLength={24} name="icon" placeholder="Ej: milk" />
          </div>
          {state.errors?.icon?.[0] ? <p className="text-sm text-red-600">{state.errors.icon[0]}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${idPrefix}-color`}>
            Color
          </label>
          <Input className="h-10 p-1" defaultValue={category?.color ?? '#059669'} id={`${idPrefix}-color`} name="color" type="color" />
          {state.errors?.color?.[0] ? <p className="text-sm text-red-600">{state.errors.color[0]}</p> : null}
        </div>
      </div>

      {category ? (
        <div className="grid gap-3 border-t border-slate-200 pt-4 sm:flex sm:items-center sm:justify-end">
          <Link
            className="inline-flex w-full items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 sm:w-auto"
            href="/categories"
          >
            Cancelar
          </Link>
          <SubmitButton idleText="Guardar cambios" pendingText="Guardando..." />
        </div>
      ) : (
        <SubmitButton idleText="Crear categoría" pendingText="Creando..." />
      )}
    </form>
  );
}
