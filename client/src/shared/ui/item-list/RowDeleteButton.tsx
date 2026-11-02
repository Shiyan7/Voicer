import { Icon } from '@/shared/ui/icon';

import { rowDeleteButtonStyles } from './RowDeleteButton.styles';

interface RowDeleteButtonProps {
  label: string;
  onClick: () => void;
}

export function RowDeleteButton(props: RowDeleteButtonProps) {
  return (
    <button
      class={rowDeleteButtonStyles()}
      type="button"
      aria-label={props.label}
      onClick={props.onClick}
    >
      <Icon size={18} name="common:trash" />
    </button>
  );
}
