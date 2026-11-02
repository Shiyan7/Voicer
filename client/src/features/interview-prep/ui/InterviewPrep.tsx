import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { BackButton } from '@/shared/ui/back-button';
import { Button } from '@/shared/ui/button';
import { ConfirmDeleteModal } from '@/shared/ui/confirm-delete-modal';
import { Dropdown } from '@/shared/ui/dropdown';
import { FileInput } from '@/shared/ui/file-input';
import { Icon } from '@/shared/ui/icon';

import { LANGUAGE_OPTIONS } from '../config/interviewPrepConfig';
import { InterviewPrepProps } from '../types/InterviewPrepProps';
import { interviewPrepStyles } from './InterviewPrep.styles';
import { PrepResumeTiles } from './PrepResumeTiles';

const styles = interviewPrepStyles();

export function InterviewPrep(props: InterviewPrepProps) {
  return (
    <div class={styles.root()}>
      <ConfirmDeleteModal
        modalId={MODALS.DELETE_RESUME}
        title={i18n.t('live.prep.resume_delete.title')}
        description={i18n.t('live.prep.resume_delete.description')}
        isDeleting={props.isDeletingResume}
        onConfirm={props.onConfirmResumeDelete}
        onCancel={props.onCancelResumeDelete}
      />
      <header class={styles.header()}>
        <BackButton onClick={props.onBack} />
        <h1 class={styles.title()}>{i18n.t('live.new')}</h1>
      </header>
      <section class={styles.form()}>
        <label class={styles.field()}>
          <span class={styles.label()}>{i18n.t('live.prep.vacancy')}</span>
          <textarea
            class={styles.textarea()}
            placeholder={i18n.t('live.prep.vacancy_placeholder')}
            value={props.vacancy}
            onInput={(event) => props.onVacancyInput(event.currentTarget.value)}
          />
        </label>
        <div class={styles.field()}>
          <span class={styles.label()}>{i18n.t('live.prep.resume')}</span>
          <FileInput
            label={props.resumeLabel}
            accept="application/pdf"
            isFilled={props.hasResume}
            onSelect={props.onResumeSelected}
          />
          <PrepResumeTiles
            options={props.resumeOptions}
            selectedId={props.selectedResumeId}
            onSelect={props.onSelectResume}
            onDelete={props.onRequestResumeDelete}
          />
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
          <Button
            class={styles.submit()}
            size="lg"
            disabled={!props.canPrepare}
            onClick={props.onPrepare}
          >
            {i18n.t('live.prep.prepare')}
            <Icon name="common:chevron-right" size={18} />
          </Button>
        </div>
      </section>
      <Show when={props.errorMessage}>
        <p class={styles.error()} role="alert">
          {props.errorMessage}
        </p>
      </Show>
    </div>
  );
}
