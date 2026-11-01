import type { RecordingKind } from '@/shared/lib/recorder';

export const isCallRecording = (payload: { kind: RecordingKind }) =>
  payload.kind === 'call';
