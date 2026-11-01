import { toInterviewSessionView } from '@/entities/interview-session';

import { interviewSessionsQuery } from '../api/interviewSessionsQuery';

export function useLiveHistory() {
  const [sessionsState, reexecute] = interviewSessionsQuery();

  const sessions = () => sessionsState.data?.interviewSessions ?? [];

  const pastSessions = () => sessions().map(toInterviewSessionView);

  const findSession = (id: string) =>
    sessions().find((session) => session.id === id);

  const refetch = () => reexecute({ requestPolicy: 'network-only' });

  return { pastSessions, findSession, refetch };
}
