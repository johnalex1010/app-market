export function normalizeCategoryName(name: string) {
  return name.trim();
}

export function buildCategorySlug(name: string) {
  return normalizeCategoryName(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
