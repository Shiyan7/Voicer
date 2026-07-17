import { createFormStore, reset, valiForm } from '@modular-forms/solid';
import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { closeModal, MODALS } from '@/shared/lib/modal';
import { authRoot } from '@/shared/roots/authRoot';

import { createSignInMutation } from '../api/createSignInMutation';
import { createSignUpMutation } from '../api/createSignUpMutation';
import { AuthForm, createAuthSchema } from '../config/createAuthSchema';
import { AuthMode } from '../types';

export const useAuth = () => {
  const [, signIn] = createSignInMutation();
  const [, signUp] = createSignUpMutation();

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
    const input = { email: formValues.email, password: formValues.password };

    const result =
      mode() === AuthMode.LogIn
        ? await signIn({ input })
        : await signUp({ input });

    const tokens =
      result.data && 'signIn' in result.data
        ? result.data.signIn
        : result.data?.signUp;

    if (!tokens) return;

    authRoot.saveToken(tokens);
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
};
