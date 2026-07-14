import type { SystemSettingsPane } from '@/features/call-recorder/model/RecorderService';

export type PermissionRow = {
  pane: SystemSettingsPane;
  label: string | undefined;
  granted: boolean | null;
};
