import { PrepModeOption } from './PrepModeOption';

export interface PrepModeCardProps {
  option: PrepModeOption;
  isSelected: boolean;
  onSelect: () => void;
}
