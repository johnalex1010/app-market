import {
  Apple,
  Beef,
  Box,
  Carrot,
  CupSoda,
  Milk,
  Package,
  PawPrint,
  Sparkles,
  Tag,
  Wheat
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const ICONS = {
  apple: Apple,
  beef: Beef,
  bottle: CupSoda,
  box: Box,
  bread: Package,
  carrot: Carrot,
  milk: Milk,
  package: Package,
  paw: PawPrint,
  sparkles: Sparkles,
  wheat: Wheat
};

type CategoryIconProps = {
  icon?: string | null;
  color?: string | null;
  className?: string;
};

export function CategoryIcon({ icon, color, className }: CategoryIconProps) {
  const normalizedIcon = icon?.toLowerCase().trim() ?? '';
  const Icon = ICONS[normalizedIcon as keyof typeof ICONS];
  const style = color ? { backgroundColor: `${color}18`, color } : undefined;

  return (
    <span
      className={cn('inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700', className)}
      style={style}
    >
      {Icon ? <Icon aria-hidden="true" className="h-5 w-5" /> : <span aria-hidden="true" className="text-base">{icon || <Tag className="h-5 w-5" />}</span>}
    </span>
  );
}
