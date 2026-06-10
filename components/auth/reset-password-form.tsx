'use client';

import { useActionState } from 'react';
import { FormMessage } from '@/components/auth/form-message';
import { SubmitButton } from '@/components/auth/submit-button';
import { Input } from '@/components/ui/input';
import { resetPasswordAction, type AuthActionState } from '@/features/auth/auth.actions';

const initialState: AuthActionState = {
  success: false,
  message: ''
};

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(resetPasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage state={state} />
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="password">
          Nueva contraseña
        </label>
        <Input autoComplete="new-password" id="password" name="password" required type="password" />
        {state.errors?.password?.[0] ? <p className="text-sm text-red-600">{state.errors.password[0]}</p> : null}
      </div>
      <SubmitButton idleText="Actualizar contraseña" pendingText="Actualizando contraseña..." />
    </form>
  );
}
