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
        <Show
          when={vm.isEditing()}
          fallback={
            <div class={styles.titleView()}>
              <Show when={vm.title()} keyed>
                {(title) => (
                  <h1
                    class={styles.title({ revealing: vm.isTitleRevealing() })}
                    onAnimationEnd={vm.finishTitleReveal}
                  >
                    {title}
                  </h1>
                )}
              </Show>
              <button
                class={styles.iconBtn({ class: styles.editBtn() })}
                type="button"
                title={i18n.t('meetings.rename')}
                aria-label={i18n.t('meetings.rename')}
                onClick={vm.startEditing}
              >
                <Icon size={18} name="common:pencil" />
              </button>
            </div>
          }
        >
          <div class={styles.titleEdit()}>
            <input
              class={styles.titleInput()}
              ref={vm.setInputRef}
              type="text"
              maxLength={120}
              value={vm.draft()}
              placeholder={i18n.t('meetings.rename_placeholder')}
              aria-label={i18n.t('meetings.rename')}
              onInput={vm.onDraftInput}
              onKeyDown={vm.onDraftKeyDown}
              onBlur={vm.saveTitle}
            />
            <button
              class={styles.iconBtn({ busy: vm.isSuggesting() })}
              type="button"
              title={i18n.t('meetings.suggest_title')}
              aria-label={i18n.t('meetings.suggest_title')}
              disabled={vm.isSuggesting()}
              onMouseDown={vm.keepInputFocus}
              onClick={vm.suggestWithAi}
            >
              <Icon size={18} name="common:sparkles" />
            </button>
          </div>
        </Show>
      </div>
      <div class={styles.chips()}>
        <Show when={vm.sourceLabel()}>
          {(source) => (
            <span class={styles.chip()}>
              <Icon class={styles.chipIcon()} name="common:audio" />
              {source()}
            </span>
          )}
        </Show>
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
