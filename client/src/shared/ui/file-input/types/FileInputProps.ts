import type { JSX } from 'solid-js';

export interface FileInputProps {
  label: string;
  accept?: string;
  isFilled?: boolean;
  error?: string;
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
}
