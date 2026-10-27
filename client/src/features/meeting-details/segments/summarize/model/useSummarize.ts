import { SummaryStyle } from '@schema';
import { createSignal } from 'solid-js';

import { meetingSummarizeMutation } from '../../../api/meetingSummarizeMutation';
import { getSummaryStyles } from '../config/summaryStyles';
import { SummarizeParams } from '../types/SummarizeParams';

export const useSummarize = (props: SummarizeParams) => {
  const [, summarize] = meetingSummarizeMutation();
  const [selectedStyle, setSelectedStyle] = createSignal(
    props.summaryStyle ?? SummaryStyle.Auto,
  );

  const runSummarize = async () => {
    props.onStarted();
    await summarize({ id: props.meetingId, style: selectedStyle() });
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
