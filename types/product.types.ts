import type { UUID } from '@/types/common.types';

export type Product = {
  id: UUID;
  user_id: UUID | null;
  category_id: UUID | null;
  default_unit_id: UUID | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
};
