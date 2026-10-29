import { DateRange } from '../types';

export const sortRange = (first: string, second: string): DateRange =>
  first <= second ? { from: first, to: second } : { from: second, to: first };
