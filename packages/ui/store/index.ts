import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useState, useEffect } from 'react';

interface IMageState {
  activeTab: 'overview' | 'licensed' | 'sub-licensed' | 'transactions' | 'upload';
  setActiveTab: (activeView: 'overview' | 'licensed' | 'sub-licensed' | 'transactions' | 'upload') => void;

  edge: string | null;
  setEdge: (edge: string | null) => void;

  transactions: { [key: string]: any }[];
  addTransaction: (transactions: any[]) => void;
}

export const useMageStore = create<IMageState>()(
  persist(
    (set) => ({
      activeTab: 'overview',
      setActiveTab: (activeTab) => set({ activeTab }),

      edge: null,
      setEdge: (edge) => set({ edge }),

      transactions: [],
      addTransaction: (transactions) => set((state) => ({ transactions: [...state.transactions, transactions] })),
    }),
    {
      name: 'armage-storage-wild-brocoli-edge',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export const useStore = <T, F>(store: (callback: (state: T) => unknown) => unknown, callback: (state: T) => F) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};
