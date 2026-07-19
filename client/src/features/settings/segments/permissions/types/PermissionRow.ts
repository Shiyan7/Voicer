export type SystemSettingsPane = 'mic' | 'systemAudio';

export type PermissionRow = {
  pane: SystemSettingsPane;
  label: string | undefined;
  granted: boolean | null;
};
