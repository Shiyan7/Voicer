import { For } from 'solid-js';

import { SpeakerTracksProps } from '../types/SpeakerTracksProps';
import { SpeakerAvatar } from './SpeakerAvatar';
import { speakerTracksStyles } from './SpeakerTracks.styles';

const styles = speakerTracksStyles();

export function SpeakerTracks(props: SpeakerTracksProps) {
  return (
    <div class={styles.root()}>
      <For each={props.tracks}>
        {(track) => (
          <>
            <span class={styles.avatarCell()}>
              <SpeakerAvatar tone={track.tone} initial={track.initial} />
            </span>
            <div class={styles.body()}>
              <span class={styles.label()}>{track.label}</span>
              <div class={styles.rail()}>
                <For each={track.ranges}>
                  {(range) => (
                    <button
                      class={styles.range({ tone: track.tone })}
                      style={{ left: range.left, width: range.width }}
                      type="button"
                      onClick={() => props.onSeek(range.startMs)}
                    />
                  )}
                </For>
              </div>
            </div>
            <span class={styles.share()}>{track.shareLabel}</span>
          </>
        )}
      </For>
    </div>
  );
}
