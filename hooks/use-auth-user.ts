'use client';

import { useEffect, useState } from 'react';
import type { AuthUser } from '@/types/auth.types';

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(null);
  }, []);

  return { user, isLoading: false };
}
