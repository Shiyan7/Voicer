import { ALL_FILTER_VALUE } from './config/ALL_FILTER_VALUE';
import type { FilterParams } from './useFilterParams';

export const useOptionFilter = <T extends string>(
  params: FilterParams,
  key: string,
  allowedValues?: readonly T[],
) => {
  const value = (): T | typeof ALL_FILTER_VALUE => {
    const current = params.read(key) as T | undefined;
    if (!current) return ALL_FILTER_VALUE;
    if (allowedValues && !allowedValues.includes(current)) {
      return ALL_FILTER_VALUE;
    }
    return current;
  };

  const activeValue = () => value() || null;

  const isActive = () => value() !== ALL_FILTER_VALUE;

  const set = (next: T | typeof ALL_FILTER_VALUE) =>
    params.update({ [key]: next === ALL_FILTER_VALUE ? undefined : next });

  return { value, activeValue, isActive, set, paramKey: key };
};
