import { MODALS } from '@/shared/lib/modal';
import { Modal } from '@/shared/ui/modal';

import { useSearch } from './model/useSearch';
import { searchStyles } from './Search.styles';
import { SearchInput } from './segments/search-input';
import { SearchResults } from './segments/search-results';

const styles = searchStyles();

export function SearchOrchestrator() {
  const vm = useSearch();

  return (
    <Modal class={styles.modal()} modalId={MODALS.SEARCH}>
      <SearchInput
        query={vm.query()}
        hasQueryText={vm.hasQueryText()}
        setRef={vm.setInputRef}
        onInput={vm.onInput}
        onClear={vm.clear}
      />
      <SearchResults
        results={vm.results()}
        total={vm.total()}
        activeIndex={vm.activeIndex()}
        isLoading={vm.isLoading()}
        isEmpty={vm.isEmpty()}
        isIdle={vm.isIdle()}
        emptyLabel={vm.emptyLabel()}
        sort={vm.sort()}
        sortLabel={vm.sortLabel()}
        sortOptions={vm.sortOptions()}
        onSortChange={vm.setSort}
        onSelect={vm.openResult}
        onHover={vm.setActiveIndex}
        onLoadMore={vm.loadMore}
      />
    </Modal>
  );
}
