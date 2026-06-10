'use client';

export function useToast() {
  return {
    showToast(message: string) {
      window.alert(message);
    }
  };
}
