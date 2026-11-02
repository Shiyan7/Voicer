import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { BackButton } from '@/shared/ui/back-button';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Modal } from '@/shared/ui/modal';
import { PageFade } from '@/shared/ui/page-fade';
import { Tabs } from '@/shared/ui/tabs';

import { PDF_VIEWER_PARAMS } from './config/briefingConfig';
import { useInterviewBriefing } from './model/useInterviewBriefing';
import { interviewBriefingStyles } from './ui/InterviewBriefing.styles';

const styles = interviewBriefingStyles();

export function InterviewBriefingOrchestrator() {
  const vm = useInterviewBriefing();

  return (
    <PageFade>
      <div class={styles.root()}>
        <header class={styles.header()}>
          <BackButton onClick={vm.goBack} />
          <h1 class={styles.title()}>{vm.title()}</h1>
        </header>
        <Show when={vm.isPreparing()}>
          <p class={styles.status()} role="status">
            {i18n.t('live.prep.preparing')}
          </p>
          <div class={interviewBriefingStyles({ size: 'header' }).skeleton()} />
          <div
            class={interviewBriefingStyles({ size: 'content' }).skeleton()}
          />
        </Show>
        <Show when={vm.isFailed()}>
          <div class={styles.failed()} role="alert">
            <span>{i18n.t('live.prep.error')}</span>
            <Button variant="secondary" onClick={vm.retry}>
              {i18n.t('live.prep.retry')}
            </Button>
          </div>
        </Show>
        <Show when={vm.isReady()}>
          <div class={styles.resume()}>
            <span class={styles.resumeLabel()}>
              {i18n.t('live.prep.vacancy')}
            </span>
            <p
              class={interviewBriefingStyles({
                expanded: vm.isVacancyExpanded(),
                faded: vm.isVacancyFaded(),
              }).vacancyText()}
              ref={vm.measureVacancy}
            >
              {vm.vacancyText()}
            </p>
            <Show when={vm.isVacancyLong()}>
              <button
                class={styles.vacancyToggle()}
                type="button"
                onClick={vm.toggleVacancy}
              >
                {vm.vacancyToggleLabel()}
              </button>
            </Show>
          </div>
          <Show when={vm.resumeUrl()}>
            <div class={styles.resume()}>
              <span class={styles.resumeLabel()}>
                {i18n.t('live.prep.resume')}
              </span>
              <button
                class={styles.chip()}
                type="button"
                onClick={vm.openResume}
              >
                <span class={styles.badge()}>pdf</span>
                <span class={styles.chipName()}>
                  {vm.resumeName() ?? i18n.t('live.prep.resume')}
                </span>
              </button>
            </div>
          </Show>
          <section class={styles.section()}>
            <Tabs
              tabs={vm.sectionTabs()}
              activeTab={vm.activeSection()}
              onSelect={vm.setActiveSection}
            />
            <ol class={styles.items()}>
              <For each={vm.activeItems()}>
                {(item) => <li class={styles.item()}>{item}</li>}
              </For>
            </ol>
          </section>
          <div class={styles.footer()}>
            <Button class={styles.start()} size="lg" onClick={vm.start}>
              <Icon name="common:microphone" size={18} />
              {i18n.t('live.prep.start')}
            </Button>
          </div>
          <Modal
            class="overflow-hidden p-0 sm:max-w-4xl"
            modalId={MODALS.INTERVIEW_RESUME}
          >
            <Show when={vm.resumeUrl()}>
              {(url) => (
                <iframe
                  class={styles.resumePdf()}
                  src={`${url()}${PDF_VIEWER_PARAMS}`}
                  title={vm.resumeName() ?? i18n.t('live.prep.resume')}
                />
              )}
            </Show>
          </Modal>
        </Show>
      </div>
    </PageFade>
  );
}
