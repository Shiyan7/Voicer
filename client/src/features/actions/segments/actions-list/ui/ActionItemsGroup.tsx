import { For, Show } from 'solid-js';

import { ActionItemGroup } from '@/features/actions/types/ActionItemGroup';
import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { actionItemsGroupStyles } from './ActionItemsGroup.styles';

interface ActionItemsGroupProps {
  group: ActionItemGroup;
  onToggle: (id: string) => void;
}

const styles = actionItemsGroupStyles();

export function ActionItemsGroup(props: ActionItemsGroupProps) {
  return (
    <section class={styles.group()}>
      <div class={styles.groupHeader()}>
        <h2 class={styles.groupTitle()}>{props.group.title}</h2>
        <a class={styles.groupLink()} href={props.group.meetingHref}>
          {i18n.t('actions.open_meeting')}
        </a>
      </div>
      <div class={styles.card()}>
        <For each={props.group.items}>
          {(item) => (
            <div class={styles.row()}>
              <button
                class={styles.checkbox({ done: item.isDone })}
                aria-pressed={item.isDone}
                type="button"
                onClick={() => props.onToggle(item.id)}
              >
                <Show when={item.isDone}>
                  <Icon size={11} name="common:check" />
                </Show>
              </button>
              <span class={styles.rowText({ done: item.isDone })}>
                {item.text}
              </span>
            </div>
          )}
        </For>
      </div>
    </section>
  );
}
