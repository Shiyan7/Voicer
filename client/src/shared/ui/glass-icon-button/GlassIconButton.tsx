import { glassIconButtonStyles } from './GlassIconButton.styles';
import { GlassIconButtonProps } from './types/GlassIconButtonProps';

export function GlassIconButton(props: GlassIconButtonProps) {
  return (
    <button
      class={glassIconButtonStyles({ size: props.size, class: props.class })}
      type={props.type ?? 'button'}
      disabled={props.disabled}
      aria-label={props.label}
      title={props.label}
      onClick={() => props.onClick?.()}
    >
      {props.children}
    </button>
  );
}
