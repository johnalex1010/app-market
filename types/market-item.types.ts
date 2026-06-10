import type { UUID } from '@/types/common.types';

export type MarketItem = {
  id: UUID;
  marketId: UUID;
  productId: UUID;
  quantity: number;
  unitPrice: number;
};
