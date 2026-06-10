import { AuthCard } from '@/components/auth/auth-card';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthCard description="Te enviaremos un enlace seguro para actualizar tu contraseña." title="Recuperar contraseña">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
