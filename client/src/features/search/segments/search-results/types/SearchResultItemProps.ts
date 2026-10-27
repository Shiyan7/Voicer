import { SearchResultView } from '../../../types/SearchResultView';

export interface SearchResultItemProps {
  result: SearchResultView;
  isActive: boolean;
  onSelect: (href: string) => void;
  onHover: () => void;
}
