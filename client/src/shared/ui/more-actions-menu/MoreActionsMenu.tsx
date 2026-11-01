import { Dropdown, DropdownOption } from '@/shared/ui/dropdown';
import { Icon } from '@/shared/ui/icon';

import { moreActionsMenuStyles } from './MoreActionsMenu.styles';

interface MoreActionsMenuProps<T> {
  options: DropdownOption<T>[];
  onSelect: (value: T) => void;
}

const styles = moreActionsMenuStyles();

export function MoreActionsMenu<T>(props: MoreActionsMenuProps<T>) {
  return (
    <Dropdown
      options={props.options}
      onSelect={props.onSelect}
      triggerClass={styles.trigger()}
      trigger={() => <Icon size={18} name="common:dots" />}
    />
  );
}
