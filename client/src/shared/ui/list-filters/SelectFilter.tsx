import { Show } from 'solid-js';

import { Dropdown, DropdownOption } from '@/shared/ui/dropdown';
import { Icon, IconName } from '@/shared/ui/icon';

import { listFiltersStyles } from './ListFilters.styles';

interface SelectFilterProps<T> {
  icon: IconName;
  title: string;
  options: DropdownOption<T>[];
  selected: T;
  isActive: boolean;
  onSelect: (value: T) => void;
}

const styles = listFiltersStyles();

export function SelectFilter<T>(props: SelectFilterProps<T>) {
  return (
    <Dropdown
      options={props.options}
      selected={props.selected}
      onSelect={props.onSelect}
      triggerClass={styles.iconBtn({ active: props.isActive })}
      trigger={() => (
        <span title={props.title}>
          <Icon size={20} name={props.icon} />
          <Show when={props.isActive}>
            <span class={styles.dot()} />
          </Show>
        </span>
      )}
    />
  );
}
