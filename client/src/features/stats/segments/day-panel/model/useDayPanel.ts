import { statsDayQuery } from '../../../api/statsDayQuery';
import { formatCalls } from '../../../lib/formatCalls';
import { formatDayDate } from '../../../lib/formatDayDate';
import { formatDuration } from '../../../lib/formatDuration';
import { mapDayMeeting } from '../lib/mapDayMeeting';
import { DayPanelProps } from '../types/DayPanelProps';

export const useDayPanel = (props: DayPanelProps) => {
  const [result] = statsDayQuery(
    () => ({ input: { date: props.date ?? '', timeZone: props.timeZone } }),
    { pause: () => !props.date },
  );

  const meetings = () => result.data?.statsDay ?? [];

  const items = () => meetings().map(mapDayMeeting);

  const title = () => (props.date ? formatDayDate(props.date, true) : '');

  const summary = () => {
    const duration = meetings().reduce(
      (sum, meeting) => sum + (meeting.durationSec ?? 0),
      0,
    );
    return `${formatCalls(meetings().length)} · ${formatDuration(duration)}`;
  };

  const isLoading = () => result.fetching && !meetings().length;

  const isEmpty = () => !result.fetching && !meetings().length;

  return { items, title, summary, isLoading, isEmpty };
};
