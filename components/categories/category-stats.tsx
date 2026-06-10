import { Star, Tag, Tags, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Category } from '@/types/category.types';

type CategoryStatsProps = {
  categories: Category[];
};

function StatCard({
  icon,
  label,
  value,
  description
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">{icon}</span>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-950">{value}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function CategoryStats({ categories }: CategoryStatsProps) {
  const systemCount = categories.filter((category) => category.is_system).length;
  const ownCount = categories.length - systemCount;
  const mostUsed = categories.reduce<Category | null>((current, category) => {
    if (!current || (category.product_count ?? 0) > (current.product_count ?? 0)) {
      return category;
    }

    return current;
  }, null);

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <StatCard description="Todas las categorías" icon={<Tags aria-hidden="true" className="h-5 w-5" />} label="Total categorías" value={categories.length} />
      <StatCard description="Categorías predeterminadas" icon={<Tag aria-hidden="true" className="h-5 w-5" />} label="Del sistema" value={systemCount} />
      <StatCard description="Categorías personalizadas" icon={<UserRound aria-hidden="true" className="h-5 w-5" />} label="Propias" value={ownCount} />
      <StatCard
        description={mostUsed ? `Usada en ${mostUsed.product_count ?? 0} productos` : 'Sin productos asociados'}
        icon={<Star aria-hidden="true" className="h-5 w-5" />}
        label="Más usada"
        value={mostUsed?.name ?? 'Sin datos'}
      />
    </div>
  );
}
