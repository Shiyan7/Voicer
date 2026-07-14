import './styles.css';

import { Router } from '@solidjs/router';

import { routes } from '@/shared/router';
import { SingletonProvider } from '@/shared/singleton-context';
import { AppLayout } from '@/widgets/app-layout';

export function Application() {
  return (
    <div class="app">
      <SingletonProvider>
        <Router root={AppLayout}>{routes}</Router>
      </SingletonProvider>
    </div>
  );
}
