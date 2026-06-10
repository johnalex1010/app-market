import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Unit } from '@/types/unit.types';

export async function getUnits() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .order('type', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Unit[];
}
