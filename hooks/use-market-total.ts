import { calculateMarketTotal } from '@/lib/calculations/market-total';

export function useMarketTotal(values: number[]) {
  return calculateMarketTotal(values);
}
