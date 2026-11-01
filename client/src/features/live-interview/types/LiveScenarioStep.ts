export interface LiveScenarioStep {
  question: string;
  short: string;
  details: string;
  code?: { language: string; text: string };
}
