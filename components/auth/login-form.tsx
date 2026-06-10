'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { FormMessage } from '@/components/auth/form-message';
import { SubmitButton } from '@/components/auth/submit-button';
import { Input } from '@/components/ui/input';
import { loginAction, type AuthActionState } from '@/features/auth/auth.actions';

const initialState: AuthActionState = {
  success: false,
  message: ''
};

type LoginFormProps = {
  initialMessage?: AuthActionState;
};

export function LoginForm({ initialMessage = initialState }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAction, initialMessage);

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
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="password">
          Contraseña
        </label>
        <Input autoComplete="current-password" id="password" name="password" required type="password" />
        {state.errors?.password?.[0] ? <p className="text-sm text-red-600">{state.errors.password[0]}</p> : null}
      </div>
      <SubmitButton idleText="Iniciar sesión" pendingText="Iniciando sesión..." />
      <div className="grid gap-3 text-sm sm:flex sm:items-center sm:justify-between">
        <Link className="font-medium text-brand-700 hover:text-brand-800" href="/forgot-password">
          ¿Olvidaste tu contraseña?
        </Link>
        <Link className="font-medium text-brand-700 hover:text-brand-800" href="/register">
          Crear cuenta
        </Link>
      </div>
    </form>
  );
}
