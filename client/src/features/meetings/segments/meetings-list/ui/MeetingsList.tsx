import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { ItemList, ListRow } from '@/shared/ui/item-list';
import { Pagination } from '@/shared/ui/pagination';

import { MeetingsListProps } from '../types/MeetingsListProps';
import { meetingsListStyles } from './MeetingsList.styles';

const styles = meetingsListStyles();

export function MeetingsList(props: MeetingsListProps) {
  return (
    <ItemList
      isLoading={props.isLoading}
      isEmpty={props.isEmpty}
      emptyLabel={props.emptyLabel}
      emptyAction={
        <Show when={props.canResetFilters}>
          <Button
            class={styles.emptyAction()}
            variant="primary"
            onClick={props.onResetFilters}
          >
            {i18n.t('meetings.reset_filters')}
          </Button>
        </Show>
      }
      footer={
        <Pagination
          page={props.currentPage}
          hasPrev={props.hasPrevPage}
          hasNext={props.hasNextPage}
          onPrev={props.onPrevPage}
          onNext={props.onNextPage}
        />
      }
    >
      <For each={props.items}>
        {(card) => (
          <ListRow
            href={card.href}
            icon="common:audio"
            title={card.title}
            meta={card.duration}
            dateLabel={card.dateLabel}
            dateTitle={card.dateTitle}
            actions={
              <button
                class={styles.deleteBtn()}
                type="button"
                aria-label={i18n.t('meetings.delete.title')}
                onClick={() => props.onDelete(card.id)}
              >
                <Icon size={18} name="common:trash" />
              </button>
            }
          />
        )}
      </For>
    </ItemList>
  );
}
