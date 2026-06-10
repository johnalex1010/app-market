import { calculatePriceVariation } from '@/lib/calculations/price-variation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Category } from '@/types/category.types';
import type { MarketItem } from '@/types/market-item.types';
import type { Product } from '@/types/product.types';
import type { Unit } from '@/types/unit.types';

function toMarketItem(row: Record<string, unknown>): MarketItem {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    market_id: String(row.market_id),
    product_id: String(row.product_id),
    product_name_snapshot: String(row.product_name_snapshot),
    category_id: row.category_id ? String(row.category_id) : null,
    quantity: Number(row.quantity ?? 0),
    unit_id: row.unit_id ? String(row.unit_id) : null,
    price: Number(row.price ?? 0),
    normalized_quantity: row.normalized_quantity === null ? null : Number(row.normalized_quantity ?? 0),
    normalized_unit_price: row.normalized_unit_price === null ? null : Number(row.normalized_unit_price ?? 0),
    image_url: row.image_url ? String(row.image_url) : null,
    notes: row.notes ? String(row.notes) : null,
    purchase_date: String(row.purchase_date),
    sync_status: row.sync_status as MarketItem['sync_status'],
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    products: (row.products as MarketItem['products']) ?? null,
    categories: (row.categories as MarketItem['categories']) ?? null,
    units: (row.units as MarketItem['units']) ?? null
  };
}

export async function getMarketItems(marketId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('market_items')
    .select(
      `
      *,
      products(id, name),
      categories(id, name),
      units(id, name, abbreviation, type, conversion_factor, base_unit)
    `
    )
    .eq('market_id', marketId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  const items = (data ?? []).map((item) => toMarketItem(item));

  return Promise.all(
    items.map(async (item) => {
      const previous = await getPreviousProductItem(item.product_id, item.id);

      return {
        ...item,
        variation: previous ? calculatePriceVariation(item.normalized_unit_price ?? item.price, previous.normalized_unit_price ?? previous.price) : null
      };
    })
  );
}

export async function getPreviousProductItem(productId: string, currentItemId?: string) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from('market_items')
    .select('*')
    .eq('product_id', productId)
    .order('purchase_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1);

  if (currentItemId) {
    query = query.neq('id', currentItemId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data?.[0] ? toMarketItem(data[0]) : null;
}

export async function getMarketFormCatalogs(userId: string) {
  const supabase = await createSupabaseServerClient();
  const [productsResult, categoriesResult, unitsResult] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .or(`is_system.eq.true,user_id.eq.${userId}`)
      .order('name', { ascending: true }),
    supabase
      .from('categories')
      .select('*')
      .or(`is_system.eq.true,user_id.eq.${userId}`)
      .order('name', { ascending: true }),
    supabase.from('units').select('*').order('type', { ascending: true }).order('name', { ascending: true })
  ]);

  if (productsResult.error) {
    throw productsResult.error;
  }

  if (categoriesResult.error) {
    throw categoriesResult.error;
  }

  if (unitsResult.error) {
    throw unitsResult.error;
  }

  return {
    products: (productsResult.data ?? []) as Product[],
    categories: (categoriesResult.data ?? []) as Category[],
    units: (unitsResult.data ?? []) as Unit[]
  };
}
