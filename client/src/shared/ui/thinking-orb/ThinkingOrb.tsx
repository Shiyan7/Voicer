import { useThinkingOrb } from './model/useThinkingOrb';
import { thinkingOrbStyles } from './ThinkingOrb.styles';
import { ThinkingOrbProps } from './types/ThinkingOrbProps';

const styles = thinkingOrbStyles();

export function ThinkingOrb(props: ThinkingOrbProps) {
  const vm = useThinkingOrb(props);

  return (
    <canvas
      ref={vm.setCanvas}
      class={styles.root({ class: props.class })}
      style={vm.canvasStyle()}
      aria-hidden="true"
    />
  );
}
