import { formatDurationLabel, formatShortDateTime } from '@/shared/lib/time';

import { DetailsHeaderDeps } from '../types/DetailsHeaderDeps';

export const useDetailsHeader = (props: DetailsHeaderDeps) => {
  const title = () => props.meeting.title;

  const metaLabel = () => {
    const date = formatShortDateTime(props.meeting.startedAt);
    const duration = props.meeting.durationSec;

    return duration ? `${date} · ${formatDurationLabel(duration)}` : date;
  };

  return { title, metaLabel };
}
