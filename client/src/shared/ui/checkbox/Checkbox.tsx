import { Icon } from '@/shared/ui/icon';

import { checkboxStyles } from './Checkbox.styles';

interface CheckboxProps {
  checked: boolean;
  class?: string;
  label: string;
  onChange: () => void;
}

const styles = checkboxStyles();

export function Checkbox(props: CheckboxProps) {
  return (
    <label class={styles.root({ class: props.class })}>
      <input
        class={styles.input()}
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
      />
      <span class={styles.box({ checked: props.checked })}>
        <Icon size={12} name="common:check" />
      </span>
      <span>{props.label}</span>
    </label>
  );
}
