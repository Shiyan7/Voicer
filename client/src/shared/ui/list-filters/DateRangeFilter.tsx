import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { formatDateRange, getDateRangePresets } from '@/shared/lib/date-range';
import { DateRange, DateRangePicker } from '@/shared/ui/date-range-picker';
import { Icon } from '@/shared/ui/icon';

import { listFiltersStyles } from './ListFilters.styles';

interface DateRangeFilterProps {
  value: DateRange | null;
  onChange: (range: DateRange | null) => void;
}

const styles = listFiltersStyles();

export function DateRangeFilter(props: DateRangeFilterProps) {
  const isActive = () => props.value !== null;

  return (
    <>
      <Show when={isActive()}>
        <span class={styles.chip()}>
          {formatDateRange(props.value)}
          <button
            class={styles.chipClear()}
            type="button"
            title={i18n.t('filters.date.clear')}
            aria-label={i18n.t('filters.date.clear')}
            onClick={() => props.onChange(null)}
          >
            <Icon size={12} name="common:cross" />
          </button>
        </span>
      </Show>
      <DateRangePicker
        value={props.value}
        presets={getDateRangePresets()}
        triggerClass={styles.iconBtn({ active: isActive() })}
        triggerTitle={i18n.t('filters.date.title')}
        onChange={props.onChange}
        trigger={() => (
          <>
            <Icon size={20} name="common:calendar" />
            <Show when={isActive()}>
              <span class={styles.dot()} />
            </Show>
          </>
        )}
      />
    </>
  );
}
