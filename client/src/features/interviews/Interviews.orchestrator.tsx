import { A } from '@solidjs/router';
import { For } from 'solid-js';

import { DeleteInterviewModal } from '@/entities/interview-session';
import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { ListRow, PagedItemList, RowDeleteButton } from '@/shared/ui/item-list';
import {
  DateRangeFilter,
  ListFiltersBar,
  SelectFilter,
} from '@/shared/ui/list-filters';
import { PageFade } from '@/shared/ui/page-fade';

import { interviewsStyles } from './Interviews.styles';
import { useInterviews } from './model/useInterviews';

const styles = interviewsStyles();

export function InterviewsOrchestrator() {
  const vm = useInterviews();

  return (
    <PageFade>
      <div class={styles.root()}>
        <header class={styles.header()}>
          <h1 class={styles.title()}>{i18n.t('live.title')}</h1>
          <Button as={A} href={paths.liveNew}>
            <Icon name="common:microphone" size={16} />
            {i18n.t('live.new')}
          </Button>
        </header>
        <section class={styles.section()}>
          <ListFiltersBar count={vm.totalCount()}>
            <DateRangeFilter
              value={vm.filters.dateRange()}
              onChange={vm.filters.setDateRange}
            />
            <SelectFilter
              icon="common:filter"
              title={i18n.t('live.status_filter.title')}
              options={vm.statusOptions()}
              selected={vm.filters.status()}
              isActive={vm.filters.hasStatusFilter()}
              onSelect={vm.filters.setStatus}
            />
            <SelectFilter
              icon="common:sort"
              title={i18n.t('filters.sort.title')}
              options={vm.sortOptions()}
              selected={vm.filters.sort()}
              isActive={vm.filters.isCustomSort()}
              onSelect={vm.filters.setSort}
            />
          </ListFiltersBar>
          <PagedItemList
            isLoading={vm.isLoading()}
            isEmpty={vm.isEmpty()}
            emptyLabel={vm.emptyLabel()}
            canResetFilters={vm.filters.hasActiveFilters()}
            pagination={vm.pagination}
            onResetFilters={vm.filters.resetFilters}
          >
            <For each={vm.rows()}>
              {(row) => (
                <ListRow
                  href={row.href}
                  icon="common:microphone"
                  title={row.title}
                  meta={row.status}
                  dateLabel={row.dateLabel}
                  dateTitle={row.dateTitle}
                  actions={
                    <RowDeleteButton
                      label={i18n.t('live.delete.title')}
                      onClick={() => vm.requestDelete(row.id)}
                    />
                  }
                />
              )}
            </For>
          </PagedItemList>
        </section>
      </div>
      <DeleteInterviewModal
        isDeleting={vm.isDeleting()}
        onConfirm={vm.confirmDelete}
        onCancel={vm.cancelDelete}
      />
    </PageFade>
  );
}
