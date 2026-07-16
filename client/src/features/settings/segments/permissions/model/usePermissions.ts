import { PermissionRow, SystemSettingsPane } from '../types/PermissionRow';

export function usePermissions() {
  const rows = (): PermissionRow[] => [];

  const requestPermissions = () => {};

  const openSystemSettings = (pane: SystemSettingsPane) => {};

  return { rows, requestPermissions, openSystemSettings };
}
