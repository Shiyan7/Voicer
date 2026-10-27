import { i18n } from '@/shared/i18n';
import { formatDuration } from '@/shared/lib/time';

import { formatDayDate } from '../../../lib/formatDayDate';
import { pluralize } from '../../../lib/pluralize';
import { HeatCell } from '../types/HeatCell';

export const getCellText = (cell: HeatCell) => {
  const date = formatDayDate(cell.date);
  if (!cell.count) return `${i18n.t('stats.no_calls')}, ${date}`;
  return `${pluralize('stats.calls', cell.count)} · ${formatDuration(cell.durationSec)}, ${date}`;
};
