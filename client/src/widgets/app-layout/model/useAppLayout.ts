import { isTauri } from '@tauri-apps/api/core';
import { onMount } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { useMouseHistoryNavigation } from './useMouseHistoryNavigation';

export const useAppLayout = () => {
  onMount(i18n.init);
  useMouseHistoryNavigation();

  const ready = () => i18n.ready();

  const isDesktop = () => isTauri();

  return { ready, isDesktop };
};
