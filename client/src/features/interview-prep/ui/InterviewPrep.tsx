import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { BackButton } from '@/shared/ui/back-button';
import { Button } from '@/shared/ui/button';
import { FileInput } from '@/shared/ui/file-input';
import { Icon } from '@/shared/ui/icon';
import { Tabs } from '@/shared/ui/tabs';

import { LANGUAGE_TABS } from '../config/interviewPrepConfig';
import { InterviewPrepProps } from '../types/InterviewPrepProps';
import { interviewPrepStyles } from './InterviewPrep.styles';

const styles = interviewPrepStyles();

export function InterviewPrep(props: InterviewPrepProps) {
  return (
    <div class={styles.root()}>
      <header class={styles.header()}>
        <BackButton onClick={props.onBack} />
        <div>
          <h1 class={styles.title()}>{i18n.t('live.prep.title')}</h1>
          <p class={styles.subtitle()}>{i18n.t('live.prep.subtitle')}</p>
        </div>
      </header>
      <section class={styles.card()}>
        <span class={styles.label()}>{i18n.t('live.prep.resume')}</span>
        <FileInput
          label={props.resumeLabel}
          accept="application/pdf"
          isFilled={props.hasResume}
          onSelect={props.onResumeSelected}
        />
        <span class={styles.label()}>{i18n.t('live.prep.language')}</span>
        <Tabs
          tabs={LANGUAGE_TABS}
          activeTab={props.language}
          onSelect={props.onSelectLanguage}
        />
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
        <section class={styles.section()}>
          <Tabs
            tabs={props.sectionTabs}
            activeTab={props.activeSection}
            onSelect={props.onSelectSection}
          />
          <ol class={styles.items()}>
            <For each={props.activeItems}>
              {(item) => <li class={styles.item()}>{item}</li>}
            </For>
          </ol>
        </section>
        <Button class={styles.start()} size="lg" onClick={props.onStart}>
          <Icon name="common:microphone" size={18} />
          {i18n.t('live.prep.start')}
        </Button>
      </Show>
    </div>
  );
}
