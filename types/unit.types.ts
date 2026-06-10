import type { UUID, UnitType } from '@/types/common.types';

export type Unit = {
  id: UUID;
  name: string;
  abbreviation: string;
  type: UnitType | 'package';
  conversion_factor: number;
  base_unit: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
};
