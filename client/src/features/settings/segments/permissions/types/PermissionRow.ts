export type SystemSettingsPane = 'mic' | 'screenRecording';

export type PermissionRow = {
  pane: SystemSettingsPane;
  label: string | undefined;
  granted: boolean | null;
};
