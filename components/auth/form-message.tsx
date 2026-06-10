import type { AuthActionState } from '@/features/auth/auth.actions';

type FormMessageProps = {
  state: AuthActionState;
};

export function FormMessage({ state }: FormMessageProps) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={state.success ? 'rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700' : 'rounded-md bg-red-50 px-3 py-2 text-sm text-red-700'}
      role="status"
    >
      {state.message}
    </p>
  );
}
