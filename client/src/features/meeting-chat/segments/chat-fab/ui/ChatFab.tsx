import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { ChatFabProps } from '../types/ChatFabProps';
import { chatFabStyles } from './ChatFab.styles';

const styles = chatFabStyles();

export function ChatFab(props: ChatFabProps) {
  return (
    <button
      class={styles.root({ dragging: props.isDragging })}
      type="button"
      style={{ left: `${props.point.x}px`, top: `${props.point.y}px` }}
      aria-label={i18n.t('meetings.chat.open')}
      aria-expanded={props.isOpen}
      title={`${i18n.t('meetings.chat.open')} · ⌘J`}
      onPointerDown={props.onPointerDown}
      onPointerMove={props.onPointerMove}
      onPointerUp={props.onPointerUp}
      onPointerCancel={props.onPointerCancel}
      onClick={props.onClick}
    >
      <Show
        when={props.isOpen}
        fallback={<Icon class={styles.icon()} size={28} name="common:chat" />}
      >
        <Icon
          class={styles.icon({ open: true })}
          size={18}
          name="common:cross"
        />
      </Show>
      <Show when={props.showBadge}>
        <span class={styles.badge()} />
      </Show>
    </button>
  );
}
