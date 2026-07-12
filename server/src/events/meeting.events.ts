/**
 * Internal (in-process) event names and payloads used to decouple
 * MeetingsService → ProcessingService → EventsGateway without circular deps.
 */

/** Emitted after audio has been attached to a meeting (status → uploaded). */
export const MEETING_AUDIO_UPLOADED_EVENT = 'meeting.audio-uploaded';

export interface MeetingAudioUploadedEvent {
  meetingId: string;
}

/** Emitted on every meeting status change; relayed to clients via socket.io. */
export const MEETING_UPDATED_EVENT = 'meeting.updated';

export interface MeetingUpdatedEvent {
  userId: string;
  id: string;
  status: string;
}
