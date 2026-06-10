import type { UUID } from '@/types/common.types';

export type Category = {
  id: UUID;
  user_id: UUID | null;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
};
