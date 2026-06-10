export function formatPercentage(value: number) {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 1
  }).format(value).concat('%');
}
