import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Category } from '@/types/category.types';

function toCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    user_id: row.user_id ? String(row.user_id) : null,
    name: String(row.name),
    slug: String(row.slug),
    icon: row.icon ? String(row.icon) : null,
    color: row.color ? String(row.color) : null,
    is_system: Boolean(row.is_system),
    product_count: typeof row.product_count === 'number' ? row.product_count : 0,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at)
  };
}

function countProductsByCategory(products: { category_id: string | null }[] | null) {
  return (products ?? []).reduce<Record<string, number>>((accumulator, product) => {
    if (!product.category_id) {
      return accumulator;
    }

    return {
      ...accumulator,
      [product.category_id]: (accumulator[product.category_id] ?? 0) + 1
    };
  }, {});
}

export async function getCategories(userId: string) {
  const supabase = await createSupabaseServerClient();
  const [{ data, error }, productsResult] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .or(`is_system.eq.true,user_id.eq.${userId}`)
      .order('is_system', { ascending: false })
      .order('name', { ascending: true }),
    supabase.from('products').select('category_id').or(`is_system.eq.true,user_id.eq.${userId}`)
  ]);

  if (error) {
    throw error;
  }

  if (productsResult.error) {
    throw productsResult.error;
  }

  const productCounts = countProductsByCategory(productsResult.data);

  return (data ?? []).map((category) => toCategory({ ...category, product_count: productCounts[String(category.id)] ?? 0 }));
}

export async function getCategoryById(categoryId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .or(`is_system.eq.true,user_id.eq.${userId}`)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toCategory(data) : null;
}
