import { For, Show } from 'solid-js';

import { ActionItem } from '@/entities/meeting';
import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';
import { PageFade } from '@/shared/ui/page-fade';
import { Tabs } from '@/shared/ui/tabs';
import { useViewModel } from '@/shared/view-model';

import { actionsPageStyles } from './ActionsPage.styles';
import {
  ActionItemGroup,
  ActionsPageViewModel,
} from './model/ActionsPageViewModel';

const styles = actionsPageStyles();

export default function ActionsPage() {
  const vm = useViewModel(ActionsPageViewModel);

  return (
    <PageFade>
      <div class={styles.root()}>
        <header class={styles.header()}>
          <h1 class={styles.title()}>{i18n.t('actions.title')}</h1>
          <Tabs
            class={styles.tabs()}
            activeTab={vm.filter}
            tabs={vm.tabs}
            onSelect={vm.setFilter}
          />
        </header>

        <Show when={!vm.isLoading} fallback={<div class={styles.skeleton()} />}>
          <Show
            when={vm.groups.length > 0}
            fallback={
              <div class={styles.empty()}>
                <span class={styles.emptyTitle()}>{vm.emptyLabel}</span>
              </div>
            }
          >
            <div class={styles.groups()}>
              <For each={vm.groups}>
                {(group) => (
                  <ActionItemsGroup group={group} onToggle={vm.toggle} />
                )}
              </For>
            </div>
          </Show>
        </Show>
      </div>
    </PageFade>
  );
}

interface ActionItemsGroupProps {
  group: ActionItemGroup;
  onToggle: (id: string) => void;
}

function ActionItemsGroup(props: ActionItemsGroupProps) {
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
          {(item) => <ActionItemRow item={item} onToggle={props.onToggle} />}
        </For>
      </div>
    </section>
  );
}

interface ActionItemRowProps {
  item: ActionItem;
  onToggle: (id: string) => void;
}

function ActionItemRow(props: ActionItemRowProps) {
  return (
    <div class={styles.row()}>
      <button
        class={styles.checkbox({ done: props.item.isDone })}
        aria-pressed={props.item.isDone}
        type="button"
        onClick={() => props.onToggle(props.item.id)}
      >
        <Show when={props.item.isDone}>
          <Icon size={11} name="common:check" />
        </Show>
      </button>
      <span class={styles.rowText({ done: props.item.isDone })}>
        {props.item.text}
      </span>
    </div>
  );
}
