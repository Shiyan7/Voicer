import { JSX, Show } from 'solid-js';

import { inputStyles } from './Input.styles';

type BaseInputProps = JSX.InputHTMLAttributes<HTMLInputElement>;

interface InputProps extends BaseInputProps {
  error?: string;
  label?: string;
  rootClass?: string;
}

const styles = inputStyles();

export function Input(props: InputProps) {
  return (
    <label class={styles.root({ class: props.rootClass })}>
      <Show when={props.label}>
        <span class={styles.label()}>{props.label}</span>
      </Show>
      <input
        {...props}
        class={styles.input({ class: props.class, error: !!props.error })}
      />
      <Show when={props.error}>
        <span class={styles.error()}>{props.error}</span>
      </Show>
    </label>
  );
}
