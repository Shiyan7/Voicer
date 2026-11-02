import type { InterviewSessionOutput } from '@schema';

export type LiveSessionDetails = Pick<
  InterviewSessionOutput,
  | 'id'
  | 'title'
  | 'prepStatus'
  | 'finishedAt'
  | 'meetingId'
  | 'recordingUrl'
  | 'createdAt'
>;
