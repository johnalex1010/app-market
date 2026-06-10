import { create } from 'zustand';
import type { SyncStatus } from '@/types/common.types';

type SyncStore = {
  status: SyncStatus;
  pendingCount: number;
  setStatus: (status: SyncStatus) => void;
  setPendingCount: (pendingCount: number) => void;
};

export const useSyncStore = create<SyncStore>((set) => ({
  status: 'synced',
  pendingCount: 0,
  setStatus: (status) => set({ status }),
  setPendingCount: (pendingCount) => set({ pendingCount })
}));
