import { onMount, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { useRecorder } from '../model/useRecorder';
import { RecordingBar } from './RecordingBar';

export function CallRecorderHost() {
  const vm = useRecorder();

  onMount(() => vm.setup());

  return (
    <Show when={vm.isBarVisible()}>
      <RecordingBar
        text={vm.barText()}
        timeLabel={vm.timeLabel()}
        isUploading={vm.isUploading()}
        uploadPercent={vm.uploadPercent()}
        stopLabel={i18n.t('recorder.stop')}
        onStop={vm.stop}
      />
    </Show>
  );
}
