export interface FileInputProps {
  label: string;
  accept?: string;
  isFilled?: boolean;
  onSelect: (file: File) => void;
}
