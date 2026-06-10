'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { SubmitButton } from '@/components/auth/submit-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createMarketAction, updateMarketAction } from '@/features/markets/market.actions';
import type { Market, MarketFormState } from '@/types/market.types';

const initialState: MarketFormState = {
  success: false,
  message: ''
};

type MarketFormProps = {
  market?: Market;
};

export function MarketForm({ market }: MarketFormProps) {
  const action = market ? updateMarketAction.bind(null, market.id) : createMarketAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {state.message ? (
        <p className={state.success ? 'text-sm text-green-700' : 'text-sm text-red-600'}>{state.message}</p>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="name">
          Nombre
        </label>
        <Input
          defaultValue={market?.name ?? `Mercado del ${new Date().toLocaleDateString('es-CO')}`}
          id="name"
          maxLength={120}
          name="name"
          required
        />
        {state.errors?.name?.[0] ? <p className="text-sm text-red-600">{state.errors.name[0]}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="market_date">
          Fecha
        </label>
        <Input defaultValue={market?.market_date ?? new Date().toISOString().slice(0, 10)} id="market_date" name="market_date" required type="date" />
        {state.errors?.market_date?.[0] ? <p className="text-sm text-red-600">{state.errors.market_date[0]}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="notes">
          Notas
        </label>
        <Textarea defaultValue={market?.notes ?? ''} id="notes" maxLength={500} name="notes" rows={4} />
        {state.errors?.notes?.[0] ? <p className="text-sm text-red-600">{state.errors.notes[0]}</p> : null}
      </div>

      <div className="grid gap-3 sm:flex sm:items-center sm:justify-end">
        <Link
          className="inline-flex w-full items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 sm:w-auto"
          href={market ? `/markets/${market.id}` : '/markets'}
        >
          Cancelar
        </Link>
        <SubmitButton idleText={market ? 'Guardar cambios' : 'Crear mercado'} pendingText={market ? 'Guardando...' : 'Creando...'} />
      </div>
    </form>
  );
}
