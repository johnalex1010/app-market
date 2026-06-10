export function calculateMarketEquivalence(currentTotal: number, previousTotal: number) {
  return {
    difference: currentTotal - previousTotal,
    percentage: previousTotal === 0 ? 0 : ((currentTotal - previousTotal) / previousTotal) * 100
  };
}
