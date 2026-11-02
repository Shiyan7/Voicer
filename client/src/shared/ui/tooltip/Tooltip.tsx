import { tooltipStyles } from './Tooltip.styles';
import { TooltipProps } from './types/TooltipProps';

const styles = tooltipStyles();

export function Tooltip(props: TooltipProps) {
  return (
    <span class={styles.root()}>
      {props.children}
      <span class={styles.bubble({ open: props.isOpen })} role="tooltip">
        {props.label}
      </span>
    </span>
  );
}
