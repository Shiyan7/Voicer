import { i18n } from '../../i18n';
import { Icon } from '../icon';
import { backButtonStyles } from './BackButton.styles';
import { BackButtonProps } from './types/BackButtonProps';

export function BackButton(props: BackButtonProps) {
  return (
    <button
      class={backButtonStyles()}
      aria-label={i18n.t('common.back')}
      type="button"
      onClick={props.onClick}
    >
      <Icon size={18} name="common:chevron-left" />
    </button>
  );
}
