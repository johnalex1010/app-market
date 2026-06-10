import { Input } from '@/components/ui/input';
import type { ComponentProps } from 'react';

export function DatePicker(props: ComponentProps<typeof Input>) {
  return <Input type="date" {...props} />;
}
