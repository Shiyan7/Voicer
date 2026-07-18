import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { useRecorder } from '../model/useRecorder';
import { RecordingBar } from './RecordingBar';

export function CallRecorderHost() {
  const vm = useRecorder();

  return (
    <Show when={vm.isBarVisible()}>
      <RecordingBar
        timeLabel={vm.timeLabel()}
        stopLabel={i18n.t('recorder.stop')}
        onStop={vm.stop}
      />
    </Show>
  );
}
