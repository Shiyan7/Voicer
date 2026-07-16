import { Show } from 'solid-js';

import { Icon } from '@/shared/ui/icon';

import { MeetingCardProps } from '../types/MeetingCardProps';
import { meetingCardStyles } from './MeetingCard.styles';

const styles = meetingCardStyles();

export function MeetingCard(props: MeetingCardProps) {
  return (
    <button
      class={styles.card()}
      type="button"
      onClick={() => props.onOpen(props.card.id)}
    >
      <Icon class={styles.icon()} size={20} name="common:audio" />
      <span class={styles.body()}>
        <span class={styles.title()}>{props.card.title}</span>
        <Show when={props.card.duration}>
          <span class={styles.duration()}>{props.card.duration}</span>
        </Show>
      </span>
      <span class={styles.date()}>{props.card.dateLabel}</span>
    </button>
  );
}
