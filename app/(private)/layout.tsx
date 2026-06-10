import type { ReactNode } from 'react';
import { PrivateLayoutShell } from '@/components/layout/private-layout-shell';

export default function PrivateLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return <PrivateLayoutShell>{children}</PrivateLayoutShell>;
}
