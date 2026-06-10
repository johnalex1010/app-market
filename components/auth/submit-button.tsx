'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

type SubmitButtonProps = {
  idleText: string;
  pendingText: string;
};

export function SubmitButton({ idleText, pendingText }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending} type="submit">
      {pending ? pendingText : idleText}
    </Button>
  );
}
