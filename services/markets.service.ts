import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Market } from '@/types/market.types';

function toMarket(row: Record<string, unknown>): Market {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    name: String(row.name),
    market_date: String(row.market_date),
    total_amount: Number(row.total_amount ?? 0),
    notes: row.notes ? String(row.notes) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at)
  };
}

export async function getCurrentUserId() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function getMarketsByUser() {
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('markets')
    .select('*')
    .eq('user_id', userId)
    .order('market_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((market) => toMarket(market));
}

export async function getMarketById(marketId: string) {
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from('markets')
    .select('*')
    .eq('id', marketId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toMarket(data) : null;
}

export async function userOwnsMarket(marketId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('markets')
    .select('id')
    .eq('id', marketId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}
