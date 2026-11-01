import { Index } from 'solid-js';

import { useVoiceBlob } from './model/useVoiceBlob';
import { VoiceBlobProps } from './types/VoiceBlobProps';
import { voiceBlobStyles } from './VoiceBlob.styles';

const styles = voiceBlobStyles();

export function VoiceBlob(props: VoiceBlobProps) {
  const vm = useVoiceBlob(props);

  return (
    <div
      class={styles.root({ class: props.class })}
      style={vm.rootStyle()}
      aria-hidden="true"
    >
      <Index each={Array.from({ length: vm.layerCount })}>
        {(_, index) => (
          <div
            class={styles.layer({ outer: index > 0 })}
            ref={vm.setLayer(index)}
          />
        )}
      </Index>
    </div>
  );
}
