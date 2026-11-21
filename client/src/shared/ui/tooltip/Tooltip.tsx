import { Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { useTooltip } from './hooks/useTooltip';
import { tooltipStyles } from './Tooltip.styles';
import { TooltipProps } from './types/TooltipProps';

const styles = tooltipStyles();

export function Tooltip(props: TooltipProps) {
  const tooltip = useTooltip(props);

  return (
    <span
      class={styles.root({ class: props.class })}
      ref={tooltip.setRoot}
      onPointerEnter={tooltip.show}
      onPointerLeave={tooltip.hide}
      onPointerDown={tooltip.hide}
    >
      {props.children}
      <Show when={tooltip.anchor()}>
        {(anchor) => (
          <Portal>
            <span
              class={styles.bubble({ position: tooltip.position() })}
              style={anchor()}
              role="tooltip"
            >
              {props.label}
            </span>
          </Portal>
        )}
      </Show>
    </span>
  );
}
