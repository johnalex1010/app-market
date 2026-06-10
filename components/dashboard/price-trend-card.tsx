import { ProductVariationChart } from '@/components/charts/product-variation-chart';
import { Card } from '@/components/ui/card';
import type { ProductVariationPoint } from '@/types/statistics.types';

type PriceTrendCardProps = {
  variations: ProductVariationPoint[];
};

export function PriceTrendCard({ variations }: PriceTrendCardProps) {
  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">Variaciones recientes</h2>
        <p className="text-sm text-slate-600">Productos con mayor cambio frente a su registro anterior.</p>
      </div>
      <ProductVariationChart data={variations} />
    </Card>
  );
}
