'use client';

import type { ButtonHTMLAttributes } from 'react';
import { Button } from '@/components/ui/button';

type ConfirmSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  message: string;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function ConfirmSubmitButton({ message, onClick, type = 'submit', ...props }: ConfirmSubmitButtonProps) {
  return (
    <Button
      type={type}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
          return;
        }

        onClick?.(event);
      }}
      {...props}
    />
  );
}
