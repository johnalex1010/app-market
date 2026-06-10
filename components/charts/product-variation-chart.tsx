import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrencyCOP } from '@/lib/formatters/currency.formatter';
import { formatPercentage } from '@/lib/formatters/percentage.formatter';
import type { ProductVariationPoint } from '@/types/statistics.types';

type ProductVariationChartProps = {
  data: ProductVariationPoint[];
};

function getStatusText(status: ProductVariationPoint['status']) {
  if (status === 'up') {
    return 'Subió';
  }

  if (status === 'down') {
    return 'Bajó';
  }

  return 'Igual';
}

function getStatusClass(status: ProductVariationPoint['status']) {
  if (status === 'up') {
    return 'text-red-700';
  }

  if (status === 'down') {
    return 'text-green-700';
  }

  return 'text-slate-600';
}

export function ProductVariationChart({ data }: ProductVariationChartProps) {
  if (data.length === 0) {
    return <EmptyState title="Sin variaciones todavía." description="Necesitas al menos dos registros del mismo producto para comparar precios." />;
  }

  return (
    <div className="space-y-3" role="img" aria-label="Variación reciente de productos">
      {data.map((item) => (
        <div key={item.productId} className="rounded-md border border-slate-200 p-3">
          <div className="flex items-start justify-between gap-3">
            <Link className="font-medium text-brand-700 hover:text-brand-800" href={`/products/${item.productId}`}>
              {item.productName}
            </Link>
            <span className={`text-sm font-semibold ${getStatusClass(item.status)}`}>
              {getStatusText(item.status)} {formatPercentage(item.percentage)}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Antes {formatCurrencyCOP(item.previousPrice)} · Ahora {formatCurrencyCOP(item.currentPrice)}
          </p>
        </div>
      ))}
    </div>
  );
}
