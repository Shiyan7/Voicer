import { pluralize } from './pluralize';

export const formatCalls = (count: number) =>
  pluralize(
    {
      one: 'stats.calls_one',
      few: 'stats.calls_few',
      many: 'stats.calls_many',
      other: 'stats.calls_other',
    },
    count,
  );
