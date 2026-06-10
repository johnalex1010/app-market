import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';
import type { AuthActionState } from '@/features/auth/auth.actions';

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthCard description="Accede para gestionar tus mercados, productos y estadísticas." title="Iniciar sesión">
      <LoginForm initialMessage={getInitialMessage(params)} />
    </AuthCard>
  );
}

function getInitialMessage(params: Record<string, string | string[] | undefined>): AuthActionState {
  if (params.registered === 'true') {
    return {
      success: true,
      message: 'Cuenta creada correctamente. Ya puedes iniciar sesión.'
    };
  }

  if (params.passwordUpdated === 'true') {
    return {
      success: true,
      message: 'La contraseña fue actualizada. Ya puedes iniciar sesión.'
    };
  }

  if (params.resetSessionMissing === 'true') {
    return {
      success: false,
      message: 'El enlace de recuperación no es válido o ya expiró.'
    };
  }

  return {
    success: false,
    message: ''
  };
}
