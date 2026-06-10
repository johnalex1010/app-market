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
  categories?: {
    id: UUID;
    name: string;
  } | null;
  units?: {
    id: UUID;
    name: string;
    abbreviation: string;
  } | null;
};

export type ProductFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export type ProductPriceHistoryItem = {
  id: UUID;
  market_id: UUID;
  market_name: string;
  purchase_date: string;
  quantity: number;
  price: number;
  normalized_unit_price: number | null;
  unit_abbreviation: string | null;
  base_unit: string | null;
};
