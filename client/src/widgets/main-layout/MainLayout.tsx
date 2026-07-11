import { useLocation, useNavigate } from '@solidjs/router';
import { onMount, type ParentProps, Show, Suspense } from 'solid-js';

import { Toasts } from '@/entities/toasts';
import { AuthModal } from '@/features/auth';
import { ApplicationViewModel } from '@/shared/ApplicationViewModel';
import { i18n } from '@/shared/i18n';
import { useViewModel } from '@/shared/view-model';
import { Navigation } from '@/widgets/navigation';

import { mainLayoutStyles } from './MainLayout.styles';

const styles = mainLayoutStyles();

export function MainLayout(props: ParentProps) {
  const app = useViewModel(ApplicationViewModel);

  const navigator = useNavigate();
  const location = useLocation();

  onMount(async () => {
    await i18n.init();
    app.initApp(navigator, location);
  });

  return (
    <Suspense>
      <Show when={i18n.ready}>
        <div class={styles.root()}>
          <Navigation />
          <main class={styles.main()}>
            <Suspense>
              {props.children}
              <Toasts />
            </Suspense>
          </main>
        </div>
        <AuthModal />
      </Show>
    </Suspense>
  );
}
