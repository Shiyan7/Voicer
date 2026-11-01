import { And, FindOperator, LessThan, MoreThanOrEqual } from 'typeorm';

export const buildDateRangeCondition = (
  from?: Date | null,
  to?: Date | null,
): FindOperator<Date> | null => {
  if (from && to) return And(MoreThanOrEqual(from), LessThan(to));
  if (from) return MoreThanOrEqual(from);
  if (to) return LessThan(to);
  return null;
};
