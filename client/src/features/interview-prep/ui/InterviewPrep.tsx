import { Field, Form } from '@modular-forms/solid';
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
import { PrepModeCard } from './PrepModeCard';

const styles = interviewPrepStyles();

export function InterviewPrep(props: InterviewPrepProps) {
  return (
    <div class={styles.root()}>
      <header class={styles.header()}>
        <BackButton onClick={props.onBack} />
        <h1 class={styles.title()}>{i18n.t('live.new')}</h1>
      </header>
      <div class={styles.modes()} role="radiogroup">
        <For each={props.modeOptions}>
          {(option) => (
            <PrepModeCard
              option={option}
              isSelected={props.mode === option.value}
              onSelect={() => props.onSelectMode(option.value)}
            />
          )}
        </For>
      </div>
      <Form class={styles.form()} of={props.form} onSubmit={props.onPrepare}>
        <Field of={props.form} name="vacancy">
          {(field, fieldProps) => (
            <label class={styles.field()}>
              <span class={styles.label()}>{i18n.t('live.prep.vacancy')}</span>
              <textarea
                {...fieldProps}
                class={interviewPrepStyles({
                  invalid: !!field.error,
                }).textarea()}
                placeholder={i18n.t('live.prep.vacancy_placeholder')}
                value={field.value ?? ''}
              />
              <Show when={field.error}>
                <span class={styles.fieldError()}>{field.error}</span>
              </Show>
            </label>
          )}
        </Field>
        <Field of={props.form} name="resume" type="File">
          {(field, fieldProps) => (
            <div class={styles.field()}>
              <span class={styles.label()}>{i18n.t('live.prep.resume')}</span>
              <FileInput
                label={
                  field.value?.name ?? i18n.t('live.prep.resume_placeholder')
                }
                accept="application/pdf"
                isFilled={!!field.value}
                error={field.error}
                inputProps={fieldProps}
              />
            </div>
          )}
        </Field>
        <div class={styles.actions()}>
          <Dropdown
            options={LANGUAGE_OPTIONS}
            selected={props.language}
            onSelect={props.onSelectLanguage}
            triggerClass={styles.language()}
            panelClass={styles.languagePanel()}
            trigger={() => (
              <span class={styles.languageValue()}>
                {props.languageLabel}
                <Icon
                  class={styles.languageIcon()}
                  name="common:chevron-right"
                  size={14}
                />
              </span>
            )}
          />
          <Button
            class={interviewPrepStyles({ mode: props.mode }).submit()}
            type="submit"
            size="lg"
            disabled={props.isPreparing}
          >
            {props.prepareLabel}
          </Button>
        </div>
      </Form>
      <Show when={props.errorMessage}>
        <p class={styles.error()} role="alert">
          {props.errorMessage}
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
