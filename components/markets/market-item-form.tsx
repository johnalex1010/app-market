'use client';

import { useActionState } from 'react';
import { SubmitButton } from '@/components/auth/submit-button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createMarketItemAction, updateMarketItemAction } from '@/features/market-items/market-item.actions';
import type { Category } from '@/types/category.types';
import type { MarketItem, MarketItemFormState } from '@/types/market-item.types';
import type { Product } from '@/types/product.types';
import type { Unit } from '@/types/unit.types';

const initialState: MarketItemFormState = {
  success: false,
  message: ''
};

type MarketItemFormProps = {
  marketId: string;
  products: Product[];
  categories: Category[];
  units: Unit[];
  item?: MarketItem;
  compact?: boolean;
};

export function MarketItemForm({ marketId, products, categories, units, item, compact = false }: MarketItemFormProps) {
  const action = item ? updateMarketItemAction.bind(null, marketId, item.id) : createMarketItemAction.bind(null, marketId);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className={compact ? 'grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3' : 'space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm'}>
      {state.message ? (
        <p className={state.success ? 'text-sm text-green-700' : 'text-sm text-red-600'}>{state.message}</p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${item?.id ?? 'new'}-product_id`}>
            Producto
          </label>
          <Select defaultValue={item?.product_id ?? ''} id={`${item?.id ?? 'new'}-product_id`} name="product_id" required>
            <option value="">Selecciona un producto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </Select>
          {state.errors?.product_id?.[0] ? <p className="text-sm text-red-600">{state.errors.product_id[0]}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${item?.id ?? 'new'}-category_id`}>
            Categoría
          </label>
          <Select defaultValue={item?.category_id ?? ''} id={`${item?.id ?? 'new'}-category_id`} name="category_id" required>
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {state.errors?.category_id?.[0] ? <p className="text-sm text-red-600">{state.errors.category_id[0]}</p> : null}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${item?.id ?? 'new'}-quantity`}>
            Cantidad
          </label>
          <Input defaultValue={item?.quantity ?? ''} id={`${item?.id ?? 'new'}-quantity`} min="0.001" name="quantity" required step="0.001" type="number" />
          {state.errors?.quantity?.[0] ? <p className="text-sm text-red-600">{state.errors.quantity[0]}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${item?.id ?? 'new'}-unit_id`}>
            Unidad
          </label>
          <Select defaultValue={item?.unit_id ?? ''} id={`${item?.id ?? 'new'}-unit_id`} name="unit_id" required>
            <option value="">Selecciona una unidad</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name} ({unit.abbreviation})
              </option>
            ))}
          </Select>
          {state.errors?.unit_id?.[0] ? <p className="text-sm text-red-600">{state.errors.unit_id[0]}</p> : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800" htmlFor={`${item?.id ?? 'new'}-price`}>
            Precio pagado
          </label>
          <Input defaultValue={item?.price ?? ''} id={`${item?.id ?? 'new'}-price`} min="1" name="price" required step="1" type="number" />
          {state.errors?.price?.[0] ? <p className="text-sm text-red-600">{state.errors.price[0]}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor={`${item?.id ?? 'new'}-notes`}>
          Notas
        </label>
        <Textarea defaultValue={item?.notes ?? ''} id={`${item?.id ?? 'new'}-notes`} maxLength={500} name="notes" rows={compact ? 2 : 3} />
        {state.errors?.notes?.[0] ? <p className="text-sm text-red-600">{state.errors.notes[0]}</p> : null}
      </div>

      <div className="flex justify-end">
        <SubmitButton idleText={item ? 'Guardar producto' : 'Agregar producto'} pendingText={item ? 'Guardando...' : 'Agregando...'} />
      </div>
    </form>
  );
}
