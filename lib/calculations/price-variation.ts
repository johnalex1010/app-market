export function calculatePriceVariation(currentPrice: number, previousPrice: number) {
  const difference = currentPrice - previousPrice;
  const percentage = previousPrice > 0 ? (difference / previousPrice) * 100 : 0;
  const status = difference > 0 ? 'up' : difference < 0 ? 'down' : 'equal';

  return {
    difference,
    percentage,
    status: status as 'up' | 'down' | 'equal'
  };
}

export function calculateVariationPercentage(currentPrice: number, previousPrice: number) {
  return calculatePriceVariation(currentPrice, previousPrice).percentage;
}
