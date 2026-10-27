export interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
}
