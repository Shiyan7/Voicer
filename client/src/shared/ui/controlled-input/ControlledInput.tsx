import { JSX, splitProps } from 'solid-js';

type BaseInputProps = JSX.InputHTMLAttributes<HTMLInputElement>;

export interface ControlledInputProps extends Omit<BaseInputProps, 'onInput'> {
  value: string;
  onInput: (value: string) => void;
}

export function ControlledInput(props: ControlledInputProps) {
  const [local, rest] = splitProps(props, ['value', 'onInput']);

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const el = e.currentTarget;
    const prevValue = el.value;
    let prevPos = el.selectionStart ?? prevValue.length;

    local.onInput(prevValue);

    // ❗️ IMPORTANT: force DOM sync after onInput
    // See discussion: https://github.com/solidjs/solid/discussions/416
    queueMicrotask(() => {
      el.value = local.value;

      if (
        local.value[prevPos - 1] === ' ' &&
        prevValue.length < local.value.length
      ) {
        prevPos++;
      }

      el.setSelectionRange(prevPos, prevPos);
    });
  };

  return <input value={local.value} onInput={handleInput} {...rest} />;
}
