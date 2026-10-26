import { PlayerTimelineProps } from '../types/PlayerTimelineProps';
import { playerTimelineStyles } from './PlayerTimeline.styles';

const styles = playerTimelineStyles();

export function PlayerTimeline(props: PlayerTimelineProps) {
  return (
    <div class={styles.root()}>
      <span class={styles.time()}>{props.currentLabel}</span>
      <div
        class={styles.track()}
        ref={props.setTrackRef}
        onPointerDown={props.onPointerDown}
        onPointerMove={props.onPointerMove}
        onPointerUp={props.onPointerUp}
      >
        <div class={styles.rail()}>
          <div class={styles.fill()} style={{ width: props.progressPercent }} />
        </div>
        <div class={styles.thumb()} style={{ left: props.progressPercent }} />
      </div>
      <span class={styles.timeEnd()}>{props.durationLabel}</span>
    </div>
  );
}
