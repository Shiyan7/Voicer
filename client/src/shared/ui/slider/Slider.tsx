import { Show } from 'solid-js';

import { THUMB_SIZE_PX } from './config/THUMB_SIZE_PX';
import { sliderStyles } from './Slider.styles';

interface SliderProps {
  class?: string;
  value: number;
  min?: number;
  max: number;
  step?: number;
  mark?: number;
  disabled?: boolean;
  ariaLabel: string;
  onChange: (value: number) => void;
}

const styles = sliderStyles();

export function Slider(props: SliderProps) {
  const min = () => props.min ?? 0;

  const ratio = (value: number) => (value - min()) / (props.max - min());

  const thumbOffset = (value: number) =>
    `calc(${THUMB_SIZE_PX / 2}px + (100% - ${THUMB_SIZE_PX}px) * ${ratio(value)})`;

  return (
    <div class={styles.root({ class: props.class })}>
      <div class={styles.track()}>
        <div
          class={styles.fill()}
          style={{ width: thumbOffset(props.value) }}
        />
      </div>
      <Show when={props.mark}>
        {(mark) => (
          <span class={styles.mark()} style={{ left: thumbOffset(mark()) }} />
        )}
      </Show>
      <input
        class={styles.input()}
        aria-label={props.ariaLabel}
        disabled={props.disabled}
        max={props.max}
        min={min()}
        step={props.step}
        type="range"
        value={props.value}
        onInput={(event) => props.onChange(event.currentTarget.valueAsNumber)}
      />
      <span class={styles.thumb()} style={{ left: thumbOffset(props.value) }} />
    </div>
  );
}
