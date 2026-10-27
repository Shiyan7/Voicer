import { A } from '@solidjs/router';
import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { MeetingCardProps } from '../types/MeetingCardProps';
import { meetingCardStyles } from './MeetingCard.styles';

const styles = meetingCardStyles();

export function MeetingCard(props: MeetingCardProps) {
  return (
    <div class={styles.card()}>
      <A
        class={styles.open()}
        href={props.card.href}
        aria-label={props.card.title}
      />
      <Icon class={styles.icon()} size={20} name="common:audio" />
      <span class={styles.body()}>
        <span class={styles.title()}>{props.card.title}</span>
        <Show when={props.card.duration}>
          <span class={styles.duration()}>{props.card.duration}</span>
        </Show>
      </span>
      <span class={styles.date()} title={props.card.dateTitle}>
        {props.card.dateLabel}
      </span>
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
