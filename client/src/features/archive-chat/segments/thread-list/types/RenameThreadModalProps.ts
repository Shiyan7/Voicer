export interface RenameThreadModalProps {
  draft: string;
  counter: string;
  canSave: boolean;
  inputRef: (element: HTMLInputElement) => void;
  onDraft: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}
