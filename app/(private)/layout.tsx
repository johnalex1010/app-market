import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { PrivateLayoutShell } from '@/components/layout/private-layout-shell';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function PrivateLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <PrivateLayoutShell>{children}</PrivateLayoutShell>;
}
