import type { InterviewSessionOutput } from '@schema';

export type LiveSessionDetails = Pick<
  InterviewSessionOutput,
  'id' | 'title' | 'mode' | 'finishedAt' | 'meetingId' | 'recordingUrl' | 'createdAt'
>;
