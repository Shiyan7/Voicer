import { InterviewPrepStatus } from '@schema';
import { Match, Switch } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { BackHeader } from '@/shared/ui/back-header';
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
      <BackHeader title={props.title} onBack={props.onBack} />
      <Switch>
        <Match when={props.status === InterviewPrepStatus.Preparing}>
          <p class={styles.status()} role="status">
            {i18n.t('live.prep.preparing')}
          </p>
          <div class={styles.skeletonHeader()} />
          <div class={styles.skeletonContent()} />
        </Match>
        <Match when={props.status === InterviewPrepStatus.Failed}>
          <div class={styles.failed()} role="alert">
            <span>{i18n.t('live.prep.error')}</span>
            <Button variant="secondary" onClick={props.onRetry}>
              {i18n.t('live.prep.retry')}
            </Button>
          </div>
        </Match>
        <Match when={props.recommendations}>
          {(recommendations) => (
            <>
              <BriefingVacancy text={props.vacancyText ?? ''} />
              <BriefingSections recommendations={recommendations()} />
              <div class={styles.footer()}>
                <Button variant="emerald" size="xl" onClick={props.onStart}>
                  <Icon name="common:microphone" size={18} />
                  {i18n.t('live.prep.start')}
                </Button>
              </div>
            </>
          )}
        </Match>
      </Switch>
    </div>
  );
}
