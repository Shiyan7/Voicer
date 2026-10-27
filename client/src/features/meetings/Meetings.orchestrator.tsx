import { DeleteMeetingModal } from '@/entities/meeting';
import { i18n } from '@/shared/i18n';
import { PageFade } from '@/shared/ui/page-fade';

import { meetingsStyles } from './Meetings.styles';
import { useMeetingsPage } from './model/useMeetingsPage';
import { ListHeader } from './segments/list-header';
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
        <StatsBanner
          greeting={vm.banner.greeting()}
          tiles={vm.banner.tiles()}
        />
        <section class={styles.section()}>
          <ListHeader
            title={vm.totalLabel()}
            favoritesOnly={vm.filters.favoritesOnly()}
            sort={vm.filters.sort()}
            source={vm.filters.source()}
            hasSourceFilter={vm.filters.hasSourceFilter()}
            isCustomSort={vm.filters.isCustomSort()}
            favoritesIcon={vm.favoritesIcon()}
            showSourceFilter={vm.showSourceFilter()}
            sortOptions={vm.sortOptions()}
            sourceOptions={vm.sourceOptions()}
            onToggleFavorites={vm.filters.toggleFavoritesOnly}
            onSortChange={vm.filters.setSort}
            onSourceChange={vm.filters.setSource}
          />
          <MeetingsList
            items={vm.items()}
            isLoading={vm.isLoading()}
            isEmpty={vm.isEmpty()}
            emptyLabel={vm.emptyLabel()}
            canResetFilters={vm.filters.hasActiveFilters()}
            currentPage={vm.currentPage()}
            hasPrevPage={vm.hasPrevPage()}
            hasNextPage={vm.hasNextPage()}
            onDelete={vm.requestDeleteMeeting}
            onResetFilters={vm.filters.resetFilters}
            onPrevPage={vm.goToPrevPage}
            onNextPage={vm.goToNextPage}
          />
        </section>
      </div>
      <DeleteMeetingModal
        isDeleting={vm.isDeleting()}
        onConfirm={vm.confirmDeleteMeeting}
        onCancel={vm.cancelDeleteMeeting}
      />
    </PageFade>
  );
}
