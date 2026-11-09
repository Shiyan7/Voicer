import { Show } from 'solid-js';

import { MeetingPlayer } from '@/entities/meeting-player';
import { i18n } from '@/shared/i18n';

import { ReviewActions } from '../../review-actions';
import { LiveSession } from '../../session';
import { useReview } from '../model/useReview';
import { ReviewDeps } from '../types/ReviewDeps';
import { ReviewHeader } from './ReviewHeader';

export function Review(deps: ReviewDeps) {
  const vm = useReview(deps);

  return (
    <LiveSession
      header={
        <ReviewHeader
          title={vm.title()}
          onBack={deps.onBack}
          actions={
            <ReviewActions
              sessionId={deps.details.id}
              meetingId={vm.meetingId()}
              audioUrl={vm.audioUrl()}
              fileName={vm.title()}
            />
          }
        />
      }
      player={
        <Show when={vm.audioUrl()}>
          {(audioUrl) => (
            <MeetingPlayer
              audioUrl={audioUrl()}
              transcript={vm.transcript()}
              playback={vm.playback}
            />
          )}
        </Show>
      }
      turns={deps.turns}
      emptyLabel={i18n.t('live.session.no_turns')}
    />
  );
}
