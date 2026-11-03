import { formatDayDate, formatDuration } from '@/shared/lib/time';

import { statsDayMeetingsQuery } from '../../../api/statsDayMeetingsQuery';
import { getTimeZone } from '../../../lib/getTimeZone';
import { pluralize } from '../../../lib/pluralize';
import { mapDayMeeting } from '../lib/mapDayMeeting';
import { DayPanelDeps } from '../types/DayPanelDeps';

export const useDayPanel = (deps: DayPanelDeps) => {
  const timeZone = getTimeZone();

  const [result] = statsDayMeetingsQuery(() => ({
    input: { date: deps.date, timeZone },
  }));

  const meetings = () => result.data?.statsDayMeetings ?? [];

  const items = () => meetings().map(mapDayMeeting);

  const title = () => formatDayDate(deps.date, true);

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
