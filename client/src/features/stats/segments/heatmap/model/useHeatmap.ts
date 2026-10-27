import { createMemo, createSignal, onCleanup } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { formatDuration } from '@/shared/lib/time';

import { getWeekdayLabels } from '../../../lib/getWeekdayLabels';
import { pluralize } from '../../../lib/pluralize';
import { TODAY_REFRESH_MS, WEEKDAY_LABEL_ROWS } from '../config/heatmapConfig';
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
  const [today, setToday] = createSignal(getTodayDate());

  const todayTimer = setInterval(() => setToday(getTodayDate()), TODAY_REFRESH_MS);
  onCleanup(() => clearInterval(todayTimer));

  const weeks = createMemo(() =>
    buildHeatmapWeeks(
      props.year,
      props.days,
      getHeatThresholds(props.days),
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
      count: pluralize('stats.calls', count),
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

  const isFuture = (cell: HeatCell) => cell.date > today();

  const select = (cell: HeatCell) => {
    if (!cell.isOutside && !isFuture(cell)) props.onSelect(cell.date);
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
    isFuture,
    select,
  };
};
