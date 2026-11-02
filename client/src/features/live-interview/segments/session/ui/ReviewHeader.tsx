import { BackButton } from '@/shared/ui/back-button';

import { ReviewHeaderProps } from '../types/ReviewHeaderProps';
import { reviewHeaderStyles } from './ReviewHeader.styles';

const styles = reviewHeaderStyles();

export function ReviewHeader(props: ReviewHeaderProps) {
  return (
    <header class={styles.root()}>
      <BackButton onClick={props.onBack} />
      <h1 class={styles.title()}>{props.title}</h1>
      <span class={styles.spacer()} />
      {props.actions}
    </header>
  );
}
