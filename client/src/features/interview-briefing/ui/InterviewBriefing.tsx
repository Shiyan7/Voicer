import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { BackButton } from '@/shared/ui/back-button';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

import { BriefingSections } from '../segments/sections';
import { BriefingVacancy } from '../segments/vacancy';
import { InterviewBriefingProps } from '../types/InterviewBriefingProps';
import { interviewBriefingStyles } from './InterviewBriefing.styles';

const styles = interviewBriefingStyles();

export function InterviewBriefing(props: InterviewBriefingProps) {
  return (
    <div class={styles.root()}>
      <header class={styles.header()}>
        <BackButton onClick={props.onBack} />
        <h1 class={styles.title()}>{props.title}</h1>
      </header>
      <Show when={props.isPreparing}>
        <p class={styles.status()} role="status">
          {i18n.t('live.prep.preparing')}
        </p>
        <div class={styles.skeletonHeader()} />
        <div class={styles.skeletonContent()} />
      </Show>
      <Show when={props.isFailed}>
        <div class={styles.failed()} role="alert">
          <span>{i18n.t('live.prep.error')}</span>
          <Button variant="secondary" onClick={props.onRetry}>
            {i18n.t('live.prep.retry')}
          </Button>
        </div>
      </Show>
      <Show when={props.briefing}>
        {(briefing) => (
          <>
            <BriefingVacancy text={briefing().vacancyText} />
            <BriefingSections recommendations={briefing().recommendations} />
            <div class={styles.footer()}>
              <Button class={styles.start()} size="lg" onClick={props.onStart}>
                <Icon name="common:microphone" size={18} />
                {i18n.t('live.prep.start')}
              </Button>
            </div>
          </>
        )}
      </Show>
    </div>
  );
}
