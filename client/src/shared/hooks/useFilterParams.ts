import { useSearchParams } from '@solidjs/router';

type FilterParamValues = Record<string, string | undefined>;

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams<FilterParamValues>();

  const read = (key: string) => searchParams[key];

  const update = (next: FilterParamValues) =>
    setSearchParams({ ...next, page: undefined });

  const clear = (...keys: string[]) =>
    update(Object.fromEntries(keys.map((key) => [key, undefined])));

  return { read, update, clear };
};

export type FilterParams = ReturnType<typeof useFilterParams>;
