import { injectable } from '@/shared/di';
import { parseMarkdownBlocks } from '@/shared/lib/markdown';
import { StatefulViewModel } from '@/shared/view-model';

import { SummaryDeps } from '../types/SummaryDeps';

@injectable()
export class SummaryViewModel extends StatefulViewModel<SummaryDeps> {
  constructor() {
    super();
  }

  get blocks() {
    return this.deps.summary ? parseMarkdownBlocks(this.deps.summary) : [];
  }

  get isEmpty() {
    return this.blocks.length === 0;
  }
}
