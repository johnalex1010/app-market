export function calculateMarketTotal(items: { price: number }[]) {
  return items.reduce((total, item) => total + item.price, 0);
}
