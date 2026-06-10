import { Button } from '@/components/ui/button';
import { logoutAction } from '@/features/auth/auth.actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function AppHeader() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-700">Control personal de mercado</p>
        {user?.email ? <p className="text-xs text-slate-500">{user.email}</p> : null}
      </div>
      <form action={logoutAction}>
        <Button type="submit" variant="secondary">
          Cerrar sesión
        </Button>
      </form>
    </header>
  );
}
