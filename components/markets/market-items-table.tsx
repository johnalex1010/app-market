import { ConfirmSubmitButton } from '@/components/ui/confirm-submit-button';
import { EmptyState } from '@/components/ui/empty-state';
import { Table } from '@/components/ui/table';
import { MarketItemForm } from '@/components/markets/market-item-form';
import { deleteMarketItemAction } from '@/features/market-items/market-item.actions';
import { formatCurrencyCOP } from '@/lib/formatters/currency.formatter';
import { formatPercentage } from '@/lib/formatters/percentage.formatter';
import type { Category } from '@/types/category.types';
import type { MarketItem } from '@/types/market-item.types';
import type { Product } from '@/types/product.types';
import type { Unit } from '@/types/unit.types';

type MarketItemsTableProps = {
  marketId: string;
  items: MarketItem[];
  products: Product[];
  categories: Category[];
  units: Unit[];
};

function getVariationLabel(item: MarketItem) {
  if (!item.variation) {
    return 'Sin historial';
  }

  const label = item.variation.status === 'up' ? 'Subió' : item.variation.status === 'down' ? 'Bajó' : 'Igual';

  return `${label} ${formatPercentage(item.variation.percentage)}`;
}

function getVariationClass(item: MarketItem) {
  if (!item.variation) {
    return 'text-slate-500';
  }

  if (item.variation.status === 'up') {
    return 'text-red-700';
  }

  if (item.variation.status === 'down') {
    return 'text-green-700';
  }

  return 'text-slate-600';
}

export function MarketItemsTable({ marketId, items, products, categories, units }: MarketItemsTableProps) {
  if (items.length === 0) {
    return <EmptyState title="Aún no hay productos en este mercado." description="Agrega el primer producto para calcular el total." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <Table aria-label="Productos del mercado">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Cantidad</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Precio unitario</th>
            <th className="px-4 py-3">Variación</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {items.map((item) => (
            <tr key={item.id} className="align-top">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-950">{item.product_name_snapshot}</p>
                <p className="text-xs text-slate-500">{item.categories?.name ?? 'Sin categoría'}</p>
              </td>
              <td className="px-4 py-3 text-slate-700">
                {item.quantity} {item.units?.abbreviation ?? ''}
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">{formatCurrencyCOP(item.price)}</td>
              <td className="px-4 py-3 text-slate-700">
                {formatCurrencyCOP(item.normalized_unit_price ?? 0)}
                {item.units?.base_unit ? <span className="text-slate-500"> / {item.units.base_unit}</span> : null}
              </td>
              <td className={`px-4 py-3 font-medium ${getVariationClass(item)}`}>{getVariationLabel(item)}</td>
              <td className="px-4 py-3">
                <details className="w-80 max-w-[80vw]">
                  <summary className="cursor-pointer text-sm font-medium text-brand-700">Editar</summary>
                  <div className="mt-3">
                    <MarketItemForm compact categories={categories} item={item} marketId={marketId} products={products} units={units} />
                  </div>
                </details>
                <form action={deleteMarketItemAction.bind(null, marketId, item.id)} className="mt-2">
                  <ConfirmSubmitButton message="¿Eliminar este producto del mercado?" variant="ghost">
                    Eliminar
                  </ConfirmSubmitButton>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
