import { Badge } from '@/components/ui/badge';
import type { Category } from '@/types/category.types';

type CategoryBadgeProps = {
  category: Pick<Category, 'color' | 'icon' | 'name'>;
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Badge className="gap-1" style={category.color ? { backgroundColor: `${category.color}18`, color: category.color } : undefined}>
      {category.icon ? <span aria-hidden="true">{category.icon}</span> : null}
      {category.name}
    </Badge>
  );
}
