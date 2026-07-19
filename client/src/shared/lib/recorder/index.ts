export type {
  CallDetectedPayload,
  CallEndedPayload,
  RecorderState,
  StartRecordingResult,
  StopRecordingResult,
} from './recorderBridge';
export {
  getRecorderState,
  onCallDetected,
  onCallEnded,
  onRecordingStarted,
  onRecordingStopped,
  startRecording,
  stopRecording,
} from './recorderBridge';
