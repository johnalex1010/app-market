import type { UUID } from '@/types/common.types';

export type Category = {
  id: UUID;
  name: string;
  color?: string;
};
