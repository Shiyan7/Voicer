import { BackButton } from '../back-button';
import { backHeaderStyles } from './BackHeader.styles';
import { BackHeaderProps } from './types/BackHeaderProps';

const styles = backHeaderStyles();

export function BackHeader(props: BackHeaderProps) {
  return (
    <header class={styles.root()}>
      <BackButton onClick={props.onBack} />
      <h1 class={styles.title()}>{props.title}</h1>
    </header>
  );
}
