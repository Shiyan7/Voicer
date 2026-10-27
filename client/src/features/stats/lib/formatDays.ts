import { pluralize } from './pluralize';

export const formatDays = (count: number) =>
  pluralize(
    {
      one: 'stats.days_one',
      few: 'stats.days_few',
      many: 'stats.days_many',
      other: 'stats.days_other',
    },
    count,
  );
