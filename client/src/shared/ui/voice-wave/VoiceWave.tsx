import { useVoiceWave } from './model/useVoiceWave';
import { VoiceWaveDeps } from './types/VoiceWaveDeps';
import { voiceWaveStyles } from './VoiceWave.styles';

export function VoiceWave(deps: VoiceWaveDeps) {
  const vm = useVoiceWave(deps);

  return (
    <canvas
      class={voiceWaveStyles({ class: deps.class })}
      ref={vm.setCanvas}
      aria-hidden="true"
    />
  );
}
