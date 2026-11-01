import { i18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';

import { listFiltersStyles } from './ListFilters.styles';

interface ResetFiltersButtonProps {
  onClick: () => void;
}

const styles = listFiltersStyles();

export function ResetFiltersButton(props: ResetFiltersButtonProps) {
  return (
    <Button class={styles.resetBtn()} variant="primary" onClick={props.onClick}>
      {i18n.t('filters.reset')}
    </Button>
  );
}
