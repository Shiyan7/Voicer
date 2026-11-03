import { SummaryStyle } from '@schema';
import { createSignal } from 'solid-js';

import { meetingSummarizeMutation } from '../../../api/meetingSummarizeMutation';
import { getSummaryStyles } from '../config/summaryStyles';
import { SummarizeDeps } from '../types/SummarizeDeps';

export const useSummarize = (deps: SummarizeDeps) => {
  const [, summarize] = meetingSummarizeMutation();
  const [selectedStyle, setSelectedStyle] = createSignal(
    deps.summaryStyle ?? SummaryStyle.Auto,
  );

  const runSummarize = async () => {
    deps.onStarted();
    await summarize({ id: deps.meetingId, style: selectedStyle() });
  };

  const summarizeWith = (style: SummaryStyle) => {
    setSelectedStyle(style);
    void runSummarize();
  };

  return {
    styleOptions: getSummaryStyles,
    selectedStyle,
    summarizeWith,
    runSummarize,
  };
};
