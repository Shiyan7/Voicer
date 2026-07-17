import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { statusBadgeStyles } from './StatusBadge.styles';

export type StatusBadgeStatus =
  | 'recording'
  | 'transcribing'
  | 'summarizing'
  | 'ready'
  | 'failed';

interface StatusBadgeProps {
  status: StatusBadgeStatus;
  class?: string;
}

const styles = statusBadgeStyles();

export function StatusBadge(props: StatusBadgeProps) {
  const kind = () => {
    const { status } = props;

    return status === 'recording' || status === 'ready' || status === 'failed'
      ? status
      : 'progress';
  };

  return (
    <span class={styles.root({ kind: kind(), class: props.class })}>
      <Show when={kind() === 'recording'}>
        <span class={styles.dot({ kind: kind() })} />
      </Show>
      {i18n.t(`meetings.status.${props.status}`)}
    </span>
  );
}
