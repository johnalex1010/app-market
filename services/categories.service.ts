import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Category } from '@/types/category.types';

export async function getCategories(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .or(`is_system.eq.true,user_id.eq.${userId}`)
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Category[];
}
