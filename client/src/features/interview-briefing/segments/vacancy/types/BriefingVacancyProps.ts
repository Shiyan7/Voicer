export interface BriefingVacancyProps {
  text: string;
  isExpanded: boolean;
  isFaded: boolean;
  isLong: boolean;
  toggleLabel: string;
  measure: (element: HTMLElement) => void;
  onToggle: () => void;
}
