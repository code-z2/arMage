import { create } from 'zustand';
import { useState, useEffect } from 'react';
import { createJSONStorage, persist } from 'zustand/middleware';

interface IMageState {
  connected: boolean;
  setConnected: (connected: boolean) => void;

  activeTab: 'overview' | 'licensed' | 'sub-licensed' | 'transactions' | 'upload';
  setActiveTab: (activeView: 'overview' | 'licensed' | 'sub-licensed' | 'transactions' | 'upload') => void;

  edge: string | null;
  setEdge: (edge: string | null) => void;
}

export const useMageStore = create<IMageState>()(
  persist(
    (set) => ({
      connected: false,
      setConnected: (connected) => set({ connected }),

      activeTab: 'overview',
      setActiveTab: (activeTab) => set({ activeTab }),

      edge: null,
      setEdge: (edge) => set({ edge }),
    }),
    {
      name: 'armage-wild-broccoli-storage-enclave',
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
