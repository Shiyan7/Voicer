import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';

export interface StartRecordingResult {
  localId: string;
  startedAt: number;
  path: string;
  warnings: string[];
}

export interface StopRecordingResult {
  localId: string;
  startedAt: number;
  path: string;
  durationSec: number;
}

export type RecorderState =
  | { state: 'idle' }
  | { state: 'recording'; localId: string; startedAt: number; path: string };

export interface CallDetectedPayload {
  source: string;
  bundleId: string | null;
  at: number;
}

export interface CallEndedPayload {
  at: number;
}

export const startRecording = () =>
  invoke<StartRecordingResult>('start_recording');

export const stopRecording = () =>
  invoke<StopRecordingResult>('stop_recording');

export const getRecorderState = () =>
  invoke<RecorderState>('get_recorder_state');

export const onRecordingStarted = (
  handler: (payload: StartRecordingResult) => void,
): Promise<UnlistenFn> =>
  listen<StartRecordingResult>('recording-started', (event) =>
    handler(event.payload),
  );

export const onRecordingStopped = (
  handler: (payload: StopRecordingResult) => void,
): Promise<UnlistenFn> =>
  listen<StopRecordingResult>('recording-stopped', (event) =>
    handler(event.payload),
  );

export const onCallDetected = (
  handler: (payload: CallDetectedPayload) => void,
): Promise<UnlistenFn> =>
  listen<CallDetectedPayload>('call-detected', (event) =>
    handler(event.payload),
  );

export const onCallEnded = (
  handler: (payload: CallEndedPayload) => void,
): Promise<UnlistenFn> =>
  listen<CallEndedPayload>('call-ended', (event) => handler(event.payload));
