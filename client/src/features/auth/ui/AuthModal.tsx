import { Field, Form, reset } from '@modular-forms/solid';
import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';
import { useViewModel } from '@/shared/view-model';

import { getOAuthButtons } from '../config/getOAuthButtons';
import { AuthViewModel } from '../model/AuthViewModel';
import { AuthMode } from '../types';
import { authModalStyles } from './AuthModal.styles';

const styles = authModalStyles();

export function AuthModal() {
  const model = useViewModel(AuthViewModel);

  return (
    <Modal modalId={MODALS.AUTH} onClose={() => reset(model.authForm)}>
      <h2 class={styles.title()}>{model.modalTitle}</h2>
      <div>
        <Show when={model.mode} keyed>
          <Form
            class={styles.form()}
            of={model.authForm}
            onSubmit={model.onSubmit}
          >
            <Field of={model.authForm} name="email">
              {(field, props) => (
                <Input
                  {...props}
                  error={field.error}
                  type="email"
                  placeholder="Email address"
                  required
                />
              )}
            </Field>
            <Field of={model.authForm} name="password">
              {(field, props) => (
                <Input
                  {...props}
                  error={field.error}
                  type="password"
                  placeholder="Password"
                  required
                />
              )}
            </Field>
            <Button type="submit">{model.buttonText}</Button>
          </Form>
        </Show>
        <div class={styles.row()}>
          <span class={styles.hint()}>
            <Show
              when={model.mode === AuthMode.LogIn}
              fallback={i18n.t('auth.hint.log_in')}
            >
              {i18n.t('auth.hint.sign_up')}
            </Show>
          </span>
          <button
            class={styles.switch()}
            type="button"
            onClick={model.toggleAuthMode}
          >
            <Show
              when={model.mode === AuthMode.LogIn}
              fallback={i18n.t('labels.log_in')}
            >
              {i18n.t('labels.sign_up')}
            </Show>
          </button>
        </div>
        <div class={styles.div()}>
          <div class={styles.div_line()} />
          <div class={styles.div_txt()}>{i18n.t('common.or')}</div>
          <div class={styles.div_line()} />
        </div>
        <div class={styles.social()}>
          <For each={getOAuthButtons()}>
            {(OAuthButton) => (
              <button class={styles.socialBtn()} type="button">
                <Icon size={20} name={OAuthButton.icon} />
              </button>
            )}
          </For>
        </div>
      </div>
      <div class={styles.footer()}>
        <div>{i18n.t('auth.footer.disclaimer')}</div>
        {i18n.t('labels.our')}&nbsp;
        <a class={styles.link()} href="#">
          {i18n.t('labels.terms_of_service')}
        </a>
        <span> & </span>
        <a class={styles.link()} href="#">
          {i18n.t('labels.privacy_policy')}
        </a>
        .
      </div>
    </Modal>
  );
}
