import { i18n } from '@/shared/i18n';

import { LiveSession } from '../../session';
import { useLiveRun } from '../model/useLiveRun';
import { LiveRunDeps } from '../types/LiveRunDeps';
import { LiveSessionBar } from './LiveSessionBar';

export function LiveRun(deps: LiveRunDeps) {
  const vm = useLiveRun(deps);

  return (
    <LiveSession
      header={
        <LiveSessionBar
          timerLabel={vm.timerLabel()}
          statusLabel={vm.statusLabel()}
          isAnswering={vm.isAnswering()}
          onCaptureCode={vm.captureCode}
          onAnswerNow={vm.answerNow}
          onStop={vm.finish}
        />
      }
      turns={vm.turns}
      emptyLabel={i18n.t('live.session.waiting')}
    />
  );
}
