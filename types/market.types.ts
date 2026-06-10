import type { UUID } from '@/types/common.types';

export type Market = {
  id: UUID;
  user_id: UUID;
  name: string;
  market_date: string;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type MarketFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};
