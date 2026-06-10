import { Input } from '@/components/ui/input';
import type { ComponentProps } from 'react';

export function NumberInput(props: ComponentProps<typeof Input>) {
  return <Input inputMode="numeric" type="number" {...props} />;
}
