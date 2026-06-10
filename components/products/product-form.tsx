'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { SubmitButton } from '@/components/auth/submit-button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createProductAction, updateProductAction } from '@/features/products/product.actions';
import type { Category } from '@/types/category.types';
import type { Product, ProductFormState } from '@/types/product.types';
import type { Unit } from '@/types/unit.types';

const initialState: ProductFormState = {
  success: false,
  message: ''
};

type ProductFormProps = {
  product?: Product;
  categories: Category[];
  units: Unit[];
};

export function ProductForm({ product, categories, units }: ProductFormProps) {
  const action = product ? updateProductAction.bind(null, product.id) : createProductAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {state.message ? (
        <p className={state.success ? 'text-sm text-green-700' : 'text-sm text-red-600'}>{state.message}</p>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="name">
          Nombre
        </label>
        <Input defaultValue={product?.name ?? ''} id="name" maxLength={120} name="name" required />
        {state.errors?.name?.[0] ? <p className="text-sm text-red-600">{state.errors.name[0]}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="category_id">
            Categoría
          </label>
          <Select defaultValue={product?.category_id ?? ''} id="category_id" name="category_id" required>
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {state.errors?.category_id?.[0] ? <p className="text-sm text-red-600">{state.errors.category_id[0]}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="default_unit_id">
            Unidad por defecto
          </label>
          <Select defaultValue={product?.default_unit_id ?? ''} id="default_unit_id" name="default_unit_id" required>
            <option value="">Selecciona una unidad</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name} ({unit.abbreviation})
              </option>
            ))}
          </Select>
          {state.errors?.default_unit_id?.[0] ? <p className="text-sm text-red-600">{state.errors.default_unit_id[0]}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="description">
          Descripción
        </label>
        <Textarea defaultValue={product?.description ?? ''} id="description" maxLength={500} name="description" rows={4} />
        {state.errors?.description?.[0] ? <p className="text-sm text-red-600">{state.errors.description[0]}</p> : null}
      </div>

      <div className="grid gap-3 sm:flex sm:items-center sm:justify-end">
        <Link
          className="inline-flex w-full items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 sm:w-auto"
          href={product ? `/products/${product.id}` : '/products'}
        >
          Cancelar
        </Link>
        <SubmitButton idleText={product ? 'Guardar cambios' : 'Crear producto'} pendingText={product ? 'Guardando...' : 'Creando...'} />
      </div>
    </form>
  );
}
