'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from '@/features/auth/auth.schema';

export type AuthActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

const DEFAULT_ERROR_MESSAGE = 'No pudimos completar la solicitud. Inténtalo de nuevo.';

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

function getStringField(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === 'string' ? value : '';
}

export async function loginAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: getStringField(formData, 'email'),
    password: getStringField(formData, 'password')
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los datos ingresados.',
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      success: false,
      message: 'Credenciales incorrectas. Verifica tu correo y contraseña.'
    };
  }

  redirect('/dashboard');
}

export async function registerAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    fullName: getStringField(formData, 'fullName'),
    email: getStringField(formData, 'email'),
    password: getStringField(formData, 'password')
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los datos ingresados.',
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName
      }
    }
  });

  if (error) {
    return {
      success: false,
      message: error.message.includes('already registered') ? 'Este correo ya está asociado a una cuenta.' : DEFAULT_ERROR_MESSAGE
    };
  }

  redirect('/login?registered=true');
}

export async function forgotPasswordAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: getStringField(formData, 'email')
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los datos ingresados.',
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password`
  });

  if (error) {
    return {
      success: false,
      message: DEFAULT_ERROR_MESSAGE
    };
  }

  return {
    success: true,
    message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.'
  };
}

export async function resetPasswordAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: getStringField(formData, 'password')
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Revisa los datos ingresados.',
      errors: parsed.error.flatten().fieldErrors
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password
  });

  if (error) {
    return {
      success: false,
      message: 'El enlace de recuperación no es válido o ya expiró.'
    };
  }

  redirect('/login?passwordUpdated=true');
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();
  redirect('/login');
}
