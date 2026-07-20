import { makePersisted } from '@solid-primitives/storage';
import { createRoot, createSignal } from 'solid-js';

import { storage } from '../storage';

export const settingsRoot = createRoot(() => {
  const [autoRecord, setAutoRecord] = makePersisted(createSignal(true), {
    name: 'settings.autoRecord',
    storage,
    serialize: (value: boolean) => (value ? '1' : '0'),
    deserialize: (raw) => raw === '1',
  });

  return {
    get autoRecord() {
      return autoRecord();
    },
    toggleAutoRecord() {
      setAutoRecord((value) => !value);
    },
  };
});
