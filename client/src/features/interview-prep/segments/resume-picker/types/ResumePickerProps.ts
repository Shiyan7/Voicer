import { PrepResumeOption } from './PrepResumeOption';

export interface ResumePickerProps {
  label: string;
  isFilled: boolean;
  options: PrepResumeOption[];
  selectedId: string | undefined;
  isDeleting: boolean;
  onSelectFile: (file: File) => void;
  onSelectSaved: (id: string) => void;
  onRequestDelete: (id: string) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}
