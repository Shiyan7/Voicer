import { i18n, Locale } from '@/shared/i18n';
import { isTauri } from '@/shared/isTauri';

import { PermissionRow } from '../types/PermissionRow';

export function useSettings() {
  const isDesktop = isTauri();

  const locale = () => i18n.locale();

  const autoRecord = (): boolean => false;

  const permissionRows = (): PermissionRow[] => [];

  const changeLang = (value: string) => {
    i18n.changeLang(value as Locale);
  };

  const toggleAutoRecord = () => {};

  const requestPermissions = () => {};

  const openSystemSettings = (pane: unknown) => {};

  const logout = () => {};

  return {
    isDesktop,
    locale,
    autoRecord,
    permissionRows,
    changeLang,
    toggleAutoRecord,
    requestPermissions,
    openSystemSettings,
    logout,
  };
}
