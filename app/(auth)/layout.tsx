import type { ReactNode } from 'react';

export default function AuthLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return <main className="grid min-h-screen w-full place-items-center overflow-x-hidden px-4 py-10">{children}</main>;
}
