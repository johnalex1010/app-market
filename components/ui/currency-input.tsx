import { Input } from '@/components/ui/input';
import type { ComponentProps } from 'react';

export function CurrencyInput(props: ComponentProps<typeof Input>) {
  return <Input inputMode="decimal" min="0" step="0.01" type="number" {...props} />;
}
