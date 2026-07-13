import { MeetingStatus } from '../types';

const STATUS_FLOW: MeetingStatus[] = [
  'recording',
  'uploading',
  'uploaded',
  'transcribing',
  'summarizing',
  'ready',
];

export function isMeetingProcessing(status: MeetingStatus) {
  return status !== 'ready' && status !== 'failed';
}

export function isMeetingAudioReady(status: MeetingStatus) {
  return STATUS_FLOW.indexOf(status) >= STATUS_FLOW.indexOf('uploaded');
}
