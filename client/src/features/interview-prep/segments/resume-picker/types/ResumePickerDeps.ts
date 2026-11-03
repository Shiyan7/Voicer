import { ResumeSelection } from '../../../types/ResumeSelection';

export interface ResumePickerDeps {
  selection: ResumeSelection | undefined;
  onChange: (selection: ResumeSelection | undefined) => void;
}
