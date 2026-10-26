import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';
import { SpeakerAvatar } from '@/shared/ui/speaker-avatar';

import { useDetailsHeader } from '../model/useDetailsHeader';
import { DetailsHeaderDeps } from '../types/DetailsHeaderDeps';
import { detailsHeaderStyles } from './DetailsHeader.styles';

const styles = detailsHeaderStyles();

export function DetailsHeader(props: DetailsHeaderDeps) {
  const vm = useDetailsHeader(props);

  return (
    <header class={styles.header()}>
      <div class={styles.titleRow()}>
        <button
          class={styles.back()}
          aria-label={i18n.t('meetings.back')}
          type="button"
          onClick={props.onBack}
        >
          <Icon size={18} name="common:chevron-left" />
        </button>
        <h1 class={styles.title()}>{vm.title()}</h1>
      </div>
      <div class={styles.chips()}>
        <span class={styles.chip()}>
          <Icon class={styles.chipIcon()} name="navigation:calendar" />
          {vm.dateLabel()}
        </span>
        <Show when={vm.durationLabel()}>
          {(duration) => (
            <span class={styles.chip()}>
              <Icon class={styles.chipIcon()} name="common:clock" />
              {duration()}
            </span>
          )}
        </Show>
        <Show when={vm.hasSpeakers()}>
          <span class={styles.chip()}>
            <span class={styles.avatars()}>
              <For each={props.speakerTones}>
                {(tone) => <SpeakerAvatar tone={tone} />}
              </For>
            </span>
            {vm.speakersLabel()}
          </span>
        </Show>
      </div>
    </header>
  );
}
