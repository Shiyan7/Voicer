import type { MeetingsStatsOutput } from '@schema';

import { useUserMe } from '@/entities/user-me';
import { i18n } from '@/shared/i18n';
import { formatDuration } from '@/shared/lib/time';

import { StatTile } from '../types/StatTile';

export const useStatsBanner = (
  stats: () => MeetingsStatsOutput | undefined,
  isLoading: () => boolean,
) => {
  const userMe = useUserMe();

  const firstName = () => userMe.user()?.name?.trim().split(/\s+/)[0];

  const greeting = () => {
    const name = firstName();

    return name
      ? i18n.t('meetings.banner.greeting_name', { name })
      : i18n.t('meetings.banner.greeting');
  };

  const tiles = (): StatTile[] => {
    const value = stats();
    if (!value) return [];

    return [
      {
        value: String(value.weekCount),
        label: i18n.t('meetings.banner.week_count'),
      },
      {
        value: formatDuration(value.weekDurationSec),
        label: i18n.t('meetings.banner.week_duration'),
      },
      {
        value: String(value.openActionItems),
        label: i18n.t('meetings.banner.open_actions'),
      },
    ];
  };

  return { greeting, tiles, isLoading };
};
