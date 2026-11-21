import { useRecorder } from '../model/useRecorder';
import { RecordingBar } from './RecordingBar';

export function CallRecorderHost() {
  const vm = useRecorder();

  return (
    <RecordingBar
      isVisible={vm.isBarVisible()}
      formattedSeconds={vm.formattedSeconds()}
      level={vm.level()}
      isPaused={vm.isPaused()}
      pauseLabel={vm.pauseLabel()}
      onTogglePause={vm.togglePause}
      onStop={vm.stop}
    />
  );
}
