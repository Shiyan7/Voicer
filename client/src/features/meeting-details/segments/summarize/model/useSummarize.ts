import { createSignal } from 'solid-js';

import { meetingSummarizeMutation } from '../../../api/meetingSummarizeMutation';
import { getSummaryStyles } from '../config/summaryStyles';
import { SummarizeParams } from '../types/SummarizeParams';
import { SummaryStyle } from '../types/SummaryStyle';

export const useSummarize = (props: SummarizeParams) => {
  const [, summarize] = meetingSummarizeMutation();
  const [selectedStyle, setSelectedStyle] = createSignal<SummaryStyle>('auto');

  const selectStyle = (style: SummaryStyle) => setSelectedStyle(style);

  const runSummarize = async () => {
    props.onStarted();
    await summarize({ id: props.meetingId });
  };

  return {
    styleOptions: getSummaryStyles,
    selectedStyle,
    selectStyle,
    runSummarize,
  };
};
