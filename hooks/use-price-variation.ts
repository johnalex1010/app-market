import { calculateVariationPercentage } from '@/lib/calculations/price-variation';

export function usePriceVariation(currentPrice: number, previousPrice: number) {
  return calculateVariationPercentage(currentPrice, previousPrice);
}
