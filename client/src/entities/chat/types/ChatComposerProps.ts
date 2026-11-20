export interface ChatComposerProps {
  draft: string;
  canSend: boolean;
  placeholder: string;
  inputRef: (element: HTMLTextAreaElement) => void;
  onDraft: (value: string) => void;
  onInputKeyDown: (event: KeyboardEvent) => void;
  onSubmit: () => void;
}
