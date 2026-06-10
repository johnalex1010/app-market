export function normalizeProductName(name: string) {
  return name.trim();
}

export function buildProductSlug(name: string) {
  return normalizeProductName(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}
