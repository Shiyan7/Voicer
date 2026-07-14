export interface ToolbarDeps {
  canRecord: boolean;
  canUpload: boolean;
  isUploading: boolean;
  onStartRecording: () => void;
  onFileSelected: (event: Event) => void;
}
