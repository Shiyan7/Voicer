import { Field, Form, reset } from '@modular-forms/solid';
import { For, Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { MODALS } from '@/shared/lib/modal';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';

import { getOAuthButtons } from '../config/getOAuthButtons';
import { useAuth } from '../model/useAuth';
import { AuthMode } from '../types';
import { authModalStyles } from './AuthModal.styles';

const styles = authModalStyles();

export function AuthModal() {
  const vm = useAuth();

  return (
    <Modal
      class="px-7 pb-8 pt-10 sm:max-w-[26rem]"
      modalId={MODALS.AUTH}
      onClose={() => reset(vm.authForm)}
    >
      <h2 class={styles.title()}>{vm.modalTitle()}</h2>
      <div>
        <Show when={vm.mode()} keyed>
          <Form class={styles.form()} of={vm.authForm} onSubmit={vm.onSubmit}>
            <Field of={vm.authForm} name="email">
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
            <Field of={vm.authForm} name="password">
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
            <Button class="mt-1" variant="primary" size="lg" type="submit">
              {vm.buttonText()}
            </Button>
          </Form>
        </Show>
        <div class={styles.row()}>
          <span class={styles.hint()}>
            <Show
              when={vm.mode() === AuthMode.LogIn}
              fallback={i18n.t('auth.hint.log_in')}
            >
              {i18n.t('auth.hint.sign_up')}
            </Show>
          </span>
          <button
            class={styles.switch()}
            type="button"
            onClick={vm.toggleAuthMode}
          >
            <Show
              when={vm.mode() === AuthMode.LogIn}
              fallback={i18n.t('labels.log_in')}
            >
              {i18n.t('labels.sign_up')}
            </Show>
          </button>
        </div>
        <div class={styles.div()}>
          <div class={styles.divLine()} />
          <div class={styles.divTxt()}>{i18n.t('common.or')}</div>
          <div class={styles.divLine()} />
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
