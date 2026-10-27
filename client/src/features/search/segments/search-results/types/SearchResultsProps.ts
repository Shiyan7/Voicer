export interface SearchResultsProps {
  query: string;
  words: string[];
  onSelect: (href: string) => void;
}
