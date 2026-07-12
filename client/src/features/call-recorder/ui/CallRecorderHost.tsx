import { onMount, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { useViewModel } from '@/shared/view-model';

import { RecorderViewModel } from '../model/RecorderViewModel';
import { CallPromptToast } from './CallPromptToast';
import { RecordingBar } from './RecordingBar';

/**
 * Mount point for the call-recorder overlays (call prompt + recording bar).
 * Render only inside Tauri.
 */
export function CallRecorderHost() {
  const vm = useViewModel(RecorderViewModel);

  onMount(() => vm.setup());

  return (
    <>
      <Show when={vm.isPromptVisible}>
        <CallPromptToast
          message={vm.promptMessage}
          recordLabel={i18n.t('recorder.record')}
          skipLabel={i18n.t('recorder.skip')}
          onRecord={vm.acceptPrompt}
          onSkip={vm.skipPrompt}
        />
      </Show>
      <Show when={vm.isBarVisible}>
        <RecordingBar
          text={vm.barText}
          timeLabel={vm.timeLabel}
          isUploading={vm.isUploading}
          uploadPercent={vm.uploadPercent}
          stopLabel={i18n.t('recorder.stop')}
          onStop={vm.stop}
        />
      </Show>
    </>
  );
}
