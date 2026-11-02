interface ListStatusSource {
  isFetching: () => boolean;
  itemCount: () => number;
  total: () => number | undefined;
}

export const useListStatus = (source: ListStatusSource) => {
  const isLoading = () => source.isFetching() && source.itemCount() === 0;

  const isEmpty = () => !source.isFetching() && source.itemCount() === 0;

  const totalCount = () => String(source.total() ?? 0);

  return { isLoading, isEmpty, totalCount };
};
