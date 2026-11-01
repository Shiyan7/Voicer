import type { FilterParams } from './useFilterParams';

export const useSortFilter = <T extends string>(
  params: FilterParams,
  values: readonly T[],
  defaultValue: T,
) => {
  const sort = () => {
    const value = params.read('sort') as T;
    return values.includes(value) ? value : defaultValue;
  };

  const isCustomSort = () => sort() !== defaultValue;

  const setSort = (value: T) =>
    params.update({ sort: value === defaultValue ? undefined : value });

  return { sort, isCustomSort, setSort };
};
