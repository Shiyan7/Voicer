import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { openUrl } from '@tauri-apps/plugin-opener';
import { injectable } from '@/shared/di';

import { ApiService } from '@/shared/api';
import { isTauri } from '@/shared/isTauri';

export type CallSource =
  'zoom' | 'meet' | 'teams' | 'telegram' | 'discord' | 'other';

export type CallDetectedEvent = {
  source: CallSource;
  bundleId: string | null;
  /** Unix millis. */
  at: number;
};

export type CallEndedEvent = {
  /** Unix millis. */
  at: number;
};

export type StartRecordingResult = {
  localId: string;
  /** Unix millis. */
  startedAt: number;
  path: string;
  /** Non-fatal issues (e.g. system audio unavailable). */
  warnings: string[];
};

export type StopRecordingResult = {
  path: string;
  durationSec: number;
  localId: string;
  /** Unix millis. */
  startedAt: number;
};

export type RecorderState =
  | { state: 'idle' }
  | { state: 'recording'; localId: string; startedAt: number; path: string };

export type PermissionsStatus = {
  mic: boolean;
  screenRecording: boolean;
};

export type UploadProgressEvent = {
  path: string;
  sent: number;
  total: number;
};

type Unsubscribe = () => void;

export type SystemSettingsPane = 'mic' | 'screenRecording';

const SYSTEM_SETTINGS_PANES: Record<SystemSettingsPane, string> = {
  mic: 'x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone',
  screenRecording:
    'x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture',
};

/**
 * Thin wrapper around the Tauri recorder commands and events
 * (contract: client/src-tauri/src/commands.rs).
 *
 * Commands must only be called inside Tauri ({@link isTauri});
 * event subscriptions become no-ops on the web.
 */
@injectable()
export class RecorderService {
  constructor(private readonly api: ApiService) {}

  getState() {
    this.ensureTauri();
    return invoke<RecorderState>('get_recorder_state');
  }

  startRecording() {
    this.ensureTauri();
    return invoke<StartRecordingResult>('start_recording');
  }

  stopRecording() {
    this.ensureTauri();
    return invoke<StopRecordingResult>('stop_recording');
  }

  deleteRecording(path: string) {
    this.ensureTauri();
    return invoke<void>('delete_recording', { path });
  }

  checkPermissions() {
    this.ensureTauri();
    return invoke<PermissionsStatus>('check_permissions');
  }

  requestPermissions() {
    this.ensureTauri();
    return invoke<PermissionsStatus>('request_permissions');
  }

  /**
   * Streams the file from disk to `POST /meetings/:id/audio` (Rust side,
   * multipart). Progress arrives via {@link onUploadProgress}.
   */
  uploadRecording(path: string, meetingId: string, token: string) {
    this.ensureTauri();
    return invoke<void>('upload_recording', {
      path,
      url: this.api.getAudioUrl(meetingId),
      token,
    });
  }

  /**
   * Auth cookies are httpOnly, so the Rust uploader cannot reuse them —
   * ask the server for a short-lived Bearer token instead.
   */
  fetchUploadToken() {
    return this.api.get<{ accessToken: string }>('/auth/token');
  }

  openSystemSettings(pane: SystemSettingsPane) {
    this.ensureTauri();
    return openUrl(SYSTEM_SETTINGS_PANES[pane]);
  }

  onCallDetected(handler: (event: CallDetectedEvent) => void): Unsubscribe {
    return this.subscribe('call-detected', handler);
  }

  onCallEnded(handler: (event: CallEndedEvent) => void): Unsubscribe {
    return this.subscribe('call-ended', handler);
  }

  /** Fired for both webview- and tray-initiated stops. */
  onRecordingStopped(
    handler: (event: StopRecordingResult) => void,
  ): Unsubscribe {
    return this.subscribe('recording-stopped', handler);
  }

  onUploadProgress(handler: (event: UploadProgressEvent) => void): Unsubscribe {
    return this.subscribe('upload-progress', handler);
  }

  private subscribe<T>(
    event: string,
    handler: (payload: T) => void,
  ): Unsubscribe {
    if (!isTauri()) return () => {};

    const unlisten = listen<T>(event, (e) => handler(e.payload));

    return () => {
      void unlisten.then((fn) => fn());
    };
  }

  private ensureTauri() {
    if (!isTauri()) {
      throw new Error('Recorder is only available in the desktop app');
    }
  }
}
