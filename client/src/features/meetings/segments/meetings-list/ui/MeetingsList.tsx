import { For, Show } from 'solid-js';

import { Pagination } from '@/shared/ui/pagination';

import { MeetingsListProps } from '../types/MeetingsListProps';
import { MeetingCard } from './MeetingCard';
import { meetingsListStyles } from './MeetingsList.styles';
import { MeetingsSkeleton } from './MeetingsSkeleton';

const styles = meetingsListStyles();

export function MeetingsList(props: MeetingsListProps) {
  return (
    <Show when={!props.isLoading} fallback={<MeetingsSkeleton />}>
      <Show
        when={!props.isEmpty}
        fallback={
          <div class={styles.empty()}>
            <span class={styles.emptyTitle()}>{props.emptyLabel}</span>
          </div>
        }
      >
        <div class={styles.list()}>
          <For each={props.items}>
            {(card) => <MeetingCard card={card} onDelete={props.onDelete} />}
          </For>
          <Pagination
            page={props.currentPage}
            hasPrev={props.hasPrevPage}
            hasNext={props.hasNextPage}
            onPrev={props.onPrevPage}
            onNext={props.onNextPage}
          />
        </div>
      </Show>
    </Show>
  );
}
