import type { HTMLAttributes } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

type ModalProps = HTMLAttributes<HTMLDivElement> & {
  open: boolean;
};

export function Modal({ open, className, children, ...props }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="presentation">
      <Card className={cn('w-full max-w-lg', className)} role="dialog" aria-modal="true" {...props}>
        {children}
      </Card>
    </div>
  );
}
