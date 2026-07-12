import { injectable } from 'tsyringe';

import { SessionViewModel } from '@/entities/session';
import { MODALS, showModal } from '@/shared/lib/modal';
import { StatefulViewModel } from '@/shared/view-model';

@injectable()
export class TeamSelectViewModel extends StatefulViewModel {
  constructor(readonly session: SessionViewModel) {
    super();
  }

  get firstLetterName() {
    return this.session.user?.name[0].toUpperCase();
  }

  onAuthBtnClick = () => {
    showModal(MODALS.AUTH);
  };
}
