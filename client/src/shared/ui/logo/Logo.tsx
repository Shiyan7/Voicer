import { Show } from 'solid-js';

import { logoStyles } from './Logo.styles';

const styles = logoStyles();

interface LogoProps {
  isCompact?: boolean;
}

export function Logo(props: LogoProps) {
  return (
    <div class={styles.root()}>
      <span class={styles.mark()}>
        <svg class={styles.bars()} viewBox="0 0 20 20" fill="currentColor">
          <rect x="0.9" y="2" width="2.4" height="8" rx="1.2" opacity="0.65" />
          <rect
            x="4.9"
            y="4.5"
            width="2.4"
            height="9"
            rx="1.2"
            opacity="0.85"
          />
          <rect x="8.8" y="7" width="2.4" height="11" rx="1.2" />
          <rect
            x="12.7"
            y="4.5"
            width="2.4"
            height="9"
            rx="1.2"
            opacity="0.85"
          />
          <rect x="16.7" y="2" width="2.4" height="8" rx="1.2" opacity="0.65" />
        </svg>
      </span>
      <Show when={!props.isCompact}>
        <span class={styles.word()}>
          voicer<span class={styles.dot()}>.</span>
        </span>
      </Show>
    </div>
  );
}
