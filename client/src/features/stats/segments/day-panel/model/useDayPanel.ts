import { formatDayDate, formatDuration } from '@/shared/lib/time';

import { statsDayMeetingsQuery } from '../../../api/statsDayMeetingsQuery';
import { getTimeZone } from '../../../lib/getTimeZone';
import { pluralize } from '../../../lib/pluralize';
import { mapDayMeeting } from '../lib/mapDayMeeting';
import { DayPanelProps } from '../types/DayPanelProps';

export const useDayPanel = (props: DayPanelProps) => {
  const timeZone = getTimeZone();

  const [result] = statsDayMeetingsQuery(() => ({
    input: { date: props.date, timeZone },
  }));

  const meetings = () => result.data?.statsDayMeetings ?? [];

  const items = () => meetings().map(mapDayMeeting);

  const title = () => formatDayDate(props.date, true);

  const summary = () => {
    const duration = meetings().reduce(
      (sum, meeting) => sum + (meeting.durationSec ?? 0),
      0,
    );
    return `${pluralize('stats.calls', meetings().length)} · ${formatDuration(duration)}`;
  };

  const isLoading = () => result.fetching && !meetings().length;

  const isEmpty = () => !result.fetching && !meetings().length;

  return { items, title, summary, isLoading, isEmpty };
};
