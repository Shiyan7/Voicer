import { injectable } from '@/shared/di';

import {
  PermissionsStatus,
  RecorderService,
  RecorderViewModel,
  SystemSettingsPane,
} from '@/features/call-recorder';
import { i18n, Locale } from '@/shared/i18n';
import { isTauri } from '@/shared/isTauri';
import { StatefulViewModel } from '@/shared/view-model';

/** Re-check permissions while the page is open (system prompts are async). */
const PERMISSIONS_POLL_MS = 2000;

export type PermissionRow = {
  pane: SystemSettingsPane;
  label: string | undefined;
  granted: boolean | null;
};

@injectable()
export class SettingsViewModel extends StatefulViewModel {
  permissions: PermissionsStatus | null = null;

  readonly isDesktop = isTauri();

  private pollId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly recorderService: RecorderService,
    private readonly recorder: RecorderViewModel,
  ) {
    super();
  }

  protected onMount() {
    if (!this.isDesktop) return;

    void this.refreshPermissions();
    this.pollId = setInterval(
      () => void this.refreshPermissions(),
      PERMISSIONS_POLL_MS,
    );
  }

  protected onDispose() {
    if (this.pollId !== null) {
      clearInterval(this.pollId);
      this.pollId = null;
    }
  }

  get locale() {
    return i18n.locale();
  }

  get autoRecord() {
    return this.recorder.autoRecord;
  }

  get permissionRows(): PermissionRow[] {
    return [
      {
        pane: 'mic',
        label: i18n.t('settings.permissions.mic'),
        granted: this.permissions?.mic ?? null,
      },
      {
        pane: 'screenRecording',
        label: i18n.t('settings.permissions.screen'),
        granted: this.permissions?.screenRecording ?? null,
      },
    ];
  }

  get allPermissionsGranted() {
    return Boolean(this.permissions?.mic && this.permissions?.screenRecording);
  }

  changeLang = (locale: string) => {
    i18n.changeLang(locale as Locale);
  };

  toggleAutoRecord = () => {
    this.recorder.setAutoRecord(!this.recorder.autoRecord);
  };

  requestPermissions = async () => {
    try {
      this.permissions = await this.recorderService.requestPermissions();
    } catch {
      // Snapshot stays as-is; the poller will retry.
    }
  };

  openSystemSettings = (pane: SystemSettingsPane) => {
    void this.recorderService.openSystemSettings(pane);
  };

  private refreshPermissions = async () => {
    try {
      this.permissions = await this.recorderService.checkPermissions();
    } catch {
      // Ignore — keep the last known snapshot.
    }
  };
}
