export interface ToolbarProps {
  isUploading: boolean;
  onStartRecording: () => void;
  onFileSelected: (event: Event) => void;
}
