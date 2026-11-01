import { useVoiceBlob } from './model/useVoiceBlob';
import { VoiceBlobProps } from './types/VoiceBlobProps';
import { voiceBlobStyles } from './VoiceBlob.styles';

export function VoiceBlob(props: VoiceBlobProps) {
  const vm = useVoiceBlob(props);

  return (
    <canvas
      class={voiceBlobStyles({ class: props.class })}
      ref={vm.setCanvas}
      style={vm.canvasStyle()}
      aria-hidden="true"
    />
  );
}
