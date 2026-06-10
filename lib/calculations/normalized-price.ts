export function calculateNormalizedQuantity(quantity: number, conversionFactor: number) {
  return quantity * conversionFactor;
}

export function calculateNormalizedUnitPrice(price: number, normalizedQuantity: number) {
  if (normalizedQuantity <= 0) {
    return 0;
  }

  return price / normalizedQuantity;
}
