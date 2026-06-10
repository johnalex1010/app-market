import type { AuthUser } from '@/types/auth.types';

export function mapAuthUser(id: string, email: string): AuthUser {
  return { id, email };
}
