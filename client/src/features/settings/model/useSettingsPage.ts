import { isTauri } from '@tauri-apps/api/core';

export function useSettingsPage() {
  const isDesktop = isTauri();

  return { isDesktop };
}
