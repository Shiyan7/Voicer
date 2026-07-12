export const MEETING_AUDIO_UPLOADED_EVENT = 'meeting.audio-uploaded';

export interface MeetingAudioUploadedEvent {
  meetingId: string;
}

export const MEETING_UPDATED_EVENT = 'meeting.updated';

export interface MeetingUpdatedEvent {
  userId: string;
  id: string;
  status: string;
}
