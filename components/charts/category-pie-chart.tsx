import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrencyCOP } from '@/lib/formatters/currency.formatter';
import type { CategoryExpensePoint } from '@/types/statistics.types';

type CategoryPieChartProps = {
  data: CategoryExpensePoint[];
};

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return <EmptyState title="Sin categorías para analizar." description="Agrega productos a mercados para ver la distribución." />;
  }

  const total = data.reduce((sum, item) => sum + item.totalAmount, 0) || 1;

  return (
    <div className="space-y-3" role="img" aria-label="Distribución de gasto por categoría">
      {data.map((item) => {
        const percentage = (item.totalAmount / total) * 100;

        return (
          <div key={item.categoryId} className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-900">{item.categoryName}</span>
              <span className="text-slate-600">{formatCurrencyCOP(item.totalAmount)}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${Math.max(percentage, 4)}%` }} />
            </div>
            <p className="text-xs text-slate-500">
              {percentage.toFixed(1)}% · {item.itemCount} productos registrados
            </p>
          </div>
        );
      })}
    </div>
  );
}
