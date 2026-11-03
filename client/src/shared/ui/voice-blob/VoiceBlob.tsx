import { useVoiceBlob } from './model/useVoiceBlob';
import { VoiceBlobDeps } from './types/VoiceBlobDeps';
import { voiceBlobStyles } from './VoiceBlob.styles';

export function VoiceBlob(deps: VoiceBlobDeps) {
  const vm = useVoiceBlob(deps);

  return (
    <canvas
      class={voiceBlobStyles({ class: deps.class })}
      ref={vm.setCanvas}
      style={vm.canvasStyle()}
      aria-hidden="true"
    />
  );
}
