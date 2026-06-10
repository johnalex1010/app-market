'use client';

import { useActionState } from 'react';
import { SubmitButton } from '@/components/auth/submit-button';
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

  return (
    <form action={formAction} className={compact ? 'grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3' : 'space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm'}>
      {state.message ? (
        <p className={state.success ? 'text-sm text-green-700' : 'text-sm text-red-600'}>{state.message}</p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-[1fr_120px_120px]">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${category?.id ?? 'new'}-name`}>
            Nombre
          </label>
          <Input defaultValue={category?.name ?? ''} id={`${category?.id ?? 'new'}-name`} maxLength={80} name="name" required />
          {state.errors?.name?.[0] ? <p className="text-sm text-red-600">{state.errors.name[0]}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${category?.id ?? 'new'}-icon`}>
            Ícono
          </label>
          <Input defaultValue={category?.icon ?? ''} id={`${category?.id ?? 'new'}-icon`} maxLength={24} name="icon" placeholder="Ej: 🥛" />
          {state.errors?.icon?.[0] ? <p className="text-sm text-red-600">{state.errors.icon[0]}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${category?.id ?? 'new'}-color`}>
            Color
          </label>
          <Input defaultValue={category?.color ?? '#2563eb'} id={`${category?.id ?? 'new'}-color`} name="color" type="color" />
          {state.errors?.color?.[0] ? <p className="text-sm text-red-600">{state.errors.color[0]}</p> : null}
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton idleText={category ? 'Guardar categoría' : 'Crear categoría'} pendingText={category ? 'Guardando...' : 'Creando...'} />
      </div>
    </form>
  );
}
