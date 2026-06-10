import type { UUID } from '@/types/common.types';

export type PriceVariationStatus = 'up' | 'down' | 'equal';

export type PriceVariation = {
  difference: number;
  percentage: number;
  status: PriceVariationStatus;
};

export type MarketItem = {
  id: UUID;
  user_id: UUID;
  market_id: UUID;
  product_id: UUID;
  product_name_snapshot: string;
  category_id: UUID | null;
  quantity: number;
  unit_id: UUID | null;
  price: number;
  normalized_quantity: number | null;
  normalized_unit_price: number | null;
  image_url: string | null;
  notes: string | null;
  purchase_date: string;
  sync_status: 'synced' | 'pending' | 'failed' | 'conflict';
  created_at: string;
  updated_at: string;
  products?: {
    id: UUID;
    name: string;
  } | null;
  categories?: {
    id: UUID;
    name: string;
  } | null;
  units?: {
    id: UUID;
    name: string;
    abbreviation: string;
    type: string;
    conversion_factor?: number;
    base_unit?: string;
  } | null;
  variation?: PriceVariation | null;
};

export type MarketItemFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};
