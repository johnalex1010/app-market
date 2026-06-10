'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { FormMessage } from '@/components/auth/form-message';
import { SubmitButton } from '@/components/auth/submit-button';
import { Input } from '@/components/ui/input';
import { registerAction, type AuthActionState } from '@/features/auth/auth.actions';

const initialState: AuthActionState = {
  success: false,
  message: ''
};

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage state={state} />
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="fullName">
          Nombre completo
        </label>
        <Input autoComplete="name" id="fullName" name="fullName" required type="text" />
        {state.errors?.fullName?.[0] ? <p className="text-sm text-red-600">{state.errors.fullName[0]}</p> : null}
      </div>
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
        <Input autoComplete="new-password" id="password" name="password" required type="password" />
        {state.errors?.password?.[0] ? <p className="text-sm text-red-600">{state.errors.password[0]}</p> : null}
      </div>
      <SubmitButton idleText="Crear cuenta" pendingText="Creando cuenta..." />
      <p className="text-sm text-slate-600">
        ¿Ya tienes cuenta?{' '}
        <Link className="font-medium text-brand-700 hover:text-brand-800" href="/login">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
