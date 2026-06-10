import type { UUID } from '@/types/common.types';

export type Product = {
  id: UUID;
  name: string;
  categoryId?: UUID;
};
