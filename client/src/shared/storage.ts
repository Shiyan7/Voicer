import { isTauri } from '@tauri-apps/api/core';
import { LazyStore } from '@tauri-apps/plugin-store';

const createTauriStorage = (name: string) => {
  const store = new LazyStore(name);

  return {
    getItem: async (key: string) => (await store.get<string>(key)) ?? null,
    setItem: async (key: string, value: string) => {
      await store.set(key, value);
    },
    removeItem: async (key: string) => {
      await store.delete(key);
    },
  };
};

export const storage = isTauri()
  ? createTauriStorage('storage.dat')
  : localStorage;
