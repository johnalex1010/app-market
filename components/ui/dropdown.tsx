import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Dropdown({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-md border border-slate-200 bg-white p-2 shadow-sm', className)} {...props} />;
}
