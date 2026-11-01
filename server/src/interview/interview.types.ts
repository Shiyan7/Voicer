export interface InterviewRecommendations {
  topics: string[];
  likelyQuestions: string[];
  emphasize: string[];
}

export interface InterviewPreparation {
  cheatSheet: string;
  recommendations: InterviewRecommendations;
}
