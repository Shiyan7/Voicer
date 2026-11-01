import { interviewSessionsQuery } from '../api/interviewSessionsQuery';
import { toPastSessionView } from '../lib/toPastSessionView';

export function useLiveHistory() {
  const [sessionsState, refetchSessions] = interviewSessionsQuery();

  const sessions = () => sessionsState.data?.interviewSessions ?? [];

  const pastSessions = () => sessions().map(toPastSessionView);

  const findSession = (id: string) =>
    sessions().find((session) => session.id === id);

  const refetch = () => refetchSessions({ requestPolicy: 'network-only' });

  return { pastSessions, findSession, refetch };
}
