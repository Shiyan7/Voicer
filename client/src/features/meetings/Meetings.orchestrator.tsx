import { Show } from 'solid-js';

import { DeleteMeetingModal } from '@/entities/meeting';
import { i18n } from '@/shared/i18n';
import {
  DateRangeFilter,
  ListFiltersBar,
  SelectFilter,
  ToggleFilter,
} from '@/shared/ui/list-filters';
import { PageFade } from '@/shared/ui/page-fade';

import { meetingsStyles } from './Meetings.styles';
import { useMeetingsPage } from './model/useMeetingsPage';
import { MeetingsList } from './segments/meetings-list';
import { StatsBanner } from './segments/stats-banner';
import { Toolbar } from './segments/toolbar/ui/Toolbar';

const styles = meetingsStyles();

export function MeetingsOrchestrator() {
  const vm = useMeetingsPage();

  return (
    <PageFade>
      <div class={styles.root()}>
        <header class={styles.header()}>
          <h1 class={styles.title()}>{i18n.t('meetings.title')}</h1>
          <Toolbar
            isUploading={vm.isUploading()}
            onStartRecording={vm.startRecording}
            onFileSelected={vm.onFileSelected}
          />
        </header>
        <Show when={vm.isAuthorized()}>
          <StatsBanner
            greeting={vm.banner.greeting()}
            tiles={vm.banner.tiles()}
            isLoading={vm.banner.isLoading()}
          />
        </Show>
        <section class={styles.section()}>
          <ListFiltersBar count={vm.totalCount()}>
            <DateRangeFilter
              value={vm.filters.dateRange()}
              onChange={vm.filters.setDateRange}
            />
            <ToggleFilter
              icon={vm.favoritesIcon()}
              title={i18n.t('meetings.only_favorites')}
              isActive={vm.filters.favoritesOnly()}
              onToggle={vm.filters.toggleFavoritesOnly}
            />
            <Show when={vm.showSourceFilter()}>
              <SelectFilter
                icon="common:filter"
                title={i18n.t('meetings.filter.title')}
                options={vm.sourceOptions()}
                selected={vm.filters.source()}
                isActive={vm.filters.hasSourceFilter()}
                onSelect={vm.filters.setSource}
              />
            </Show>
            <SelectFilter
              icon="common:sort"
              title={i18n.t('filters.sort.title')}
              options={vm.sortOptions()}
              selected={vm.filters.sort()}
              isActive={vm.filters.isCustomSort()}
              onSelect={vm.filters.setSort}
            />
          </ListFiltersBar>
          <MeetingsList
            items={vm.items()}
            isLoading={vm.isLoading()}
            isEmpty={vm.isEmpty()}
            emptyLabel={vm.emptyLabel()}
            canResetFilters={vm.filters.hasActiveFilters()}
            pagination={vm.pagination}
            onDelete={vm.requestDelete}
            onResetFilters={vm.filters.resetFilters}
          />
        </section>
      </div>
      <DeleteMeetingModal
        isDeleting={vm.isDeleting()}
        onConfirm={vm.confirmDelete}
        onCancel={vm.cancelDelete}
      />
    </PageFade>
  );
}
