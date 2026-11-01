import { For } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { ListRow, PagedItemList, RowDeleteButton } from '@/shared/ui/item-list';

import { MeetingsListProps } from '../types/MeetingsListProps';

export function MeetingsList(props: MeetingsListProps) {
  return (
    <PagedItemList
      isLoading={props.isLoading}
      isEmpty={props.isEmpty}
      emptyLabel={props.emptyLabel}
      canResetFilters={props.canResetFilters}
      pagination={props.pagination}
      onResetFilters={props.onResetFilters}
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
              <RowDeleteButton
                label={i18n.t('meetings.delete.title')}
                onClick={() => props.onDelete(card.id)}
              />
            }
          />
        )}
      </For>
    </PagedItemList>
  );
}
