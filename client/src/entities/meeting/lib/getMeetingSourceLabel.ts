interface MeetingSourceInfo {
  title?: string | null;
  source?: string | null;
}

export const getMeetingSourceLabel = (meeting: MeetingSourceInfo) =>
  meeting.title && meeting.source ? meeting.source : null;
