import { toInterviewSessionView } from '@/entities/interview-session';

import {
  interviewSessionsQuery,
  refetchInterviewSessions,
} from '../api/interviewSessionsQuery';

export function useLiveHistory() {
  const [sessionsState] = interviewSessionsQuery();

  const sessions = () => sessionsState.data?.interviewSessions ?? [];

  const pastSessions = () => sessions().map(toInterviewSessionView);

  const findSession = (id: string) =>
    sessions().find((session) => session.id === id);

  const refetch = refetchInterviewSessions;

  return { pastSessions, findSession, refetch };
}
