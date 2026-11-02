import { JSX, Show } from 'solid-js';

import { useDropdown } from '@/shared/ui/dropdown';

import { popoverStyles } from './Popover.styles';

interface PopoverProps {
  class?: string;
  panelClass?: string;
  triggerClass?: (opened: boolean) => string;
  placement?: 'top-start' | 'bottom-end';
  disabled?: boolean;
  ariaLabel: string;
  trigger: JSX.Element;
  children: JSX.Element;
}

export function Popover(props: PopoverProps) {
  const dropdown = useDropdown();

  const styles = () => popoverStyles({ placement: props.placement });

  return (
    <div
      class={styles().root({ class: props.class })}
      ref={dropdown.setRootRef}
    >
      <button
        class={props.triggerClass?.(dropdown.opened())}
        aria-expanded={dropdown.opened()}
        aria-label={props.ariaLabel}
        disabled={props.disabled}
        type="button"
        onClick={dropdown.toggle}
      >
        {props.trigger}
      </button>
      <Show when={dropdown.opened()}>
        <div class={styles().panel({ class: props.panelClass })}>
          {props.children}
        </div>
      </Show>
    </div>
  );
}
