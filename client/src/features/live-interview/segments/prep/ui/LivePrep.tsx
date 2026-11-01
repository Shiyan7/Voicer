import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { LivePrepProps } from '../types/LivePrepProps';
import { livePrepStyles } from './LivePrep.styles';

const styles = livePrepStyles();

export function LivePrep(props: LivePrepProps) {
  return (
    <div class={styles.root()}>
      <header>
        <h1 class={styles.title()}>{i18n.t('live.prep.title')}</h1>
        <p class={styles.subtitle()}>{i18n.t('live.prep.subtitle')}</p>
      </header>
      <Show when={props.pastSessions.length > 0}>
        <section class={styles.history()}>
          <h2 class={styles.historyTitle()}>{i18n.t('live.prep.history')}</h2>
          <For each={props.pastSessions}>
            {(pastSession) => (
              <button
                class={styles.historyItem()}
                type="button"
                onClick={() => props.onOpenPastSession(pastSession.id)}
              >
                <span class={styles.historyDate()}>
                  {pastSession.dateLabel}
                </span>
                <span class={styles.historyVacancy()}>
                  {pastSession.vacancyLabel}
                </span>
                <span
                  class={styles.badge({ finished: pastSession.isFinished })}
                >
                  {i18n.t(
                    pastSession.isFinished
                      ? 'live.prep.status_finished'
                      : 'live.prep.status_unfinished',
                  )}
                </span>
              </button>
            )}
          </For>
        </section>
      </Show>
      <section class={styles.card()}>
        <span class={styles.label()}>{i18n.t('live.prep.resume')}</span>
        <label class={styles.file({ filled: props.hasResume })}>
          <Icon name="common:upload" size={20} />
          <span class={styles.fileName()}>{props.resumeLabel}</span>
          <input
            class={styles.fileInput()}
            type="file"
            accept="application/pdf"
            onChange={props.onResumeSelected}
          />
        </label>
        <span class={styles.label()}>{i18n.t('live.prep.vacancy')}</span>
        <textarea
          class={styles.textarea()}
          placeholder={i18n.t('live.prep.vacancy_placeholder')}
          value={props.vacancy}
          onInput={(event) => props.onVacancyInput(event.currentTarget.value)}
        />
        <div class={styles.actions()}>
          <Button disabled={!props.canPrepare} onClick={props.onPrepare}>
            <Icon name="common:sparkles" size={16} />
            {i18n.t('live.prep.prepare')}
          </Button>
        </div>
      </section>
      <Show when={props.errorMessage}>
        <p class={styles.error()} role="alert">
          {props.errorMessage}
        </p>
      </Show>
      <Show when={props.isPreparing}>
        <p class={styles.loading()} role="status">
          {i18n.t('live.prep.preparing')}
        </p>
      </Show>
      <Show when={props.isReady && !props.isPreparing}>
        <div class={styles.sections()}>
          <For each={props.sections}>
            {(section) => (
              <section class={styles.section()}>
                <h2 class={styles.sectionTitle()}>{section.title}</h2>
                <For each={section.items}>
                  {(item) => <p class={styles.item()}>{item}</p>}
                </For>
              </section>
            )}
          </For>
        </div>
        <Button class={styles.start()} size="lg" onClick={props.onStart}>
          <Icon name="common:microphone" size={18} />
          {i18n.t('live.prep.start')}
        </Button>
      </Show>
    </div>
  );
}
