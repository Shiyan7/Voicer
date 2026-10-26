import { SearchResultView } from '@/features/search/types/SearchResultView';

export interface SearchResultItemProps {
  result: SearchResultView;
  onSelect: (href: string) => void;
  onHover: () => void;
}
