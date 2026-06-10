'use server';

import { revalidatePath } from 'next/cache';
import { calculateMarketTotal } from '@/lib/calculations/market-total';
import { calculateNormalizedQuantity, calculateNormalizedUnitPrice } from '@/lib/calculations/normalized-price';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { marketItemSchema } from '@/lib/validations/market-item.validation';
import { userOwnsMarket } from '@/services/markets.service';
import type { MarketItemFormState } from '@/types/market-item.types';

const DEFAULT_ITEM_STATE: MarketItemFormState = {
  success: false,
  message: ''
};

function getStringField(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === 'string' ? value : '';
}

function parseMarketItemFormData(formData: FormData) {
  return marketItemSchema.safeParse({
    product_id: getStringField(formData, 'product_id'),
    category_id: getStringField(formData, 'category_id'),
    quantity: getStringField(formData, 'quantity'),
    unit_id: getStringField(formData, 'unit_id'),
    price: getStringField(formData, 'price'),
    notes: getStringField(formData, 'notes') || null
  });
}

async function updateMarketTotal(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, marketId: string, userId: string) {
  const { data: items, error: itemsError } = await supabase.from('market_items').select('price').eq('market_id', marketId).eq('user_id', userId);

  if (itemsError) {
    throw itemsError;
  }

  const total = calculateMarketTotal((items ?? []).map((item) => ({ price: Number(item.price ?? 0) })));
  const { error: updateError } = await supabase.from('markets').update({ total_amount: total }).eq('id', marketId).eq('user_id', userId);

  if (updateError) {
    throw updateError;
  }

  return total;
}

async function buildMarketItemPayload(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, formData: FormData) {
  const parsed = parseMarketItemFormData(formData);

  if (!parsed.success) {
    return {
      parsed,
      payload: null
    };
  }

  const [{ data: product, error: productError }, { data: unit, error: unitError }] = await Promise.all([
    supabase.from('products').select('name').eq('id', parsed.data.product_id).single(),
    supabase.from('units').select('conversion_factor').eq('id', parsed.data.unit_id).single()
  ]);

  if (productError) {
    throw productError;
  }

  if (unitError) {
    throw unitError;
  }

  const normalizedQuantity = calculateNormalizedQuantity(parsed.data.quantity, Number(unit.conversion_factor));
  const normalizedUnitPrice = calculateNormalizedUnitPrice(parsed.data.price, normalizedQuantity);

  return {
    parsed,
    payload: {
      product_id: parsed.data.product_id,
      product_name_snapshot: String(product.name),
      category_id: parsed.data.category_id,
      quantity: parsed.data.quantity,
      unit_id: parsed.data.unit_id,
      price: parsed.data.price,
      normalized_quantity: normalizedQuantity,
      normalized_unit_price: normalizedUnitPrice,
      notes: parsed.data.notes
    }
  };
}

export async function createMarketItemAction(marketId: string, _state: MarketItemFormState = DEFAULT_ITEM_STATE, formData: FormData): Promise<MarketItemFormState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: 'Debes iniciar sesión para agregar productos.'
    };
  }

  if (!(await userOwnsMarket(marketId, user.id))) {
    return {
      success: false,
      message: 'No tienes permisos para modificar este mercado.'
    };
  }

  const result = await buildMarketItemPayload(supabase, formData);

  if (!result.parsed.success || !result.payload) {
    return {
      success: false,
      message: 'Revisa los datos del producto.',
      errors: result.parsed.success ? undefined : result.parsed.error.flatten().fieldErrors
    };
  }

  const { error } = await supabase.from('market_items').insert({
    ...result.payload,
    market_id: marketId,
    user_id: user.id,
    purchase_date: new Date().toISOString().slice(0, 10),
    sync_status: 'synced'
  });

  if (error) {
    return {
      success: false,
      message: 'No pudimos agregar el producto. Inténtalo de nuevo.'
    };
  }

  await updateMarketTotal(supabase, marketId, user.id);
  revalidatePath(`/markets/${marketId}`);

  return {
    success: true,
    message: 'Producto agregado al mercado.'
  };
}

export async function updateMarketItemAction(marketId: string, itemId: string, _state: MarketItemFormState = DEFAULT_ITEM_STATE, formData: FormData): Promise<MarketItemFormState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: 'Debes iniciar sesión para editar productos.'
    };
  }

  if (!(await userOwnsMarket(marketId, user.id))) {
    return {
      success: false,
      message: 'No tienes permisos para modificar este mercado.'
    };
  }

  const result = await buildMarketItemPayload(supabase, formData);

  if (!result.parsed.success || !result.payload) {
    return {
      success: false,
      message: 'Revisa los datos del producto.',
      errors: result.parsed.success ? undefined : result.parsed.error.flatten().fieldErrors
    };
  }

  const { error } = await supabase.from('market_items').update(result.payload).eq('id', itemId).eq('market_id', marketId).eq('user_id', user.id);

  if (error) {
    return {
      success: false,
      message: 'No pudimos actualizar el producto. Inténtalo de nuevo.'
    };
  }

  await updateMarketTotal(supabase, marketId, user.id);
  revalidatePath(`/markets/${marketId}`);

  return {
    success: true,
    message: 'Producto actualizado.'
  };
}

export async function deleteMarketItemAction(marketId: string, itemId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Debes iniciar sesión para eliminar productos.');
  }

  if (!(await userOwnsMarket(marketId, user.id))) {
    throw new Error('No tienes permisos para modificar este mercado.');
  }

  const { error } = await supabase.from('market_items').delete().eq('id', itemId).eq('market_id', marketId).eq('user_id', user.id);

  if (error) {
    throw new Error('No pudimos eliminar el producto.');
  }

  await updateMarketTotal(supabase, marketId, user.id);
  revalidatePath(`/markets/${marketId}`);
}
