import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { Category } from '@/types/category.types';

type ProductToolbarProps = {
  categories: Pick<Category, 'id' | 'name'>[];
};

export function ProductToolbar({ categories }: ProductToolbarProps) {
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm lg:grid-cols-[minmax(14rem,1fr)_12rem_12rem_auto]">
      <label className="relative">
        <span className="sr-only">Buscar producto</span>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input className="pl-9" name="search" placeholder="Buscar producto..." type="search" />
      </label>

      <label>
        <span className="sr-only">Filtrar por categoría</span>
        <Select defaultValue="" name="category">
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </label>

      <label>
        <span className="sr-only">Filtrar por tipo</span>
        <Select defaultValue="" name="type">
          <option value="">Todos los tipos</option>
          <option value="system">Sistema</option>
          <option value="own">Propio</option>
        </Select>
      </label>

      <button
        className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        type="button"
      >
        <Filter aria-hidden="true" className="h-4 w-4" />
        Filtros
      </button>
    </div>
  );
}
