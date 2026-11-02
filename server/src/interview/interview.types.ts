export interface InterviewRecommendations {
  topics: string[];
  likelyQuestions: string[];
  emphasize: string[];
}

export interface InterviewPreparation {
  title: string;
  cheatSheet: string;
  recommendations: InterviewRecommendations;
}
