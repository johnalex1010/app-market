'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { FormMessage } from '@/components/auth/form-message';
import { SubmitButton } from '@/components/auth/submit-button';
import { Input } from '@/components/ui/input';
import { forgotPasswordAction, type AuthActionState } from '@/features/auth/auth.actions';

const initialState: AuthActionState = {
  success: false,
  message: ''
};

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage state={state} />
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="email">
          Correo electrónico
        </label>
        <Input autoComplete="email" id="email" name="email" required type="email" />
        {state.errors?.email?.[0] ? <p className="text-sm text-red-600">{state.errors.email[0]}</p> : null}
      </div>
      <SubmitButton idleText="Enviar enlace" pendingText="Enviando enlace..." />
      <Link className="block text-sm font-medium text-brand-700 hover:text-brand-800" href="/login">
        Volver a iniciar sesión
      </Link>
    </form>
  );
}
