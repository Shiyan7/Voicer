export interface LivePrepSection {
  titleKey: 'topics' | 'questions' | 'emphasis';
  items: string[];
}

export interface LivePrepResult {
  sections: LivePrepSection[];
}
