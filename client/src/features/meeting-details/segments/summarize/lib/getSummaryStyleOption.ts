import { SummaryStyle } from '@schema';

import { getSummaryStyles } from '../config/summaryStyles';

export const getSummaryStyleOption = (style: SummaryStyle) =>
  getSummaryStyles().find((option) => option.value === style);
