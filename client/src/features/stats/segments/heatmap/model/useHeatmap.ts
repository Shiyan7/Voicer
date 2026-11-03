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
import { HeatmapDeps } from '../types/HeatmapDeps';
import { HeatTooltip } from '../types/HeatTooltip';

export const useHeatmap = (deps: HeatmapDeps) => {
  const [tooltip, setTooltip] = createSignal<HeatTooltip | null>(null);

  const weeks = createMemo(() =>
    buildHeatmapWeeks(deps.year, deps.days, getHeatThresholds(deps.days)),
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
        sumBy(deps.days, (day) => day.count),
      ),
      duration: formatDuration(sumBy(deps.days, (day) => day.durationSec)),
      year: String(deps.year),
    });
  };

  const yearTabs = () =>
    deps.years.map((year) => ({ label: String(year), value: year }));

  const isDimmed = (cell: HeatCell) =>
    Boolean(deps.selectedDate) && cell.date !== deps.selectedDate;

  const showTooltip = (cell: HeatCell, element: HTMLElement) =>
    setTooltip({
      text: getCellText(cell),
      left: element.offsetLeft + element.offsetWidth / 2,
      top: element.offsetTop,
    });

  const hideTooltip = () => setTooltip(null);

  const select = (cell: HeatCell) => {
    if (!cell.isOutside && !cell.isFuture) deps.onSelect(cell.date);
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
