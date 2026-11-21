import { ChatThreadView } from '../../../types/ChatThreadView';

export interface ThreadListDeps {
  threads: ChatThreadView[];
  isLoading: boolean;
  onNew: () => void;
  onRename: (id: string, title: string) => void;
  onPin: (id: string, isPinned: boolean) => void;
  onDelete: (id: string) => void;
}
