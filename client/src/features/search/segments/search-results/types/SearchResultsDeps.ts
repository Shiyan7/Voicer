export interface SearchResultsDeps {
  query: string;
  words: string[];
  onSelect: (href: string) => void;
}
