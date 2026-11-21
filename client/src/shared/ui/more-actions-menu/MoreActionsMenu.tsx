import { Dropdown, DropdownOption } from '@/shared/ui/dropdown';
import { Icon } from '@/shared/ui/icon';

import { moreActionsMenuStyles } from './MoreActionsMenu.styles';

interface MoreActionsMenuProps<T> {
  options: DropdownOption<T>[];
  variant?: 'ghost';
  class?: string;
  onSelect: (value: T) => void;
}

const styles = moreActionsMenuStyles();

export function MoreActionsMenu<T>(props: MoreActionsMenuProps<T>) {
  return (
    <Dropdown
      class={props.class}
      options={props.options}
      onSelect={props.onSelect}
      panelClass={styles.panel({ variant: props.variant })}
      triggerClass={styles.trigger({ variant: props.variant })}
      trigger={() => <Icon size={18} name="common:dots" />}
    />
  );
}
