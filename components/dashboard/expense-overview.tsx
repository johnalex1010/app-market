import { CategoryPieChart } from '@/components/charts/category-pie-chart';
import { Card } from '@/components/ui/card';
import type { CategoryExpensePoint } from '@/types/statistics.types';

type ExpenseOverviewProps = {
  categories: CategoryExpensePoint[];
};

export function ExpenseOverview({ categories }: ExpenseOverviewProps) {
  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">Gasto por categoría</h2>
        <p className="text-sm text-slate-600">Tus categorías con mayor gasto registrado.</p>
      </div>
      <CategoryPieChart data={categories} />
    </Card>
  );
}
