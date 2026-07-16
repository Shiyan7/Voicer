import { For } from 'solid-js';

import { ActionItem } from '@/entities/action-item';
import { ActionItemGroup } from '@/features/actions/types/ActionItemGroup';
import { i18n } from '@/shared/i18n';

import { actionItemsGroupStyles } from './ActionItemsGroup.styles';

interface ActionItemsGroupProps {
  group: ActionItemGroup;
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
          {(item) => <ActionItem item={item} />}
        </For>
      </div>
    </section>
  );
}
