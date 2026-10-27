import { i18n } from '@/shared/i18n';

import { formatCalls } from '../../../lib/formatCalls';
import { formatDayDate } from '../../../lib/formatDayDate';
import { formatDuration } from '../../../lib/formatDuration';
import { HeatCell } from '../types/HeatCell';

export const getCellText = (cell: HeatCell) => {
  const date = formatDayDate(cell.date);
  if (!cell.count) return `${i18n.t('stats.no_calls')}, ${date}`;
  return `${formatCalls(cell.count)} · ${formatDuration(cell.durationSec)}, ${date}`;
};
