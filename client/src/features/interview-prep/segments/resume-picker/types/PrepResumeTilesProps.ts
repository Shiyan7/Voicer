import { PrepResumeOption } from './PrepResumeOption';

export interface PrepResumeTilesProps {
  options: PrepResumeOption[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}
