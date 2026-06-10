import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { Table } from '@/components/ui/table';
import { formatCurrencyCOP } from '@/lib/formatters/currency.formatter';
import { formatShortDate } from '@/lib/formatters/date.formatter';
import type { ProductPriceHistoryItem } from '@/types/product.types';

type ProductPriceHistoryProps = {
  history: ProductPriceHistoryItem[];
};

export function ProductPriceHistory({ history }: ProductPriceHistoryProps) {
  if (history.length === 0) {
    return <EmptyState title="Sin historial de precios." description="Cuando agregues este producto a un mercado, aparecerá aquí." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <Table aria-label="Historial de precios del producto">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Mercado</th>
            <th className="px-4 py-3">Cantidad</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Precio normalizado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {history.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-3 text-slate-700">{formatShortDate(item.purchase_date)}</td>
              <td className="px-4 py-3">
                <Link className="font-medium text-brand-700 hover:text-brand-800" href={`/markets/${item.market_id}`}>
                  {item.market_name}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-700">
                {item.quantity} {item.unit_abbreviation ?? ''}
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">{formatCurrencyCOP(item.price)}</td>
              <td className="px-4 py-3 text-slate-700">
                {formatCurrencyCOP(item.normalized_unit_price ?? 0)}
                {item.base_unit ? <span className="text-slate-500"> / {item.base_unit}</span> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
