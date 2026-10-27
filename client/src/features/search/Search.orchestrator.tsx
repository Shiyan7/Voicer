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
        onQueryChange={vm.setQuery}
        onClear={vm.clear}
      />
      <SearchResults
        query={vm.debouncedQuery()}
        words={vm.words()}
        onSelect={vm.openResult}
      />
    </Modal>
  );
}
