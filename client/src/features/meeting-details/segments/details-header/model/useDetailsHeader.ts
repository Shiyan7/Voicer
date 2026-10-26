import { i18n } from '@/shared/i18n';
import { formatDurationLabel, formatShortDateTime } from '@/shared/lib/time';

import { DetailsHeaderDeps } from '../types/DetailsHeaderDeps';

export const useDetailsHeader = (props: DetailsHeaderDeps) => {
  const title = () => props.meeting.title;

  const dateLabel = () => formatShortDateTime(props.meeting.startedAt);

  const durationLabel = () => {
    const duration = props.meeting.durationSec;
    return duration ? formatDurationLabel(duration) : null;
  };

  const speakersLabel = () =>
    i18n.t('meetings.speakers_count', {
      count: props.speakerTones.length.toString(),
    });

  const hasSpeakers = () => props.speakerTones.length > 0;

  return {
    title,
    dateLabel,
    durationLabel,
    speakersLabel,
    hasSpeakers,
  };
};
