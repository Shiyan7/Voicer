import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { statusBadgeStyles } from './StatusBadge.styles';

export type StatusBadgeStatus =
  | 'recording'
  | 'uploading'
  | 'uploaded'
  | 'transcribing'
  | 'summarizing'
  | 'ready'
  | 'failed';

type BadgeKind = 'ready' | 'failed' | 'recording' | 'progress';

const KIND_BY_STATUS: Record<StatusBadgeStatus, BadgeKind> = {
  recording: 'recording',
  uploading: 'progress',
  uploaded: 'progress',
  transcribing: 'progress',
  summarizing: 'progress',
  ready: 'ready',
  failed: 'failed',
};

interface StatusBadgeProps {
  status: StatusBadgeStatus;
  class?: string;
}

const styles = statusBadgeStyles();

export function StatusBadge(props: StatusBadgeProps) {
  const kind = () => KIND_BY_STATUS[props.status];

  return (
    <span class={styles.root({ kind: kind(), class: props.class })}>
      <Show when={kind() === 'recording'}>
        <span class={styles.dot({ kind: kind() })} />
      </Show>
      {i18n.t(`meetings.status.${props.status}`)}
    </span>
  );
}
