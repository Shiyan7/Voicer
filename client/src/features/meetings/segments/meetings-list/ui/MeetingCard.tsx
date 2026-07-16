import { Icon } from '@/shared/ui/icon';
import { StatusBadge } from '@/shared/ui/status-badge';

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
      <span class={styles.body()}>
        <span class={styles.title()}>{props.card.title}</span>
        <span class={styles.meta()}>{props.card.meta}</span>
      </span>
      <StatusBadge status={props.card.status} />
      <Icon class={styles.chevron()} size={14} name="common:chevron-right" />
    </button>
  );
}
