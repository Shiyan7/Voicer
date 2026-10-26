export interface SearchInputProps {
  query: string;
  hasQueryText: boolean;
  setRef: (element: HTMLInputElement) => void;
  onInput: (event: InputEvent) => void;
  onClear: () => void;
}
