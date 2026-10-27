import { createMemo, createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { formatCalls } from '../../../lib/formatCalls';
import { formatDuration } from '../../../lib/formatDuration';
import { getWeekdayLabels } from '../../../lib/getWeekdayLabels';
import { WEEKDAY_LABEL_ROWS } from '../config/heatmapConfig';
import { buildHeatmapWeeks } from '../lib/buildHeatmapWeeks';
import { buildMonthLabels } from '../lib/buildMonthLabels';
import { getCellText } from '../lib/getCellText';
import { getHeatThresholds } from '../lib/getHeatThresholds';
import { getTodayDate } from '../lib/getTodayDate';
import { HeatCell } from '../types/HeatCell';
import { HeatmapProps } from '../types/HeatmapProps';
import { HeatTooltip } from '../types/HeatTooltip';

export const useHeatmap = (props: HeatmapProps) => {
  const [tooltip, setTooltip] = createSignal<HeatTooltip | null>(null);

  const weeks = createMemo(() =>
    buildHeatmapWeeks(
      props.year,
      props.days,
      getHeatThresholds(props.days),
      getTodayDate(),
    ),
  );

  const monthLabels = () => buildMonthLabels(weeks());

  const monthOffset = (column: number) =>
    `${(column / weeks().length) * 100}%`;

  const weekdayLabels = () =>
    getWeekdayLabels().map((label, row) =>
      WEEKDAY_LABEL_ROWS.includes(row) ? label : '',
    );

  const totalLabel = () => {
    const count = props.days.reduce((sum, day) => sum + day.count, 0);
    const duration = props.days.reduce((sum, day) => sum + day.durationSec, 0);
    return i18n.t('stats.year_total', {
      count: formatCalls(count),
      duration: formatDuration(duration),
      year: String(props.year),
    });
  };

  const yearTabs = () =>
    props.years.map((year) => ({ label: String(year), value: year }));

  const isDimmed = (cell: HeatCell) =>
    Boolean(props.selectedDate) && cell.date !== props.selectedDate;

  const showTooltip = (cell: HeatCell, element: HTMLElement) =>
    setTooltip({
      text: getCellText(cell),
      left: element.offsetLeft + element.offsetWidth / 2,
      top: element.offsetTop,
    });

  const hideTooltip = () => setTooltip(null);

  const select = (cell: HeatCell) => {
    if (!cell.isOutside && !cell.isFuture) props.onSelect(cell.date);
  };

  return {
    weeks,
    monthLabels,
    monthOffset,
    weekdayLabels,
    totalLabel,
    tooltip,
    yearTabs,
    isDimmed,
    showTooltip,
    hideTooltip,
    select,
  };
};
