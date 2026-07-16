import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { MeetingsListDeps } from '../types/MeetingsListDeps';
import { MeetingCard } from './MeetingCard';
import { meetingsListStyles } from './MeetingsList.styles';
import { MeetingsSkeleton } from './MeetingsSkeleton';

const styles = meetingsListStyles();

export function MeetingsList(props: MeetingsListDeps) {
  return (
    <Show when={!props.isLoading} fallback={<MeetingsSkeleton />}>
      <Show
        when={!props.isEmpty}
        fallback={
          <div class={styles.empty()}>
            <span class={styles.emptyTitle()}>{i18n.t('meetings.empty')}</span>
          </div>
        }
      >
        <div class={styles.list()}>
          <For each={props.items}>
            {(card) => <MeetingCard card={card} onOpen={props.onOpen} />}
          </For>
        </div>
      </Show>
    </Show>
  );
}
