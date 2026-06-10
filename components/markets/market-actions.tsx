import Link from 'next/link';
import { ConfirmSubmitButton } from '@/components/ui/confirm-submit-button';
import { deleteMarketAction } from '@/features/markets/market.actions';

type MarketActionsProps = {
  marketId: string;
};

export function MarketActions({ marketId }: MarketActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        className="inline-flex items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200"
        href={`/markets/${marketId}/edit`}
      >
        Editar mercado
      </Link>
      <form action={deleteMarketAction.bind(null, marketId)}>
        <ConfirmSubmitButton message="¿Eliminar este mercado? Esta acción eliminará también todos los productos registrados dentro del mercado.">
          Eliminar mercado
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
