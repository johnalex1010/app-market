import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function CategoryToolbar() {
  return (
    <div className="grid gap-3 sm:flex sm:items-center sm:justify-end">
      <label className="relative sm:w-72">
        <span className="sr-only">Buscar categoría</span>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input className="pl-9" name="search" placeholder="Buscar categoría..." type="search" />
      </label>

      <label className="sm:w-36">
        <span className="sr-only">Filtrar categorías</span>
        <Select defaultValue="" name="type">
          <option value="">Filtrar</option>
          <option value="system">Sistema</option>
          <option value="own">Propias</option>
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
