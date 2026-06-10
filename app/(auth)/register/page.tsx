import { AuthCard } from '@/components/auth/auth-card';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <AuthCard description="Crea tu cuenta para separar tus mercados y productos personales." title="Crear cuenta">
      <RegisterForm />
    </AuthCard>
  );
}
