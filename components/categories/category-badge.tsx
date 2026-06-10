import { CategoryIcon } from '@/components/categories/category-icon';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@/types/category.types';

type CategoryBadgeProps = {
  category: Pick<Category, 'color' | 'icon' | 'name'>;
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Badge className="gap-1.5" style={category.color ? { backgroundColor: `${category.color}18`, color: category.color } : undefined}>
      <CategoryIcon className="h-4 w-4 rounded-sm bg-transparent" color={category.color} icon={category.icon} />
      {category.name}
    </Badge>
  );
}
