import { Field, Form } from '@modular-forms/solid';
import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { BackHeader } from '@/shared/ui/back-header';
import { Button } from '@/shared/ui/button';
import { Dropdown } from '@/shared/ui/dropdown';
import { Icon } from '@/shared/ui/icon';

import { LANGUAGE_OPTIONS } from '../../../config/interviewPrepConfig';
import { PrepFormProps } from '../types/PrepFormProps';
import { prepFormStyles } from './PrepForm.styles';

const styles = prepFormStyles();

export function PrepForm(props: PrepFormProps) {
  return (
    <div class={styles.root()}>
      <BackHeader title={i18n.t('live.new')} onBack={props.onBack} />
      <Form class={styles.form()} of={props.form} onSubmit={props.onPrepare}>
        <Field of={props.form} name="vacancy">
          {(field, fieldProps) => (
            <label class={styles.field()}>
              <span class={styles.label()}>{i18n.t('live.prep.vacancy')}</span>
              <textarea
                {...fieldProps}
                class={styles.textarea()}
                placeholder={i18n.t('live.prep.vacancy_placeholder')}
                value={field.value}
              />
              <Show when={field.error}>
                <p class={styles.fieldError()} role="alert">
                  {field.error}
                </p>
              </Show>
            </label>
          )}
        </Field>
        <div class={styles.field()}>
          <span class={styles.label()}>{i18n.t('live.prep.resume')}</span>
          <Field of={props.form} name="resumeFile" type="File">
            {() => (
              <Field of={props.form} name="resumeSessionId">
                {(sessionField) => (
                  <>
                    {props.resumePicker}
                    <Show when={sessionField.error}>
                      <p class={styles.fieldError()} role="alert">
                        {sessionField.error}
                      </p>
                    </Show>
                  </>
                )}
              </Field>
            )}
          </Field>
        </div>
        <div class={styles.actions()}>
          <div class={styles.field()}>
            <span class={styles.label()}>{i18n.t('live.prep.language')}</span>
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
          </div>
          <Button size="xl" type="submit">
            {i18n.t('live.prep.prepare')}
            <Icon name="common:chevron-right" size={18} />
          </Button>
        </div>
      </Form>
      <Show when={props.errorMessage}>
        <p class={styles.error()} role="alert">
          {props.errorMessage}
        </p>
      </Show>
    </div>
  );
}
