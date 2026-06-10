import type { ReactNode } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';

type PrivateLayoutShellProps = {
  children: ReactNode;
};

export function PrivateLayoutShell({ children }: PrivateLayoutShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <AppHeader />
        <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
      </div>
    </div>
  );
}
