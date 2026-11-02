import { Icon } from '@/shared/ui/icon';

import { PrepModeCardProps } from '../types/PrepModeCardProps';
import { prepModeCardStyles } from './PrepModeCard.styles';

export function PrepModeCard(props: PrepModeCardProps) {
  const styles = () =>
    prepModeCardStyles({
      mode: props.option.value,
      selected: props.isSelected,
    });

  return (
    <button
      class={styles().card()}
      type="button"
      role="radio"
      aria-checked={props.isSelected}
      onClick={props.onSelect}
    >
      <span class={styles().icon()}>
        <Icon name={props.option.icon} size={22} />
      </span>
      <span class={styles().title()}>{props.option.title}</span>
      <span class={styles().description()}>{props.option.description}</span>
    </button>
  );
}
