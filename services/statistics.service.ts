import { calculateAverage } from '@/lib/calculations/statistics';
import { calculatePriceVariation } from '@/lib/calculations/price-variation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUserId } from '@/services/markets.service';
import type { CategoryExpensePoint, MarketExpensePoint, ProductVariationPoint, StatisticsOverview } from '@/types/statistics.types';

type MarketRow = {
  id: string;
  name: string;
  market_date: string;
  total_amount: number | string | null;
};

type MarketItemRow = {
  id: string;
  product_id: string | null;
  product_name_snapshot: string;
  category_id: string | null;
  price: number | string | null;
  normalized_unit_price: number | string | null;
  purchase_date: string;
  created_at: string;
  categories?:
    | {
        id: string;
        name: string;
      }
    | {
        id: string;
        name: string;
      }[]
    | null;
};

type NormalizedMarketItem = Omit<MarketItemRow, 'categories'> & {
  categories: {
    id: string;
    name: string;
  } | null;
};

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function normalizeCategory(category: MarketItemRow['categories']) {
  if (Array.isArray(category)) {
    return category[0] ?? null;
  }

  return category ?? null;
}

function buildCategoryExpenses(items: NormalizedMarketItem[]) {
  const grouped = new Map<string, CategoryExpensePoint>();

  items.forEach((item) => {
    const categoryId = item.category_id ?? 'sin-categoria';
    const existing = grouped.get(categoryId);
    const price = toNumber(item.price);

    if (existing) {
      existing.totalAmount += price;
      existing.itemCount += 1;
      return;
    }

    grouped.set(categoryId, {
      categoryId,
      categoryName: item.categories?.name ?? 'Sin categoría',
      totalAmount: price,
      itemCount: 1
    });
  });

  return [...grouped.values()].sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 8);
}

function buildProductVariations(items: NormalizedMarketItem[]) {
  const grouped = new Map<string, NormalizedMarketItem[]>();

  items.forEach((item) => {
    if (!item.product_id) {
      return;
    }

    grouped.set(item.product_id, [...(grouped.get(item.product_id) ?? []), item]);
  });

  const variations: ProductVariationPoint[] = [];

  grouped.forEach((productItems, productId) => {
    const ordered = productItems.sort((a, b) => {
      const dateComparison = new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime();

      if (dateComparison !== 0) {
        return dateComparison;
      }

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const [current, previous] = ordered;

    if (!current || !previous) {
      return;
    }

    const currentPrice = toNumber(current.normalized_unit_price) || toNumber(current.price);
    const previousPrice = toNumber(previous.normalized_unit_price) || toNumber(previous.price);
    const variation = calculatePriceVariation(currentPrice, previousPrice);

    variations.push({
      productId,
      productName: current.product_name_snapshot,
      currentPrice,
      previousPrice,
      ...variation
    });
  });

  return variations.sort((a, b) => Math.abs(b.percentage) - Math.abs(a.percentage)).slice(0, 8);
}

export async function getStatistics(): Promise<StatisticsOverview> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      summaries: [],
      recentMarkets: [],
      categoryExpenses: [],
      productVariations: []
    };
  }

  const supabase = await createSupabaseServerClient();
  const [marketsResult, itemsResult] = await Promise.all([
    supabase
      .from('markets')
      .select('id, name, market_date, total_amount')
      .eq('user_id', userId)
      .order('market_date', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase
      .from('market_items')
      .select(
        `
        id,
        product_id,
        product_name_snapshot,
        category_id,
        price,
        normalized_unit_price,
        purchase_date,
        created_at,
        categories(id, name)
      `
      )
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false })
      .order('created_at', { ascending: false })
  ]);

  if (marketsResult.error) {
    throw marketsResult.error;
  }

  if (itemsResult.error) {
    throw itemsResult.error;
  }

  const markets = ((marketsResult.data ?? []) as MarketRow[]).map<MarketExpensePoint>((market) => ({
    marketId: market.id,
    name: market.name,
    marketDate: market.market_date,
    totalAmount: toNumber(market.total_amount)
  }));
  const items = ((itemsResult.data ?? []) as unknown as MarketItemRow[]).map((item) => ({
    ...item,
    categories: normalizeCategory(item.categories)
  }));
  const totalSpent = markets.reduce((total, market) => total + market.totalAmount, 0);
  const averageMarket = calculateAverage(markets.map((market) => market.totalAmount));

  return {
    summaries: [
      {
        label: 'Gasto total',
        value: totalSpent,
        format: 'currency'
      },
      {
        label: 'Mercados registrados',
        value: markets.length,
        format: 'number'
      },
      {
        label: 'Promedio por mercado',
        value: averageMarket,
        format: 'currency'
      },
      {
        label: 'Productos registrados',
        value: items.length,
        format: 'number'
      }
    ],
    recentMarkets: markets.slice(0, 8),
    categoryExpenses: buildCategoryExpenses(items),
    productVariations: buildProductVariations(items)
  };
}
