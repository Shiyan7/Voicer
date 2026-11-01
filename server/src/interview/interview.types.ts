export interface InterviewRecommendations {
  topics: string[];
  likelyQuestions: string[];
  emphasize: string[];
}

export interface InterviewPreparation {
  resumeText: string;
  cheatSheet: string;
  recommendations: InterviewRecommendations;
}
