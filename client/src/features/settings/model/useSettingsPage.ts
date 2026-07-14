import { isTauri } from '@/shared/isTauri';

export function useSettingsPage() {
  const isDesktop = isTauri();

  return { isDesktop };
}
