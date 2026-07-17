import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { MeetingCardProps } from '../types/MeetingCardProps';
import { meetingCardStyles } from './MeetingCard.styles';

const styles = meetingCardStyles();

export function MeetingCard(props: MeetingCardProps) {
  return (
    <div class={styles.card()}>
      <button
        class={styles.open()}
        type="button"
        aria-label={props.card.title}
        onClick={() => props.onOpen(props.card.id)}
      />
      <Icon class={styles.icon()} size={20} name="common:audio" />
      <span class={styles.body()}>
        <span class={styles.title()}>{props.card.title}</span>
        <Show when={props.card.duration}>
          <span class={styles.duration()}>{props.card.duration}</span>
        </Show>
      </span>
      <span class={styles.date()}>{props.card.dateLabel}</span>
      <div class={styles.actions()}>
        <button
          class={styles.deleteBtn()}
          type="button"
          aria-label={i18n.t('meetings.delete.title')}
          onClick={() => props.onDelete(props.card.id)}
        >
          <Icon size={18} name="common:trash" />
        </button>
      </div>
    </div>
  );
}
