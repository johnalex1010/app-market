import { redirect } from 'next/navigation';
import { AuthCard } from '@/components/auth/auth-card';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function ResetPasswordPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?resetSessionMissing=true');
  }

  return (
    <AuthCard description="Define una nueva contraseña para recuperar el acceso." title="Cambiar contraseña">
      <ResetPasswordForm />
    </AuthCard>
  );
}
