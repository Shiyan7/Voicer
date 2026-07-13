import { injectable } from 'tsyringe';

import { SessionViewModel } from '@/entities/session';
import { i18n } from '@/shared/i18n';
import { MODALS, showModal } from '@/shared/lib/modal';
import { StatefulViewModel } from '@/shared/view-model';

import { TeamSelectDeps } from '../types/TeamSelectDeps';

@injectable()
export class TeamSelectViewModel extends StatefulViewModel<TeamSelectDeps> {
  constructor(readonly session: SessionViewModel) {
    super();
  }

  get firstLetterName() {
    return this.session.user?.name[0].toUpperCase();
  }

  get authLabel() {
    return this.deps.isCollapsed
      ? i18n.t('labels.log_in')
      : i18n.t('labels.auth_button');
  }

  onAuthBtnClick = () => {
    showModal(MODALS.AUTH);
  };
}
