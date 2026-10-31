import { Show } from 'solid-js';

import { useVoiceBeam } from './model/useVoiceBeam';
import { VoiceBeamProps } from './types/VoiceBeamProps';
import { voiceBeamStyles } from './VoiceBeam.styles';

const styles = voiceBeamStyles();

export function VoiceBeam(props: VoiceBeamProps) {
  const vm = useVoiceBeam(props);

  return (
    <>
      <style>{vm.css()}</style>
      <div
        ref={vm.setRoot}
        class={props.class}
        style={vm.rootStyle()}
        data-voice-beam={vm.id}
        data-voice-type="pill"
        data-voice-look="glow"
        data-voice-halfres=""
        data-active=""
        data-paused={props.paused ? '' : undefined}
      >
        {props.children}
        <div data-voice-beam-bloom="" />
        <div data-voice-beam-warp="inner" />
        <div data-voice-beam-warp="bloom" />
        <Show when={vm.hasHaloCanvas}>
          <canvas data-voice-beam-band-halo="" aria-hidden="true" />
        </Show>
        <canvas data-voice-beam-band="" aria-hidden="true" />
        <Show when={vm.hasCore()}>
          <div data-voice-beam-core="">
            <div />
          </div>
        </Show>
        <svg class={styles.filter()} aria-hidden="true" width="0" height="0">
          <filter
            id={vm.filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            color-interpolation-filters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency={vm.baseFrequency()}
              numOctaves={2}
              seed={7}
              result="noise"
            />
            <feOffset in="noise" dx="0" dy="0" result="moved" />
            <feColorMatrix
              in="moved"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0.5  0 0 0 0 0  0 0 0 0 1"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      </div>
    </>
  );
}
