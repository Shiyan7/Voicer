import { For, JSX, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { Icon } from '../icon';
import { dateRangePickerStyles } from './DateRangePicker.styles';
import { useDateRangePicker } from './hooks/useDateRangePicker';
import { DateRange, DateRangePreset } from './types';

interface DateRangePickerProps {
  value: DateRange | null;
  presets: DateRangePreset[];
  triggerClass?: string;
  triggerTitle?: string;
  onChange: (range: DateRange | null) => void;
  trigger: (opened: boolean) => JSX.Element;
}

const styles = dateRangePickerStyles();

export function DateRangePicker(props: DateRangePickerProps) {
  const picker = useDateRangePicker({
    value: () => props.value,
    onChange: (range) => props.onChange(range),
  });

  return (
    <div class={styles.root()} ref={picker.setRootRef}>
      <button
        class={props.triggerClass}
        type="button"
        title={props.triggerTitle}
        aria-label={props.triggerTitle}
        aria-expanded={picker.opened()}
        onClick={picker.toggle}
      >
        {props.trigger(picker.opened())}
      </button>
      <Show when={picker.opened()}>
        <div class={styles.panel()}>
          <div class={styles.presets()}>
            <For each={props.presets}>
              {(preset) => (
                <button
                  class={styles.preset()}
                  type="button"
                  onClick={() => picker.apply(preset.range)}
                >
                  {preset.label}
                </button>
              )}
            </For>
          </div>
          <div class={styles.calendar()}>
            <div class={styles.header()}>
              <button
                class={styles.navButton()}
                type="button"
                aria-label={i18n.t('date_range.prev_month')}
                onClick={picker.prevMonth}
              >
                <Icon name="common:chevron-left" size={16} />
              </button>
              <span class={styles.monthTitle()}>{picker.monthTitle()}</span>
              <button
                class={styles.navButton()}
                type="button"
                aria-label={i18n.t('date_range.next_month')}
                disabled={picker.isCurrentMonth()}
                onClick={picker.nextMonth}
              >
                <Icon name="common:chevron-right" size={16} />
              </button>
            </div>
            <div
              class={styles.grid()}
              onMouseLeave={() => picker.hoverDay(null)}
            >
              <For each={picker.weekdays()}>
                {(weekday) => <span class={styles.weekday()}>{weekday}</span>}
              </For>
              <For each={picker.days()}>
                {(day) => (
                  <div
                    class={styles.day({
                      outside: day.isOutside,
                      inRange: picker.isInRange(day),
                    })}
                  >
                    <button
                      class={styles.dayButton({
                        today: day.isToday,
                        edge: picker.isEdge(day),
                      })}
                      type="button"
                      disabled={day.isFuture}
                      onClick={() => picker.selectDay(day.key)}
                      onMouseEnter={() => picker.hoverDay(day.key)}
                    >
                      {day.label}
                    </button>
                  </div>
                )}
              </For>
            </div>
            <div class={styles.footer()}>
              <span class={styles.hint()}>
                {picker.isSelecting()
                  ? i18n.t('date_range.hint_end')
                  : i18n.t('date_range.hint_start')}
              </span>
              <Show when={props.value}>
                <button
                  class={styles.clear()}
                  type="button"
                  onClick={picker.clear}
                >
                  {i18n.t('date_range.clear')}
                </button>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
