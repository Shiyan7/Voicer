import { A } from '@solidjs/router';
import { Match, Show, Switch } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { paths } from '@/shared/router';
import { AudioPlayer } from '@/shared/ui/audio-player';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { PageFade } from '@/shared/ui/page-fade';
import { useViewModel } from '@/shared/view-model';

import { meetingDetailsStyles } from './MeetingDetails.styles';
import { MeetingDetailsPageViewModel } from './model/MeetingDetailsPageViewModel';
import { ActionItemsSection } from './segments/action-items/ui/ActionItemsSection';
import { DetailsHeader } from './segments/details-header/ui/DetailsHeader';
import { StatePanel } from './segments/state-panel/ui/StatePanel';
import { Summary } from './segments/summary/ui/Summary';
import { Transcript } from './segments/transcript/ui/Transcript';

const styles = meetingDetailsStyles();

export function MeetingDetailsOrchestrator() {
  const vm = useViewModel(MeetingDetailsPageViewModel);

  return (
    <PageFade>
      <div class={styles.root()}>
        <A class={styles.backLink()} href={paths.meetings}>
          <Icon size={12} name="common:arrow-left" />
          {i18n.t('meetings.back')}
        </A>
        <Switch>
          <Match when={vm.isLoading}>
            <div class={styles.skeleton({ size: 'header' })} />
            <div class={styles.skeleton({ size: 'content' })} />
          </Match>
          <Match when={vm.loadFailed}>
            <div class={styles.notFound()}>
              <h1 class={styles.notFoundTitle()}>
                {i18n.t('meetings.not_found')}
              </h1>
              <Button as={A} href={paths.meetings} variant="secondary">
                {i18n.t('meetings.back')}
              </Button>
            </div>
          </Match>
          <Match when={vm.meeting}>
            {(meeting) => (
              <>
                <DetailsHeader meeting={meeting()} />

                <Show when={vm.showPlayer}>
                  <AudioPlayer
                    ref={vm.setPlayerApi}
                    src={vm.audioUrl}
                    onTimeUpdate={vm.onPlayerTimeUpdate}
                  />
                </Show>

                <Show when={vm.statePanelVariant}>
                  {(variant) => (
                    <StatePanel variant={variant()} status={meeting().status} />
                  )}
                </Show>

                <Show when={vm.isReady}>
                  <Summary summary={meeting().summary} />
                  <ActionItemsSection items={meeting().actionItems} />
                  <Transcript
                    segments={meeting().segments}
                    currentTimeMs={vm.currentTimeMs}
                    onSeek={vm.seekTo}
                  />
                </Show>
              </>
            )}
          </Match>
        </Switch>
      </div>
    </PageFade>
  );
}
