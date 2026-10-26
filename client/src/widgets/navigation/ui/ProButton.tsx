import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { ProButtonProps } from '../types/ProButtonProps';
import { proButtonStyles } from './ProButton.styles';

const styles = proButtonStyles();

export function ProButton(props: ProButtonProps) {
  return (
    <button
      class={styles.root({ collapsed: props.isCollapsed })}
      type="button"
      aria-label={i18n.t('pro.cta')}
    >
      <span class={styles.iconWrap({ collapsed: props.isCollapsed })}>
        <Icon size={18} name="common:crown" />
      </span>
      <Show when={!props.isCollapsed}>
        <span class={styles.text()}>
          <span class={styles.title()}>{i18n.t('pro.cta')}</span>
          <span class={styles.hint()}>{i18n.t('pro.hint')}</span>
        </span>
      </Show>
    </button>
  );
}
