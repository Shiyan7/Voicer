import { interviewSessionsQuery } from '../api/interviewSessionsQuery';
import { mapInterviewRows } from '../lib/mapInterviewRows';

export function useInterviews() {
  const [sessionsState] = interviewSessionsQuery();

  const rows = () =>
    mapInterviewRows(sessionsState.data?.interviewSessions ?? []);

  const isLoading = () => sessionsState.fetching && !sessionsState.data;

  const isEmpty = () => rows().length === 0;

  return { rows, isLoading, isEmpty };
}
