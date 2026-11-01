import { InterviewSessionItemProps } from '../types/InterviewSessionItemProps';
import { interviewSessionItemStyles } from './InterviewSessionItem.styles';

const styles = interviewSessionItemStyles();

export function InterviewSessionItem(props: InterviewSessionItemProps) {
  return (
    <button
      class={styles.root()}
      type="button"
      onClick={() => props.onOpen(props.session.id)}
    >
      <span class={styles.date()}>{props.session.dateLabel}</span>
      <span class={styles.vacancy()}>{props.session.vacancyLabel}</span>
      <span class={styles.badge({ finished: props.session.isFinished })}>
        {props.session.statusLabel}
      </span>
    </button>
  );
}
