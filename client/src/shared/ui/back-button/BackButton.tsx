import { Icon } from '../icon';
import { backButtonStyles } from './BackButton.styles';
import { BackButtonProps } from './types/BackButtonProps';

export function BackButton(props: BackButtonProps) {
  return (
    <button
      class={backButtonStyles()}
      aria-label={props.label}
      type="button"
      onClick={props.onClick}
    >
      <Icon size={18} name="common:chevron-left" />
    </button>
  );
}
