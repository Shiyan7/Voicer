import { createMemo, createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { sumBy } from '@/shared/lib/sumBy';
import { formatDuration } from '@/shared/lib/time';

import { getWeekdayLabels } from '../../../lib/getWeekdayLabels';
import { pluralize } from '../../../lib/pluralize';
import { WEEKDAY_LABEL_ROWS } from '../config/heatmapConfig';
import { buildHeatmapWeeks } from '../lib/buildHeatmapWeeks';
import { buildMonthLabels } from '../lib/buildMonthLabels';
import { getCellText } from '../lib/getCellText';
import { getHeatThresholds } from '../lib/getHeatThresholds';
import { HeatCell } from '../types/HeatCell';
import { HeatmapProps } from '../types/HeatmapProps';
import { HeatTooltip } from '../types/HeatTooltip';

export const useHeatmap = (props: HeatmapProps) => {
  const [tooltip, setTooltip] = createSignal<HeatTooltip | null>(null);

  const weeks = createMemo(() =>
    buildHeatmapWeeks(props.year, props.days, getHeatThresholds(props.days)),
  );

  const monthLabels = () => buildMonthLabels(weeks());

  const monthOffset = (column: number) => `${(column / weeks().length) * 100}%`;

  const weekdayLabels = () =>
    getWeekdayLabels().map((label, row) =>
      WEEKDAY_LABEL_ROWS.includes(row) ? label : '',
    );

  const totalLabel = () => {
    return i18n.t('stats.year_total', {
      count: pluralize(
        'stats.calls',
        sumBy(props.days, (day) => day.count),
      ),
      duration: formatDuration(sumBy(props.days, (day) => day.durationSec)),
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
