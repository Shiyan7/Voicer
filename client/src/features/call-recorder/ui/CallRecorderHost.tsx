import { Show } from 'solid-js';

import { useRecorder } from '../model/useRecorder';
import { RecordingBar } from './RecordingBar';

export function CallRecorderHost() {
  const vm = useRecorder();

  return (
    <Show when={vm.isBarVisible()}>
      <RecordingBar
        formattedSeconds={vm.formattedSeconds()}
        level={vm.level()}
        isPaused={vm.isPaused()}
        pauseLabel={vm.pauseLabel()}
        onTogglePause={vm.togglePause}
        onStop={vm.stop}
      />
    </Show>
  );
}
