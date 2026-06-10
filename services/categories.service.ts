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
    created_at: String(row.created_at),
    updated_at: String(row.updated_at)
  };
}

export async function getCategories(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .or(`is_system.eq.true,user_id.eq.${userId}`)
    .order('is_system', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((category) => toCategory(category));
}
