import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCategories } from '@/services/categories.service';
import { getCurrentUserId } from '@/services/markets.service';
import { getUnits } from '@/services/units.service';
import type { Product, ProductPriceHistoryItem } from '@/types/product.types';

function toProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    user_id: row.user_id ? String(row.user_id) : null,
    category_id: row.category_id ? String(row.category_id) : null,
    default_unit_id: row.default_unit_id ? String(row.default_unit_id) : null,
    name: String(row.name),
    slug: String(row.slug),
    description: row.description ? String(row.description) : null,
    image_url: row.image_url ? String(row.image_url) : null,
    is_system: Boolean(row.is_system),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    categories: (row.categories as Product['categories']) ?? null,
    units: (row.units as Product['units']) ?? null
  };
}

export async function getProducts() {
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      categories(id, name),
      units:default_unit_id(id, name, abbreviation)
    `
    )
    .or(`is_system.eq.true,user_id.eq.${userId}`)
    .order('is_system', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((product) => toProduct(product));
}

export async function getProductById(productId: string) {
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      *,
      categories(id, name),
      units:default_unit_id(id, name, abbreviation)
    `
    )
    .eq('id', productId)
    .or(`is_system.eq.true,user_id.eq.${userId}`)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toProduct(data) : null;
}

export async function getProductFormCatalogs() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      categories: [],
      units: []
    };
  }

  const [categories, units] = await Promise.all([getCategories(userId), getUnits()]);

  return {
    categories,
    units
  };
}

export async function getProductPriceHistory(productId: string) {
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('market_items')
    .select(
      `
      id,
      market_id,
      purchase_date,
      quantity,
      price,
      normalized_unit_price,
      markets(id, name),
      units(id, abbreviation, base_unit)
    `
    )
    .eq('product_id', productId)
    .eq('user_id', userId)
    .order('purchase_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => {
    const row = item as Record<string, unknown>;
    const market = row.markets as { id: string; name: string } | null;
    const unit = row.units as { abbreviation: string; base_unit: string } | null;

    return {
      id: String(row.id),
      market_id: String(row.market_id),
      market_name: market?.name ?? 'Mercado sin nombre',
      purchase_date: String(row.purchase_date),
      quantity: Number(row.quantity ?? 0),
      price: Number(row.price ?? 0),
      normalized_unit_price: row.normalized_unit_price === null ? null : Number(row.normalized_unit_price ?? 0),
      unit_abbreviation: unit?.abbreviation ?? null,
      base_unit: unit?.base_unit ?? null
    } satisfies ProductPriceHistoryItem;
  });
}
