import { createFormStore, reset, valiForm } from '@modular-forms/solid';
import { createSignal } from 'solid-js';

import { useSession } from '@/entities/session';
import { i18n } from '@/shared/i18n';
import { closeModal, MODALS } from '@/shared/lib/modal';

import { createLoginMutation } from '../api/createLoginMutation';
import { createSignupMutation } from '../api/createSignupMutation';
import { AuthForm, createAuthSchema } from '../config/createAuthSchema';
import { AuthMode } from '../types';

export function useAuth() {
  const session = useSession();

  const login = createLoginMutation();
  const signup = createSignupMutation();

  const [mode, setMode] = createSignal(AuthMode.LogIn);

  const authForm = createFormStore<AuthForm>({
    validate: (values) => valiForm(createAuthSchema())(values),
    validateOn: 'blur',
  });

  const modalTitle = () =>
    mode() === AuthMode.LogIn
      ? i18n.t('auth.title.login')
      : i18n.t('auth.title.signup');

  const buttonText = () =>
    mode() === AuthMode.LogIn
      ? i18n.t('labels.log_in')
      : i18n.t('labels.sign_up');

  const toggleAuthMode = () => {
    reset(authForm);
    setMode((current) =>
      current === AuthMode.LogIn ? AuthMode.SignUp : AuthMode.LogIn,
    );
  };

  const onSubmit = async (formValues: AuthForm) => {
    const user =
      mode() === AuthMode.LogIn
        ? await login.mutateAsync(formValues)
        : await signup.mutateAsync(formValues);

    session.login(user);
    closeModal(MODALS.AUTH);
  };

  return {
    mode,
    authForm,
    modalTitle,
    buttonText,
    toggleAuthMode,
    onSubmit,
  };
}
