import type { InterviewSessionOutput } from '@schema';

export type LiveSessionDetails = Pick<
  InterviewSessionOutput,
  'id' | 'title' | 'finishedAt' | 'meetingId' | 'recordingUrl' | 'createdAt'
>;
