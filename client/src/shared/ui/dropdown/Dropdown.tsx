import { For, JSX, Show } from 'solid-js';

import { Icon } from '@/shared/ui/icon';

import { dropdownStyles } from './Dropdown.styles';
import { useDropdown } from './hooks/useDropdown';
import { DropdownOption } from './types';

interface DropdownProps<T> {
  class?: string;
  panelClass?: string;
  triggerClass?: string;
  options: DropdownOption<T>[];
  selected?: T;
  onSelect: (value: T) => void;
  trigger: (opened: boolean) => JSX.Element;
}

const styles = dropdownStyles();

export function Dropdown<T>(props: DropdownProps<T>) {
  const dropdown = useDropdown();

  const handleSelect = (value: T) => {
    props.onSelect(value);
    dropdown.close();
  };

  return (
    <div class={styles.root({ class: props.class })} ref={dropdown.setRootRef}>
      <button
        class={props.triggerClass}
        type="button"
        onClick={dropdown.toggle}
      >
        {props.trigger(dropdown.opened())}
      </button>
      <Show when={dropdown.opened()}>
        <div class={styles.panel({ class: props.panelClass })}>
          <For each={props.options}>
            {(option) => (
              <button
                class={styles.item({
                  active: option.value === props.selected,
                  danger: option.isDanger,
                })}
                type="button"
                onClick={() => handleSelect(option.value)}
              >
                <Show when={option.emoji}>
                  <span class={styles.itemEmoji()}>{option.emoji}</span>
                </Show>
                <Show when={option.icon}>
                  {(icon) => (
                    <Icon
                      class={styles.itemIcon({ danger: option.isDanger })}
                      size={16}
                      name={icon()}
                    />
                  )}
                </Show>
                <span class={styles.itemLabel()}>{option.label}</span>
                <Show when={option.value === props.selected}>
                  <Icon class={styles.check()} size={16} name="common:check" />
                </Show>
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
