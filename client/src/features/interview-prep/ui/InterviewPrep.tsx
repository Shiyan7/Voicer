import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { BackButton } from '@/shared/ui/back-button';
import { Button } from '@/shared/ui/button';
import { Dropdown } from '@/shared/ui/dropdown';
import { FileInput } from '@/shared/ui/file-input';
import { Icon } from '@/shared/ui/icon';
import { Tabs } from '@/shared/ui/tabs';

import { LANGUAGE_OPTIONS } from '../config/interviewPrepConfig';
import { InterviewPrepProps } from '../types/InterviewPrepProps';
import { interviewPrepStyles } from './InterviewPrep.styles';

const styles = interviewPrepStyles();

export function InterviewPrep(props: InterviewPrepProps) {
  return (
    <div class={styles.root()}>
      <header class={styles.header()}>
        <BackButton onClick={props.onBack} />
        <h1 class={styles.title()}>{i18n.t('live.new')}</h1>
      </header>
      <section class={styles.card()}>
        <div class={styles.modes()} role="radiogroup">
          <For each={props.modeOptions}>
            {(option) => (
              <button
                class={styles.mode({ selected: props.mode === option.value })}
                type="button"
                role="radio"
                aria-checked={props.mode === option.value}
                onClick={() => props.onSelectMode(option.value)}
              >
                <Icon name={option.icon} size={20} />
                <span class={styles.modeTitle()}>{option.title}</span>
                <span class={styles.modeDescription()}>
                  {option.description}
                </span>
              </button>
            )}
          </For>
        </div>
        <span class={styles.label()}>{i18n.t('live.prep.resume')}</span>
        <FileInput
          label={props.resumeLabel}
          accept="application/pdf"
          isFilled={props.hasResume}
          onSelect={props.onResumeSelected}
        />
        <span class={styles.label()}>{i18n.t('live.prep.vacancy')}</span>
        <textarea
          class={styles.textarea()}
          placeholder={i18n.t('live.prep.vacancy_placeholder')}
          value={props.vacancy}
          onInput={(event) => props.onVacancyInput(event.currentTarget.value)}
        />
        <div class={styles.actions()}>
          <Dropdown
            options={LANGUAGE_OPTIONS}
            selected={props.language}
            onSelect={props.onSelectLanguage}
            triggerClass={styles.language()}
            panelClass={styles.languagePanel()}
            trigger={() => (
              <span
                class={styles.languageValue()}
                title={i18n.t('live.prep.language')}
              >
                {props.languageLabel}
                <Icon
                  class={styles.languageIcon()}
                  name="common:chevron-right"
                  size={14}
                />
              </span>
            )}
          />
          <Button disabled={!props.canPrepare} onClick={props.onPrepare}>
            <Icon name="common:sparkles" size={16} />
            {props.prepareLabel}
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
