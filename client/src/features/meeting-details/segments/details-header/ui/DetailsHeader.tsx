import { useDetailsHeader } from '../model/useDetailsHeader';
import { DetailsHeaderDeps } from '../types/DetailsHeaderDeps';
import { detailsHeaderStyles } from './DetailsHeader.styles';

const styles = detailsHeaderStyles();

export function DetailsHeader(props: DetailsHeaderDeps) {
  const vm = useDetailsHeader(props);

  return (
    <header class={styles.header()}>
      <h1 class={styles.title()}>{vm.title()}</h1>
      <span class={styles.meta()}>{vm.metaLabel()}</span>
    </header>
  );
}
