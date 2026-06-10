import { create } from 'zustand';

type MarketDraftStore = {
  name: string;
  setName: (name: string) => void;
  reset: () => void;
};

export const useMarketDraftStore = create<MarketDraftStore>((set) => ({
  name: '',
  setName: (name) => set({ name }),
  reset: () => set({ name: '' })
}));
