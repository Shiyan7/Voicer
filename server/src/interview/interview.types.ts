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

export interface InterviewRecording {
  id: string;
  audioUrl: string | null;
}
