'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { marketSchema } from '@/lib/validations/market.validation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { MarketFormState } from '@/types/market.types';

const DEFAULT_MARKET_STATE: MarketFormState = {
  success: false,
  message: ''
};

function getStringField(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === 'string' ? value : '';
}

function parseMarketFormData(formData: FormData) {
  return marketSchema.safeParse({
    name: getStringField(formData, 'name'),
    market_date: getStringField(formData, 'market_date'),
    notes: getStringField(formData, 'notes') || null
  });
}

export async function createMarketAction(_state: MarketFormState = DEFAULT_MARKET_STATE, formData: FormData): Promise<MarketFormState> {
  const parsed = parseMarketFormData(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los datos del mercado.',
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: 'Debes iniciar sesión para crear mercados.'
    };
  }

  const { data, error } = await supabase
    .from('markets')
    .insert({
      ...parsed.data,
      user_id: user.id,
      total_amount: 0
    })
    .select('id')
    .single();

  if (error) {
    return {
      success: false,
      message: 'No pudimos crear el mercado. Inténtalo de nuevo.'
    };
  }

  revalidatePath('/markets');
  redirect(`/markets/${data.id}`);
}

export async function updateMarketAction(marketId: string, _state: MarketFormState = DEFAULT_MARKET_STATE, formData: FormData): Promise<MarketFormState> {
  const parsed = parseMarketFormData(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los datos del mercado.',
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: 'Debes iniciar sesión para editar mercados.'
    };
  }

  const { error } = await supabase.from('markets').update(parsed.data).eq('id', marketId).eq('user_id', user.id);

  if (error) {
    return {
      success: false,
      message: 'No pudimos actualizar el mercado. Inténtalo de nuevo.'
    };
  }

  revalidatePath('/markets');
  revalidatePath(`/markets/${marketId}`);
  redirect(`/markets/${marketId}`);
}

export async function deleteMarketAction(marketId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { error } = await supabase.from('markets').delete().eq('id', marketId).eq('user_id', user.id);

  if (error) {
    throw new Error('No pudimos eliminar el mercado.');
  }

  revalidatePath('/markets');
  redirect('/markets');
}
