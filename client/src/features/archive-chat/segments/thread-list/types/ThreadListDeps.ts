import { ChatThreadView } from '../../../types/ChatThreadView';

export interface ThreadListDeps {
  threads: ChatThreadView[];
  isLoading: boolean;
  onNew: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}
