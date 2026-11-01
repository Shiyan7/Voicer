import type { InterviewRecommendationsOutput } from '@schema';

import { LivePrepResult } from '../types/LivePrepResult';

export const toPrepResult = (
  recommendations: InterviewRecommendationsOutput,
): LivePrepResult => ({
  sections: [
    { titleKey: 'topics', items: recommendations.topics },
    { titleKey: 'questions', items: recommendations.likelyQuestions },
    { titleKey: 'emphasis', items: recommendations.emphasize },
  ],
});
