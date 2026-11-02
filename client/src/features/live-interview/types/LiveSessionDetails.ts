import type { InterviewSessionOutput } from '@schema';

export type LiveSessionDetails = Pick<
  InterviewSessionOutput,
  'id' | 'title' | 'mode' | 'prepStatus' | 'finishedAt' | 'meetingId' | 'recordingUrl' | 'createdAt'
>;
