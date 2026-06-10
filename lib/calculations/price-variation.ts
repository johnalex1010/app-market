export function calculatePriceVariation(currentPrice: number, previousPrice: number) {
  return currentPrice - previousPrice;
}

export function calculateVariationPercentage(currentPrice: number, previousPrice: number) {
  if (previousPrice === 0) {
    return 0;
  }

  return ((currentPrice - previousPrice) / previousPrice) * 100;
}
