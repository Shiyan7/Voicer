export interface SearchInputDeps {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
}
