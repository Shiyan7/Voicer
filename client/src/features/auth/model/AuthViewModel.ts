import { createFormStore, reset, valiForm } from '@modular-forms/solid';

import { SessionViewModel } from '@/entities/session';
import { MinimalUserOutput } from '@/shared/api/types';
import { injectable } from '@/shared/di';
import { i18n } from '@/shared/i18n';
import { closeModal, MODALS } from '@/shared/lib/modal';
import { StatefulViewModel } from '@/shared/view-model';

import { AuthForm, createAuthSchema } from '../config/createAuthSchema';
import { AuthMode } from '../types';
import { AuthService } from './AuthService';

@injectable()
export class AuthViewModel extends StatefulViewModel {
  mode: AuthMode = AuthMode.LogIn;

  authForm = createFormStore<AuthForm>({
    validate: (values) => valiForm(createAuthSchema())(values),
    validateOn: 'blur',
  });

  constructor(
    private readonly auth: AuthService,
    private readonly session: SessionViewModel,
  ) {
    super();
  }

  get modalTitle() {
    return this.mode === AuthMode.LogIn
      ? i18n.t('auth.title.login')
      : i18n.t('auth.title.signup');
  }

  get buttonText() {
    return this.mode === AuthMode.LogIn
      ? i18n.t('labels.log_in')
      : i18n.t('labels.sign_up');
  }

  toggleAuthMode = () => {
    reset(this.authForm);
    this.mode = this.mode === AuthMode.LogIn ? AuthMode.SignUp : AuthMode.LogIn;
  };

  onSubmit = async (formValues: AuthForm) => {
    const user =
      this.mode === AuthMode.LogIn
        ? await this.auth.login(formValues)
        : await this.auth.signup(formValues);

    this.finishAuth(user);
  };

  private finishAuth(user: MinimalUserOutput) {
    this.session.login(user);
    closeModal(MODALS.AUTH);
  }
}
